import Terminal from '../components/Terminal';

const EVENTS_LINES = [
  { type: 'comment' as const, text: '# Kernel event captured by eBPF probe' },
  { type: 'output'  as const, text: '{ "src": "payment-svc:8080", "dst": "postgres:5432",' },
  { type: 'output'  as const, text: '  "proto": "TCP", "op": "connect", "ns": "payments" }' },
  { type: 'comment' as const, text: '' },
  { type: 'comment' as const, text: '# Sent to backend over gRPC' },
  { type: 'output'  as const, text: 'POST /api/events  →  200 OK  (3ms)' },
  { type: 'comment' as const, text: '' },
  { type: 'comment' as const, text: '# Graph edge upserted in Neo4j' },
  { type: 'success' as const, text: 'MERGE (a:Service {name:"payment-svc"})-[:CALLS]->(b:Service {name:"postgres"})' },
];

const COMPONENTS = [
  {
    icon: 'bug_report',
    title: 'graphon-bpf',
    color: 'text-primary',
    description: 'eBPF probe DaemonSet. Runs one pod per node with CAP_BPF and CAP_NET_ADMIN. Hooks into kprobe/tcp_connect, accept, and close syscalls.',
  },
  {
    icon: 'dns',
    title: 'graphon-backend',
    color: 'text-secondary',
    description: 'Go/Fiber HTTP API. Receives events over REST, stores metadata in PostgreSQL, writes graph edges to Neo4j, enforces RBAC/OIDC, and dispatches webhook analysis.',
  },
  {
    icon: 'storage',
    title: 'PostgreSQL',
    color: 'text-tertiary',
    description: 'Primary relational store. Holds cluster registry, users, OIDC sessions, graph snapshots, audit events, and ownership records. Full-text search via tsvector.',
  },
  {
    icon: 'hub',
    title: 'Neo4j',
    color: 'text-[#ff9e64]',
    description: 'Graph database. Stores service nodes and directed CALLS edges. Powers dependency traversal, blast-radius queries, and safe-delete checks via Cypher.',
  },
  {
    icon: 'web',
    title: 'graphon-ui',
    color: 'text-primary',
    description: 'React (Vite) SPA served from inside the cluster. Renders the live graph with @xyflow/react, review panels, settings, and the ownership overlay.',
  },
  {
    icon: 'schedule',
    title: 'Scheduler',
    color: 'text-secondary',
    description: 'In-process background ticker. Runs governance jobs: scheduled snapshot capture, orphan detection, cluster heartbeat. Enterprise-only jobs gated by license feature flags.',
  },
];

const TIMELINE = [
  { time: '~0 ms',   label: 'eBPF probe fires on kernel tcp_connect/accept syscall' },
  { time: '< 1 ms',  label: 'Event serialised to JSON, sent to backend over HTTP' },
  { time: '< 5 ms',  label: 'Backend persists to PostgreSQL, upserts Neo4j edge' },
  { time: '< 50 ms', label: 'UI polls /api/graph — new edge rendered in browser' },
];

