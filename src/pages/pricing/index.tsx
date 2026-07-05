import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import {
  FREE_FEATURES, PRO_FEATURES, CLOUD_FEATURES,
  COMPARE, FAQS, CTA_LINKS,
} from './data';
import { useInView } from '../../hooks/useInView';

function Cell({ value }: { value: boolean | string }) {
  if (value === true)  return <span className="material-symbols-outlined text-[18px] text-tertiary">check</span>;
  if (value === false) return <span className="material-symbols-outlined text-[18px] text-outline-variant">remove</span>;
  return <span className={styles.cellText}>{value}</span>;
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button
        className={styles.faqBtn}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={styles.faqQuestion}>{q}</span>
        <span className={`material-symbols-outlined ${styles.faqIcon} ${open ? styles.faqIconOpen : ''}`}>
          expand_more
        </span>
      </button>
      {open && <p className={styles.faqAnswer}>{a}</p>}
    </div>
  );
}

export default function Pricing() {
  const { ref: headerRef,   visible: headerVisible   } = useInView<HTMLDivElement>();
  const { ref: cardsRef,    visible: cardsVisible    } = useInView<HTMLDivElement>();
  const { ref: compareRef,  visible: compareVisible  } = useInView<HTMLDivElement>();
  const { ref: faqRef,      visible: faqVisible      } = useInView<HTMLDivElement>();
  const { ref: ctaRef,      visible: ctaVisible      } = useInView<HTMLDivElement>();

  const delay = (ms: number): CSSProperties => ({ '--delay': `${ms}ms` } as CSSProperties);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className={`${styles.header} ${styles.reveal} ${headerVisible ? styles.inView : ''}`}
        >
          <p className={styles.eyebrow}>Pricing</p>
          <h1 className={styles.title}>Start free. Scale when you need to.</h1>
          <p className={styles.subtitle}>The core graph is free forever. Pay only for team-scale features.</p>
        </div>

        {/* ── Pricing Cards ────────────────────────────────────────── */}
        <div ref={cardsRef} className={styles.cardsGrid}>
          {/* Free */}
          <div
            className={`${styles.card} glow-card ${styles.revealScale} ${cardsVisible ? styles.inView : ''}`}
            style={delay(0)}
          >
            <div>
              <p className={`${styles.tierLabel} text-tertiary`}>Self-Hosted</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>Free</span>
                <span className={styles.priceSub}>forever</span>
              </div>
              <p className={styles.cardNote}>Apache-2.0. No license server. No telemetry.</p>
            </div>
            <a href={CTA_LINKS.deploy} target="_blank" rel="noopener noreferrer" className={styles.outlineBtn}>
              <span className="material-symbols-outlined text-[18px]">code</span>
              Deploy Now
            </a>
            <ul className={styles.featureList}>
              {FREE_FEATURES.map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise */}
          <div
            className={`${styles.cardHighlight} glow-card ${styles.revealScale} ${cardsVisible ? styles.inView : ''}`}
            style={delay(130)}
          >
            <div className={styles.popularPill}>
              <span className={styles.popularPulse} aria-hidden="true" />
              <span>Most Popular</span>
              <span className={`material-symbols-outlined ${styles.popularIcon}`} aria-hidden="true">
                bolt
              </span>
            </div>
            <div>
              <p className={`${styles.tierLabel} text-primary`}>Pro</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>Custom</span>
              </div>
              <p className={styles.cardNote}>Annual license. Self-hosted, in your cluster.</p>
            </div>
            <a href={CTA_LINKS.getLicense} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Get a License
            </a>
            <ul className={styles.featureList}>
              {PRO_FEATURES.map((f: string) => (
                <li key={f} className={styles.featureItem}>
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Cloud */}
          <div
            className={`${styles.cardDimmed} glow-card ${styles.revealScale} ${cardsVisible ? styles.inView : ''}`}
            style={delay(260)}
          >
            <div>
              <p className={`${styles.tierLabel} text-secondary`}>Graphon Cloud</p>
              <div className={styles.priceRow}>
                <span className="font-display font-bold text-headline-lg text-on-surface cursor-default">Coming Soon</span>
              </div>
              <p className={styles.cardNote}>Managed. No cluster admin required.</p>
            </div>
            <button disabled className={styles.disabledBtn}>
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              Join Waitlist
            </button>
            <ul className={styles.featureList}>
              {CLOUD_FEATURES.map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Compare Table ────────────────────────────────────────── */}
        <div
          ref={compareRef}
          className={`${styles.compareSection} ${styles.reveal} ${compareVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.sectionTitle}>Feature Comparison</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Feature</th>
                  <th className={`${styles.thCenter} text-tertiary`}>Free</th>
                  <th className={`${styles.thCenter} text-primary`}>Pro</th>
                  <th className={`${styles.thCenter} text-secondary`}>Cloud</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-outline-variant/20 ${i % 2 === 0 ? 'bg-surface-container-low/50' : ''}`}
                  >
                    <td className={styles.tdFeature}>{row.feature}</td>
                    <td className={styles.tdCenter}><Cell value={row.free} /></td>
                    <td className={styles.tdCenter}><Cell value={row.pro} /></td>
                    <td className={styles.tdCenter}><Cell value={row.cloud} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <div
          ref={faqRef}
          className={`${styles.faqSection} ${styles.reveal} ${faqVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div>
            {FAQS.map(({ q, a }) => <Faq key={q} q={q} a={a} />)}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <div
          ref={ctaRef}
          className={`${styles.bottomCta} glass-panel ${styles.reveal} ${ctaVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.ctaTitle}>Still have questions?</h2>
          <p className={styles.ctaBody}>Open a GitHub issue, read the docs, or browse the source code.</p>
          <div className={styles.ctaBtns}>
            <a
              href={CTA_LINKS.openIssue}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.primaryBtn} !w-auto`}
            >
              <span className="material-symbols-outlined text-[18px]">bug_report</span>
              Open an Issue
            </a>
            <Link to={CTA_LINKS.readDocs} className={`${styles.outlineBtn} !w-auto`}>
              <span className="material-symbols-outlined text-[18px]">description</span>
              Read the Docs
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
