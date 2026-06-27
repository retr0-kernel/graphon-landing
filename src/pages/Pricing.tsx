import { useState } from 'react';
import { Link } from 'react-router-dom';

const FREE_FEATURES = [
  'Live dependency graph',
  'Drift detection (manual snapshots)',
  'Safe delete analysis',
  'Ownership discovery',
  'Full-text search & export',
  'REST API',
  'Community support (GitHub Issues)',
  'Unlimited nodes & edges',
  'No telemetry',
];

const ENTERPRISE_FEATURES = [
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
];

const CLOUD_FEATURES = [
  'Everything in Enterprise',
  'Fully managed control plane',
  'No cluster admin required',
  'Automatic updates',
  'SLA-backed uptime',
  'Usage-based billing',
  'Dedicated support',
];

interface CompareRow {
  feature: string;
  free: boolean | string;
  enterprise: boolean | string;
  cloud: boolean | string;
}

const COMPARE: CompareRow[] = [
  { feature: 'Live dependency graph',      free: true,        enterprise: true,       cloud: true },
  { feature: 'Drift detection',            free: 'Manual',    enterprise: 'Scheduled',cloud: 'Scheduled' },
  { feature: 'Safe delete analysis',       free: true,        enterprise: true,       cloud: true },
  { feature: 'Ownership discovery',        free: true,        enterprise: true,       cloud: true },
  { feature: 'Full-text search',           free: true,        enterprise: true,       cloud: true },
  { feature: 'Export (JSON / DOT)',        free: true,        enterprise: true,       cloud: true },
  { feature: 'RBAC',                       free: false,       enterprise: true,       cloud: true },
  { feature: 'OIDC / SSO',                 free: false,       enterprise: true,       cloud: true },
  { feature: 'GitHub PR Impact',           free: false,       enterprise: true,       cloud: true },
  { feature: 'GitLab MR Impact',           free: false,       enterprise: true,       cloud: true },
  { feature: 'Scheduled snapshots',        free: false,       enterprise: true,       cloud: true },
  { feature: 'Multi-cluster registry',     free: false,       enterprise: true,       cloud: true },
  { feature: 'Managed hosting',            free: false,       enterprise: false,      cloud: true },
  { feature: 'Automatic updates',          free: false,       enterprise: false,      cloud: true },
  { feature: 'Priority support',           free: false,       enterprise: 'Included', cloud: 'Included' },
];

const FAQS = [
  {
    q: 'Is the self-hosted tier really free?',
    a: 'Yes. Apache-2.0 license. No telemetry, no license server, no expiry. Deploy it, use it, modify it.',
  },
  {
    q: 'How do I get an Enterprise license key?',
    a: 'Open a GitHub issue or email the maintainers. We\'ll generate a signed JWT license key for your tenant.',
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
    a: 'We\'re building it now. Join the waitlist and we\'ll notify you when it\'s ready. Early access users get 3 months free.',
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)  return <span className="material-symbols-outlined text-[18px] text-tertiary">check</span>;
  if (value === false) return <span className="material-symbols-outlined text-[18px] text-outline-variant">remove</span>;
  return <span className="text-body-sm text-on-surface-variant">{value}</span>;
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-outline-variant/40">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="text-body-md text-on-surface font-medium">{q}</span>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <p className="pb-4 text-body-md text-on-surface-variant">{a}</p>
      )}
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-screen-xl space-y-20">

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-label-caps uppercase text-on-surface-variant">Pricing</p>
          <h1 className="font-display font-bold text-display-lg text-on-surface">
            Start free. Scale when you need to.
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            The core graph is free forever. Pay only for team-scale features.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free */}
          <div className="glow-card bg-surface-container p-8 space-y-6">
            <div>
              <p className="text-label-caps uppercase text-tertiary">Self-Hosted</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="font-display font-bold text-display-lg text-on-surface">Free</span>
                <span className="text-body-sm text-on-surface-variant mb-2">forever</span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">Apache-2.0. No license server. No telemetry.</p>
            </div>
            <a
              href="https://github.com/retr0-kernel/graphon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-outline-variant/60 text-on-surface font-medium text-body-md px-4 py-2.5 rounded-full hover:bg-surface-container-high transition-colors w-full"
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              Deploy Now
            </a>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise */}
          <div className="relative glow-card bg-primary/5 border-primary/40 p-8 space-y-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-label-caps px-4 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </div>
            <div>
              <p className="text-label-caps uppercase text-primary">Enterprise</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="font-display font-bold text-display-lg text-on-surface">Custom</span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">Annual license. Self-hosted, in your cluster.</p>
            </div>
            <a
              href="https://github.com/retr0-kernel/graphon/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-on-primary font-medium text-body-md px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity w-full"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Get a License
            </a>
            <ul className="space-y-2.5">
              {ENTERPRISE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Cloud */}
          <div className="glow-card bg-surface-container p-8 space-y-6 opacity-70">
            <div>
              <p className="text-label-caps uppercase text-secondary">Graphon Cloud</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="font-display font-bold text-headline-lg text-on-surface">Coming Soon</span>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">Managed. No cluster admin required.</p>
            </div>
            <button
              disabled
              className="flex items-center justify-center gap-2 border border-outline-variant/30 text-on-surface-variant font-medium text-body-md px-4 py-2.5 rounded-full cursor-not-allowed w-full"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              Join Waitlist
            </button>
            <ul className="space-y-2.5">
              {CLOUD_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compare table */}
        <div className="space-y-6">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-outline-variant/40">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-high">
                  <th className="px-5 py-3 text-label-caps uppercase text-on-surface-variant">Feature</th>
                  <th className="px-5 py-3 text-label-caps uppercase text-tertiary text-center">Free</th>
                  <th className="px-5 py-3 text-label-caps uppercase text-primary text-center">Enterprise</th>
                  <th className="px-5 py-3 text-label-caps uppercase text-secondary text-center">Cloud</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-outline-variant/20 ${
                      i % 2 === 0 ? 'bg-surface-container-low/50' : ''
                    }`}
                  >
                    <td className="px-5 py-3 text-body-sm text-on-surface-variant">{row.feature}</td>
                    <td className="px-5 py-3 text-center"><Cell value={row.free} /></td>
                    <td className="px-5 py-3 text-center"><Cell value={row.enterprise} /></td>
                    <td className="px-5 py-3 text-center"><Cell value={row.cloud} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">Frequently Asked Questions</h2>
          <div>
            {FAQS.map(({ q, a }) => (
              <Faq key={q} q={q} a={a} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="glass-panel rounded-xl p-10 text-center space-y-5">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">
            Still have questions?
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Open a GitHub issue, read the docs, or browse the source code.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/retr0-kernel/graphon/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-on-primary font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">bug_report</span>
              Open an Issue
            </a>
            <Link
              to="/architecture"
              className="flex items-center gap-2 border border-outline-variant/60 text-on-surface font-medium px-5 py-2.5 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
