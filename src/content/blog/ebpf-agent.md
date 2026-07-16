---
title: "What we learned shipping an eBPF agent that turns every TCP packet into a dependency graph"
excerpt: "Four BPF programs, five Go packages, a Neo4j sink, and the unifying ingestion → enrichment → graph → review pipeline that runs a Kubernetes cluster on Kafka-style event streams — without ever restarting a pod."
date: 2026-07-12
author: "Krish Srivastava"
avatar: "assets/images/photo2.jpeg"
tags: ["eBPF", "Kubernetes", "Observability", "Engineering"]
---

There is a question that comes up constantly in engineering teams with more than a handful of microservices:

> What is actually talking to what?

Not what the architecture diagram says. Not what the runbook claims. What is happening, right now, inside the cluster. That means every real TCP connection, every service that silently depends on another, every database that nobody documented.

Most teams answer: "look at the service mesh," "check the tracing," "ask the platform team." Every one of those requires instrumentation. Somebody has to add sidecars, add an SDK, redeploy, and in practice it's never complete. There are always the old services nobody wants to touch, the third-party containers we don't control, the legacy thing that runs fine and nobody understands.

That question turns out to be the entry point to five others that show up in every incident review:

1. **Who owns this service?**
2. **What does it depend on?**
3. **What depends on it?**
4. **What changed since yesterday?**
5. **Is it safe to delete?**

Graphon is shaped around answering all five from a single eBPF-fed dependency graph. The rest of this post is about how we built the data plane that makes the graph answerable.

We wanted to answer that question with **zero changes to the application code**. No sidecars. No restarts. No cooperation required. That meant going below the application and straight to the kernel, via eBPF and treating the cluster as a *stream of dependency events*, not a pile of metrics.

