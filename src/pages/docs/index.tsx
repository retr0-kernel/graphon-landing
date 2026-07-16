import { useMemo, useEffect, useRef, useState, type CSSProperties } from 'react';
import Terminal from '../../components/terminal';
import styles from './styles.module.css';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useInView } from '../../hooks/useInView';
import {
  SIDEBAR_SECTIONS,
  PREREQUISITES,
  INSTALL_LINES, TENANT_SETUP_LINES,
  COMPONENTS, DATA_FLOW,
  ENV_VARS, DEPLOYMENT_MODES,
  GRAPH_ENDPOINTS, SNAPSHOT_ENDPOINTS, DRIFT_ENDPOINTS, EXPORT_ENDPOINTS, SEARCH_ENDPOINTS,
  TELEMETRY_ENDPOINTS, COST_API_ENDPOINTS, SCAN_API_ENDPOINTS, SLO_API_ENDPOINTS,
  AUTH_CURL_LINES,
  GITHUB_WEBHOOK_LINES, GITLAB_WEBHOOK_LINES,
  OIDC_LINES, RBAC_ROLES,
  APPLY_KEY_LINES, FREE_FEATURES_TABLE,
  PRO_LICENSE_STEPS,
  HELM_INSTALL_LINES, HELM_VALUES,
  OTLP_LINES, OTLP_HELM_YAML, AGENT_CONFIGMAP_YAML,
  PROMETHEUS_ANNOTATION_YAML, PROMETHEUS_HELM_YAML, PROMETHEUS_SECRET_YAML,
  LOG_FORMAT_YAML,
  COST_HELM_YAML, COST_UI_NOTE,
  AZ_LABEL_YAML, AZ_HELM_YAML, AZ_UI_NOTE,
  SCAN_HELM_YAML, SCAN_UI_NOTE,
} from './data';
import type { ApiEndpoint } from './data';

// ── Small shared primitives ─────────────────────────────────────────────────

function IC({ children }: { children: string }) {
  return <span className={styles.code}>{children}</span>;
}

function Callout({ icon = 'info', warn = false, children }: {
  icon?: string; warn?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`${styles.callout} ${warn ? styles.calloutWarn : ''}`}>
      <span className={`material-symbols-outlined ${styles.calloutIcon} ${warn ? styles.calloutWarnIcon : ''}`}>
        {icon}
      </span>
      <p className={styles.calloutText}>{children}</p>
    </div>
  );
}

function MethodBadge({ method }: { method: ApiEndpoint['method'] }) {
  const cls: Record<ApiEndpoint['method'], string> = {
    GET:    styles.methodGet,
    POST:   styles.methodPost,
    PUT:    styles.methodPut,
    PATCH:  styles.methodPatch,
    DELETE: styles.methodDelete,
  };
  return <span className={cls[method]}>{method}</span>;
}

