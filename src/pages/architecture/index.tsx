import { type CSSProperties, useState, useEffect, useRef } from 'react';
import Terminal from '../../components/terminal';
import styles from './styles.module.css';
import { EVENTS_LINES, COMPONENTS, TIMELINE, SCHEMA_TABLES } from './data';
import { useInView } from '../../hooks/useInView';
import { useTheme } from '../../context/ThemeContext';
import architectureImgDark from '../../assets/images/architecture.png';
import architectureImgLight from '../../assets/images/architecture_light.png';

export default function Architecture() {
  const { ref: headerRef,     visible: headerVisible     } = useInView<HTMLDivElement>();
  const { ref: diagramRef,    visible: diagramVisible    } = useInView<HTMLDivElement>();
  const { ref: timelineRef,   visible: timelineVisible   } = useInView<HTMLDivElement>();
  const { ref: ebpfRef,       visible: ebpfVisible       } = useInView<HTMLDivElement>();
  const { ref: componentsRef, visible: componentsVisible } = useInView<HTMLDivElement>();
  const { ref: schemaRef,     visible: schemaVisible     } = useInView<HTMLDivElement>();

  const delay = (ms: number): CSSProperties => ({ '--delay': `${ms}ms` } as CSSProperties);
  const { resolved } = useTheme();
  const architectureImg = resolved === 'light' ? architectureImgLight : architectureImgDark;
  const [diagramLoaded, setDiagramLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setDiagramLoaded(false);
    // After React commits the new src to the DOM, check if the image is
    // already in the browser cache. Cached images fire `load` synchronously
    // before React's onLoad handler is attached, so they get silently missed.
    // requestAnimationFrame fires after the browser has painted the new frame,
    // guaranteeing the img element has the updated src when we inspect it.
    const raf = requestAnimationFrame(() => {
      if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
        setDiagramLoaded(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [resolved]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className={`${styles.header} ${styles.reveal} ${headerVisible ? styles.inView : ''}`}
        >
          <p className={styles.eyebrow}>System Design</p>
          <h1 className={styles.title}>Architecture</h1>
          <p className={styles.subtitle}>
            Graphon is a thin data pipeline — eBPF event → REST → dual-store → React.
            Every component is stateless and horizontally scalable except the databases.
          </p>
        </div>

        {/* ── Architecture Diagram ─────────────────────────────────── */}
        <div
          ref={diagramRef}
          className={`${styles.diagram} ${styles.reveal} ${diagramVisible ? styles.inView : ''}`}
        >
          {!diagramLoaded && (
            <div className={`img-skeleton ${styles.diagramPlaceholder}`} aria-hidden="true" />
          )}
          <img
            ref={imgRef}
            src={architectureImg}
            alt="Graphon Platform Architecture"
            className={styles.diagramImg}
            onLoad={() => setDiagramLoaded(true)}
            onError={() => setDiagramLoaded(true)}
            style={!diagramLoaded ? { display: 'none' } : undefined}
          />
        </div>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <div ref={timelineRef} className={styles.timelineSection}>
          <h2
            className={`${styles.sectionTitle} ${styles.reveal} ${timelineVisible ? styles.inView : ''}`}
          >
            Event-to-graph latency
          </h2>
          <div className={styles.timelineGrid}>
            {TIMELINE.map(({ time, label }, i) => (
              <div
                key={i}
                className={`${styles.timelineCard} glow-card ${styles.revealScale} ${timelineVisible ? styles.inView : ''}`}
                style={delay(80 + i * 110)}
              >
                <span className={styles.timelineTime}>{time}</span>
                <p className={styles.timelineLabel}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── eBPF Deep Dive ───────────────────────────────────────── */}
        <div ref={ebpfRef} className={styles.ebpfSection}>
          <div className={`${styles.ebpfCopy} ${styles.revealLeft} ${ebpfVisible ? styles.inView : ''}`}>
            <h2 className={styles.sectionTitle}>How the eBPF probe works</h2>
            <p className={styles.ebpfBody}>
              The <code className={styles.inlineCode}>graphon-bpf</code> DaemonSet
              runs one pod per node. It attaches eBPF programs to kernel kprobes — specifically{' '}
              <code className={styles.inlineCode}>tcp_v4_connect</code>,{' '}
              <code className={styles.inlineCode}>inet_csk_accept</code>, and{' '}
              <code className={styles.inlineCode}>tcp_close</code>.
            </p>
            <p className={styles.ebpfBody}>
              Each event carries the source and destination pod identity (resolved from cgroup metadata),
              namespace, port, and protocol. This happens at the kernel boundary — no userspace agent
              sitting in the data path, no sampling, no missed connections.
            </p>
            <p className={styles.ebpfBody}>
              Events are batched in a perf ring buffer and flushed to the backend every few milliseconds.
              The entire path from TCP syscall to rendered graph edge takes under 50 ms.
            </p>
          </div>
          <div className={`${styles.revealRight} ${ebpfVisible ? styles.inView : ''}`}>
            <Terminal title="bpf-events" lines={EVENTS_LINES} />
          </div>
        </div>

        {/* ── Core Components ──────────────────────────────────────── */}
        <div ref={componentsRef} className={styles.componentsSection}>
          <h2
            className={`${styles.sectionTitle} ${styles.reveal} ${componentsVisible ? styles.inView : ''}`}
          >
            Core Components
          </h2>
          <div className={styles.componentsGrid}>
            {COMPONENTS.map(({ icon, title, color, description }, i) => (
              <div
                key={title}
                className={`${styles.componentCard} glow-card ${styles.revealScale} ${componentsVisible ? styles.inView : ''}`}
                style={delay(80 + i * 90)}
              >
                <span className={`material-symbols-outlined text-[28px] ${color}`}>{icon}</span>
                <h3 className={styles.componentTitle}>{title}</h3>
                <p className={styles.componentDesc}>{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Storage Schema ────────────────────────────────────────── */}
        <div
          ref={schemaRef}
          className={`${styles.schemaSection} glass-panel ${styles.reveal} ${schemaVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.sectionTitle}>Storage Schema (PostgreSQL)</h2>
          <div className={styles.schemaGrid}>
            {SCHEMA_TABLES.map(({ table, cols }, i) => (
              <div
                key={table}
                className={`${styles.schemaTable} ${styles.reveal} ${schemaVisible ? styles.inView : ''}`}
                style={delay(100 + i * 80)}
              >
                <p className={styles.schemaTableName}>{table}</p>
                <ul className="space-y-0.5">
                  {cols.map(c => (
                    <li key={c} className={styles.schemaCol}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