Before writing anything new, we tried the alternatives. [Coroot](https://coroot.com) is genuinely great for a quick eBPF service map on a single cluster — if that's all you need, start there. [Hubble](https://github.com/cilium/hubble) (Cilium's observability layer) is excellent if you're already running Cilium as your CNI. [Pixie](https://pixielabs.ai) is the right answer for dev-cluster debugging. The hosted service-mesh observability tools work well if you're all-in on a specific mesh.

We kept running into the same gap with each of them: we could see the dependency graph, but we couldn't answer **"who owns this edge"**, **"is this service still owned"**, or **"if I delete it, what's the blast radius."** Those turned out to be the questions we actually cared about. So we built something that takes a different bet — the ownership layer is the first-class concept, and the dependency graph exists to serve it.

This is a deep-dive on what we built at Graphon and what we learned shipping it: the four BPF programs, the five Go packages that consume them, the Go+Fiber ingest endpoint that turns them into a Neo4j graph, and the review/safe-delete/drift surface that ends up in the UI. If you want to skip the engineering and just see it, the [single Helm chart](https://retr0-kernel.github.io/graphon-helm) ships everything and lights the graph up in under a minute.

## What eBPF actually is — and why a kernel probe beats a sidecar

eBPF lets us run sandboxed programs directly inside the Linux kernel, triggered by events, such as system calls, network events, function calls without modifying the kernel source and without loading a kernel module. The kernel verifies the program before it runs (no infinite loops, no unsafe memory access) and then executes it at native speed.

For network observability, the interesting hooks are the TCP ones:

- `tcp_connect` — outbound connection attempt (`struct sock *sk`).
- `tcp_accept` — server-side connection arrival.
- Tracepoints on `net:` and `sock:` — catches IPv4, IPv6, and UNIX sockets, both directions.
- `sock_ops` callbacks — gives us a per-connection callback for L7 sampling without a sidecar.

If we can attach to these, we can see every TCP connection made by every process on the machine without touching those processes at all.

Service meshes and tracing agents live **inside the pod**. They see what the application sends them and only what the application sends them. If the application doesn't call the SDK, the agent sees nothing.

A kernel probe lives **below the application**. It sees everything, including:

- Connections made by the runtime itself (`execve`, dynamic linking, container init).
- Outbound HTTP from daemons we didn't realize were running.
- Cross-node traffic the mesh hasn't been configured to instrument.
- Traffic from pods whose `NetworkPolicy` is broken — the exact surprises Graphon was designed to surface.

## The agent today: four BPF programs, five Go packages

The agent runs as a per-node DaemonSet and ships four BPF programs. They compile once with CO-RE (Compile Once - Run Everywhere) so the same artifact reloads across kernel versions by relocating struct offsets at load time.

| Program | Hook | Purpose |
| --- | --- | --- |
| `tcp_connect.bpf.c` | kprobe on `tcp_connect` | Outbound TCP 4-tuple (pid, comm, src_ip, src_port, dst_ip, dst_port). |
| `net_all.bpf.c` | tracepoint `net/sock` | IPv4 + IPv6 + UNIX, inbound + outbound, TCP + UDP. |
| `tcp_lifecycle.bpf.c` | kretprobe | Per-flow latency, bytes sent/recv, retransmits, type (`established` / `closed` / `retransmit`). |
| `tcp_l7.bpf.c` | `sock_ops` | First-bytes L7 sampling — TLS handshake class + latency from the first 8 bytes of the ClientHello (Pro). HTTP/2 connection-preface detection (`PRI * HT` 8-byte prefix) and stream count (Pro). |

Each BPF program lands its event in a ring buffer (`BPF_MAP_TYPE_RINGBUF`) and user-space pulls. The Go side is split into five packages under `pkg/`:

```text
pkg/ebpf       CO-RE loader + ring-buffer consumer (libbpf-go)
pkg/enricher   Kubernetes informer → IP → pod / namespace / service cache
pkg/sender     HTTP POST to the backend with exponential backoff
pkg/agent      orchestrator: buffer, dedupe, flush, tier-aware sanitisation
pkg/otlp       OTLP/HTTP listener on :4317 (so workloads can push their own telemetry)
```

The agent's configuration lives in a ConfigMap, not env vars. The DaemonSet mounts `/etc/graphon/config.yaml` from a ConfigMap and re-reads it every 60 seconds — no pod restart to tune `BATCH_SIZE`, add a port to the known-DB list, or change the flush cadence. The full schema is documented in the [Agent ConfigMap](https://graphon.co/docs) section of the public docs.

(The `bpf/` directory in the repo also has two more programs that aren't enabled by default — `dns_query.bpf.c` and `udp_sendmsg.bpf.c`. They're behind a build flag and we'll write about them once they ship.)

The orchestrator picks a flush trigger on either **500 ms** or **100 events**, whichever comes first (`BATCH_SIZE` and `FLUSH_INTERVAL_MS` env vars). That's fast enough for incident response, slow enough that the BPF side doesn't spend more time in syscalls than in probe work.

A note on **tier-aware sanitisation**. The Free tier ships edges + protocol + lifecycle metrics. The Pro Self-Hosted tier unlocks the five B-fields: **B1 DNS attribution** (which qname resolved to which edge), **B2 TLS fingerprint** (handshake class + latency from the first 8 bytes of the ClientHello), **B3 HTTP/2** (connection-preface detection and stream count), **B4 TCP retransmit accounting** (per-flow bytes retransmitted), and **B5 encrypted-bytes attribution** (bytes inside TLS vs cleartext). The right place to strip those is the very last call site, in `pkg/agent`, where `sanitizeForTier()` rewrites the JSON bytes before the HTTP POST. No other code in the stack has to know about the tier.

## From kernel event to Neo4j edge

The destination of every agent batch is `POST /api/v1/ingest/events` on the Go backend (Fiber + GORM-free; raw `pgxpool` and `pgx` against the Bolt driver). The handler is short enough to walk through in full.

```go
func (h *IngestHandler) processEvent(ctx context.Context, e models.DependencyEvent, tenantID, clusterID string) error {
    srcID := serviceNodeID(tenantID, clusterID, srcNS, srcName)
    if err := h.graph.UpsertServiceNode(ctx, srcID, srcName, srcNS, e.SrcPod, e.SrcIP, tenantID, clusterID, srcPod); err != nil {
        return fmt.Errorf("upsert src: %w", err)
    }
    _ = h.graph.UpsertNamespaceNode(ctx, namespaceNodeID(tenantID, clusterID, srcNS), srcNS, tenantID, clusterID)

    // Destination: Database or Service. Port-based classifier.
    if dbType, isDB := knownDBPorts[e.DstPort]; isDB {
        h.graph.UpsertDatabaseNode(ctx, dstID, dstName, e.DstIP, e.DstPort, dbType, tenantID, clusterID)
    } else {
        h.graph.UpsertServiceNode(ctx, dstID, dstName, dstNS, "", e.DstIP, tenantID, clusterID, graph.PodMeta{})
    }

    h.graph.UpsertCallsEdge(ctx, srcID, dstID, tenantID, clusterID)   // the dependency edge
    h.drift.RecordEdge(ctx, tenantID, clusterID, srcID, dstID)         // baseline for "what changed since yesterday"
    return nil
}
```

Three Neo4j nodes and one relationship, per TCP 4-tuple we observe.

The **destination port classifier** is what makes Postgres / MySQL / Mongo / Redis / Cassandra / Elasticsearch show up as first-class graph nodes instead of foreign IPs. The handler keeps a small port → database-type map (5432 → postgres, 6379 → redis, 27017 → mongodb, …) and emits `(:Database { type: "postgres" })` instead of a bare service. That single decision lets the UI filter by "who is hitting a database they shouldn't be" without any client-side heuristics.

The **quality gate** is the line nobody notices until they read the source: events whose source pod couldn't be enriched (the agent fell back to a raw IP, no namespace context) are silently filtered out, not turned into garbage nodes. Prevents pollution of every namespace filter downstream.

The **drift baseline write** is the same handler, where every edge goes into a Postgres-backed baseline, scheduled snapshots compare the live graph against it. That's what powers the "what changed since yesterday?" review item downstream.

### Owning what we observe

If a source pod has an `app.graphon.io/owner-team` label, the agent writes those labels into the same `DependencyEvent` JSON it sends. The ingest handler reads `OwnerTeam` / `OwnerEmail` / `OwnerSlack` and writes a row into the `ownership_assignments` table with `source = "k8s_label"` and `confidence = 0.8`. That ownership row is what the UI shows in the right rail of every service detail page, what the orphan detector flags, what the safe-delete analyser reads when it answers "is this service owned?", and what the Slack notification posts when ownership changes. One label, five downstream surfaces.

The `X-Cluster-ID` header on the request is more than routing, every successful ingest calls `cluster.Registry.EnsureFromIngest()` which heartbeats the cluster and surfaces it on the Clusters page automatically, with zero operator action. Drop a DaemonSet on a new cluster, the cluster appears.

## What the rest of the backend does with one batch

A dependency edge is a small, atomic fact. But the backend multiplies that fact into five different products, each reading the same graph, each with its own storage and read path:

| Surface | Storage | Reads |
| --- | --- | --- |
| Graph + ownership + safe-delete + drift | Neo4j | Cypher queries in [`internal/graph/queries.go`](https://github.com/retr0-kernel/graphon-backend/blob/main/internal/graph/queries.go). |
| Audit log, cluster registry, ownership, scan findings, snapshots | Postgres | `pgxpool` raw SQL via [`internal/store/`](https://github.com/retr0-kernel/graphon-backend/tree/main/internal/store). |
| Logs, traces, metrics, costs, SLO burn-rate | ClickHouse | Per-table clients under [`internal/store/clickhouse/`](https://github.com/retr0-kernel/graphon-backend/tree/main/internal/store/clickhouse). |

Because the graph is the source of truth for *what talks to what*, **every other product hangs off it**:

- **Review Center.** Drift, orphan, license, cluster-down, stale-ownership, and mirrored reliability scanner findings, all read Neo4j edges and write back as `review_items` rows. Five-minute `SourcesFanOut` ticker. One triage queue.
- **Safe-delete.** Reverse BFS to depth 5 in Neo4j to compute blast radius, joined with the ownership table, joined with the scan findings table, joined with the SLO burn-rate table.
- **Snapshots.** Snapshot the Neo4j state (ids + edge set) into Postgres, diff later. Schedule UI lives in `internal/snapshot` with `pending → running → completed | failed` state machine and exponential-backoff retry.
- **Export.** Mermaid / DOT / JSON on Free, PDF / DrawIO on Pro. The hand-rolled `%PDF-1.4` header is 60 lines and beats the dependency footprint of `gopdf`.
- **Costs.** Egress cost attribution joins `tcp_lifecycle.bytes_sent` against a pricing table (`internal/cost/pricingtable.go` — 45-test suite covering AWS / GCP / Azure / unknown providers) and groups by service or namespace.
- **SLOs.** Multi-window burn-rate in `internal/obsmath/burnrate.go`, dependency-free, so the test suite doesn't need ClickHouse to run.
- **Telemetry.** ClickHouse is gated behind a 3-state circuit breaker (`Closed → Open → HalfOpen → Closed`, `FailureThreshold=5`, `OpenDuration=30s`). Context-cancelled errors deliberately don't trip the breaker — those are client bugs, not backend outages.

Every one of those products degrades gracefully if its backing store is down. The graph keeps ingesting, the review queue keeps working, the UI keeps rendering. Picking the wrong materialisation would have broken the offline-first feel of the Free tier.

## What we learned the hard way

A handful of things were real surprises:

1. **You see a lot more traffic than you expected.** Cron jobs talking to the database, init containers doing things and then dying, daemons talking to monitoring services. The dependency graph gets dense fast. We surface dense clusters on the graph page so engineers don't get lost.
2. **DNS attribution is the unlock.** A `tcp_connect` to an IP tells us nothing about *intent*. Once we join to the DNS query (`dig`) that resolved the IP, a `tcp_lifecycle` edge becomes a meaningful dependency edge. The DNS join is Free, runs in `pkg/enricher`, and is what makes cost attribution group correctly.
3. **Encrypted vs cleartext matters more than expected.** Not every outbound connection is TLS. Control planes are plaintext, system services are UNIX sockets. We added a per-flow `EncryptedBytes` counter (Pro, WS-8i B5) so backend aggregations can attribute bytes *inside TLS* separately from total bytes. That answer turned a noisy cost dashboard into one where the numbers matched the AWS bill.
4. **The kernel can be slow to load.** On a busy host, BPF program load takes hundreds of milliseconds. We load once and survive, not reload per pod. The agent also tolerates partial BPF failures if `tcp_l7` refuses to load on a 6.1 LTS kernel, the other three keep running and we just lose the Pro fields for that node.
5. **Tier boundaries belong at the wire, not inside the field.** We rewrote `sanitizeForTier()` in `pkg/agent` so Free and Pro both serialise from the same struct, but the Free serializer simply drops the Pro fields. We landed on this approach after a few attempts at other patterns — checking a flag inside business logic, or switching JSON tags at runtime — both ended up leaking fields downstream.
6. **A sidecar-free answer to mesh-bypass detection is still open.** If Istio is running, the sidecar intercepts the connection before the kernel sees it — we see the Envoy pod, not the workload. We're tracking this as Phase 5.

## A caveat we should call out

The agent uses eBPF, which means it needs a Linux kernel with BPF support. That covers the vast majority of self-hosted Kubernetes — bare-metal, on-prem vSphere, EKS, GKE Standard, AKS, OpenShift, RKE, Rancher. It does **not** work on:

- GKE Autopilot (the kernel doesn't expose BPF to DaemonSets).
- AWS Fargate / Azure Container Apps (no host access).
- macOS or Windows nodes.
- Talos or other hardened distros that disable BPF by default.

If you install Graphon on one of these, the agent stays alive in a **degraded mode** — `/healthz` returns 200, but `/status` reports `failed_load_probes`, and the cluster shows up in the UI with a "degraded (no data plane)" badge. You keep the ownership graph, drift detection, safe-delete verdict, review center, and snapshots — you just lose the live dependency-graph surface until you move a workload to a node that supports BPF. We're tracking better support here, but it's a real limitation today and we'd rather you know upfront than find out in production.

## What's next

If you want to see the agent in action, the [`graphon-helm`](https://retr0-kernel.github.io/graphon-helm) chart ships everything you need for a single-cluster install in about five minutes:

```bash
helm repo add graphon https://retr0-kernel.github.io/graphon-helm
helm install graphon graphon/graphon-stack \
  --namespace graphon --create-namespace \
  --set neo4j.neo4j.password=$(openssl rand -hex 16)
kubectl -n graphon port-forward svc/graphon-ui 3000:80
```

The dependency graph lights up within a minute of the first flush. The Free tier gives you the kernel-side TCP graph, ownership, drift, safe-delete (basic verdict), graph export to Mermaid / DOT / JSON, and snapshots. The Pro Self-Hosted tier unlocks the telemetry pipeline (logs / traces / metrics in ClickHouse), cost attribution, SLO tracking, the reliability scanner, RBAC + OIDC, and multi-cluster. Enterprise adds GitHub/GitLab PR impact analysis and the audit-log viewer.

And if you're trying to answer that question for your own cluster, *what is actually talking to what?* and you don't have to instrument anything. You can just install the chart and look.

— *Krish Srivastava — the Graphon team*
