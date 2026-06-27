import { type CSSProperties } from 'react';
import Terminal from '../../components/terminal';
import styles from './styles.module.css';
import { EVENTS_LINES, COMPONENTS, TIMELINE, SCHEMA_TABLES } from './data';
import { useInView } from '../../hooks/useInView';

export default function Architecture() {
  const { ref: headerRef,     visible: headerVisible     } = useInView<HTMLDivElement>();
  const { ref: diagramRef,    visible: diagramVisible    } = useInView<HTMLDivElement>();
  const { ref: timelineRef,   visible: timelineVisible   } = useInView<HTMLDivElement>();
  const { ref: ebpfRef,       visible: ebpfVisible       } = useInView<HTMLDivElement>();
  const { ref: componentsRef, visible: componentsVisible } = useInView<HTMLDivElement>();
  const { ref: schemaRef,     visible: schemaVisible     } = useInView<HTMLDivElement>();

  const delay = (ms: number): CSSProperties => ({ '--delay': `${ms}ms` } as CSSProperties);

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
          className={`${styles.diagram} glass-panel ${styles.reveal} ${diagramVisible ? styles.inView : ''}`}
        >
          <h2 className={styles.diagramTitle}>System Overview</h2>
          <svg
            viewBox="0 0 900 340"
            className={styles.diagramSvg}
            aria-label="Graphon architecture diagram"
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" className="fill-outline-variant" />
              </marker>
            </defs>
            <rect x="10" y="10" width="880" height="320" rx="12"
              className="fill-surface-container-low stroke-outline-variant" strokeWidth="1" />
            <text x="24" y="32" className="fill-on-surface-variant text-[11px] font-mono">Kubernetes Cluster</text>
            <rect x="30" y="50" width="200" height="120" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="130" y="70" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">Every Node (DaemonSet)</text>
            <rect x="50"  y="80" width="160" height="74" rx="6"
              className="fill-primary/10 stroke-primary/40" strokeWidth="1" />
            <text x="130" y="98"  textAnchor="middle" className="fill-primary text-[11px] font-display font-semibold">graphon-bpf</text>
            <text x="130" y="112" textAnchor="middle" className="fill-on-surface-variant text-[9px]">eBPF kprobes</text>
            <text x="130" y="124" textAnchor="middle" className="fill-on-surface-variant text-[9px]">tcp_connect / accept</text>
            <text x="130" y="136" textAnchor="middle" className="fill-on-surface-variant text-[9px]">→ JSON events</text>
            <rect x="300" y="50" width="180" height="160" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="390" y="70" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">Backend (Deployment)</text>
            <rect x="316" y="80" width="148" height="115" rx="6"
              className="fill-secondary/10 stroke-secondary/40" strokeWidth="1" />
            <text x="390" y="98"  textAnchor="middle" className="fill-secondary text-[11px] font-display font-semibold">graphon-backend</text>
            <text x="390" y="113" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Go · Fiber · RBAC</text>
            <text x="390" y="125" textAnchor="middle" className="fill-on-surface-variant text-[9px]">License Engine</text>
            <text x="390" y="137" textAnchor="middle" className="fill-on-surface-variant text-[9px]">OIDC Sessions</text>
            <text x="390" y="149" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Webhook Dispatcher</text>
            <text x="390" y="161" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Scheduler</text>
            <text x="390" y="178" textAnchor="middle" className="fill-on-surface-variant text-[9px]">REST API :8080</text>
            <rect x="550" y="50"  width="150" height="80" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="625" y="70"  textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">PostgreSQL</text>
            <text x="625" y="88"  textAnchor="middle" className="fill-tertiary text-[11px] font-display font-semibold">Metadata Store</text>
            <text x="625" y="103" textAnchor="middle" className="fill-on-surface-variant text-[9px]">clusters · users · sessions</text>
            <text x="625" y="116" textAnchor="middle" className="fill-on-surface-variant text-[9px]">snapshots · tsvector search</text>
            <rect x="550" y="155" width="150" height="70" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="625" y="174" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">Neo4j</text>
            <text x="625" y="191" textAnchor="middle" className="fill-[#ff9e64] text-[11px] font-display font-semibold">Graph Store</text>
            <text x="625" y="207" textAnchor="middle" className="fill-on-surface-variant text-[9px]">service nodes + CALLS edges</text>
            <rect x="770" y="50"  width="100" height="80" rx="8"
              className="fill-surface-container stroke-outline-variant/50" strokeWidth="1" />
            <text x="820" y="70"  textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">UI</text>
            <text x="820" y="88"  textAnchor="middle" className="fill-primary text-[11px] font-display font-semibold">graphon-ui</text>
            <text x="820" y="103" textAnchor="middle" className="fill-on-surface-variant text-[9px]">React · xyflow</text>
            <text x="820" y="116" textAnchor="middle" className="fill-on-surface-variant text-[9px]">:3000</text>
            <rect x="770" y="200" width="100" height="55" rx="8"
              className="fill-surface-container-lowest stroke-outline-variant/40" strokeWidth="1" />
            <text x="820" y="220" textAnchor="middle" className="fill-on-surface-variant text-[10px] font-mono">External</text>
            <text x="820" y="234" textAnchor="middle" className="fill-on-surface-variant text-[9px]">GitHub / GitLab</text>
            <text x="820" y="246" textAnchor="middle" className="fill-on-surface-variant text-[9px]">OIDC Provider</text>
            <line x1="210" y1="115" x2="300" y2="130" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            <text x="240" y="112" className="fill-on-surface-variant text-[9px]">HTTP events</text>
            <line x1="480" y1="90"  x2="550" y2="90"  className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            <line x1="480" y1="140" x2="550" y2="180" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            <line x1="730" y1="90"  x2="770" y2="90"  className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" />
            <text x="738" y="82" className="fill-on-surface-variant text-[9px]">REST</text>
            <line x1="730" y1="150" x2="820" y2="200" className="stroke-outline-variant" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 3" />
            <ellipse cx="130" cy="270" rx="50" ry="24" className="fill-surface-container-lowest stroke-outline-variant/40" strokeWidth="1" />
            <text x="130" y="274" textAnchor="middle" className="fill-on-surface-variant text-[9px]">Engineer (browser)</text>
            <line x1="130" y1="246" x2="820" y2="130" className="stroke-outline-variant/30" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arr)" />
          </svg>
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
