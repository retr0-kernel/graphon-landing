import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import ShaderCanvas from '../../components/shader-canvas';
import Terminal from '../../components/terminal';
import styles from './styles.module.css';
import { INSTALL_LINES, FEATURES, MODES, PROBLEMS } from './data';
import { ROUTES } from '../../config/routes';
import { GITHUB_URL } from '../../config/externalLinks';
import { useInView } from '../../hooks/useInView';

export default function Home() {
  const { ref: problemRef,  visible: problemVisible  } = useInView<HTMLDivElement>();
  const { ref: installRef,  visible: installVisible  } = useInView<HTMLDivElement>();
  const { ref: featuresRef, visible: featuresVisible } = useInView<HTMLDivElement>();
  const { ref: modesRef,    visible: modesVisible    } = useInView<HTMLDivElement>();
  const { ref: ctaRef,      visible: ctaVisible      } = useInView<HTMLDivElement>();

  const rv  = (visible: boolean, delay = 0) =>
    `${styles.reveal} ${visible ? styles.inView : ''}`;
  const rvDelay = (visible: boolean, delay: number): CSSProperties =>
    ({ '--delay': `${delay}ms` } as CSSProperties);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <ShaderCanvas />
        <div className={`${styles.heroOverlay} bg-gradient-radial`} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={`${styles.heroBadgeDot} dot-pulse`} />
            v0.3.0 — Self-Hosted &amp; Enterprise
          </div>

          <h1 className={styles.heroTitle}>
            Runtime Dependency{' '}
            <span className="text-gradient">Intelligence</span>
            {' '}for Kubernetes
          </h1>

          <p className={styles.heroSubtitle}>
            Graphon uses eBPF to build a live service graph of your entire cluster —
            no code changes, no sidecars. Detect drift, analyze blast radius, and own your infrastructure.
          </p>

          <div className={styles.heroCtas}>
            <Link to={ROUTES.features} className={styles.primaryBtn}>
              <span className="material-symbols-outlined text-[18px]">explore</span>
              See Features
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ghostBtn}
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              View on GitHub
            </a>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <span className="material-symbols-outlined text-[28px] animate-bounce">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ── Problem Statement ────────────────────────────────────────────── */}
      <section className={styles.problem}>
        <div ref={problemRef} className={styles.problemInner}>
          <div className={styles.problemGrid}>
            {PROBLEMS.map(({ icon, q, a }, i) => (
              <div
                key={q}
                className={`${styles.problemCard} ${styles.revealScale} ${problemVisible ? styles.inView : ''}`}
                style={rvDelay(problemVisible, i * 130)}
              >
                <span className={`material-symbols-outlined ${styles.problemIcon}`}>{icon}</span>
                <p className={styles.problemQ}>{q}</p>
                <p className={styles.problemA}>{a}</p>
              </div>
            ))}
          </div>
          <p
            className={`${styles.problemFooter} ${styles.reveal} ${problemVisible ? styles.inView : ''}`}
            style={rvDelay(problemVisible, 360)}
          >
            Graphon answers all of these — in real time, without instrumenting a single line of code.
          </p>
        </div>
      </section>

      {/* ── Quick Install ────────────────────────────────────────────────── */}
      <section className={styles.install}>
        <div className={styles.installInner}>
          <div ref={installRef} className={styles.installLayout}>
            <div className={`${styles.installCopy} ${styles.revealLeft} ${installVisible ? styles.inView : ''}`}>
              <p className={styles.installEyebrow}>Get Running in 5 Minutes</p>
              <h2 className={styles.installTitle}>Three commands from zero to graph</h2>
              <p className={styles.installBody}>
                Graphon ships as a Helm chart. Add the repo, deploy to your cluster,
                port-forward the UI, and you have a live dependency map.
              </p>
              <Link to={ROUTES.architecture} className={styles.installLink}>
                <span>How does it work?</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className={`${styles.revealRight} ${installVisible ? styles.inView : ''}`}>
              <Terminal title="install" lines={INSTALL_LINES} copyable />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ───────────────────────────────────────────── */}
      <section className={styles.features}>
        <div ref={featuresRef} className={styles.featuresInner}>
          <div
            className={`${styles.sectionHeader} ${styles.reveal} ${featuresVisible ? styles.inView : ''}`}
          >
            <p className={styles.sectionEyebrow}>Capabilities</p>
            <h2 className={styles.sectionTitle}>Everything you need to own your cluster</h2>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map(({ icon, title, description, color }, i) => (
              <div
                key={title}
                className={`${styles.featureCard} glow-card ${styles.reveal} ${featuresVisible ? styles.inView : ''}`}
                style={rvDelay(featuresVisible, 80 + i * 90)}
              >
                <span className={`material-symbols-outlined text-[32px] ${color}`}>{icon}</span>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{description}</p>
              </div>
            ))}
          </div>
          <div
            className={`${styles.featuresFooter} ${styles.reveal} ${featuresVisible ? styles.inView : ''}`}
            style={rvDelay(featuresVisible, 450)}
          >
            <Link to={ROUTES.features} className={styles.outlineBtn}>
              All Features
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Deployment Modes ─────────────────────────────────────────────── */}
      <section className={styles.modes}>
        <div ref={modesRef} className={styles.modesInner}>
          <div
            className={`${styles.sectionHeader} ${styles.reveal} ${modesVisible ? styles.inView : ''}`}
          >
            <p className={styles.sectionEyebrow}>Deployment</p>
            <h2 className={styles.sectionTitle}>Run it your way</h2>
          </div>
          <div className={styles.modesGrid}>
            {MODES.map(({ badge, title, desc, cta, ctaHref, highlight }, i) => (
              <div
                key={title}
                className={`${highlight ? styles.modeCardHighlight : styles.modeCard} glow-card ${styles.revealScale} ${modesVisible ? styles.inView : ''}`}
                style={rvDelay(modesVisible, 80 + i * 130)}
              >
                {highlight && <div className={styles.modePopularPill}>Most Popular</div>}
                <span className={styles.modeBadge}>{badge}</span>
                <h3 className={styles.modeTitle}>{title}</h3>
                <p className={styles.modeDesc}>{desc}</p>
                <Link to={ctaHref} className={highlight ? styles.modeCtaHighlight : styles.modeCta}>
                  {cta}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div
          ref={ctaRef}
          className={`${styles.ctaInner} ${styles.reveal} ${ctaVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.ctaTitle}>
            Your cluster is already talking. <br />
            <span className="text-gradient">Are you listening?</span>
          </h2>
          <p
            className={`${styles.ctaBody} ${styles.reveal} ${ctaVisible ? styles.inView : ''}`}
            style={rvDelay(ctaVisible, 120)}
          >
            Graphon is open source. No telemetry. No sign-up. No cloud dependency.
            Deploy today and see your first graph in under five minutes.
          </p>
          <div
            className={`${styles.reveal} ${ctaVisible ? styles.inView : ''}`}
            style={rvDelay(ctaVisible, 220)}
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              <span className="material-symbols-outlined text-[20px]">star</span>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
