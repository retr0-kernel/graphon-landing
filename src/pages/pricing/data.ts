import { GITHUB_URL } from '../../config/externalLinks';
import { ROUTES } from '../../config/routes';

export interface CompareRow {
  feature: string;
  free: boolean | string;
  enterprise: boolean | string;
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
  'No telemetry',
] as const;

export const ENTERPRISE_FEATURES: readonly string[] = [
  'Everything in Free',
  'RBAC (Viewer / Developer / Admin)',
  'OIDC / SSO with group-to-role mapping',
  'GitHub PR impact analysis & comments',
  'GitLab MR impact analysis & comments',
  'Scheduled graph snapshots',
  'Multi-cluster registry',
  'Snapshot retention policies',
  'Priority support (SLA)',
  'Custom license term',
] as const;

export const CLOUD_FEATURES: readonly string[] = [
  'Everything in Enterprise',
  'Fully managed control plane',
  'No cluster admin required',
  'Automatic updates',
  'SLA-backed uptime',
  'Usage-based billing',
  'Dedicated support',
] as const;

export const COMPARE: readonly CompareRow[] = [
  { feature: 'Live dependency graph',  free: true,        enterprise: true,        cloud: true        },
  { feature: 'Drift detection',        free: 'Manual',    enterprise: 'Scheduled', cloud: 'Scheduled' },
  { feature: 'Safe delete analysis',   free: true,        enterprise: true,        cloud: true        },
  { feature: 'Ownership discovery',    free: true,        enterprise: true,        cloud: true        },
  { feature: 'Full-text search',       free: true,        enterprise: true,        cloud: true        },
  { feature: 'Export (JSON / DOT)',    free: true,        enterprise: true,        cloud: true        },
  { feature: 'RBAC',                   free: false,       enterprise: true,        cloud: true        },
  { feature: 'OIDC / SSO',             free: false,       enterprise: true,        cloud: true        },
  { feature: 'GitHub PR Impact',       free: false,       enterprise: true,        cloud: true        },
  { feature: 'GitLab MR Impact',       free: false,       enterprise: true,        cloud: true        },
  { feature: 'Scheduled snapshots',    free: false,       enterprise: true,        cloud: true        },
  { feature: 'Multi-cluster registry', free: false,       enterprise: true,        cloud: true        },
  { feature: 'Managed hosting',        free: false,       enterprise: false,       cloud: true        },
  { feature: 'Automatic updates',      free: false,       enterprise: false,       cloud: true        },
  { feature: 'Priority support',       free: false,       enterprise: 'Included',  cloud: 'Included'  },
] as const;

export const FAQS: readonly FaqItem[] = [
  {
    q: 'Is the self-hosted tier really free?',
    a: 'Yes. Apache-2.0 license. No telemetry, no license server, no expiry. Deploy it, use it, modify it.',
  },
  {
    q: 'How do I get an Enterprise license key?',
    a: "Open a GitHub issue or email the maintainers. We'll generate a signed JWT license key for your tenant.",
  },
  {
    q: 'What happens when an Enterprise license expires?',
    a: 'Graphon gracefully falls back to the Free tier. Your cluster graph keeps running — you just lose Enterprise-only features like RBAC enforcement and scheduled snapshots.',
  },
  {
    q: 'Can I run Enterprise self-hosted?',
    a: 'Yes. Enterprise is a feature tier, not a SaaS offering. You install the same Helm chart and provide a license key. Everything runs in your cluster.',
  },
  {
    q: 'What data leaves my cluster?',
    a: 'Nothing. In self-hosted and enterprise modes, all data stays inside your cluster. The only outbound call is optionally to GitHub/GitLab for PR comments.',
  },
  {
    q: 'When is Graphon Cloud available?',
    a: "We're building it now. Join the waitlist and we'll notify you when it's ready. Early access users get 3 months free.",
  },
] as const;

export const CTA_LINKS = {
  openIssue:    `${GITHUB_URL}/issues/new`,
  getLicense:   `${GITHUB_URL}/issues/new`,
  deploy:       GITHUB_URL,
  readDocs:     ROUTES.docs,
} as const;
