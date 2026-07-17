/**
 * High-level feature surface. We intentionally keep the cards here to the
 * capabilities a customer would understand before they read the docs — not
 * the internals. Internals like the spill buffer, the edge sampler, and the
 * explicit cluster registration flow belong in the Architecture and Docs
 * pages, not in the marketing-grade feature list.
 */

export interface Feature {
  icon: string;
  badge: 'Free' | 'Pro' | 'Enterprise';
  title: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  detail: readonly string[];
}

export const BADGE_STYLE: Record<Feature['badge'], string> = {
  Free:       'bg-tertiary/10 text-tertiary',
  Pro:        'bg-primary/10 text-primary',
  Enterprise: 'bg-secondary/10 text-secondary',
};

/**
 * The full ordered list rendered in the bento grid.
 * Order is: Free → Pro → Enterprise (coming soon).
 * The Enterprise tier is currently "Coming Soon" — see the page footer.
 */
export const FEATURES: readonly Feature[] = [
  // ── Free ──────────────────────────────────────────────────────────
  {
    icon: 'account_tree',
    badge: 'Free',
    title: 'Live Dependency Graph',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    description:
      'eBPF traces every TCP/UDP connection kernel-side. No sidecars, no code changes, no sampling. The graph reflects your cluster as it is right now — including the temporary connections a poll-based tool would never see.',
    detail: [
      'Kernel-level eBPF probes on tcp_connect, accept, close',
      'Sub-second latency from event to rendered graph',
      'Aggregates by service — survives rolling deploys',
      'Handles ephemeral jobs, init-containers, and CronJobs',
    ],
  },
  {
    icon: 'compare_arrows',
    badge: 'Free',
    title: 'Drift Detection & Snapshots',
    color: 'text-secondary',
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    description:
      'Take a snapshot at any time. Compare any two snapshots. Get a precise diff: edges added, edges removed, new services, missing services. Use it in post-incident reviews, change windows, or scheduled audits.',
    detail: [
      'Named snapshots with descriptions and timestamps',
      'Edge-level diff — not just node presence',
      'Export diff as JSON or Markdown',
      'Manual snapshot capture on the Free tier',
    ],
  },
  {
    icon: 'shield',
    badge: 'Free',
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
      'Works for databases, queues, and external endpoints',
    ],
  },
  {
    icon: 'manage_accounts',
    badge: 'Free',
    title: 'Ownership Discovery',
    color: 'text-tertiary',
    bg: 'bg-tertiary/5',
    border: 'border-tertiary/20',
    description:
      'Graphon reads `app.kubernetes.io/part-of`, `team`, `owner`, and your own custom label selectors from pod metadata. No spreadsheet. No manual registration. Ownership is always in sync with your running workloads.',
    detail: [
      'Configurable label selectors per tenant',
      'Ownership overlaid on the dependency graph',
      'Filter the graph by team or service to reduce noise',
      'Orphan detection surfaces unowned services',
    ],
  },

  // ── Pro ───────────────────────────────────────────────────────────
  {
    icon: 'policy',
    badge: 'Pro',
    title: 'RBAC & SSO',
    color: 'text-secondary',
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    description:
      'Six built-in roles (Viewer / Developer / Manager / Platform-Admin / Admin / Agent). Integrate your existing identity provider via OIDC and map IdP groups to Graphon roles in a single config line.',
    detail: [
      'Six built-in roles with per-route permission enforcement',
      'OIDC SSO (Google, Okta, Azure AD, Keycloak, Auth0)',
      'Group-to-role mapping configured in Helm values',
      'API-key auth continues to work in parallel',
    ],
  },
  {
    icon: 'merge',
    badge: 'Pro',
    title: 'PR / MR Impact Analysis',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    description:
      'Connect GitHub or GitLab. When a pull request touches files in a service, Graphon queries the dependency graph and posts a comment showing which services are affected, their blast radius, and a direct link to the affected subgraph.',
    detail: [
      'GitHub webhook with HMAC-SHA256 verification',
      'GitLab webhook with token verification',
      'Async dispatch — zero latency to webhook sender',
      'Impact comment posted back to the PR/MR thread',
    ],
  },
  {
    icon: 'history',
    badge: 'Pro',
    title: 'Scheduled Graph Snapshots',
    color: 'text-tertiary',
    bg: 'bg-tertiary/5',
    border: 'border-tertiary/20',
    description:
      'Capture the full graph state on a schedule and keep N of them. Use snapshots as incident baselines, audit evidence, or SLA proof. Retention policies keep the storage footprint predictable.',
    detail: [
      'Scheduled capture (cron expression per tenant)',
      'Full graph serialisation to PostgreSQL',
      'Configurable retention policies',
      'Export to JSON, DOT, Mermaid, or Draw.io',
    ],
  },
  {
    icon: 'article',
    badge: 'Pro',
    title: 'Logs, Traces & Metrics',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    description:
      'ClickHouse-backed observability correlated with the dependency graph. Jump from a service node straight into its recent logs, distributed traces, and RED metrics — without ever leaving Graphon.',
    detail: [
      'OTLP/HTTP trace ingest on port 4318',
      'Log tail by node with structured filter',
      'Trace waterfall per dependency edge',
      'RED metrics per service from Prometheus scrape',
    ],
  },
  {
    icon: 'payments',
    badge: 'Pro',
    title: 'Cost Attribution',
    color: 'text-[#ff9e64]',
    bg: 'bg-[#ff9e64]/5',
    border: 'border-[#ff9e64]/20',
    description:
      'Allocate cloud spend to every service in the graph. Custom pricing tables, known-port classification, and per-team rollup so finance and engineering speak the same language.',
    detail: [
      'Per-provider pricing tables (AWS / GCP / Azure)',
      'Cost rolled up to team or owner labels',
      'Trend view with month-over-month delta',
      'Same-AZ, cross-AZ, and internet egress split',
    ],
  },
  {
    icon: 'track_changes',
    badge: 'Pro',
    title: 'SLO Tracking',
    color: 'text-secondary',
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    description:
      'Define SLOs against any service or endpoint. Multi-window burn-rate alerts fire before users feel pain. SLO health is anchored to the dependency graph — a degraded dependency is immediately visible to every upstream owner.',
    detail: [
      'Availability, latency, and error-rate SLOs',
      'Multi-window burn-rate alerting (Google SRE math)',
      'SLO budget remaining graphed over time',
      'Per-owner SLO health dashboard',
    ],
  },
  {
    icon: 'health_and_safety',
    badge: 'Pro',
    title: 'Reliability Scanner',
    color: 'text-tertiary',
    bg: 'bg-tertiary/5',
    border: 'border-tertiary/20',
    description:
      'Continuous configuration checks across the dependency graph. Missing resource limits, single points of failure, dangling services, unowned nodes. Findings land in the Review Center so the right team owns the fix.',
    detail: [
      '13 built-in checks across Deployments, Services, CronJobs',
      'Disable individual checks or exclude namespaces',
      'Findings flow into Review Center with owner attribution',
      'Slack notifications on new high-severity findings',
    ],
  },
  {
    icon: 'hub',
    badge: 'Pro',
    title: 'Multi-Cluster Registry',
    color: 'text-[#ff9e64]',
    bg: 'bg-[#ff9e64]/5',
    border: 'border-[#ff9e64]/20',
    description:
      'Register multiple clusters in a single Graphon control plane. Switch between cluster graphs, compare topologies across environments, and get a unified ownership view spanning dev, staging, and prod.',
    detail: [
      'Cluster registry with display names and regions',
      'Per-cluster isolation with shared tenant credentials',
      'Claim-code-based cluster registration',
      'Heartbeat-driven cluster status in the UI',
    ],
  },

  // ── Enterprise (Coming Soon) ──────────────────────────────────────
  {
    icon: 'cloud_done',
    badge: 'Enterprise',
    title: 'Graphon Cloud (Managed)',
    color: 'text-secondary',
    bg: 'bg-secondary/5',
    border: 'border-secondary/20',
    description:
      'A fully managed Graphon control plane. We run Neo4j, PostgreSQL, and ClickHouse. You run the agent. No cluster admin required on your side, automatic updates, and an SLA on uptime.',
    detail: [
      'Fully managed Neo4j + PostgreSQL + ClickHouse',
      'No cluster admin required on your side',
      'Automatic zero-downtime updates',
      'SLA-backed uptime with status page',
    ],
  },
  {
    icon: 'verified_user',
    badge: 'Enterprise',
    title: 'SOC 2 + Audit Log Export',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    description:
      'Continuous SOC 2 controls and a tamper-evident audit log. Stream the audit log to your SIEM (Splunk, Datadog, Panther) for ingestion into your compliance pipeline.',
    detail: [
      'SOC 2 Type II controls in place',
      'Tamper-evident audit log for every privileged action',
      'SIEM streaming (Splunk, Datadog, Panther)',
      'Annual penetration test report on request',
    ],
  },
  {
    icon: 'support_agent',
    badge: 'Enterprise',
    title: 'Dedicated Support & SLA',
    color: 'text-tertiary',
    bg: 'bg-tertiary/5',
    border: 'border-tertiary/20',
    description:
      'A named support engineer who knows your deployment, 24×7 incident response, and an SLA that means something. The same engineer who helps you on day one is on the call when things go wrong on day 365.',
    detail: [
      'Named support engineer who knows your deployment',
      '24×7 P1 incident response',
      'Quarterly architecture review',
      'Private Slack channel with the engineering team',
    ],
  },
] as const;

