import type { TerminalLine } from '../../components/terminal';

export type { TerminalLine };

export interface Component {
  icon: string;
  title: string;
  color: string;
  description: string;
}

export interface TimelineItem {
  time: string;
  label: string;
}

export interface LatencyMetric {
  name: string;
  free: string;
  pro: string;
  note: string;
}

/**
 * Wire-format sample of a single dependency event as it lands in the backend's
 * ingest path. Used to illustrate the kernel -> agent -> backend handoff.
 */
export const EVENTS_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# Kernel event captured by the eBPF agent (DaemonSet)' },
  { type: 'output',  text: '{ "src": "payment-svc:8080", "dst": "postgres:5432",' },
  { type: 'output',  text: '  "proto": "TCP", "op": "connect", "ns": "payments",' },
  { type: 'output',  text: '  "bytes_sent": 1824, "bytes_recv": 4196, "rtt_us": 280 }' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '# POSTed to backend /api/v1/ingest/batch' },
  { type: 'output',  text: 'POST /api/v1/ingest/batch  ->  202 Accepted  (3 ms)' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '# Backend upserts a graph edge in Neo4j' },
  { type: 'success', text: 'MERGE (a:Service {name:"payment-svc"})-[:CALLS]->(b:Database {type:"postgres", name:"orders-db"})' },
] as const;

/**
 * Public-facing names. The agent is shipped as the Helm sub-chart
 * `graphon-agent` so that the public surface area is "Graphon agent", not
 * "Graphon bpf". The internal Go module is still `graphon-bpf` for clarity
 * in the source tree, but end users only ever see the friendly name.
 */
export const COMPONENTS: readonly Component[] = [
  {
    icon: 'bug_report',
    title: 'graphon-agent',
    color: 'text-primary',
    description: 'eBPF agent (DaemonSet). One pod per node with CAP_BPF and CAP_NET_ADMIN. Attaches CO-RE programs to tcp_connect, tcp_accept, and tcp_close syscalls. No sidecar, no code changes.',
  },
  {
    icon: 'hub',
    title: 'graphon-backend',
    color: 'text-secondary',
    description: 'Go HTTP API. Receives agent batches over REST, writes graph edges to Neo4j, persists governance data to PostgreSQL, and streams telemetry to ClickHouse. Stateless and horizontally scalable.',
  },
  {
    icon: 'storage',
    title: 'Neo4j',
    color: 'text-[#ff9e64]',
    description: 'Graph store. Holds every service, database, namespace, and the directed CALLS edges between them. Powers dependency traversal, blast-radius queries, and safe-delete checks via Cypher.',
  },
  {
    icon: 'database',
    title: 'PostgreSQL',
    color: 'text-tertiary',
    description: 'Relational store. Cluster registry, users, OIDC sessions, ownership, graph snapshots, audit log, scan findings, drift events. Full-text search via tsvector.',
  },
  {
    icon: 'analytics',
    title: 'ClickHouse',
    color: 'text-[#ff9e64]',
    description: 'Columnar store. Connection telemetry, log streams, distributed traces, Prometheus metrics, cost attribution, and SLO burn-rate. Gated by a circuit breaker so a CH outage cannot stall the graph.',
  },
  {
    icon: 'web',
    title: 'graphon-ui',
    color: 'text-primary',
    description: 'React (Vite) SPA. Renders the live dependency graph, ownership overlays, review queues, scan results, cost dashboards, and SLO burn-rate charts. Served by the same Helm chart.',
  },
] as const;

/**
 * End-to-end latency from kernel TCP syscall to a rendered edge in the UI.
 * Numbers come from the public docs performance section — they are the p50
 * values measured against a 1k-edge / 50-node development cluster.
 */
export const TIMELINE: readonly TimelineItem[] = [
  { time: '~0 µs',   label: 'eBPF program fires on the kernel tcp_connect/accept kprobe' },
  { time: '< 200 µs', label: 'Agent enqueues the event into the ring buffer and enriches it (pod, namespace, service) against the kube informer cache' },
  { time: '~3 ms',  label: 'Agent serialises the batch to JSON and POSTs to the backend ingest endpoint' },
  { time: '< 10 ms', label: 'Backend upserts the edge in Neo4j and acknowledges the batch (HTTP 202)' },
  { time: '< 50 ms', label: 'UI long-poll receives the new edge and renders it on the canvas' },
] as const;

/**
 * Performance budget that the public docs advertise. These are real numbers
 * from the Phase 3 testing matrix, not a wishlist.
 *
 *  - "Free" = what the open-source self-hosted build targets
 *  - "Pro"  = what the Pro self-hosted build adds (OTLP/HTTP, ClickHouse, cost, SLO)
 */
export const LATENCY_BUDGET: readonly LatencyMetric[] = [
  {
    name: 'Kernel probe -> ring buffer',
    free:  '< 1 µs',
    pro:   '< 1 µs',
    note:  'CO-RE eBPF on tcp_v4_connect / inet_csk_accept. p99 < 5 µs even at 50k edges/sec/node.',
  },
  {
    name: 'Ring buffer -> agent send',
    free:  '~2 ms',
    pro:   '~2 ms',
    note:  '500 ms flush window or 100-event high-water mark — whichever hits first. Batch is gzip+JSON.',
  },
  {
    name: 'Agent -> backend ingest',
    free:  '~3 ms',
    pro:   '~3 ms',
    note:  'In-cluster HTTP. The same-backend graphon-agent on a worker node. Network RTT dominates.',
  },
  {
    name: 'Backend -> Neo4j upsert',
    free:  '~4 ms',
    pro:   '~4 ms',
    note:  'MERGE (a)-[:CALLS]->(b) with three supporting node upserts. Indexed on (tenant_id, cluster_id, service_id).',
  },
  {
    name: 'Backend -> ClickHouse write',
    free:  'n/a',
    pro:   '~6 ms',
    note:  'Per-batch async insert. Telemetry is decoupled from the critical graph-write path — Free tenants never touch ClickHouse.',
  },
  {
    name: 'UI long-poll -> rendered edge',
    free:  '< 50 ms',
    pro:   '< 50 ms',
    note:  'SSE-style change feed at /api/v1/graph/changes. UI patches the existing node set; no full re-render.',
  },
  {
    name: 'End-to-end (kernel -> canvas)',
    free:  '< 50 ms',
    pro:   '< 60 ms',
    note:  'p50 measured on a 1k-edge / 50-node dev cluster. The 10 ms Pro overhead is the ClickHouse async insert.',
  },
  {
    name: 'OTLP/HTTP trace ingest (Pro only)',
    free:  'n/a',
    pro:   '< 8 ms',
    note:  'Port 4318, both http/json and http/protobuf. Trace lands in ClickHouse and is joinable to the live graph by service.',
  },
] as const;
