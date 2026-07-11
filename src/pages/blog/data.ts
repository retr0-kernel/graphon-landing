export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;          // ISO 8601
  readingMinutes: number;
  tags: readonly string[];
  author: string;
}

export interface BlogPost extends BlogPostMeta {
  body: readonly BlogBlock[];
}

export type BlogBlock =
  | { kind: 'p';     text: string }
  | { kind: 'h2';    text: string }
  | { kind: 'h3';    text: string }
  | { kind: 'code';  language: string; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list';  ordered?: boolean; items: readonly string[] };

// ── Index (used by /blog) ─────────────────────────────────────────────────

export const POSTS: readonly BlogPostMeta[] = [
  {
    slug: 'ebpf-agent-in-kubernetes',
    title: 'I built an eBPF agent that sees everything happening inside a Kubernetes cluster — here\u2019s what I learned',
    excerpt:
      'How a kernel-side probe, a warm IP\u2192Pod cache, and a 60-second flush window turned into a dependency graph that\u2019s deeper than what sidecar-based tools give you.',
    date: '2026-07-09',
    readingMinutes: 12,
    tags: ['eBPF', 'Kubernetes', 'Observability', 'Engineering'],
    author: 'Graphon Team',
  },
] as const;

// ── Full post ─────────────────────────────────────────────────────────────

export const POSTS_BY_SLUG: Record<string, BlogPost> = {
  'ebpf-agent-in-kubernetes': {
    slug: 'ebpf-agent-in-kubernetes',
    title: 'I built an eBPF agent that sees everything happening inside a Kubernetes cluster \u2014 here\u2019s what I learned',
    excerpt:
      'How a kernel-side probe, a warm IP\u2192Pod cache, and a 60-second flush window turned into a dependency graph that\u2019s deeper than what sidecar-based tools give you.',
    date: '2026-07-09',
    readingMinutes: 12,
    tags: ['eBPF', 'Kubernetes', 'Observability', 'Engineering'],
    author: 'Graphon Team',
    body: [
      { kind: 'p', text: 'There is a question that comes up constantly in engineering teams with more than a handful of microservices:' },
      { kind: 'quote', text: '"What is actually talking to what?"' },
      { kind: 'p', text: 'Not what the architecture diagram says. Not what the runbook claims. What is actually happening, right now, inside the cluster \u2014 every real TCP connection, every service that silently depends on another, every database that a service is talking to that nobody documented.' },
      { kind: 'p', text: 'The answer most teams give is: "check the service mesh" or "look at the tracing." But those require instrumentation. Somebody has to add sidecars, add the SDK, add the annotation, redeploy. And in practice, it\u2019s never complete. There are always the old services nobody wants to touch, the third-party containers you don\u2019t control, the legacy thing that runs fine and nobody understands.' },
      { kind: 'p', text: 'I wanted to answer that question with zero changes to the application code. No sidecars. No restarts. No cooperation required.' },
      { kind: 'p', text: 'So I started digging into eBPF.' },

      { kind: 'h2', text: 'What eBPF actually is' },
      { kind: 'p', text: 'eBPF lets you run sandboxed programs directly inside the Linux kernel, triggered by events \u2014 system calls, network events, function calls \u2014 without modifying the kernel source and without loading a kernel module. The kernel verifies the program before it runs (no infinite loops, no unsafe memory access) and then executes it at native speed.' },
      { kind: 'p', text: 'For network observability, the interesting hooks are the TCP ones. When a process opens a TCP connection, the kernel calls tcp_connect. When data flows, tcp_sendmsg and tcp_recvmsg. When it closes, tcp_close. If I can attach to these, I can see every TCP connection made by every process on the machine \u2014 without touching those processes at all.' },
      { kind: 'p', text: 'The catch: eBPF programs run in the kernel. They can only do very limited work there \u2014 store data in BPF maps, emit perf events. The actual processing has to happen in user space, in a daemon that reads from those maps.' },

      { kind: 'h2', text: 'The first prototype' },
      { kind: 'p', text: 'The initial version was embarrassingly simple. Attach a kprobe to tcp_connect. In the BPF program, record the source IP, destination IP, destination port, and the PID. Emit to a perf ring buffer. In user space, read the ring buffer in a tight loop.' },
      {
        kind: 'code',
        language: 'c',
        text: 'SEC("kprobe/tcp_connect")\nint trace_connect(struct pt_regs *ctx) {\n    struct sock *sk = (struct sock *)PT_REGS_PARM1(ctx);\n\n    struct event_t event = {};\n    BPF_CORE_READ_INTO(&event.saddr, sk, __sk_common.skc_rcv_saddr);\n    BPF_CORE_READ_INTO(&event.daddr, sk, __sk_common.skc_daddr);\n    BPF_CORE_READ_INTO(&event.dport, sk, __sk_common.skc_dport);\n    event.pid = bpf_get_current_pid_tgid() >> 32;\n\n    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &event, sizeof(event));\n    return 0;\n}',
      },
      { kind: 'p', text: 'Output: a firehose of 10.0.1.5:8080 \u2192 10.0.2.3:5432 pairs. Raw IPs. No context. Completely unreadable.' },
      { kind: 'p', text: 'This was the first hard lesson: the kernel doesn\u2019t know about Kubernetes. It sees IPs and ports. The meaning \u2014 "that\u2019s the payments service talking to the postgres database" \u2014 lives entirely in user space, in the Kubernetes API.' },

      { kind: 'h2', text: 'The enrichment problem' },
      { kind: 'p', text: 'To go from 10.0.2.3 to payments-service/namespace/microservices/owner-team:platform, I need to:' },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Know which Kubernetes Pod owns that IP',
          'Know which Service or Deployment that Pod belongs to',
          'Know what labels are on that Pod (owner team, service name, etc.)',
        ],
      },
      { kind: 'p', text: 'The obvious approach: hit the Kubernetes API for every event. That\u2019s a disaster. The agent captures thousands of connections per second on a busy cluster. Synchronous API calls would be the bottleneck, not the eBPF part.' },
      { kind: 'p', text: 'The real approach: maintain a local in-memory cache, kept warm by Kubernetes informers.' },
      { kind: 'p', text: 'Informers are the standard Kubernetes client mechanism for watching resources. You set up a watcher for Pods and Services, and the client library streams change events \u2014 ADDED, MODIFIED, DELETED \u2014 as they happen. You keep a local map of IP \u2192 Pod metadata that stays perfectly in sync with the cluster state.' },
      {
        kind: 'code',
        language: 'go',
        text: 'podInformer.AddEventHandler(cache.ResourceEventHandlerFuncs{\n    AddFunc: func(obj interface{}) {\n        pod := obj.(*corev1.Pod)\n        for _, ip := range pod.Status.PodIPs {\n            ipCache[ip.IP] = PodInfo{\n                Name:      pod.Name,\n                Namespace: pod.Namespace,\n                Labels:    pod.Labels,\n            }\n        }\n    },\n    DeleteFunc: func(obj interface{}) {\n        // ... remove from cache\n    },\n})',
      },
      { kind: 'p', text: 'Now when an IP pair arrives from eBPF, lookup is a nanosecond map read. The enrichment is free.' },
      { kind: 'p', text: 'This also taught me something interesting about Kubernetes networking: pods come and go constantly, but their IP assignments are relatively stable within a deployment cycle. The cache miss rate in practice is very low \u2014 new pod IPs appear in the informer stream before they start making connections, most of the time.' },

      { kind: 'h2', text: 'Counting bytes, not just connections' },
      { kind: 'p', text: 'The initial version just detected connections \u2014 "A talked to B." But that\u2019s incomplete. How much did they talk? Traffic volume is what drives cost. A service making 10,000 tiny health check pings is very different from a service streaming 50 GB of data to another AZ.' },
      { kind: 'p', text: 'I added hooks for tcp_sendmsg and used BPF maps to accumulate byte counters per connection tuple:' },
      {
        kind: 'code',
        language: 'c',
        text: 'struct conn_key_t {\n    __be32 saddr;\n    __be32 daddr;\n    __be16 dport;\n    __u32  pid;\n};\n\n// In tcp_sendmsg hook:\n__u64 *bytes = bpf_map_lookup_elem(&conn_bytes_sent, &key);\nif (bytes) {\n    __sync_fetch_and_add(bytes, size);\n} else {\n    bpf_map_update_elem(&conn_bytes_sent, &key, &size, BPF_ANY);\n}',
      },
      { kind: 'p', text: 'A BPF hash map. The user-space daemon reads this map periodically \u2014 not per-packet, but on a 5-second flush interval \u2014 and drains the counters. This keeps kernel overhead minimal (a single atomic add per send) while still giving accurate traffic volume.' },
      { kind: 'p', text: 'The insight this unlocked: you can classify traffic by source and destination network \u2014 same availability zone, different AZ, internet egress \u2014 and assign a cost per gigabyte. Suddenly you have something a finance team actually cares about.' },

      { kind: 'h2', text: 'The AZ problem' },
      { kind: 'p', text: 'Cross-AZ traffic is expensive on every major cloud provider. A gigabyte sent between zones costs around $0.01 on AWS, $0.085 to the internet. For data-heavy services this adds up fast. But knowing whether two IPs are in the same AZ requires knowing which node each pod is on, and which AZ that node is in.' },
      { kind: 'p', text: 'Kubernetes makes this available via the topology.kubernetes.io/zone label on nodes. On EKS, GKE, and AKS, this is set automatically. On bare-metal or some managed variants, it\u2019s not set at all.' },
      { kind: 'p', text: 'So the AZ mapping becomes: pod IP \u2192 node name (via pod informer) \u2192 AZ (via node informer, reading topology label).' },
      { kind: 'p', text: 'For clusters without the topology label, I added a static mapping: operators can declare worker-1: us-east-1a in the config, which covers on-premises and hybrid environments.' },
      { kind: 'p', text: 'Without AZ information, the system falls back conservatively \u2014 private-IP traffic is treated as same-AZ (free). Better to undercount cost than to overcount.' },

      { kind: 'h2', text: 'OTLP: becoming a trace collector' },
      { kind: 'p', text: 'Here\u2019s where things got interesting. The agent is already on every node. It has the process-to-pod mapping. It has a ClickHouse connection. Why not make it receive traces too?' },
      { kind: 'p', text: 'OpenTelemetry Protocol (OTLP) is the emerging standard for trace export. Every modern tracing SDK \u2014 Go, Python, Java, Node.js, .NET \u2014 supports OTLP. The protocol supports two transports: gRPC and HTTP. HTTP/protobuf is simpler and more compatible, so that\u2019s what I implemented.' },
      { kind: 'p', text: 'The agent listens on port 4318 on the node. Your application sends traces here. The trick for Kubernetes: use the Downward API to inject the node IP as an environment variable.' },
      {
        kind: 'code',
        language: 'yaml',
        text: 'env:\n  - name: NODE_IP\n    valueFrom:\n      fieldRef:\n        fieldPath: status.hostIP\n  - name: OTEL_EXPORTER_OTLP_ENDPOINT\n    value: "http://$(NODE_IP):4318"',
      },
      { kind: 'p', text: 'Every pod sends its traces to the agent on its own node. The agent batches and writes to ClickHouse. No collector, no extra hop, no additional infrastructure.' },

      { kind: 'h2', text: 'Log collection: reading files the kernel writes' },
      { kind: 'p', text: 'Container logs on Kubernetes are written by the container runtime to files under /var/log/containers/ on the host. The agent already runs with host filesystem access (it needs /proc and /sys/kernel/debug for eBPF). Adding log collection was almost free in terms of privilege \u2014 just ReadDir the log directory and tail the files.' },
      { kind: 'p', text: 'The interesting part is format detection. There are two container log formats in the wild \u2014 containerd/CRI-O and Docker JSON \u2014 and the agent handles both, plus structured JSON parsing so log lines that carry trace_id can be joined to traces in ClickHouse. You can go from a trace to the logs it generated, or from a log error to the trace context it occurred in.' },

      { kind: 'h2', text: 'What it feels like to run this' },
      { kind: 'p', text: 'Once all of this is running \u2014 eBPF capturing connections, OTLP receiving traces, Prometheus scraping metrics, logs being tailed \u2014 and all of it flowing into ClickHouse, you have something you\u2019ve never had before in Kubernetes.' },
      { kind: 'p', text: 'You can ask: "Show me every service that called the payment database in the last hour, how many bytes they sent, what their error rate was, and what the logs looked like when the errors happened." And you can answer it in one query, because it\u2019s all in one place with consistent service and trace IDs tying it together.' },
      { kind: 'p', text: 'The dependency graph is the anchor. When you click on a service node, you\u2019re not just seeing "who calls this" \u2014 you\u2019re seeing the live trace data, the current Prometheus metrics (rate, errors, duration), the log stream, and what it\u2019s costing you in cross-AZ egress. All derived from data the agent is collecting passively, without any changes to the application.' },

      { kind: 'h2', text: 'The hardest parts' },
      {
        kind: 'list',
        items: [
          'BTF (BPF Type Format) \u2014 CO-RE (Compile Once, Run Everywhere) requires CONFIG_DEBUG_INFO_BTF=y and /sys/kernel/btf/vmlinux. GKE Autopilot and AWS Fargate don\u2019t expose the host kernel. The agent detects BTF absence at startup and falls back to a mode without eBPF, using the synthetic data path instead.',
          'Map size limits \u2014 BPF maps have fixed maximum sizes. If the cluster is large enough that the number of active connections exceeds the map capacity, entries get dropped. You size the maps conservatively, flush frequently (5-second intervals), and monitor for overflow. The flush-and-drain pattern \u2014 read the map, emit to user space, clear entries \u2014 needs to be atomic to avoid double-counting.',
          'Container log rotation \u2014 log files get rotated. The runtime truncates the file (or replaces it with a new inode). The tail implementation detects this by watching file size go to zero or the inode change, and reopens the file. Boring but essential.',
          'Kubernetes version drift \u2014 the sock structure in the Linux kernel changes between versions. BPF CO-RE handles this by using BTF to rewrite field offsets at load time, but you still have to test across kernel versions. EKS runs on 5.10+, GKE on 5.15+, AKS on 5.15+, k3s varies. The lowest common denominator for BTF is around 5.4.',
        ],
      },

      { kind: 'h2', text: 'What\u2019s next' },
      { kind: 'p', text: 'The dependency graph is alive. The telemetry is flowing. The cost data is real.' },
      { kind: 'p', text: 'The next interesting problem: making sense of it at scale. A cluster with 500 services has a graph with thousands of edges. Querying "what is the blast radius of this service going down" is a graph traversal problem \u2014 and it gets expensive when Neo4j has to walk 10 hops deep in real time.' },
      { kind: 'p', text: 'Also: SLOs. Define "payment-service must return 200 in < 200ms for 99.9% of requests." Now track error budget burn rate in real time. When you have the trace data, this is tractable. The math isn\u2019t hard. The challenge is making the time-series queries fast enough to refresh in the UI without hammering ClickHouse.' },
      { kind: 'p', text: 'More on all of this when I\u2019m ready to say what I\u2019m actually building.' },
    ],
  },
};