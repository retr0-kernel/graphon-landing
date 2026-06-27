import { Link } from 'react-router-dom';
import ShaderCanvas from '../components/ShaderCanvas';
import Terminal from '../components/Terminal';

const INSTALL_LINES = [
  { type: 'comment' as const, text: '# 1. Add the Helm repo' },
  { type: 'command' as const, text: 'helm repo add graphon https://retr0-kernel.github.io/graphon-helm' },
  { type: 'command' as const, text: 'helm repo update' },
  { type: 'comment' as const, text: '' },
  { type: 'comment' as const, text: '# 2. Deploy to your cluster' },
  { type: 'command' as const, text: 'helm install graphon graphon/graphon --namespace graphon --create-namespace' },
  { type: 'comment' as const, text: '' },
  { type: 'output'  as const, text: 'NAME: graphon' },
  { type: 'output'  as const, text: 'STATUS: deployed' },
  { type: 'output'  as const, text: 'REVISION: 1' },
  { type: 'comment' as const, text: '' },
  { type: 'comment' as const, text: '# 3. Open the dashboard' },
  { type: 'command' as const, text: 'kubectl port-forward svc/graphon-ui 3000:80 -n graphon' },
  { type: 'success' as const, text: '✓  Visit http://localhost:3000' },
];

const FEATURES = [
  {
    icon: 'account_tree',
    title: 'Live Dependency Graph',
    description: 'eBPF traces every TCP/UDP connection. Your service topology is always current — no agents, no sidecars.',
    color: 'text-primary',
  },
  {
    icon: 'compare_arrows',
    title: 'Drift Detection',
    description: 'Compare snapshots across time. Know exactly when a service started talking to a new endpoint.',
    color: 'text-secondary',
  },
  {
    icon: 'warning',
    title: 'Safe Delete Analysis',
    description: 'Before removing a workload, Graphon shows you every service that depends on it.',
    color: 'text-[#ff9e64]',
  },
  {
    icon: 'manage_accounts',
    title: 'Ownership Discovery',
    description: 'Auto-detect team ownership from pod labels. No manual spreadsheet maintenance.',
    color: 'text-tertiary',
  },
];

