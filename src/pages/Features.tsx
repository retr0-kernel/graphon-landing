const FEATURES = [
  {
    icon: 'account_tree',
    badge: 'Core',
    title: 'Live Dependency Graph',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    description:
      'eBPF traces every TCP/UDP connection kernel-side. No sidecars, no code changes, no sampling. The graph reflects your cluster as it is right now — including temporary connections that would vanish before a poll-based tool even noticed.',
    detail: [
      'Kernel-level eBPF probes on kprobe/tcp_connect, accept, close',
      'Sub-second latency from event to graph',
      'Handles ephemeral jobs, init-containers, and CronJobs',
      'Aggregates by service, not pod — survives rolling deploys',
    ],
  },
  {
    icon: 'compare_arrows',
    badge: 'Core',
    title: 'Drift Detection',
    color: 'text-secondary',
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    description:
      'Take a snapshot at any time. Compare any two snapshots. Get a precise diff: edges added, edges removed, new services, missing services. Use it in post-incident reviews, change windows, or scheduled audits.',
    detail: [
      'Named snapshots with descriptions and timestamps',
      'Edge-level diff — not just node presence',
      'Export diff as JSON or Markdown',
      'Baseline vs. incident state analysis',
    ],
  },
  {
    icon: 'warning',
    badge: 'Core',
    title: 'Safe Delete Analysis',
    color: 'text-[#ff9e64]',
    bg: 'bg-[#ff9e64]/5',
    border: 'border-[#ff9e64]/20',
    description:
      'Before deleting a Deployment, Service, or CronJob, Graphon shows you every upstream caller. No more silent 503s because someone deleted a shared utility without checking who depended on it.',
    detail: [
      'Reverse-dependency traversal in Neo4j',
      'Shows call depth (direct vs. transitive)',
      'Highlights cross-namespace dependencies',
      'Works for databases, message queues, and external endpoints',
    ],
  },
  {
    icon: 'manage_accounts',
    badge: 'Core',
    title: 'Ownership Discovery',
    color: 'text-tertiary',
    bg: 'bg-tertiary/5',
    border: 'border-tertiary/20',
    description:
      'Graphon reads `app.kubernetes.io/part-of`, `team`, `owner`, and custom label selectors from pod metadata. No spreadsheet. No manual registration. Ownership is always in sync with your running workloads.',
    detail: [
      'Configurable label selectors',
      'Ownership overlaid on the dependency graph',
      'Filter graph by team/service to reduce visual noise',
      'API endpoint for ownership queries',
    ],
  },
  {
    icon: 'policy',
    badge: 'Enterprise',
    title: 'RBAC & SSO',
    color: 'text-secondary',
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    description:
      'Enterprise deployments can enforce role-based access with Viewer, Developer, and Admin roles. Integrate your existing identity provider via OIDC — map IdP groups to Graphon roles with a single config line.',
    detail: [
      'Roles: Viewer, Developer, Admin',
      'OIDC SSO with configurable group-to-role mapping',
      'Per-route permission enforcement via Fiber middleware',
      'Audit log for privilege-sensitive actions',
    ],
  },
  {
    icon: 'merge',
    badge: 'Enterprise',
    title: 'PR / MR Impact Analysis',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    description:
      'Connect GitHub or GitLab. When a pull request touches files, Graphon queries the dependency graph and posts a comment showing which services are affected, their blast radius, and a direct link to the affected subgraph.',
    detail: [
      'GitHub webhook + HMAC-SHA256 verification',
      'GitLab webhook + token verification',
      'Impact comment posted back to the PR/MR',
      'Async dispatch — zero latency to webhook sender',
    ],
  },
  {
    icon: 'history',
    badge: 'Enterprise',
    title: 'Graph Snapshots',
    color: 'text-tertiary',
    bg: 'bg-tertiary/5',
    border: 'border-tertiary/20',
    description:
      'Scheduled and on-demand snapshots store a full graph state in PostgreSQL. Replay any historical moment. Use snapshots as incident baselines, audit evidence, or SLA proof.',
    detail: [
      'On-demand and scheduled (cron) capture',
      'Full graph serialisation to PostgreSQL JSONB',
      'Snapshot tags and retention policies',
      'Export to JSON, DOT, or Mermaid',
    ],
  },
  {
    icon: 'hub',
    badge: 'Enterprise',
    title: 'Multi-Cluster Support',
    color: 'text-[#ff9e64]',
    bg: 'bg-[#ff9e64]/5',
    border: 'border-[#ff9e64]/20',
    description:
      'Register multiple clusters in a single Graphon control plane. Switch between cluster graphs, compare topologies across environments, and get a unified ownership view spanning dev, staging, and prod.',
    detail: [
      'Cluster registry with display names and regions',
      'Per-cluster isolation with shared tenant credentials',
      'Graph overlay across clusters (coming soon)',
      'Enterprise license supports unlimited clusters',
    ],
  },
];

const BADGE_STYLE: Record<string, string> = {
  Core:       'bg-tertiary/10 text-tertiary',
  Enterprise: 'bg-secondary/10 text-secondary',
};

export default function Features() {
  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-screen-xl space-y-14">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <p className="text-label-caps uppercase text-on-surface-variant">Capabilities</p>
          <h1 className="font-display font-bold text-display-lg text-on-surface">
            Everything Graphon can do
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Core features are free forever in the self-hosted tier.
            Enterprise features unlock with a license key.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, badge, title, color, bg, border, description, detail }) => (
            <div
              key={title}
              className={`glow-card ${bg} border ${border} p-7 space-y-4 flex flex-col`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`material-symbols-outlined text-[36px] ${color}`}>{icon}</span>
                <span className={`text-label-caps uppercase px-2 py-0.5 rounded-full ${BADGE_STYLE[badge]}`}>
                  {badge}
                </span>
              </div>
              <h2 className="font-display font-bold text-headline-md text-on-surface">{title}</h2>
              <p className="text-body-sm text-on-surface-variant flex-1">{description}</p>
              <ul className="space-y-1.5">
                {detail.map(d => (
                  <li key={d} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5 shrink-0">check_circle</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison note */}
        <div className="glass-panel rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-display font-semibold text-headline-md text-tertiary mb-4">Free — Self-Hosted</p>
            <ul className="space-y-2">
              {['Live dependency graph', 'Drift detection & snapshots (manual)', 'Safe delete analysis', 'Ownership discovery', 'Search & export', 'REST API'].map(f => (
                <li key={f} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold text-headline-md text-secondary mb-4">Enterprise</p>
            <ul className="space-y-2">
              {['Everything in Free', 'RBAC (Viewer / Developer / Admin)', 'OIDC / SSO with group mapping', 'GitHub & GitLab PR impact comments', 'Scheduled graph snapshots', 'Multi-cluster registry'].map(f => (
                <li key={f} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
