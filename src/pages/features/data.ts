export interface Feature {
  icon: string;
  badge: string;
  title: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  detail: readonly string[];
}

export const BADGE_STYLE: Record<string, string> = {
  Core:       'bg-tertiary/10 text-tertiary',
  Enterprise: 'bg-secondary/10 text-secondary',
};

export const FREE_FEATURES: readonly string[] = [
  'Live dependency graph',
  'Drift detection & snapshots (manual)',
  'Safe delete analysis',
  'Ownership discovery',
  'Search & export',
  'REST API',
] as const;

export const ENTERPRISE_FEATURES: readonly string[] = [
  'Everything in Free',
  'RBAC (Viewer / Developer / Admin)',
  'OIDC / SSO with group mapping',
  'GitHub & GitLab PR impact comments',
  'Scheduled graph snapshots',
  'Multi-cluster registry',
] as const;

export const FEATURES: readonly Feature[] = [
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
] as const;
