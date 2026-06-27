import { Link } from 'react-router-dom';

const NAV = [
  { label: 'Home',         to: '/' },
  { label: 'Features',     to: '/features' },
  { label: 'Architecture', to: '/architecture' },
  { label: 'Pricing',      to: '/pricing' },
];

const LINKS = [
  { label: 'GitHub',      href: 'https://github.com/retr0-kernel/graphon' },
  { label: 'Helm Chart',  href: 'https://github.com/retr0-kernel/graphon/tree/main/graphon-helm' },
  { label: 'Docs',        href: 'https://github.com/retr0-kernel/graphon/blob/main/graphon-helm/docs/README.md' },
  { label: 'Changelog',   href: 'https://github.com/retr0-kernel/graphon/releases' },
];

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/50 bg-surface-container-lowest">
      <div className="mx-auto max-w-screen-xl px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" className="fill-surface-container-high stroke-outline-variant" strokeWidth="1" />
              <circle cx="12" cy="6"  r="2.5" className="fill-primary" />
              <circle cx="6"  cy="15" r="2"   className="fill-secondary" />
              <circle cx="18" cy="15" r="2"   className="fill-tertiary" />
              <line x1="12" y1="8.5" x2="6"  y2="13" className="stroke-outline" strokeWidth="1" />
              <line x1="12" y1="8.5" x2="18" y2="13" className="stroke-outline" strokeWidth="1" />
              <line x1="6"  y1="15"  x2="18" y2="15" className="stroke-outline" strokeWidth="1" />
            </svg>
            <span className="font-display font-bold text-on-surface text-[14px]">Graphon</span>
          </Link>
          <p className="text-body-sm text-on-surface-variant max-w-xs">
            eBPF-powered runtime dependency intelligence for Kubernetes clusters.
          </p>
          <p className="text-label-caps text-on-surface-variant uppercase">
            Apache-2.0 · v0.3.0
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-label-caps uppercase text-on-surface-variant mb-4">Navigate</p>
          <ul className="space-y-2">
            {NAV.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* External links */}
        <div>
          <p className="text-label-caps uppercase text-on-surface-variant mb-4">Resources</p>
          <ul className="space-y-2">
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 px-6 md:px-10 py-4 text-center text-label-caps text-on-surface-variant uppercase">
        © {new Date().getFullYear()} Graphon. Open source. No telemetry. No cloud required.
      </div>
    </footer>
  );
}