function EndpointTable({ endpoints }: { endpoints: readonly ApiEndpoint[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Method</th>
            <th className={styles.th}>Path</th>
            <th className={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map(e => (
            <tr key={e.path + e.method}>
              <td className={styles.tdBadge}><MethodBadge method={e.method} /></td>
              <td className={styles.tdMono}>{e.path}</td>
              <td className={styles.td}>{e.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true)  return <span className={`material-symbols-outlined ${styles.checkFree}`}>check_circle</span>;
  if (value === false) return <span className={`material-symbols-outlined ${styles.crossIcon}`}>remove</span>;
  return <span className={styles.cellText}>{value}</span>;
}

// ── Section wrapper with reveal ─────────────────────────────────────────────

function Section({ id, title, children, delay = 0 }: {
  id: string; title: string; children: React.ReactNode; delay?: number;
}) {
  const { ref, visible } = useInView<HTMLDivElement>(0.05);
  return (
    <section
      id={id}
      className={`${styles.section} ${styles.reveal} ${visible ? styles.inView : ''}`}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      <div ref={ref}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function SubSection({ id, title, children }: {
  id: string; title: string; children: React.ReactNode;
}) {
  return (
    <div id={id} className={styles.subSection}>
      <h3 className={styles.subSectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

// ── Docs page ───────────────────────────────────────────────────────────────

export default function Docs() {
  // Collect all section + sub-section IDs for active tracking
  const allIds = useMemo(() =>
    SIDEBAR_SECTIONS.flatMap(s => [
      s.id,
      ...(s.items?.map(i => i.id) ?? []),
    ]), []);

  const activeId = useActiveSection(allIds);
  const sidebarRef = useRef<HTMLElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Label of the currently active item, shown on the mobile "on this page" toggle
  const activeLabel = useMemo(() => {
    for (const section of SIDEBAR_SECTIONS) {
      const match = section.items?.find(i => i.id === activeId);
      if (match) return match.label;
      if (section.id === activeId) return section.title;
    }
    return SIDEBAR_SECTIONS[0]?.title ?? 'Contents';
  }, [activeId]);

  // Auto-scroll the sidebar so the active item is always fully visible with padding
  useEffect(() => {
    if (!activeId || !sidebarRef.current) return;
    const sidebar = sidebarRef.current;
    const btn = sidebar.querySelector<HTMLElement>(`[data-sid="${activeId}"]`);
    if (!btn) return;

    const PADDING = 80; // px of breathing room above / below the active item
    // getBoundingClientRect gives viewport-relative coords; subtract sidebar's
    // viewport top then add current scrollTop to get scroll-container-relative position.
    const btnRect  = btn.getBoundingClientRect();
    const navRect  = sidebar.getBoundingClientRect();
    const btnTop    = btnRect.top  - navRect.top  + sidebar.scrollTop;
    const btnBottom = btnRect.bottom - navRect.top + sidebar.scrollTop;

    if (btnTop - PADDING < sidebar.scrollTop) {
      // Active item is above visible area — scroll up with padding
      sidebar.scrollTo({ top: btnTop - PADDING, behavior: 'smooth' });
    } else if (btnBottom + PADDING > sidebar.scrollTop + sidebar.clientHeight) {
      // Active item is below visible area — scroll down with padding
      sidebar.scrollTo({ top: btnBottom + PADDING - sidebar.clientHeight, behavior: 'smooth' });
    }
  }, [activeId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavOpen(false);
  };

  const linkClass = (id: string) =>
    `${styles.sidebarLink} ${activeId === id ? styles.sidebarLinkActive : ''}`;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* Header */}
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>Documentation</p>
          <h1 className={styles.pageTitle}>Graphon Docs</h1>
          <p className={styles.pageSubtitle}>
            Everything you need to deploy, configure, and operate Graphon —
            from a local Kind cluster to a production multi-cluster Enterprise setup.
          </p>
        </header>

        <div className={styles.docsBody}>
        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <nav ref={sidebarRef} className={styles.sidebar} aria-label="Documentation navigation">
          <button
            type="button"
            className={styles.sidebarToggle}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(o => !o)}
          >
            <span className={styles.sidebarToggleText}>
              <span className={styles.sidebarToggleEyebrow}>On this page</span>
              <span className={styles.sidebarToggleActive}>{activeLabel}</span>
            </span>
            <span
              className={`material-symbols-outlined ${styles.sidebarToggleIcon} ${mobileNavOpen ? styles.sidebarToggleIconOpen : ''}`}
            >
              expand_more
            </span>
          </button>

          <div className={`${styles.sidebarPanel} ${mobileNavOpen ? styles.sidebarPanelOpen : ''}`}>
            {SIDEBAR_SECTIONS.map(section => (
              <div key={section.id} className={styles.sidebarGroup}>
                <p className={styles.sidebarGroupTitle}>{section.title}</p>
                {section.items?.map(item => (
                  <button
                    key={item.id}
                    data-sid={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={linkClass(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>

        {/* ── Main content ─────────────────────────────────────────── */}
        <article className={styles.content}>

          {/* ── Getting Started ─────────────────────────────────── */}
          <Section id="getting-started" title="Getting Started">
            <SubSection id="prerequisites" title="Prerequisites">
              <p className={styles.prose}>
                Before you deploy Graphon, confirm your environment meets these requirements.
              </p>
              <ul className={styles.prereqList}>
                {PREREQUISITES.map(p => (
                  <li key={p.label} className={styles.prereqItem}>
                    <span className={`material-symbols-outlined ${styles.prereqCheck}`}>check_circle</span>
                    <div>
                      <p className={styles.prereqLabel}>{p.label}</p>
                      <p className={styles.prereqDetail}>{p.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Callout icon="info">
                Graphon's eBPF agent requires BTF (BPF Type Format) support in the kernel. Run{' '}
                <IC>uname -r</IC> and verify the kernel is ≥ 5.8. Most managed Kubernetes providers
                (EKS, GKE, AKS) ship with a compatible kernel by default.
              </Callout>
            </SubSection>

            <SubSection id="quick-install" title="Quick Install">
              <p className={styles.prose}>
                Graphon ships as a Helm chart. Three commands take you from zero to a live dependency graph.
              </p>
              <Terminal title="install.sh" lines={INSTALL_LINES} copyable />
            </SubSection>

            <SubSection id="first-graph" title="Your First Graph">
              <p className={styles.prose}>
                Once the pods are running, register your tenant and create an API key. You only need to do
                this once per organization.
              </p>
              <Terminal title="setup.sh" lines={TENANT_SETUP_LINES} copyable />
              <p className={styles.prose} style={{ marginTop: '1rem' }}>
                With the token saved, navigate to <IC>http://localhost:3000</IC>. Within a few minutes of
                the eBPF agent starting, services and connections will begin appearing on the graph canvas.
                If you don't see traffic immediately, check that <IC>graphon-bpf</IC> pods are{' '}
                <IC>Running</IC> on every node with{' '}
                <IC>kubectl get pods -n graphon -l app=graphon-bpf</IC>.
              </p>
              <Callout icon="lightbulb">
                The first graph populate takes 30–90 seconds depending on the volume of traffic in your
                cluster. The scheduler also runs an orphan scan every 15 minutes and a drift detection
                pass every 10 minutes in the background.
              </Callout>
            </SubSection>
          </Section>

          {/* ── Architecture ─────────────────────────────────────── */}
          <Section id="architecture" title="Architecture">
            <SubSection id="how-ebpf-works" title="How eBPF Works">
              <p className={styles.prose}>
                Graphon's agent (<IC>graphon-bpf</IC>) runs as a Kubernetes DaemonSet — one Pod per node.
                It attaches eBPF programs to the <IC>tcp_connect</IC> and <IC>tcp_accept</IC> kernel hooks
                using CO-RE (Compile Once, Run Everywhere) so no kernel module or recompilation is needed.
              </p>
              <p className={styles.prose}>
                When a connection is observed, the agent resolves the source and destination Pod IPs against
                the Kubernetes API to map them to service names and namespaces. It then emits a compact JSON
                event to the backend's <IC>POST /api/v1/ingest/events</IC> endpoint over plain HTTP — no
                sidecar, no service mesh, no code changes required.
              </p>
              <Callout icon="security">
                The agent only observes connection metadata (source IP, destination IP, port, protocol). It
                never reads application payload data.
              </Callout>
            </SubSection>

            <SubSection id="components" title="Components">
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Component</th>
                      <th className={styles.th}>Kind</th>
                      <th className={styles.th}>Port</th>
                      <th className={styles.th}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPONENTS.map(c => (
                      <tr key={c.name}>
                        <td className={styles.tdMono}>{c.name}</td>
                        <td className={styles.td}>{c.type}</td>
                        <td className={styles.td}>{c.port}</td>
                        <td className={styles.td}>{c.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>

            <SubSection id="data-flow" title="Data Flow">
              <div className={styles.flowList}>
                {DATA_FLOW.map(f => (
                  <div key={f.step} className={styles.flowItem}>
                    <div className={styles.flowStep}>{f.step}</div>
                    <div>
                      <p className={styles.flowTitle}>{f.title}</p>
                      <p className={styles.flowDesc}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ── Configuration ─────────────────────────────────────── */}
          <Section id="configuration" title="Configuration">
            <SubSection id="env-vars" title="Environment Variables">
              <p className={styles.prose}>
                All configuration is done via environment variables. When using Helm, these map to{' '}
                <IC>values.yaml</IC> keys (see <IC>backend.*</IC> in the Helm Values section).
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Variable</th>
                      <th className={styles.th}>Default</th>
                      <th className={styles.th}>Req.</th>
                      <th className={styles.th}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENV_VARS.map(v => (
                      <tr key={v.name}>
                        <td className={styles.tdMono}>{v.name}</td>
                        <td className={styles.td} style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.default}</td>
                        <td className={styles.td}>
                          {v.required
                            ? <span className={`material-symbols-outlined ${styles.checkFree}`} style={{ fontSize: 14 }}>check</span>
                            : <span style={{ color: 'rgb(var(--c-on-surface) / 0.25)', fontSize: 12 }}>—</span>
                          }
                        </td>
                        <td className={styles.td}>{v.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>

            <SubSection id="deployment-modes" title="Deployment Modes">
              <div className={styles.modeCards}>
                {DEPLOYMENT_MODES.map((m, i) => (
                  <div key={m.mode} className={i === 1 ? styles.modeCardHighlight : styles.modeCard}>
                    <p className={styles.modeBadge}>{i === 2 ? 'Coming Soon' : i === 1 ? 'Enterprise' : 'Free'}</p>
                    <p className={styles.modeTitle}>{m.mode}</p>
                    <p className={styles.modeDesc}>{m.desc}</p>
                    <ul className={styles.modeFeatures}>
                      {m.features.map(f => (
                        <li key={f} className={styles.modeFeatureItem}>
                          <span className={`material-symbols-outlined ${styles.prereqCheck}`} style={{ fontSize: 14, marginTop: 2 }}>check</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection id="agent-configmap" title="Agent ConfigMap">
              <p className={styles.prose}>
                The agent DaemonSet reads its runtime configuration from a mounted ConfigMap
                (<IC>graphon-agent-config</IC>) at <IC>/etc/graphon/config.yaml</IC>. All keys are optional
                — the defaults shown below match Free tier behavior. Pro deployments typically set
                <IC> dnsResolutionEnabled: true</IC> and larger <IC>maps.flowMaxEntries</IC>.
              </p>
              <Callout icon="tune">
                Reloaded automatically every 60 s. No agent restart needed when changing batching or map sizes.
              </Callout>
              <pre className={styles.codeBlock}>{AGENT_CONFIGMAP_YAML}</pre>
            </SubSection>
          </Section>

          {/* ── Observability (Phase 4) ───────────────────────────── */}
          <Section id="observability" title="Observability (Phase 4)">
            <SubSection id="otlp-traces" title="OTLP Tracing">
              <p className={styles.prose}>
                The Graphon agent runs a full <IC>OTLP/HTTP</IC> receiver on port <IC>4318</IC> on every
                Kubernetes node. Configure your OpenTelemetry SDK to export traces to the local node IP using
                the <IC>status.hostIP</IC> Downward API field.
              </p>
              <Callout icon="info">
                OTLP/HTTP supports both <IC>http/json</IC> (JSON-encoded protos) and{' '}
                <IC>http/protobuf</IC> (binary protos). Both are fully decoded — no partial implementation.
              </Callout>
              <Terminal title="kubernetes-deployment.yaml" lines={OTLP_LINES} copyable />
              <pre className={styles.codeBlock}>{OTLP_HELM_YAML}</pre>
            </SubSection>

            <SubSection id="prometheus" title="Prometheus Scraping">
              <p className={styles.prose}>
                The agent scrapes pods with the <IC>prometheus.io/scrape: "true"</IC> annotation on the same
                node. Auth credentials are read from Kubernetes Secrets at scrape time.
              </p>
              <pre className={styles.codeBlock}>{PROMETHEUS_ANNOTATION_YAML}</pre>
              <p className={styles.prose} style={{ marginTop: '1rem' }}>
                For endpoints requiring authentication, create a Kubernetes Secret and reference it:
              </p>
              <pre className={styles.codeBlock}>{PROMETHEUS_SECRET_YAML}</pre>
              <p className={styles.prose} style={{ marginTop: '1rem' }}>Configure global defaults in Helm:</p>
              <pre className={styles.codeBlock}>{PROMETHEUS_HELM_YAML}</pre>
            </SubSection>

            <SubSection id="log-collection" title="Log Collection">
              <p className={styles.prose}>
                The agent tails <IC>/var/log/containers/*.log</IC> on every node. All Kubernetes container
                log formats are supported with no configuration required.
              </p>
              <pre className={styles.codeBlock}>{LOG_FORMAT_YAML}</pre>
              <Callout icon="info">
                Multi-line logs (CRI-O partial lines tagged <IC>P</IC>) are assembled before being shipped.
                Log rotation is handled automatically — no duplicate or dropped lines.
              </Callout>
            </SubSection>

            <SubSection id="cost-config" title="Cost Tracking">
              <p className={styles.prose}>
                Graphon classifies every connection by traffic type (same-AZ, cross-AZ, internet) using
                embedded AWS/GCP/Azure CIDR snapshots. Egress cost is calculated from per-GB rates you
                configure. <strong>Both bytes sent (egress, billed) and bytes received (ingress, informational)
                are always shown in the UI</strong> so you can see the full picture.
              </p>
              <Callout icon="warning" warn>
                The built-in per-GB rates are public list prices. Set your actual negotiated rate in
                Settings → Cost Config or in <IC>values.yaml</IC> to get accurate billing estimates.
              </Callout>
              <pre className={styles.codeBlock}>{COST_HELM_YAML}</pre>
              <ul className={styles.bulletList}>
                {COST_UI_NOTE.map(note => <li key={note} className={styles.bulletItem}>{note}</li>)}
              </ul>
            </SubSection>

            <SubSection id="az-detection" title="AZ Detection">
              <p className={styles.prose}>
                Cross-AZ cost calculation requires the <IC>topology.kubernetes.io/zone</IC> node label.
                Most managed Kubernetes services (EKS, GKE, AKS) set this automatically.
              </p>
              <pre className={styles.codeBlock}>{AZ_LABEL_YAML}</pre>
              <p className={styles.prose} style={{ marginTop: '1rem' }}>
                For bare-metal or on-prem clusters, provide a static mapping:
              </p>
              <pre className={styles.codeBlock}>{AZ_HELM_YAML}</pre>
              <ul className={styles.bulletList}>
                {AZ_UI_NOTE.map(note => <li key={note} className={styles.bulletItem}>{note}</li>)}
              </ul>
            </SubSection>

            <SubSection id="scan-config" title="Reliability Scanner">
              <p className={styles.prose}>
                The scanner runs 13 checks across Deployments, StatefulSets, DaemonSets, Services, and
                CronJobs. All checks are configurable — disable any check, exclude namespaces, exclude
                specific workloads, or change the owner label key.
              </p>
              <pre className={styles.codeBlock}>{SCAN_HELM_YAML}</pre>
              <ul className={styles.bulletList}>
                {SCAN_UI_NOTE.map(note => <li key={note} className={styles.bulletItem}>{note}</li>)}
              </ul>
            </SubSection>

            <SubSection id="slo" title="SLO Tracking">
              <p className={styles.prose}>
                Define Service Level Objectives (SLOs) per service. The SLO engine computes burn rate and
                compliance from ClickHouse trace and connection data. Supported SLI types:{' '}
                <IC>availability</IC>, <IC>latency_p99</IC>, <IC>latency_p95</IC>, <IC>error_rate</IC>.
              </p>
              <Callout icon="info">
                SLOs are defined via the UI (Settings → SLO) or the REST API. The burn rate is recalculated
                every 5 minutes and surfaced as a graph overlay.
              </Callout>
            </SubSection>
          </Section>

          {/* ── API Reference ──────────────────────────────────────── */}
          <Section id="api-reference" title="API Reference">
            <SubSection id="auth-headers" title="Authentication">
              <p className={styles.prose}>
                Every API call requires an <IC>X-API-Key</IC> header containing a token obtained from{' '}
                <IC>POST /api/v1/auth/keys</IC>. Cluster-scoped endpoints additionally require{' '}
                <IC>X-Tenant-ID</IC> and <IC>X-Cluster-ID</IC>.
              </p>
              <Terminal title="auth-example.sh" lines={AUTH_CURL_LINES} copyable />
              <Callout icon="info">
                When <IC>AUTH_DISABLED=true</IC> (the default in development), the headers are still
                accepted but not enforced. Set <IC>AUTH_DISABLED=false</IC> in production.
              </Callout>
            </SubSection>

            <SubSection id="graph-api" title="Graph">
              <EndpointTable endpoints={GRAPH_ENDPOINTS} />
            </SubSection>

            <SubSection id="snapshots-api" title="Snapshots">
              <p className={styles.prose}>
                Manual snapshots are available on the Free tier. Scheduled snapshots (every 6 hours) require
                an Enterprise license with the <IC>scheduled-snapshots</IC> feature flag.
              </p>
              <EndpointTable endpoints={SNAPSHOT_ENDPOINTS} />
            </SubSection>

            <SubSection id="drift-api" title="Drift Detection">
              <p className={styles.prose}>
                The drift engine compares the live graph against a set of approved baselines. New edges that
                weren't present in the baseline are surfaced as drift events and sent to Slack.
              </p>
              <EndpointTable endpoints={DRIFT_ENDPOINTS} />
            </SubSection>

            <SubSection id="export-api" title="Export">
              <p className={styles.prose}>
                Export the current graph in several formats. <IC>mermaid</IC>, <IC>dot</IC>, and{' '}
                <IC>svg</IC> are available on the Free tier. <IC>drawio</IC> requires an Enterprise license.
              </p>
              <EndpointTable endpoints={EXPORT_ENDPOINTS} />
            </SubSection>

            <SubSection id="search-api" title="Search">
              <p className={styles.prose}>
                Full-text search is powered by PostgreSQL <IC>tsvector</IC>. Results include services,
                namespaces, and ownership records.
              </p>
              <EndpointTable endpoints={SEARCH_ENDPOINTS} />
            </SubSection>

            <SubSection id="telemetry-api" title="Telemetry">
              <p className={styles.prose}>
                All telemetry endpoints require ClickHouse to be configured. They respond with HTTP 501
                when ClickHouse is not available. The <IC>connections</IC> endpoint returns both{' '}
                <IC>bytes_sent</IC> (egress, billed) and <IC>bytes_recv</IC> (ingress, informational).
              </p>
              <EndpointTable endpoints={TELEMETRY_ENDPOINTS} />
            </SubSection>

            <SubSection id="cost-api" title="Cost & Config">
              <p className={styles.prose}>
                Cost and config endpoints require a Pro license. Config endpoints are also available via
                the UI (Settings → Cost Config). Changes via API or UI are stored in PostgreSQL and applied
                immediately.
              </p>
              <EndpointTable endpoints={COST_API_ENDPOINTS} />
            </SubSection>

            <SubSection id="scan-api" title="Scan & Config">
              <p className={styles.prose}>
                Scan config and findings endpoints require a Pro license. All 13 check names are returned
                by <IC>GET /api/v1/scan/config/checks</IC> along with their severity, title, and description
                — the UI uses this to render the toggle list.
              </p>
              <EndpointTable endpoints={SCAN_API_ENDPOINTS} />
            </SubSection>

            <SubSection id="slo-api" title="SLO">
              <p className={styles.prose}>
                Create and manage SLO definitions. Burn rate is the ratio of error budget consumed per hour.
                A burn rate &gt; 1.0 means you will exhaust the error budget before the end of the window.
              </p>
              <EndpointTable endpoints={SLO_API_ENDPOINTS} />
            </SubSection>
          </Section>

          {/* ── Webhooks ───────────────────────────────────────────── */}
          <Section id="webhooks" title="Webhooks">
            <p className={styles.prose}>
              Graphon listens for pull request and merge request events at{' '}
              <IC>POST /api/v1/webhooks</IC>. When a PR is opened, the backend runs an impact analysis
              against the live graph and posts the result as a comment on the PR/MR. Requires an
              Enterprise license.
            </p>

            <SubSection id="github-webhook" title="GitHub Setup">
              <Terminal title="github-webhook.sh" lines={GITHUB_WEBHOOK_LINES} copyable />
              <Callout icon="info">
                The webhook endpoint verifies the HMAC-SHA256 signature in the{' '}
                <IC>X-Hub-Signature-256</IC> header before processing any payload. Requests with a
                missing or invalid signature return HTTP 401.
              </Callout>
            </SubSection>

            <SubSection id="gitlab-webhook" title="GitLab Setup">
              <Terminal title="gitlab-webhook.sh" lines={GITLAB_WEBHOOK_LINES} copyable />
              <Callout icon="info">
                Set <IC>GITLAB_INSTANCE_URL</IC> only if you are using a self-hosted GitLab. Leave
                it at the default (<IC>https://gitlab.com</IC>) for GitLab.com.
              </Callout>
            </SubSection>
          </Section>

          {/* ── OIDC & RBAC ────────────────────────────────────────── */}
          <Section id="oidc-rbac" title="OIDC & RBAC">
            <SubSection id="oidc-setup" title="SSO / OIDC Setup">
              <p className={styles.prose}>
                Graphon supports any OIDC-compliant provider (Google Workspace, Okta, Azure AD,
                Keycloak, Auth0, …). When enabled, users are redirected to{' '}
                <IC>/auth/login</IC> and a server-side session is created on callback. API-key
                authentication continues to work in parallel so existing integrations are not broken.
              </p>
              <Terminal title="oidc-setup.sh" lines={OIDC_LINES} copyable />
              <Callout icon="info">
                Set <IC>OIDC_GROUP_ROLE_MAPPING</IC> to automatically assign RBAC roles based on
                the user's group membership in your identity provider. Format:{' '}
                <IC>group-name:role,other-group:role</IC>.
              </Callout>
            </SubSection>

            <SubSection id="roles" title="Roles & Permissions">
              <p className={styles.prose}>
                Graphon uses six built-in roles. Roles are assigned either via group mapping (OIDC)
                or directly when creating an API key via <IC>POST /api/v1/auth/keys</IC>.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Role</th>
                      <th className={styles.th}>Permissions</th>
                      <th className={styles.th}>Typical use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RBAC_ROLES.map(r => (
                      <tr key={r.role}>
                        <td className={styles.tdBadge}>
                          <span className={styles.rolePill}>{r.role}</span>
                        </td>
                        <td className={styles.td} style={{ fontSize: 12, fontFamily: 'monospace' }}>{r.permissions}</td>
                        <td className={styles.td}>{r.typical}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout warn icon="warning">
                RBAC is opt-in. Set <IC>RBAC_ENABLED=true</IC> to enforce permission checks.
                When disabled, all authenticated users are treated as <IC>admin</IC> for backwards
                compatibility.
              </Callout>
            </SubSection>
          </Section>

          {/* ── License ───────────────────────────────────────────── */}
          <Section id="license" title="License System">
            <SubSection id="free-tier" title="Free Tier">
              <p className={styles.prose}>
                No license key is required for the Free tier. The core graph, ownership, drift
                detection, snapshots, and export are available out of the box under the Apache 2.0
                license with no telemetry and no call home.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Feature</th>
                      <th className={styles.th} style={{ textAlign: 'center' }}>Free</th>
                      <th className={styles.th} style={{ textAlign: 'center' }}>Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FREE_FEATURES_TABLE.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? '' : ''}>
                        <td className={styles.td}>{row.feature}</td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <FeatureCell value={row.free} />
                        </td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <FeatureCell value={row.pro} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>

            <SubSection id="apply-key" title="Applying a License Key">
              <p className={styles.prose}>
                Pro license keys are RS256-signed JWTs generated using keygen.sh, scoped to your
                organisation name and cluster count. They are verified locally against an embedded RSA
                public key — no internet connection is required for validation.
              </p>
              <Terminal title="apply-license.sh" lines={APPLY_KEY_LINES} copyable />
              <Callout icon="info">
                After a license expires, Graphon enters a 14-day grace period (configurable via{' '}
                <IC>LICENSE_GRACE_PERIOD_DAYS</IC>) before falling back to the Free tier.
              </Callout>
            </SubSection>

            <SubSection id="pro-license" title="Getting a Pro Key">
              <p className={styles.prose}>
                Pro license keys are issued manually until billing integration is available. The process
                takes under 24 hours:
              </p>
              <ol className={styles.orderedList}>
                {PRO_LICENSE_STEPS.map(s => (
                  <li key={s.step} className={styles.orderedItem}>
                    <strong>{s.title}</strong> — {s.detail}
                  </li>
                ))}
              </ol>
              <Callout icon="info">
                Links: <a href="https://github.com/retr0-kernel/graphon-helm/issues/new?title=Pro+License+Request&labels=license" className={styles.link} target="_blank" rel="noopener noreferrer">Open GitHub Issue</a>
                {' · '}
                <a href="https://linkedin.com/in/retr0-kernel" className={styles.link} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </Callout>
            </SubSection>
          </Section>

          {/* ── Helm Chart ─────────────────────────────────────────── */}
          <Section id="helm-chart" title="Helm Chart">
            <SubSection id="helm-install" title="Installation">
              <Terminal title="helm-install.sh" lines={HELM_INSTALL_LINES} copyable />
            </SubSection>

            <SubSection id="helm-values" title="Values Reference">
              <p className={styles.prose}>
                The most commonly used values are listed below. For the full reference, see the{' '}
                <IC>values.yaml</IC> in the <IC>graphon-helm</IC> repository.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Key</th>
                      <th className={styles.th}>Default</th>
                      <th className={styles.th}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HELM_VALUES.map(v => (
                      <tr key={v.key}>
                        <td className={styles.tdMono}>{v.key}</td>
                        <td className={styles.td} style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.default}</td>
                        <td className={styles.td}>{v.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout warn icon="warning">
                Change <IC>postgresql.auth.password</IC> and <IC>neo4j.auth.password</IC> before
                deploying to any environment. The defaults are intentionally insecure.
              </Callout>
            </SubSection>
          </Section>

        </article>
        </div>
      </div>
    </div>
  );
}
