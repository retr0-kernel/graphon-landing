import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { NAV_LINKS } from '../../config/routes';
import { EXTERNAL_LINKS, BOTTOM_LINKS, GITHUB_URL } from '../../config/externalLinks';
import GraphonLogo from '../../assets/icons/GraphonLogo';
import GitHubIcon from '../../assets/icons/GitHubIcon';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} />

      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <GraphonLogo size={22} />
            <span className={styles.logoText}>Graphon</span>
          </Link>

          <p className={styles.tagline}>
            eBPF-powered runtime dependency intelligence for Kubernetes clusters.
          </p>

          <div className={styles.badges}>
            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              v0.3.0
            </span>
            <span className={styles.badge}>Apache-2.0</span>
            <span className={styles.badge}>eBPF</span>
          </div>

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

        {/* Links */}
        <div className={styles.links}>
          {/* Nav pages */}
          <div className={styles.linkCol}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={styles.linkItem}>
                {label}
              </Link>
            ))}
          </div>

          {/* External */}
          <div className={styles.linkCol}>
            {EXTERNAL_LINKS.map(({ label, href, icon, isGitHub }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalItem}
              >
                {isGitHub
                  ? <GitHubIcon size={14} className={styles.externalIcon} />
                  : <span className={`material-symbols-outlined ${styles.externalIcon}`}>{icon}</span>
                }
                {label}
              </a>
            ))}
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
