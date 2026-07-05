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
  'Live dependency graph',
  'Drift detection (manual snapshots)',
  'Safe delete analysis',
  'Ownership discovery',
  'Full-text search & export',
  'REST API',
  'Community support (GitHub Issues)',
  'Unlimited nodes & edges',
  'No telemetry sent anywhere',
] as const;

export const PRO_FEATURES: readonly string[] = [
  'Everything in Free',
  'RBAC (6 roles: Viewer / Developer / Manager / Platform-Admin / Admin / Agent)',
  'OIDC / SSO with group-to-role mapping',
  'GitHub PR impact analysis & comments',
  'GitLab MR impact analysis & comments',
  'Scheduled graph snapshots',
  'Multi-cluster registry',
  'Snapshot retention policies',
  'ClickHouse telemetry: connections, logs, traces, metrics',
  'OTLP/HTTP trace ingestion (port 4318)',
  'Prometheus metric scraping (annotation-driven, with auth)',
  'Live log streaming + structured search',
  'Cost tracking (AWS/GCP/Azure, configurable pricing)',
  'SLO engine (availability, latency, custom error budgets)',
  'Reliability & security scanner (13 checks, all configurable)',
  'Priority support',
  'Custom license term',
] as const;

export const CLOUD_FEATURES: readonly string[] = [
  'Everything in Pro',
  'Fully managed control plane (Neo4j + PostgreSQL + ClickHouse)',
  'No cluster admin required',
  'Automatic updates',
  'SLA-backed uptime',
  'Usage-based billing',
  'Dedicated support channel',
] as const;

export const COMPARE: readonly CompareRow[] = [
  { feature: 'Live dependency graph',           free: true,        pro: true,        cloud: true        },
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
  { feature: 'Connection telemetry',            free: false,       pro: true,        cloud: true        },
  { feature: 'Logs (structured + raw)',         free: false,       pro: true,        cloud: true        },
  { feature: 'Distributed traces (OTLP)',       free: false,       pro: true,        cloud: true        },
  { feature: 'Prometheus metrics',              free: false,       pro: true,        cloud: true        },
  { feature: 'Cost tracking',                   free: false,       pro: true,        cloud: true        },
  { feature: 'SLO engine',                      free: false,       pro: true,        cloud: true        },
  { feature: 'Reliability scanner (13 checks)', free: false,       pro: true,        cloud: true        },
  { feature: 'Managed hosting',                 free: false,       pro: false,       cloud: true        },
  { feature: 'Automatic updates',               free: false,       pro: false,       cloud: true        },
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
    q: 'When is Graphon Cloud available?',
    a: "We are building it. Early access users get 3 months free. Open a GitHub issue to get on the waitlist.",
  },
] as const;

export const CTA_LINKS = {
  openIssue:    `${GITHUB_URL}/issues/new?title=Pro+License+Request&labels=license`,
  getLicense:   `${GITHUB_URL}/issues/new?title=Pro+License+Request&labels=license`,
  linkedin:     'https://linkedin.com/in/retr0-kernel',
  deploy:       GITHUB_URL,
  readDocs:     ROUTES.docs,
} as const;
