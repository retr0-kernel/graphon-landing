import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { NAV_LINKS, ROUTES } from '../../config/routes';
import { BOTTOM_LINKS, GITHUB_URL } from '../../config/externalLinks';
import { CONTACT_PAGE_DATA, getGmailComposeUrl } from '../../pages/contact-us/data';
import GraphonLogo from '../../assets/icons/GraphonLogo';
import GitHubIcon from '../../assets/icons/GitHubIcon';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} />
      <div className={styles.bgOrbOne} aria-hidden="true" />
      <div className={styles.bgOrbTwo} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.brandCard}>
          <div className={styles.brandTop}>
            <Link to="/" className={styles.logoLink}>
              <GraphonLogo size={26} />
              <span className={styles.logoText}>Graphon</span>
            </Link>
            <span className={styles.statusPill}>
              <span className={`${styles.statusDot} dot-pulse`} />
              Open source
            </span>
          </div>

          <p className={styles.tagline}>
            eBPF-powered runtime dependency intelligence for Kubernetes clusters.
            Map services, understand blast radius, and run everything in your own environment.
          </p>

          <div className={styles.actionRow}>
            <Link to={ROUTES.contactUs} className={styles.contactBtn}>
              <span className="material-symbols-outlined">forum</span>
              Contact Us
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ghBtn}
            >
              <GitHubIcon size={15} />
              Star on GitHub
            </a>
          </div>
        </div>

        <div className={styles.linksPanel}>
          <div className={styles.linkCol}>
            <p className={styles.colTitle}>Explore</p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={styles.linkItem}>
                {label}
              </Link>
            ))}
          </div>

          <div className={styles.linkCol}>
            <p className={styles.colTitle}>Connect</p>
            <Link to={ROUTES.contactUs} className={`${styles.linkItem} ${styles.iconLink}`}>
              <span className={`material-symbols-outlined ${styles.externalIcon}`}>forum</span>
              Contact Us
            </Link>
            <a
              href={getGmailComposeUrl(CONTACT_PAGE_DATA.primaryEmail)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalItem}
            >
              <span className={`material-symbols-outlined ${styles.externalIcon}`}>mail</span>
              {CONTACT_PAGE_DATA.primaryEmail}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalItem}
            >
              <GitHubIcon size={14} className={styles.externalIcon} />
              GitHub
            </a>
          </div>

          <div className={styles.miniCard}>
            <span className={`material-symbols-outlined ${styles.miniIcon}`}>hub</span>
            <p className={styles.miniTitle}>Runtime graph, no sidecars.</p>
            <p className={styles.miniText}>Built for teams that need visibility without surrendering control.</p>
          </div>
        </div>
      </div>

      <div className={styles.sep} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Graphon · Open source · No telemetry · No cloud required
        </p>
        <div className={styles.bottomLinks}>
          {BOTTOM_LINKS.map(({ label, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={styles.bottomLink}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
