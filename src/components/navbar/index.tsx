import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme, type ThemePreference } from '../../context/ThemeContext';
import styles from './styles.module.css';
import GraphonLogo from '../../assets/icons/GraphonLogo';
import { NAV_LINKS } from '../../config/routes';
import { GITHUB_URL } from '../../config/externalLinks';

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

export default function Navbar() {
  const { preference, cycle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`;

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : styles.headerTop}`}
    >
      <nav className={styles.nav}>
        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <GraphonLogo size={24} />
          <span className={styles.logoText}>Graphon</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.desktopLinks}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={desktopLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className={styles.rightActions}>
          {/* Theme toggle */}
          <button
            onClick={cycle}
            title={`Theme: ${LABEL_MAP[preference]}`}
            className={styles.themeBtn}
          >
            <span className={`material-symbols-outlined ${styles.themeBtnIcon}`}>
              {ICON_MAP[preference]}
            </span>
            <span className={styles.themeBtnLabel}>{LABEL_MAP[preference]}</span>
          </button>

          {/* CTA */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <span className={`material-symbols-outlined ${styles.ctaBtnIcon}`}>code</span>
            GitHub
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={styles.hamburger}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
            >
              {label}
            </NavLink>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileGhLink}
          >
            <span className={`material-symbols-outlined ${styles.mobileGhLinkIcon}`}>code</span>
            View on GitHub
          </a>
        </div>
      )}
    </header>
  );
}
