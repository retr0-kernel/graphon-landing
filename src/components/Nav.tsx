import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme, type ThemePreference } from '../context/ThemeContext';

const ICON_MAP: Record<ThemePreference, string> = {
  dark: 'dark_mode',
  light: 'light_mode',
  system: 'contrast',
};
const LABEL_MAP: Record<ThemePreference, string> = {
  dark: 'Dark',
  light: 'Light',
  system: 'System',
};

export default function Nav() {
  const { preference, cycle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-body-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-primary'
        : 'text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'glass-panel bg-surface-container-low/80 border-b border-outline-variant/50'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-screen-xl px-6 md:px-10 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" className="fill-surface-container-high stroke-outline-variant" strokeWidth="1" />
            <circle cx="12" cy="6"  r="2.5" className="fill-primary" />
            <circle cx="6"  cy="15" r="2"   className="fill-secondary" />
            <circle cx="18" cy="15" r="2"   className="fill-tertiary" />
            <line x1="12" y1="8.5"  x2="6"  y2="13" className="stroke-outline" strokeWidth="1" />
            <line x1="12" y1="8.5"  x2="18" y2="13" className="stroke-outline" strokeWidth="1" />
            <line x1="6"  y1="15"   x2="18" y2="15" className="stroke-outline" strokeWidth="1" />
          </svg>
          <span className="font-display font-bold text-on-surface text-[15px] tracking-tight">
            Graphon
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/"             className={linkClass} end>Home</NavLink>
          <NavLink to="/features"     className={linkClass}>Features</NavLink>
          <NavLink to="/architecture" className={linkClass}>Architecture</NavLink>
          <NavLink to="/pricing"      className={linkClass}>Pricing</NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={cycle}
            title={`Theme: ${LABEL_MAP[preference]}`}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors px-2 py-1 rounded-lg hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">{ICON_MAP[preference]}</span>
            <span className="hidden sm:inline text-label-caps uppercase">{LABEL_MAP[preference]}</span>
          </button>

          {/* CTA */}
          <a
            href="https://github.com/retr0-kernel/graphon"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-primary text-on-primary font-medium text-body-sm px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            GitHub
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-b border-outline-variant/50 px-6 pb-4 pt-2 flex flex-col gap-4">
          {[
            { to: '/',             label: 'Home',         end: true },
            { to: '/features',     label: 'Features' },
            { to: '/architecture', label: 'Architecture' },
            { to: '/pricing',      label: 'Pricing' },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-body-md font-medium py-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://github.com/retr0-kernel/graphon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary text-body-sm font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            View on GitHub
          </a>
        </div>
      )}
    </header>
  );
}
