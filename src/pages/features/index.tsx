import { type CSSProperties } from 'react';
import styles from './styles.module.css';
import {
  FEATURES, BADGE_STYLE,
  FREE_FEATURES, PRO_FEATURES, ENTERPRISE_FEATURES,
} from './data';
import { useInView } from '../../hooks/useInView';

/**
 * Group the FEATURES list by badge so we can render three visual sections
 * (Free, Pro, Enterprise) in the bento grid. The Free / Pro cards are full
 * colour; the Enterprise cards render with a "Coming Soon" overlay.
 */
function groupByTier(items: typeof FEATURES) {
  return {
    free:       items.filter(f => f.badge === 'Free'),
    pro:        items.filter(f => f.badge === 'Pro'),
    enterprise: items.filter(f => f.badge === 'Enterprise'),
  };
}

export default function Features() {
  const { ref: headerRef,         visible: headerVisible         } = useInView<HTMLDivElement>();
  const { ref: freeRef,           visible: freeVisible           } = useInView<HTMLDivElement>();
  const { ref: proRef,            visible: proVisible            } = useInView<HTMLDivElement>();
  const { ref: enterpriseRef,     visible: enterpriseVisible     } = useInView<HTMLDivElement>();
  const { ref: comparisonRef,     visible: comparisonVisible     } = useInView<HTMLDivElement>();

  const delay = (ms: number): CSSProperties => ({ '--delay': `${ms}ms` } as CSSProperties);
  const { free, pro, enterprise } = groupByTier(FEATURES);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className={`${styles.header} ${styles.reveal} ${headerVisible ? styles.inView : ''}`}
        >
          <p className={styles.eyebrow}>Capabilities</p>
          <h1 className={styles.title}>Everything Graphon can do</h1>
          <p className={styles.subtitle}>
            Core capabilities are free forever in the self-hosted tier.
            Pro features unlock with a license key. Graphon Cloud (Enterprise)
            is fully managed and is on the roadmap.
          </p>
        </div>

        {/* ── Free tier section ────────────────────────────────────── */}
        <section ref={freeRef} className={styles.tierSection}>
          <header className={styles.tierHeader}>
            <span className={`${styles.tierDot} ${styles.tierDotFree}`} aria-hidden="true" />
            <h2 className={styles.tierHeading}>Free — Self-Hosted</h2>
            <span className={styles.tierNote}>Forever free, Apache-2.0</span>
          </header>
          <div className={styles.bentoGrid}>
            {free.map(({ icon, badge, title, color, bg, border, description, detail }, i) => (
              <div
                key={title}
                className={`${styles.featureCard} glow-card ${bg} border ${border} ${styles.revealScale} ${freeVisible ? styles.inView : ''}`}
                style={delay(i * 80)}
              >
                <div className={styles.cardTop}>
                  <span className={`material-symbols-outlined text-[36px] ${color}`}>{icon}</span>
                  <span className={`${styles.badge} ${BADGE_STYLE[badge]}`}>{badge}</span>
                </div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{description}</p>
                <ul className={styles.detailList}>
                  {detail.map(d => (
                    <li key={d} className={styles.detailItem}>
                      <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pro tier section ─────────────────────────────────────── */}
        <section ref={proRef} className={styles.tierSection}>
          <header className={styles.tierHeader}>
            <span className={`${styles.tierDot} ${styles.tierDotPro}`} aria-hidden="true" />
            <h2 className={styles.tierHeading}>Pro — Self-Hosted</h2>
            <span className={styles.tierNote}>License key — same Helm chart</span>
          </header>
          <div className={styles.bentoGrid}>
            {pro.map(({ icon, badge, title, color, bg, border, description, detail }, i) => (
              <div
                key={title}
                className={`${styles.featureCard} glow-card ${bg} border ${border} ${styles.revealScale} ${proVisible ? styles.inView : ''}`}
                style={delay(i * 80)}
              >
                <div className={styles.cardTop}>
                  <span className={`material-symbols-outlined text-[36px] ${color}`}>{icon}</span>
                  <span className={`${styles.badge} ${BADGE_STYLE[badge]}`}>{badge}</span>
                </div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{description}</p>
                <ul className={styles.detailList}>
                  {detail.map(d => (
                    <li key={d} className={styles.detailItem}>
                      <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Enterprise tier section (Coming Soon) ────────────────── */}
        <section ref={enterpriseRef} className={styles.tierSection}>
          <header className={styles.tierHeader}>
            <span className={`${styles.tierDot} ${styles.tierDotEnterprise}`} aria-hidden="true" />
            <h2 className={styles.tierHeading}>Graphon Cloud — Enterprise</h2>
            <span className={styles.comingSoonPill}>Coming Soon</span>
          </header>
          <p className={styles.tierLede}>
            We're building a fully managed version of Graphon. If you want to
            be on the early-access list, open a GitHub issue — early users get
            three months free.
          </p>
          <div className={`${styles.bentoGrid} ${styles.bentoGridBlurred}`}>
            {enterprise.map(({ icon, badge, title, color, bg, border, description, detail }, i) => (
              <div
                key={title}
                className={`${styles.featureCard} glow-card ${bg} border ${border} ${styles.revealScale} ${styles.enterpriseCard} ${enterpriseVisible ? styles.inView : ''}`}
                style={delay(i * 80)}
                aria-label={`${title} — coming soon`}
              >
                <div className={styles.cardTop}>
                  <span className={`material-symbols-outlined text-[36px] ${color}`}>{icon}</span>
                  <span className={`${styles.badge} ${BADGE_STYLE[badge]}`}>{badge}</span>
                </div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{description}</p>
                <ul className={styles.detailList}>
                  {detail.map(d => (
                    <li key={d} className={styles.detailItem}>
                      <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className={styles.enterpriseOverlay}>
                  <span className={`material-symbols-outlined ${styles.enterpriseOverlayIcon}`}>hourglass_top</span>
                  <p className={styles.enterpriseOverlayText}>Coming Soon</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comparison Panel (3 columns: Free, Pro, Enterprise) ──── */}
        <div
          ref={comparisonRef}
          className={`${styles.comparison} glass-panel ${styles.reveal} ${comparisonVisible ? styles.inView : ''}`}
        >
          <div className={`${styles.tierColumn} ${styles.reveal} ${comparisonVisible ? styles.inView : ''}`} style={delay(80)}>
            <p className={`${styles.tierTitle} ${styles.tierFree}`}>Free — Self-Hosted</p>
            <ul className={styles.tierList}>
              {FREE_FEATURES.map(f => (
                <li key={f} className={styles.tierItem}>
                  <span className={`material-symbols-outlined ${styles.tierCheckFree}`}>check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.tierColumn} ${styles.reveal} ${comparisonVisible ? styles.inView : ''}`} style={delay(180)}>
            <p className={`${styles.tierTitle} ${styles.tierPro}`}>Pro — Self-Hosted</p>
            <ul className={styles.tierList}>
              {PRO_FEATURES.map(f => (
                <li key={f} className={styles.tierItem}>
                  <span className={`material-symbols-outlined ${styles.tierCheckPro}`}>check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.tierColumn} ${styles.tierColumnEnterprise} ${styles.reveal} ${comparisonVisible ? styles.inView : ''}`} style={delay(280)}>
            <p className={`${styles.tierTitle} ${styles.tierEnterprise}`}>Graphon Cloud — Enterprise <span className={styles.comingSoonPillSm}>Coming Soon</span></p>
            <ul className={styles.tierList}>
              {ENTERPRISE_FEATURES.map(f => (
                <li key={f} className={styles.tierItem}>
                  <span className={`material-symbols-outlined ${styles.tierCheckEnterprise}`}>check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
