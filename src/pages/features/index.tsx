import { type CSSProperties } from 'react';
import styles from './styles.module.css';
import { FEATURES, BADGE_STYLE, FREE_FEATURES, PRO_FEATURES } from './data';
import { useInView } from '../../hooks/useInView';

export default function Features() {
  const { ref: headerRef,     visible: headerVisible     } = useInView<HTMLDivElement>();
  const { ref: gridRef,       visible: gridVisible       } = useInView<HTMLDivElement>();
  const { ref: comparisonRef, visible: comparisonVisible } = useInView<HTMLDivElement>();

  const delay = (ms: number): CSSProperties => ({ '--delay': `${ms}ms` } as CSSProperties);

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
            Core features are free forever in the self-hosted tier.
            Pro features unlock with a license key.
          </p>
        </div>

        {/* ── Bento Grid ───────────────────────────────────────────── */}
        <div ref={gridRef} className={styles.bentoGrid}>
          {FEATURES.map(({ icon, badge, title, color, bg, border, description, detail }, i) => (
            <div
              key={title}
              className={`${styles.featureCard} glow-card ${bg} border ${border} ${styles.revealScale} ${gridVisible ? styles.inView : ''}`}
              style={delay(i * 80)}
            >
              <div className={styles.cardTop}>
                <span className={`material-symbols-outlined text-[36px] ${color}`}>{icon}</span>
                <span className={`${styles.badge} ${BADGE_STYLE[badge]}`}>{badge}</span>
              </div>
              <h2 className={styles.cardTitle}>{title}</h2>
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

        {/* ── Comparison Panel ─────────────────────────────────────── */}
        <div
          ref={comparisonRef}
          className={`${styles.comparison} glass-panel ${styles.reveal} ${comparisonVisible ? styles.inView : ''}`}
        >
          <div className={`${styles.reveal} ${comparisonVisible ? styles.inView : ''}`} style={delay(100)}>
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
          <div className={`${styles.reveal} ${comparisonVisible ? styles.inView : ''}`} style={delay(220)}>
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
        </div>

      </div>
    </div>
  );
}
