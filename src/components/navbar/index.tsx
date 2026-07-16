import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { type LucideIcon, Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useTheme, type ThemePreference } from '../../context/ThemeContext';
import styles from './styles.module.css';
import graphonImg from '../../assets/images/graphon.webp';
import { NAV_LINKS } from '../../config/routes';
import { GITHUB_URL } from '../../config/externalLinks';

const ThemeIcon: Record<ThemePreference, LucideIcon> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
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
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (logoRef.current?.complete && logoRef.current.naturalWidth > 0) {
        setLogoLoaded(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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
          <span className={styles.logoImgWrap}>
            {!logoLoaded && <span className={`img-skeleton ${styles.logoSkeleton}`} aria-hidden="true" />}
            <img
              ref={logoRef}
              src={graphonImg}
              alt="Graphon"
              width={40}
              height={40}
              className={styles.logoImg}
              onLoad={() => setLogoLoaded(true)}
              style={!logoLoaded ? { opacity: 0 } : undefined}
            />
          </span>
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
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              cycle(r.left + r.width / 2, r.top + r.height / 2);
            }}
            title={`Theme: ${LABEL_MAP[preference]}`}
            className={styles.themeBtn}
          >
            {(() => { const Icon = ThemeIcon[preference]; return <Icon key={preference} size={18} className={`${styles.themeBtnIcon} ${styles.themeBtnIconEnter}`} />; })()}
            <span className={styles.themeBtnLabel}>{LABEL_MAP[preference]}</span>
          </button>

          {/* CTA */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <FaGithub size={16} className={styles.ctaBtnIcon} />
            GitHub
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={styles.hamburger}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
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
            <FaGithub size={16} className={styles.mobileGhLinkIcon} />
            View on GitHub
          </a>
        </div>
      )}
    </header>
  );
}