const MODES = [
  {
    badge: 'FREE',
    title: 'Self-Hosted',
    desc: 'Full dependency graph, drift detection, and ownership discovery. Runs entirely in your cluster.',
    cta: 'Deploy Now',
    ctaHref: '/pricing',
    highlight: false,
  },
  {
    badge: 'ENTERPRISE',
    title: 'Enterprise',
    desc: 'RBAC, SSO/OIDC, GitHub & GitLab PR impact analysis, graph snapshots, and multi-cluster support.',
    cta: 'Get a License',
    ctaHref: '/pricing',
    highlight: true,
  },
  {
    badge: 'COMING SOON',
    title: 'Graphon Cloud',
    desc: 'Fully managed. Connect your cluster once and get the full dashboard without operating anything.',
    cta: 'Join Waitlist',
    ctaHref: '/pricing',
    highlight: false,
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden px-6">
        {/* Shader background */}
        <ShaderCanvas />

        {/* Radial fade from background over the shader */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/60 to-background pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-surface-container/70 backdrop-blur border border-outline-variant/50 text-label-caps uppercase px-3 py-1.5 rounded-full text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dot-pulse inline-block" />
            v0.3.0 — Self-Hosted &amp; Enterprise
          </div>

          <h1 className="font-display font-bold text-display-lg text-on-surface leading-tight">
            Runtime Dependency{' '}
            <span className="text-gradient">Intelligence</span>
            {' '}for Kubernetes
          </h1>

          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Graphon uses eBPF to build a live service graph of your entire cluster —
            no code changes, no sidecars. Detect drift, analyze blast radius, and own your infrastructure.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/features"
              className="flex items-center gap-2 bg-primary text-on-primary font-medium text-body-md px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              See Features
            </Link>
            <a
              href="https://github.com/retr0-kernel/graphon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-outline-variant/70 text-on-surface font-medium text-body-md px-5 py-2.5 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              View on GitHub
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-on-surface-variant/40 animate-bounce">
          <span className="material-symbols-outlined text-[28px]">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ── Problem Statement ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/30 rounded-xl overflow-hidden">
            {[
              { icon: 'help', q: '"Which services call payment-svc?"',     a: 'Impossible to answer from docs alone.' },
              { icon: 'help', q: '"Is it safe to delete this deployment?"', a: 'Unknown without tracing every dependent.' },
              { icon: 'help', q: '"What changed since last Tuesday?"',      a: 'No baseline. No diff. No answer.' },
            ].map(({ icon, q, a }) => (
              <div key={q} className="bg-surface-container-low p-8">
                <span className="material-symbols-outlined text-[28px] text-error/70 mb-4 block">{icon}</span>
                <p className="font-mono text-body-sm text-on-surface mb-2">{q}</p>
                <p className="text-body-sm text-on-surface-variant">{a}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-body-lg text-on-surface-variant mt-8">
            Graphon answers all of these — in real time, without instrumenting a single line of code.
          </p>
        </div>
      </section>

      {/* ── Quick Install ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-surface-container-lowest/50">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <p className="text-label-caps uppercase text-primary">Get Running in 5 Minutes</p>
              <h2 className="font-display font-bold text-headline-lg text-on-surface">
                Three commands from zero to graph
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Graphon ships as a Helm chart. Add the repo, deploy to your cluster,
                port-forward the UI, and you have a live dependency map.
              </p>
              <Link
                to="/architecture"
                className="inline-flex items-center gap-1.5 text-primary font-medium text-body-md hover:underline"
              >
                How does it work?
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <Terminal title="install" lines={INSTALL_LINES} copyable />
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ───────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-screen-xl space-y-12">
          <div className="text-center space-y-3">
            <p className="text-label-caps uppercase text-on-surface-variant">Capabilities</p>
            <h2 className="font-display font-bold text-headline-lg text-on-surface">Everything you need to own your cluster</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon, title, description, color }) => (
              <div key={title} className="glow-card bg-surface-container p-6 space-y-3">
                <span className={`material-symbols-outlined text-[32px] ${color}`}>{icon}</span>
                <h3 className="font-display font-semibold text-headline-md text-on-surface">{title}</h3>
                <p className="text-body-sm text-on-surface-variant">{description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 border border-outline-variant/60 text-on-surface font-medium px-5 py-2.5 rounded-full hover:bg-surface-container-high transition-colors"
            >
              All Features
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Deployment Modes ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-surface-container-lowest/50">
        <div className="mx-auto max-w-screen-xl space-y-12">
          <div className="text-center space-y-3">
            <p className="text-label-caps uppercase text-on-surface-variant">Deployment</p>
            <h2 className="font-display font-bold text-headline-lg text-on-surface">
              Run it your way
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MODES.map(({ badge, title, desc, cta, ctaHref, highlight }) => (
              <div
                key={title}
                className={`glow-card p-7 space-y-4 relative ${
                  highlight
                    ? 'bg-primary/5 border-primary/40'
                    : 'bg-surface-container'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-label-caps px-3 py-0.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <span className="text-label-caps uppercase text-on-surface-variant">{badge}</span>
                <h3 className="font-display font-bold text-headline-md text-on-surface">{title}</h3>
                <p className="text-body-sm text-on-surface-variant">{desc}</p>
                <Link
                  to={ctaHref}
                  className={`inline-flex items-center gap-1.5 font-medium text-body-sm ${
                    highlight ? 'text-primary' : 'text-on-surface-variant'
                  } hover:underline`}
                >
                  {cta}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="font-display font-bold text-headline-lg text-on-surface">
            Your cluster is already talking. <br />
            <span className="text-gradient">Are you listening?</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Graphon is open source. No telemetry. No sign-up. No cloud dependency.
            Deploy today and see your first graph in under five minutes.
          </p>
          <a
            href="https://github.com/retr0-kernel/graphon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-medium text-body-md px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">star</span>
            Star on GitHub
          </a>
        </div>
      </section>
    </>
  );
}