export default function Architecture() {
  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-screen-xl space-y-16">

        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <p className="text-label-caps uppercase text-on-surface-variant">System Design</p>
          <h1 className="font-display font-bold text-display-lg text-on-surface">Architecture</h1>
          <p className="text-body-lg text-on-surface-variant">
            Graphon is a thin data pipeline — eBPF event → REST → dual-store → React.
            Every component is stateless and horizontally scalable except the databases.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="glass-panel rounded-xl p-8 overflow-x-auto">
          <h2 className="font-display font-semibold text-headline-md text-on-surface mb-8">System Overview</h2>
          <svg
            viewBox="0 0 900 340"
            className="w-full max-w-4xl mx-auto"
            aria-label="Graphon architecture diagram"
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" className="fill-outline-variant" />
              </marker>
            </defs>

            {/* ── Kubernetes Cluster box ── */}
            <rect x="10" y="10" width="880" height="320" rx="12"
              className="fill-surface-container-low stroke-outline-variant" strokeWidth="1" />
            <text x="24" y="32" className="fill-on-surface-variant text-[11px] font-mono">Kubernetes Cluster</text>

            {/* Node group */}
            <rect x="30" y="50" width="200" height="120" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="130" y="70" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">Every Node (DaemonSet)</text>
            <rect x="50"  y="80" width="160" height="74" rx="6"
              className="fill-primary/10 stroke-primary/40" strokeWidth="1" />
            <text x="130" y="98" textAnchor="middle" className="fill-primary text-[11px] font-display font-semibold">graphon-bpf</text>
            <text x="130" y="112" textAnchor="middle" className="fill-on-surface-variant text-[9px]">eBPF kprobes</text>
            <text x="130" y="124" textAnchor="middle" className="fill-on-surface-variant text-[9px]">tcp_connect / accept</text>
            <text x="130" y="136" textAnchor="middle" className="fill-on-surface-variant text-[9px]">→ JSON events</text>

            {/* Backend */}
            <rect x="300" y="50" width="180" height="160" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="390" y="70" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">Backend (Deployment)</text>
            <rect x="316" y="80" width="148" height="115" rx="6"
              className="fill-secondary/10 stroke-secondary/40" strokeWidth="1" />
            <text x="390" y="98" textAnchor="middle" className="fill-secondary text-[11px] font-display font-semibold">graphon-backend</text>
            <text x="390" y="113" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Go · Fiber · RBAC</text>
            <text x="390" y="125" textAnchor="middle" className="fill-on-surface-variant text-[9px]">License Engine</text>
            <text x="390" y="137" textAnchor="middle" className="fill-on-surface-variant text-[9px]">OIDC Sessions</text>
            <text x="390" y="149" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Webhook Dispatcher</text>
            <text x="390" y="161" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Scheduler</text>
            <text x="390" y="178" textAnchor="middle" className="fill-on-surface-variant text-[9px]">REST API :8080</text>

            {/* Databases */}
            <rect x="550" y="50" width="150" height="80" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="625" y="70" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">PostgreSQL</text>
            <text x="625" y="88" textAnchor="middle" className="fill-tertiary text-[11px] font-display font-semibold">Metadata Store</text>
            <text x="625" y="103" textAnchor="middle" className="fill-on-surface-variant text-[9px]">clusters · users · sessions</text>
            <text x="625" y="116" textAnchor="middle" className="fill-on-surface-variant text-[9px]">snapshots · tsvector search</text>

            <rect x="550" y="155" width="150" height="70" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="625" y="174" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">Neo4j</text>
            <text x="625" y="191" textAnchor="middle" className="fill-[#ff9e64] text-[11px] font-display font-semibold">Graph Store</text>
            <text x="625" y="207" textAnchor="middle" className="fill-on-surface-variant text-[9px]">service nodes + CALLS edges</text>

            {/* UI */}
            <rect x="770" y="50" width="100" height="80" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="820" y="70" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">UI</text>
            <text x="820" y="88" textAnchor="middle" className="fill-primary text-[11px] font-display font-semibold">graphon-ui</text>
            <text x="820" y="103" textAnchor="middle" className="fill-on-surface-variant text-[9px]">React · xyflow</text>
            <text x="820" y="116" textAnchor="middle" className="fill-on-surface-variant text-[9px]">:3000</text>

            {/* External */}
            <rect x="770" y="200" width="100" height="55" rx="8"
              className="fill-surface-container-lowest stroke-outline-variant/40" strokeWidth="1" />
            <text x="820" y="220" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">External</text>
            <text x="820" y="234" textAnchor="middle" className="fill-on-surface-variant text-[9px]">GitHub / GitLab</text>
            <text x="820" y="246" textAnchor="middle" className="fill-on-surface-variant text-[9px]">OIDC Provider</text>

            {/* ── Arrows ── */}
            {/* bpf → backend */}
            <line x1="210" y1="115" x2="300" y2="130" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            <text x="240" y="112" className="fill-on-surface-variant text-[9px]">HTTP events</text>
            {/* backend → postgres */}
            <line x1="480" y1="90" x2="550" y2="90" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            {/* backend → neo4j */}
            <line x1="480" y1="140" x2="550" y2="180" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            {/* ui ← backend */}
            <line x1="730" y1="90" x2="770" y2="90" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            <text x="738" y="82" className="fill-on-surface-variant text-[9px]">REST</text>
            {/* backend ↔ external */}
            <line x1="730" y1="150" x2="820" y2="200" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 3" />

            {/* External User */}
            <ellipse cx="130" cy="270" rx="50" ry="24" className="fill-surface-container-lowest stroke-outline-variant/40" strokeWidth="1" />
            <text x="130" y="274" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Engineer (browser)</text>
            <line x1="130" y1="246" x2="820" y2="130" className="stroke-outline-variant/30" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arr)" />
          </svg>
        </div>

        {/* Data flow timeline */}
        <div className="space-y-6">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">Event-to-graph latency</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIMELINE.map(({ time, label }, i) => (
              <div key={i} className="glow-card bg-surface-container p-5 space-y-2">
                <span className="font-mono text-primary text-body-sm">{time}</span>
                <p className="text-body-sm text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* eBPF deep dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-5">
            <h2 className="font-display font-bold text-headline-lg text-on-surface">
              How the eBPF probe works
            </h2>
            <p className="text-body-md text-on-surface-variant">
              The <code className="font-mono text-primary text-body-sm bg-surface-container px-1.5 py-0.5 rounded">graphon-bpf</code> DaemonSet
              runs one pod per node. It attaches eBPF programs to kernel kprobes — specifically{' '}
              <code className="font-mono text-primary text-body-sm bg-surface-container px-1.5 py-0.5 rounded">tcp_v4_connect</code>,{' '}
              <code className="font-mono text-primary text-body-sm bg-surface-container px-1.5 py-0.5 rounded">inet_csk_accept</code>, and{' '}
              <code className="font-mono text-primary text-body-sm bg-surface-container px-1.5 py-0.5 rounded">tcp_close</code>.
            </p>
            <p className="text-body-md text-on-surface-variant">
              Each event carries the source and destination pod identity (resolved from cgroup metadata),
              namespace, port, and protocol. This happens at the kernel boundary — no userspace agent
              sitting in the data path, no sampling, no missed connections.
            </p>
            <p className="text-body-md text-on-surface-variant">
              Events are batched in a perf ring buffer and flushed to the backend every few milliseconds.
              The entire path from TCP syscall to rendered graph edge takes under 50 ms.
            </p>
          </div>
          <Terminal
            title="bpf-events"
            lines={EVENTS_LINES}
          />
        </div>

        {/* Core components */}
        <div className="space-y-6">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">Core Components</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPONENTS.map(({ icon, title, color, description }) => (
              <div key={title} className="glow-card bg-surface-container p-6 space-y-3">
                <span className={`material-symbols-outlined text-[28px] ${color}`}>{icon}</span>
                <h3 className="font-mono font-medium text-body-md text-on-surface">{title}</h3>
                <p className="text-body-sm text-on-surface-variant">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Storage schema */}
        <div className="glass-panel rounded-xl p-8 space-y-6">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">Storage Schema (PostgreSQL)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              { table: 'clusters',       cols: ['id', 'tenant_id', 'display_name', 'region', 'last_seen', 'metadata'] },
              { table: 'users',          cols: ['id', 'tenant_id', 'email', 'role', 'created_at'] },
              { table: 'sessions',       cols: ['id', 'user_id', 'token_hash', 'expires_at', 'created_at'] },
              { table: 'graph_snapshots',cols: ['id', 'cluster_id', 'label', 'description', 'graph_json', 'captured_at'] },
              { table: 'events',         cols: ['id', 'tenant_id', 'cluster_id', 'type', 'payload', 'ts'] },
              { table: 'ownership',      cols: ['service', 'namespace', 'team', 'labels', 'updated_at'] },
            ].map(({ table, cols }) => (
              <div key={table} className="space-y-2">
                <p className="font-mono text-primary text-body-sm">{table}</p>
                <ul className="space-y-0.5">
                  {cols.map(c => (
                    <li key={c} className="font-mono text-label-caps text-on-surface-variant">{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
