import { GITHUB_URL } from '../../config/externalLinks';
import { ROUTES } from '../../config/routes';

export interface CompareRow {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  cloud: boolean | string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const FREE_FEATURES: readonly string[] = [
  'Live dependency graph (eBPF, no sidecars)',
  'Drift detection & manual snapshots',
  'Safe delete analysis (blast radius to depth 5)',
  'Ownership discovery from K8s labels',
  'Full-text search & export (Mermaid, DOT, SVG)',
  'REST API & audit log',
  'Unlimited nodes & edges',
  'No telemetry, no call home',
  'Apache-2.0 — forever',
] as const;

export const PRO_FEATURES: readonly string[] = [
  'Everything in Free',
  'RBAC with 6 built-in roles',
  'OIDC / SSO with group-to-role mapping',
  'GitHub PR & GitLab MR impact comments',
  'Scheduled graph snapshots with retention',
  'Multi-cluster registry',
  'ClickHouse telemetry (logs, traces, metrics)',
  'OTLP/HTTP receiver on port 4318',
  'Prometheus metric scraping (annotation-driven)',
  'Cost attribution (AWS / GCP / Azure)',
  'SLO tracking with multi-window burn-rate',
  'Reliability scanner (13 checks)',
  'Priority support',
  'Custom license term',
] as const;

/**
 * Graphon Cloud (Enterprise) — managed offering, currently "Coming Soon".
 * Same Pro feature surface, but we run the control plane (Neo4j, PostgreSQL,
 * ClickHouse) and you only run the agent in your cluster.
 */
export const CLOUD_FEATURES: readonly string[] = [
  'Everything in Pro',
  'Fully managed Graphon Cloud control plane',
  'Neo4j + PostgreSQL + ClickHouse managed for you',
  'No cluster admin required on your side',
  'Automatic zero-downtime updates',
  'SOC 2 Type II + tamper-evident audit log',
  'SIEM streaming (Splunk, Datadog, Panther)',
  'Named support engineer & 24×7 P1',
  'SLA-backed uptime',
] as const;

export const COMPARE: readonly CompareRow[] = [
  { feature: 'Live dependency graph (eBPF)',   free: true,        pro: true,        cloud: true        },
  { feature: 'Drift detection',                 free: 'Manual',    pro: 'Scheduled', cloud: 'Scheduled' },
  { feature: 'Safe delete analysis',            free: true,        pro: true,        cloud: true        },
  { feature: 'Ownership discovery',             free: true,        pro: true,        cloud: true        },
  { feature: 'Full-text search',                free: true,        pro: true,        cloud: true        },
  { feature: 'Export (Mermaid / DOT / SVG)',    free: true,        pro: true,        cloud: true        },
  { feature: 'Draw.io export',                  free: false,       pro: true,        cloud: true        },
  { feature: 'RBAC (6 roles)',                  free: false,       pro: true,        cloud: true        },
  { feature: 'OIDC / SSO',                      free: false,       pro: true,        cloud: true        },
  { feature: 'GitHub PR Impact',                free: false,       pro: true,        cloud: true        },
  { feature: 'GitLab MR Impact',                free: false,       pro: true,        cloud: true        },
  { feature: 'Scheduled snapshots',             free: false,       pro: true,        cloud: true        },
  { feature: 'Multi-cluster registry',          free: false,       pro: true,        cloud: true        },
  { feature: 'OTLP/HTTP trace ingest (port 4318)', free: false,     pro: true,        cloud: true        },
  { feature: 'Connection telemetry',            free: false,       pro: true,        cloud: true        },
  { feature: 'Logs (structured + raw)',         free: false,       pro: true,        cloud: true        },
  { feature: 'Distributed traces (OTLP)',       free: false,       pro: true,        cloud: true        },
  { feature: 'Prometheus metrics',              free: false,       pro: true,        cloud: true        },
  { feature: 'Cost tracking',                   free: false,       pro: true,        cloud: true        },
  { feature: 'SLO engine (multi-window burn-rate)', free: false,   pro: true,        cloud: true        },
  { feature: 'Reliability scanner (13 checks)', free: false,       pro: true,        cloud: true        },
  { feature: 'Managed control plane',           free: false,       pro: false,       cloud: true        },
  { feature: 'Automatic updates',               free: false,       pro: false,       cloud: true        },
  { feature: 'SOC 2 + audit log export',        free: false,       pro: false,       cloud: true        },
  { feature: 'Named support & 24×7 P1',         free: false,       pro: false,       cloud: true        },
  { feature: 'SLA-backed uptime',               free: false,       pro: false,       cloud: true        },
  { feature: 'Priority support',                free: false,       pro: 'Included',  cloud: 'Included'  },
] as const;

export const FAQS: readonly FaqItem[] = [
  {
    q: 'Is the self-hosted Free tier really free?',
    a: 'Yes. Apache-2.0 license. No telemetry, no license server check-in, no expiry date. Deploy it, use it, modify it.',
  },
  {
    q: 'How do I get a Pro license key?',
    a: 'Open a GitHub issue at github.com/retr0-kernel/graphon-helm/issues or message us on LinkedIn. We generate an RS256-signed JWT license key using keygen.sh, scoped to your org name and cluster count. It is emailed to you directly. Billing integration is coming — until then, this process is manual and fast.',
  },
  {
    q: 'What happens when a Pro license expires?',
    a: 'Graphon gracefully falls back to the Free tier with a 14-day grace period. Your cluster graph keeps running — you lose Pro-only features like RBAC enforcement, telemetry, cost tracking, and the scanner.',
  },
  {
    q: 'Can I run Pro fully self-hosted?',
    a: 'Yes. Pro is a feature tier, not a SaaS offering. You install the same Helm chart and provide a license key. Everything — Neo4j, PostgreSQL, ClickHouse — runs inside your cluster. No data leaves.',
  },
  {
    q: 'What data leaves my cluster?',
    a: 'Nothing in self-hosted mode. All telemetry (traces, metrics, logs, connections) is stored in your in-cluster ClickHouse. The only optional outbound calls are to GitHub/GitLab for PR/MR impact comments.',
  },
  {
    q: 'Do I need ClickHouse for the Pro tier?',
    a: 'Only for Phase 4 features (telemetry, logs, traces, metrics, cost, SLO, scanner). The core dependency graph, OIDC, RBAC, snapshots, and drift detection work without ClickHouse.',
  },
  {
    q: 'My nodes do not have topology.kubernetes.io/zone labels — will cost tracking work?',
    a: 'Yes, partially. Internet egress costs work without AZ labels. Cross-AZ costs require the zone label (or a manual node→zone map in values.yaml or the UI). Without it, all private-IP traffic is assumed to be same-AZ, so cross-AZ costs are underreported, not over-reported.',
  },
  {
    q: 'Can I disable specific reliability scan checks?',
    a: 'Yes. Use the disabledChecks list in values.yaml or the Settings → Scan Config UI. You can also exclude entire namespaces or specific workload names.',
  },
  {
    q: 'When is Graphon Cloud (Enterprise) available?',
    a: "We are building it. Early access users get 3 months free. Open a GitHub issue to get on the waitlist.",
  },
  {
    q: 'Is there a difference between Pro self-hosted and Graphon Cloud (Enterprise)?',
    a: 'The Pro feature surface is identical. Graphon Cloud (Enterprise) is the same Pro capabilities, but we run the control plane for you (Neo4j, PostgreSQL, ClickHouse) and you only run the agent in your cluster. It also adds managed-hosting, automatic updates, SOC 2 controls, and a 24×7 P1 SLA.',
  },
] as const;

export const CTA_LINKS = {
  openIssue:    `${GITHUB_URL}/issues/new?title=Pro+License+Request&labels=license`,
  getLicense:   `${GITHUB_URL}/issues/new?title=Pro+License+Request&labels=license`,
  waitlist:     `${GITHUB_URL}/issues/new?title=Graphon+Cloud+Waitlist&labels=cloud-waitlist`,
  linkedin:     'https://linkedin.com/in/retr0-kernel',
  deploy:       GITHUB_URL,
  readDocs:     ROUTES.docs,
} as const;
