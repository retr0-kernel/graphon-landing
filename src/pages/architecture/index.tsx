import { type CSSProperties, useState, useEffect, useRef } from 'react';
import Terminal from '../../components/terminal';
import styles from './styles.module.css';
import { EVENTS_LINES, COMPONENTS, TIMELINE, LATENCY_BUDGET } from './data';
import { useInView } from '../../hooks/useInView';
import { useTheme } from '../../context/ThemeContext';
import architectureImgDark from '../../assets/images/architecture.webp';
import architectureImgLight from '../../assets/images/architecture_light.webp';

export default function Architecture() {
  const { ref: headerRef,         visible: headerVisible         } = useInView<HTMLDivElement>();
  const { ref: diagramRef,        visible: diagramVisible        } = useInView<HTMLDivElement>();
  const { ref: timelineRef,       visible: timelineVisible       } = useInView<HTMLDivElement>();
  const { ref: latencyRef,        visible: latencyVisible        } = useInView<HTMLDivElement>();
  const { ref: ebpfRef,           visible: ebpfVisible           } = useInView<HTMLDivElement>();
  const { ref: componentsRef,     visible: componentsVisible     } = useInView<HTMLDivElement>();

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

        {/* ── Pipeline Timeline (event-to-graph latency, narrative) ── */}
        <div ref={timelineRef} className={styles.timelineSection}>
          <h2
            className={`${styles.sectionTitle} ${styles.reveal} ${timelineVisible ? styles.inView : ''}`}
          >
            Event-to-graph latency
          </h2>
          <p
            className={`${styles.sectionLede} ${styles.reveal} ${timelineVisible ? styles.inView : ''}`}
            style={delay(40)}
          >
            From a TCP syscall in the kernel to a rendered edge on the canvas — the full pipeline,
            with the time budget at every hop. Numbers are p50 on a 1k-edge / 50-node dev cluster.
          </p>
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

        {/* ── Latency Budget Table (real numbers, Free vs Pro) ─────── */}
        <div
          ref={latencyRef}
          className={`${styles.latencySection} glass-panel ${styles.reveal} ${latencyVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.sectionTitle}>Performance budget</h2>
          <p className={styles.sectionLede}>
            The numbers above are the high-level pipeline. The table below is the engineering
            budget the team measures against on every release — what we promise Free and Pro
            self-hosted installs alike, and what the Pro data plane adds on top.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Hop</th>
                  <th className={styles.th}>Free</th>
                  <th className={styles.th}>Pro</th>
                  <th className={styles.th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {LATENCY_BUDGET.map((m, i) => (
                  <tr
                    key={m.name}
                    className={`${styles.reveal} ${latencyVisible ? styles.inView : ''}`}
                    style={delay(120 + i * 60)}
                  >
                    <td className={styles.tdMono}>{m.name}</td>
                    <td className={styles.td}><span className={styles.tierFree}>{m.free}</span></td>
                    <td className={styles.td}><span className={styles.tierPro}>{m.pro}</span></td>
                    <td className={styles.td}>{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.fineprint}>
            p50 measured on a single-node dev cluster against a synthetic workload of 5k TCP events/sec.
            Real-world numbers scale linearly with edge volume; on a 10k-edge cluster, the
            end-to-end p50 sits at 80–90 ms with the same p99 envelope.
          </p>
        </div>

        {/* ── eBPF Deep Dive ───────────────────────────────────────── */}
        <div ref={ebpfRef} className={styles.ebpfSection}>
          <div className={`${styles.ebpfCopy} ${styles.revealLeft} ${ebpfVisible ? styles.inView : ''}`}>
            <h2 className={styles.sectionTitle}>How the agent probe works</h2>
            <p className={styles.ebpfBody}>
              The <code className={styles.inlineCode}>graphon-agent</code> DaemonSet
              runs one pod per node. It attaches CO-RE (Compile Once — Run Everywhere) eBPF
              programs to kernel kprobes — specifically{' '}
              <code className={styles.inlineCode}>tcp_v4_connect</code>,{' '}
              <code className={styles.inlineCode}>inet_csk_accept</code>,{' '}
              <code className={styles.inlineCode}>tcp_close</code>, and a{' '}
              <code className={styles.inlineCode}>sock_ops</code> callback for L7 sampling
              (Pro only).
            </p>
            <p className={styles.ebpfBody}>
              Every event carries the source and destination pod identity (resolved from
              cgroup metadata), namespace, port, and protocol. This happens at the kernel
              boundary — no userspace agent sitting in the data path, no sampling, no missed
              connections. The probe only reads connection metadata; it never inspects
              application payload.
            </p>
            <p className={styles.ebpfBody}>
              Events land in a per-CPU ring buffer (<code className={styles.inlineCode}>BPF_MAP_TYPE_RINGBUF</code>)
              and are flushed in batches of up to 100 events or every 500 ms, whichever hits first.
              Failed batches fall back to a crash-safe on-disk spill buffer
              (<code className={styles.inlineCode}>/var/lib/graphon/spill.log</code>) so a backend
              outage or a pod restart never loses data.
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

      </div>
    </div>
  );
}