/**
 * Short-form list for the comparison panel at the bottom of the page.
 * Kept in sync with the per-tier card list above.
 */
export const FREE_FEATURES: readonly string[] = [
  'Live dependency graph (eBPF)',
  'Drift detection & manual snapshots',
  'Safe delete analysis',
  'Ownership discovery',
  'Search & export (Mermaid, DOT, SVG)',
  'REST API',
  'Unlimited nodes & edges',
  'No telemetry, no call home',
  'Apache-2.0 license — forever',
] as const;

export const PRO_FEATURES: readonly string[] = [
  'Everything in Free',
  'RBAC (6 roles) & OIDC / SSO with group mapping',
  'GitHub PR & GitLab MR impact comments',
  'Scheduled graph snapshots with retention',
  'Multi-cluster registry',
  'ClickHouse telemetry: logs, traces, metrics',
  'OTLP/HTTP receiver on port 4318',
  'Cost attribution (AWS / GCP / Azure)',
  'SLO tracking with multi-window burn-rate',
  'Reliability scanner (13 checks)',
  'Prometheus metric scraping',
  'Priority support',
  'Custom license term',
] as const;

export const ENTERPRISE_FEATURES: readonly string[] = [
  'Everything in Pro',
  'Fully managed Graphon Cloud',
  'No cluster admin required',
  'Automatic zero-downtime updates',
  'SOC 2 Type II + audit log export',
  'Named support engineer & 24×7 P1',
  'SLA-backed uptime',
] as const;
