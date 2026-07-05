import type { TerminalLine } from '../../components/terminal';

export interface DocSection {
  id: string;
  title: string;
  items?: { id: string; label: string }[];
}

export const SIDEBAR_SECTIONS: readonly DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      { id: 'prerequisites',    label: 'Prerequisites'      },
      { id: 'quick-install',    label: 'Quick Install'      },
      { id: 'first-graph',      label: 'Your First Graph'   },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    items: [
      { id: 'how-ebpf-works',   label: 'How eBPF Works'     },
      { id: 'components',       label: 'Components'         },
      { id: 'data-flow',        label: 'Data Flow'          },
    ],
  },
  {
    id: 'configuration',
    title: 'Configuration',
    items: [
      { id: 'env-vars',         label: 'Environment Vars'   },
      { id: 'deployment-modes', label: 'Deployment Modes'   },
    ],
  },
  {
    id: 'observability',
    title: 'Observability (Phase 4)',
    items: [
      { id: 'otlp-traces',      label: 'OTLP Tracing'       },
      { id: 'prometheus',       label: 'Prometheus Scraping' },
      { id: 'log-collection',   label: 'Log Collection'      },
      { id: 'cost-config',      label: 'Cost Tracking'       },
      { id: 'az-detection',     label: 'AZ Detection'        },
      { id: 'scan-config',      label: 'Reliability Scan'    },
      { id: 'slo',              label: 'SLO Tracking'        },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    items: [
      { id: 'auth-headers',     label: 'Authentication'     },
      { id: 'graph-api',        label: 'Graph'              },
      { id: 'snapshots-api',    label: 'Snapshots'          },
      { id: 'drift-api',        label: 'Drift Detection'    },
      { id: 'export-api',       label: 'Export'             },
      { id: 'search-api',       label: 'Search'             },
      { id: 'telemetry-api',    label: 'Telemetry'          },
      { id: 'cost-api',         label: 'Cost & Config'      },
      { id: 'scan-api',         label: 'Scan & Config'      },
      { id: 'slo-api',          label: 'SLO'                },
    ],
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    items: [
      { id: 'github-webhook',   label: 'GitHub Setup'       },
      { id: 'gitlab-webhook',   label: 'GitLab Setup'       },
    ],
  },
  {
    id: 'oidc-rbac',
    title: 'OIDC & RBAC',
    items: [
      { id: 'oidc-setup',       label: 'SSO / OIDC Setup'   },
      { id: 'roles',            label: 'Roles & Permissions'},
    ],
  },
  {
    id: 'license',
    title: 'License System',
    items: [
      { id: 'free-tier',        label: 'Free Tier'          },
      { id: 'pro-license',      label: 'Getting a Pro Key'  },
      { id: 'apply-key',        label: 'Applying a Key'     },
    ],
  },
  {
    id: 'helm-chart',
    title: 'Helm Chart',
    items: [
      { id: 'helm-install',     label: 'Installation'       },
      { id: 'helm-values',      label: 'Values Reference'   },
    ],
  },
] as const;

// ── Getting Started ────────────────────────────────────────────────────────

export const INSTALL_LINES: readonly TerminalLine[] = [
  { type: 'comment',  text: '# 1. Add the Graphon Helm repo' },
  { type: 'command',  text: 'helm repo add graphon https://retr0-kernel.github.io/graphon-helm' },
  { type: 'output',   text: '"graphon" has been added to your repositories' },
  { type: 'comment',  text: '# 2. Deploy to your cluster' },
  { type: 'command',  text: 'helm upgrade --install graphon graphon/graphon --namespace graphon --create-namespace' },
  { type: 'success',  text: 'Release "graphon" has been upgraded. Happy Helming!' },
  { type: 'comment',  text: '# 3. Open the UI' },
  { type: 'command',  text: 'kubectl port-forward -n graphon svc/graphon-ui 3000:80' },
  { type: 'output',   text: 'Forwarding from 127.0.0.1:3000 -> 80' },
  { type: 'success',  text: 'Visit http://localhost:3000 — your live graph is ready' },
];

export const TENANT_SETUP_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# Register your tenant (run once)' },
  { type: 'command', text: `curl -X POST http://localhost:8080/api/v1/tenants/register \\` },
  { type: 'output',  text: `  -H "Content-Type: application/json" \\` },
  { type: 'output',  text: `  -d '{"id":"my-org","name":"My Organisation"}'` },
  { type: 'success', text: '{"id":"my-org","name":"My Organisation"}' },
  { type: 'comment', text: '# Create an admin API key' },
  { type: 'command', text: `curl -X POST http://localhost:8080/api/v1/auth/keys \\` },
  { type: 'output',  text: `  -H "X-Tenant-ID: my-org" \\` },
  { type: 'output',  text: `  -d '{"name":"admin","role":"admin"}'` },
  { type: 'success', text: '{"id":"key-...","token":"gph_..."}  ← save this token' },
];

export const PREREQUISITES = [
  { label: 'Kubernetes cluster',  detail: '1.25 or later. Kind, k3s, EKS, GKE, AKS all work.' },
  { label: 'Helm 3',              detail: 'Minimum v3.10. Run: helm version' },
  { label: 'kubectl',             detail: 'Configured to reach your cluster.' },
  { label: 'Linux kernel ≥ 5.8',  detail: 'Required for the BTF-based eBPF probes. Most cloud providers satisfy this.' },
  { label: 'PostgreSQL 14+',      detail: 'Bundled as a sub-chart or bring your own via POSTGRES_DSN.' },
  { label: 'Neo4j 5+',            detail: 'Bundled as a sub-chart or bring your own via NEO4J_URI.' },
  { label: 'ClickHouse (Phase 4)',detail: 'Required for logs, traces, metrics, and cost tracking. Bundled or external.' },
];

// ── Architecture ───────────────────────────────────────────────────────────

export const COMPONENTS = [
  {
    name: 'graphon-bpf',
    type: 'DaemonSet',
    port: '4318 (OTLP/HTTP)',
    description: 'Runs on every node. Attaches eBPF probes to tcp_connect/accept syscalls. Tails container logs from /var/log/containers. Scrapes Prometheus metrics. Receives OTLP/HTTP spans on port 4318. Writes high-volume telemetry directly to ClickHouse.',
  },
  {
    name: 'graphon-backend',
    type: 'Deployment',
    port: '8080',
    description: 'Go + Fiber REST API. Houses the License Engine, RBAC middleware, OIDC handler, Webhook Dispatcher, Snapshot Engine, Cost Calculator, SLO Engine, Reliability Scanner, and background Scheduler.',
  },
  {
    name: 'graphon-ui',
    type: 'Deployment',
    port: '80',
    description: 'React SPA served as static files. Uses @xyflow/react for the live graph canvas. Phase 4 adds Connections, Logs, Traces, Metrics, Cost, SLO, and Scan dashboards.',
  },
  {
    name: 'PostgreSQL',
    type: 'StatefulSet',
    port: '5432',
    description: 'Stores tenants, clusters, API keys, sessions, snapshots, ownership records, drift baselines, SLO definitions, scan findings, cost config, and scan config.',
  },
  {
    name: 'Neo4j',
    type: 'StatefulSet',
    port: '7687',
    description: 'Stores the live service graph (SERVICE nodes + CALLS edges). All graph queries run here.',
  },
  {
    name: 'ClickHouse',
    type: 'StatefulSet',
    port: '9000 / 8123',
    description: 'Phase 4: Columnar store for high-volume time-series data — connections, logs, traces, metrics, SLO windows. Handles billions of rows efficiently.',
  },
];

export const DATA_FLOW = [
  { step: '1', title: 'eBPF capture', desc: 'graphon-bpf attaches eBPF probes to every node via syscall tracepoints (tcp_connect, accept4) and kprobes (tcp_finish_connect, tcp_close, tcp_retransmit_skb). Each observed connection emits a structured event with source/dest IP, port, bytes, latency, and AZ.' },
  { step: '2', title: 'Metadata enrichment', desc: 'The agent resolves IPs to pod names via the Kubernetes API, performs local DNS caching for FQDN resolution, and reads the topology.kubernetes.io/zone node label for AZ-aware cost classification.' },
  { step: '3', title: 'Direct ClickHouse write', desc: 'High-volume telemetry (connections, logs, metrics) is written directly from the agent to ClickHouse in batches of up to 10,000 rows, bypassing the backend HTTP API to avoid bottlenecks.' },
  { step: '4', title: 'Graph ingest', desc: 'Service topology events are also POSTed to POST /api/v1/ingest/events. The backend writes SERVICE nodes and CALLS edges to Neo4j.' },
  { step: '5', title: 'OTLP/HTTP traces', desc: 'Applications send OpenTelemetry traces to the agent\'s OTLP/HTTP endpoint (port 4318). The agent decodes protobuf or JSON payloads and writes spans to ClickHouse.' },
  { step: '6', title: 'Background jobs', desc: 'The backend Scheduler runs: orphan scan (15 min), drift detection (10 min), baseline promotion (1 h), cleanup (1 h), scheduled snapshots (6 h), SLO compliance windows (5 min), reliability scans (configurable).' },
];

// ── Configuration ──────────────────────────────────────────────────────────

export interface EnvVar {
  name: string;
  default: string;
  required: boolean;
  description: string;
}

export const ENV_VARS: readonly EnvVar[] = [
  { name: 'PORT',                      default: '8080',       required: false, description: 'HTTP listen port for graphon-backend.'                             },
  { name: 'POSTGRES_DSN',              default: '—',          required: true,  description: 'Full PostgreSQL DSN. e.g. postgres://user:pass@host:5432/graphon'  },
  { name: 'NEO4J_URI',                 default: '—',          required: true,  description: 'Bolt URI for Neo4j. e.g. bolt://neo4j:7687'                        },
  { name: 'NEO4J_USER',                default: 'neo4j',      required: false, description: 'Neo4j username.'                                                   },
  { name: 'NEO4J_PASSWORD',            default: '—',          required: true,  description: 'Neo4j password.'                                                   },
  { name: 'CLICKHOUSE_URL',            default: '—',          required: false, description: 'ClickHouse DSN. e.g. clickhouse://user:pass@host:9000/graphon. Required for Phase 4 telemetry.' },
  { name: 'CLICKHOUSE_USER',           default: 'graphon',    required: false, description: 'ClickHouse username.'                                              },
  { name: 'CLICKHOUSE_PASSWORD',       default: '—',          required: false, description: 'ClickHouse password.'                                              },
  { name: 'AUTH_DISABLED',             default: 'true',       required: false, description: 'Set false in production. Disables API-key and session enforcement.' },
  { name: 'GRAPHON_LICENSE_KEY',       default: '—',          required: false, description: 'RS256-signed JWT for Pro features. Leave empty for Free tier.'     },
  { name: 'RBAC_ENABLED',             default: 'false',       required: false, description: 'Enable RBAC permission checks on every endpoint.'                  },
  { name: 'RBAC_DEFAULT_ROLE',         default: 'viewer',     required: false, description: 'Role assigned to OIDC-authenticated users without a group mapping.'},
  { name: 'OIDC_ENABLED',             default: 'false',       required: false, description: 'Enable /auth/login, /auth/callback, /auth/logout, /auth/me.'       },
  { name: 'OIDC_ISSUER_URL',           default: '—',          required: false, description: 'OIDC provider discovery URL. e.g. https://accounts.google.com'     },
  { name: 'OIDC_CLIENT_ID',            default: '—',          required: false, description: 'OAuth2 client ID.'                                                 },
  { name: 'OIDC_CLIENT_SECRET',        default: '—',          required: false, description: 'OAuth2 client secret. Keep in a Kubernetes Secret.'               },
  { name: 'OIDC_REDIRECT_URL',         default: '—',          required: false, description: 'Callback URL. Must match what you registered with the provider.'  },
  { name: 'OIDC_SCOPES',              default: 'openid,email,profile', required: false, description: 'Comma-separated OIDC scopes to request.'                },
  { name: 'OIDC_GROUP_ROLE_MAPPING',   default: '—',          required: false, description: 'Map OIDC groups to roles. e.g. "platform-eng:admin,devs:developer"'},
  { name: 'GITHUB_WEBHOOK_SECRET',     default: '—',          required: false, description: 'HMAC-SHA256 secret for validating GitHub webhook payloads.'        },
  { name: 'GITHUB_TOKEN',              default: '—',          required: false, description: 'GitHub PAT with repo write scope. Used to post PR impact comments.'},
  { name: 'GITLAB_WEBHOOK_SECRET',     default: '—',          required: false, description: 'Token for validating GitLab webhook X-Gitlab-Token header.'        },
  { name: 'GITLAB_TOKEN',              default: '—',          required: false, description: 'GitLab PAT. Used to post MR impact notes.'                         },
  { name: 'GITLAB_INSTANCE_URL',       default: 'https://gitlab.com', required: false, description: 'Base URL for self-hosted GitLab instances.'             },
  { name: 'DEPLOYMENT_MODE',           default: 'self-hosted', required: false, description: 'self-hosted or cloud. Logged at startup.'                        },
  { name: 'LOG_LEVEL',                 default: 'info',       required: false, description: 'debug | info | warn | error'                                       },
  { name: 'CORS_ORIGINS',              default: '*',          required: false, description: 'Allowed CORS origins. Set to your UI URL in production.'           },
  { name: 'BASELINE_DAYS',             default: '7',          required: false, description: 'Edges older than this are promoted to drift baselines.'            },
  { name: 'LICENSE_GRACE_PERIOD_DAYS', default: '14',         required: false, description: 'Days to keep Pro features after license expiry.'                   },
] as const;

export const DEPLOYMENT_MODES = [
  {
    mode: 'Free Self-Hosted',
    env: 'DEPLOYMENT_MODE=self-hosted',
    desc: 'Default. No license key required. Core graph, ownership, drift, manual snapshots, and basic export. Up to 3 users.',
    features: ['Live dependency graph', 'Ownership CRUD', 'Drift detection', 'Safe-delete analysis', 'Manual snapshots + diff', 'Review centre', 'Slack alerts', 'REST API'],
  },
  {
    mode: 'Pro Self-Hosted',
    env: 'GRAPHON_LICENSE_KEY=<jwt>',
    desc: 'RS256-signed license JWT unlocks full observability features. Self-hosted in your own cluster. Annual license. Contact us via LinkedIn or GitHub Issues to obtain a key.',
    features: ['Everything in Free', 'OIDC/SSO', 'RBAC (6 roles)', 'Scheduled snapshots (6h)', 'Snapshot retention >30 days', 'GitHub/GitLab PR impact comments', 'Draw.io export', 'Multi-cluster', 'ClickHouse telemetry (logs, traces, metrics, connections)', 'Cost tracking', 'SLO engine', 'Reliability scanner', 'Priority support'],
  },
  {
    mode: 'Cloud (Coming Soon)',
    env: 'DEPLOYMENT_MODE=cloud',
    desc: 'Graphon manages the backend. You deploy only graphon-bpf as a DaemonSet. No database admin required.',
    features: ['Everything in Pro', 'Managed Neo4j + PostgreSQL + ClickHouse', '5-minute onboarding', 'Dedicated SLA', 'SOC 2 roadmap'],
  },
];

// ── Observability — OTLP Tracing ───────────────────────────────────────────

export const OTLP_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# The Graphon agent runs an OTLP/HTTP receiver on port 4318 (per node).' },
  { type: 'comment', text: '# Point your OTel SDK to the node IP — use the Downward API to get it.' },
  { type: 'comment', text: '# Example Kubernetes Deployment env block:' },
  { type: 'output',  text: 'env:' },
  { type: 'output',  text: '  - name: NODE_IP' },
  { type: 'output',  text: '    valueFrom:' },
  { type: 'output',  text: '      fieldRef:' },
  { type: 'output',  text: '        fieldPath: status.hostIP' },
  { type: 'output',  text: '  - name: OTEL_EXPORTER_OTLP_ENDPOINT' },
  { type: 'output',  text: '    value: "http://$(NODE_IP):4318"' },
  { type: 'output',  text: '  - name: OTEL_EXPORTER_OTLP_PROTOCOL' },
  { type: 'output',  text: '    value: "http/json"        # or http/protobuf — both are supported' },
  { type: 'output',  text: '  - name: OTEL_SERVICE_NAME' },
  { type: 'output',  text: '    value: "my-service"' },
  { type: 'success', text: 'Spans appear in the Graphon UI → Traces within seconds.' },
];

export const OTLP_HELM_YAML = `# values.yaml — enable OTLP receiver on the agent
agent:
  phase4:
    otlpEnabled: true
    otlpPort: 4318           # Default: 4318 (OTLP/HTTP standard port)`;

// ── Observability — Prometheus Scraping ────────────────────────────────────

export const PROMETHEUS_ANNOTATION_YAML = `# Add these annotations to any Pod that exposes /metrics:
metadata:
  annotations:
    prometheus.io/scrape: "true"        # Required — enables scraping
    prometheus.io/port: "9090"          # Port to scrape (default: 8080)
    prometheus.io/path: "/metrics"      # Path (default: /metrics)
    prometheus.io/scheme: "https"       # "http" or "https" (default: http)
    prometheus.io/interval: "60s"       # Per-pod override (default: 30s)

    # ── Auth (Graphon extensions) ──────────────────────────────────────────
    # If your /metrics endpoint requires authentication:
    graphon.io/metrics-auth-type: "bearer"           # "bearer" or "basic"
    graphon.io/metrics-auth-secret: "my-secret"      # k8s Secret name (same namespace)
    graphon.io/metrics-auth-secret-key: "token"      # Key inside the Secret

    # ── TLS ───────────────────────────────────────────────────────────────
    graphon.io/metrics-tls-skip-verify: "false"      # Set "true" for self-signed certs`;

export const PROMETHEUS_HELM_YAML = `# values.yaml — Prometheus scraper configuration
prometheusConfig:
  scrapeInterval: "30s"     # Global interval; override per-pod via annotation
  defaultScheme: "http"
  defaultPath: "/metrics"
  defaultPort: "8080"`;

export const PROMETHEUS_SECRET_YAML = `# Create a k8s Secret holding the bearer token:
apiVersion: v1
kind: Secret
metadata:
  name: my-service-metrics-token
  namespace: my-namespace
type: Opaque
stringData:
  token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."   # your token here

---
# Then annotate the Pod:
metadata:
  annotations:
    prometheus.io/scrape: "true"
    graphon.io/metrics-auth-type: "bearer"
    graphon.io/metrics-auth-secret: "my-service-metrics-token"
    graphon.io/metrics-auth-secret-key: "token"`;

// ── Observability — Log Collection ─────────────────────────────────────────

export const LOG_FORMAT_YAML = `# Graphon supports all Kubernetes container log formats:
#
# 1. CRI-O / containerd (default since k8s 1.20+):
#    2024-01-15T12:00:00.123456789Z stdout F {"level":"info","msg":"server started","port":8080}
#    ─── timestamp ───────────────── stream flag message (F=full, P=partial/multiline)
#
# 2. Docker JSON log driver (legacy):
#    {"log":"server started\\n","stream":"stdout","time":"2024-01-15T12:00:00.123456789Z"}
#
# Both formats are auto-detected. No configuration needed.
#
# ── Structured JSON log field conventions ──────────────────────────────────
# The following field names are extracted automatically from JSON messages:
#
# Message:   msg, message, log, body, text, event, content
# Severity:  level, severity, lvl, log.level, loglevel, log_level
#            (string: trace/debug/info/warn/error/fatal)
#            (numeric: Python logging integers 10/20/30/40/50 also supported)
# TraceID:   trace_id, traceid, trace-id, x-trace-id, dd.trace_id
#            x-b3-traceid, traceparent (W3C "00-<traceid>-<spanid>-<flags>")
# SpanID:    span_id, spanid, span-id, x-b3-spanid, dd.span_id`;

// ── Observability — Cost Tracking ─────────────────────────────────────────

export const COST_HELM_YAML = `# values.yaml — Cost tracking configuration
costConfig:
  # Cloud provider for pricing. Options: auto | aws | gcp | azure | unknown
  # "auto" reads spec.providerID / node labels (recommended).
  # Override to lock to a specific provider if auto-detection fails.
  cloudProvider: "auto"

  # Per-GB egress pricing overrides.
  # Leave empty to use Graphon's built-in list-price defaults:
  #   AWS:   $0.09/GB internet, $0.01/GB cross-AZ
  #   GCP:   $0.085/GB internet, $0.01/GB cross-AZ
  #   Azure: $0.087/GB internet, $0.01/GB cross-AZ
  # Set to your actual negotiated rate for accurate billing.
  pricing:
    crossAZPerGB: ""        # e.g. "0.01"
    internetPerGB: ""       # e.g. "0.07"  (common enterprise discount tier)

  # Custom CIDR ranges — overrides the embedded cloud CIDR snapshots.
  # Use when:
  #   - Your company has on-prem IP ranges that are NOT public internet
  #   - You use a VPN/Direct Connect where specific IPs should be billed differently
  #   - You have non-standard cloud configurations
  #
  # traffic_class: "free" (same-AZ/internal), "cross_az", or "internet"
  customCIDRs:
    - cidr: "203.0.113.0/24"
      traffic_class: free
      label: "On-prem datacenter"
    - cidr: "198.51.100.0/24"
      traffic_class: cross_az
      label: "DR site (different AZ)"`;

export const COST_UI_NOTE = [
  'All cost configuration can also be edited live in the Graphon UI under Settings → Cost Config.',
  'Changes made in the UI are stored in PostgreSQL and take precedence over Helm values.',
  'The UI shows the currently detected cloud provider, active pricing rates, and highlights where defaults are being used.',
  'You can add, edit, and delete custom CIDR entries without redeploying.',
  'Both bytes_sent (egress, what you are billed for) and bytes_recv (ingress, informational) are shown in the UI.',
];

// ── Observability — AZ Detection ──────────────────────────────────────────

export const AZ_LABEL_YAML = `# Ensure your nodes have the zone topology label (standard on EKS, GKE, AKS):
kubectl get nodes -o custom-columns='NAME:.metadata.name,ZONE:.metadata.labels.topology\\.kubernetes\\.io/zone'

# If the ZONE column is <none>, your cloud controller manager is not setting it.
# Fix for EKS: ensure the aws-node DaemonSet is up-to-date.
# Fix for GKE: labels are set automatically — check the node pool.
# Fix for AKS: labels are set automatically on 1.28+ clusters.

# For bare-metal / on-prem, add the label manually:
kubectl label node worker-1 topology.kubernetes.io/zone=rack-a
kubectl label node worker-2 topology.kubernetes.io/zone=rack-b`;

export const AZ_HELM_YAML = `# values.yaml — Static AZ mapping (when topology label is absent)
azConfig:
  nodeZoneMap:
    worker-1: us-east-1a
    worker-2: us-east-1b
    worker-3: us-east-1c
    # ... add all nodes`;

export const AZ_UI_NOTE = [
  'If AZ labels are missing, Graphon shows \'AZ unknown\' in the cost breakdown.',
  'You can configure a static node→zone map in Settings → Cost Config → AZ Node Map.',
  'Without AZ information, all private-IP traffic is classified as same-AZ (free). This means cross-AZ costs will be underreported — not overreported.',
  'Internet egress costs are NOT affected by AZ detection and are always reported correctly.',
];

// ── Observability — Reliability Scan ──────────────────────────────────────

export const SCAN_HELM_YAML = `# values.yaml — Reliability scan configuration
scanConfig:
  # Disable specific checks org-wide. Override per-cluster in the UI.
  # Full list of check names:
  #   single_replica_deployment       — Deployments with replicas < 2
  #   missing_pod_disruption_budget   — Multi-replica deployments without PDB
  #   missing_resource_limits         — Containers without memory limits
  #   missing_readiness_probe         — Containers without readiness probe
  #   latest_image_tag                — Containers using :latest or untagged images
  #   missing_owner_label             — Deployments missing owner label
  #   unreplicated_database           — Single-replica StatefulSets matching DB names
  #   statefulset_missing_resource_limits — StatefulSet containers without memory limits
  #   statefulset_missing_update_strategy — StatefulSets using OnDelete strategy
  #   daemonset_missing_resource_limits   — DaemonSet containers without memory limits
  #   publicly_exposed_service        — LoadBalancer services with public IPs
  #   unencrypted_public_port         — Cleartext protocols on public LoadBalancers
  #   cronjob_no_concurrency_policy   — CronJobs with Allow concurrency policy
  disabledChecks:
    - missing_owner_label          # Remove once your team adopts ownership labels
    # - latest_image_tag           # Remove once all images are pinned

  # Namespaces to skip entirely.
  # kube-system, kube-public, kube-node-lease are always excluded.
  excludedNamespaces:
    - kube-system
    - kube-public
    - kube-node-lease
    - monitoring           # Add your monitoring namespace if it has intentional single replicas

  # Specific workloads to skip by name.
  excludedServices:
    - some-legacy-deployment    # has a known single-replica exception

  # The label key used for ownership checks. Change to match your org's convention.
  ownerLabelKey: "app.graphon.io/owner-team"
  # Common alternatives:
  #   team: "team"
  #   owner: "owner"
  #   app.kubernetes.io/managed-by: "app.kubernetes.io/managed-by"`;

export const SCAN_UI_NOTE = [
  'All scan configuration is also editable in the UI under Settings → Scan Config.',
  'The UI shows a list of all checks with toggles — changes take effect on the next scan.',
  'You can trigger an on-demand scan from the UI. Periodic scans run on the configured interval.',
  'Findings include remediation steps with copy-pasteable YAML examples.',
  'Findings can be acknowledged in the UI to suppress them until the next scan cycle.',
];

// ── API Reference ──────────────────────────────────────────────────────────

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  auth: string;
  description: string;
}

export const GRAPH_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'GET',  path: '/api/v1/graph',              auth: 'tenant+cluster', description: 'Returns the live service topology as {nodes, edges}. Filter by ?namespace=.' },
  { method: 'GET',  path: '/api/v1/graph/summary',      auth: 'tenant+cluster', description: 'Returns counts: total nodes, edges, namespaces, orphans.' },
  { method: 'GET',  path: '/api/v1/graph/nodes/:id',    auth: 'tenant+cluster', description: 'Returns detail for a single service node.' },
  { method: 'GET',  path: '/api/v1/graph/paths',        auth: 'tenant+cluster', description: 'Find shortest dependency path between two services. ?from=&to=.' },
  { method: 'GET',  path: '/api/v1/services',           auth: 'tenant+cluster', description: 'List all services with metadata.' },
  { method: 'GET',  path: '/api/v1/services/search',    auth: 'tenant+cluster', description: 'Full-text search over service names and metadata.' },
  { method: 'GET',  path: '/api/v1/services/:id',       auth: 'tenant+cluster', description: 'Get detail for a specific service.' },
  { method: 'GET',  path: '/api/v1/namespaces',         auth: 'tenant+cluster', description: 'List all observed namespaces.' },
  { method: 'GET',  path: '/api/v1/services/:id/safe-delete', auth: 'tenant+cluster', description: 'Analyze whether a service can be safely deleted. Returns {safe, dependents}.' },
];

export const SNAPSHOT_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'POST',   path: '/api/v1/snapshots',             auth: 'tenant+cluster', description: 'Capture a graph snapshot. Body: {label, trigger}.' },
  { method: 'GET',    path: '/api/v1/snapshots',             auth: 'tenant+cluster', description: 'List snapshots with optional ?limit=.' },
  { method: 'GET',    path: '/api/v1/snapshots/:id',         auth: 'tenant+cluster', description: 'Get a specific snapshot by ID.' },
  { method: 'GET',    path: '/api/v1/snapshots/diff',        auth: 'tenant+cluster', description: 'Diff two snapshots. ?from=<id>&to=<id>. Returns {added, removed, changed}.' },
  { method: 'DELETE', path: '/api/v1/snapshots/:id',         auth: 'tenant+cluster', description: 'Delete a snapshot. Requires snapshot:write permission.' },
];

export const DRIFT_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'POST', path: '/api/v1/drift/seed',                    auth: 'tenant+cluster', description: 'Seed drift baselines from the current graph state.' },
  { method: 'GET',  path: '/api/v1/drift/baselines',               auth: 'tenant+cluster', description: 'List all drift baselines for this cluster.' },
  { method: 'POST', path: '/api/v1/drift/baselines/:id/acknowledge', auth: 'tenant+cluster', description: 'Acknowledge a drift event, removing it from the active set.' },
];

export const EXPORT_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'POST', path: '/api/v1/export', auth: 'tenant+cluster', description: 'Export the graph. Body: {format}. Free: mermaid|dot|svg. Pro adds: drawio.' },
];

export const SEARCH_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'GET', path: '/api/v1/search', auth: 'tenant+cluster', description: 'Full-text search across services, namespaces, and ownership data. ?q=<query>.' },
];

export const TELEMETRY_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'GET', path: '/api/v1/connections', auth: 'tenant+cluster', description: 'List recent connections. ?namespace=&from=&to=&service=&limit=. Returns bytes_sent AND bytes_recv.' },
  { method: 'GET', path: '/api/v1/logs',         auth: 'tenant+cluster', description: 'Query log entries. ?namespace=&pod=&severity=&from=&to=&q=.' },
  { method: 'GET', path: '/api/v1/logs/stream',  auth: 'tenant+cluster', description: 'Server-Sent Events stream of live logs. Set Accept: text/event-stream.' },
  { method: 'GET', path: '/api/v1/traces',       auth: 'tenant+cluster', description: 'List trace summaries. ?service=&from=&to=&status=&limit=.' },
  { method: 'GET', path: '/api/v1/traces/:id',   auth: 'tenant+cluster', description: 'Get a full trace with all spans and attributes.' },
  { method: 'GET', path: '/api/v1/metrics',      auth: 'tenant+cluster', description: 'Query metric time-series. ?service=&metric=&from=&to=.' },
  { method: 'GET', path: '/api/v1/metrics/catalog', auth: 'tenant+cluster', description: 'List all known metric names and labels.' },
];

export const COST_API_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'GET',    path: '/api/v1/costs/summary',         auth: 'Pro', description: 'Cost summary by traffic class. ?from=&to=&clusters=.' },
  { method: 'GET',    path: '/api/v1/costs/by-service/:svc', auth: 'Pro', description: 'Daily cost trend + top destinations for one service.' },
  { method: 'GET',    path: '/api/v1/cost-config',           auth: 'Pro', description: 'Get cost config (cloud provider, pricing, custom CIDRs). ?cluster_id=.' },
  { method: 'PUT',    path: '/api/v1/cost-config',           auth: 'Pro', description: 'Set cloud provider and pricing overrides. Body: {cluster_id, cloud_provider, pricing_cross_az_per_gb, pricing_internet_per_gb, az_node_map}.' },
  { method: 'GET',    path: '/api/v1/cost-config/cidrs',     auth: 'Pro', description: 'List custom CIDR entries. ?cluster_id=.' },
  { method: 'PUT',    path: '/api/v1/cost-config/cidrs',     auth: 'Pro', description: 'Add/update a custom CIDR. Body: {cluster_id, cidr, traffic_class, label}.' },
  { method: 'DELETE', path: '/api/v1/cost-config/cidrs',     auth: 'Pro', description: 'Remove a custom CIDR. ?cluster_id=&cidr=.' },
];

export const SCAN_API_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'GET',  path: '/api/v1/scan/findings',            auth: 'Pro', description: 'List scan findings. ?cluster_id=&severity=&check=&namespace=&acknowledged=.' },
  { method: 'PUT',  path: '/api/v1/scan/findings/:id/acknowledge', auth: 'Pro', description: 'Acknowledge a finding until the next scan cycle.' },
  { method: 'POST', path: '/api/v1/scan/run',                 auth: 'Pro', description: 'Trigger an on-demand scan for a cluster. Body: {cluster_id}.' },
  { method: 'GET',  path: '/api/v1/scan/config/checks',       auth: 'Pro', description: 'Get the full catalogue of check names, severities, and descriptions.' },
  { method: 'GET',  path: '/api/v1/scan/config',              auth: 'Pro', description: 'Get the scan config for a cluster. ?cluster_id=.' },
  { method: 'PUT',  path: '/api/v1/scan/config',              auth: 'Pro', description: 'Update scan config. Body: {cluster_id, disabled_checks, excluded_namespaces, excluded_services, owner_label_key}.' },
];

export const SLO_API_ENDPOINTS: readonly ApiEndpoint[] = [
  { method: 'GET',    path: '/api/v1/slo',                       auth: 'Pro', description: 'List all SLO definitions for a cluster. ?cluster_id=.' },
  { method: 'PUT',    path: '/api/v1/slo/:service/:name',         auth: 'Pro', description: 'Create or update an SLO. Body: {sli_type, target, window_hours}.' },
  { method: 'DELETE', path: '/api/v1/slo/:service/:name',         auth: 'Pro', description: 'Delete an SLO definition.' },
  { method: 'GET',    path: '/api/v1/slo/:service/:name/burn-rate', auth: 'Pro', description: 'Get current burn rate and compliance for an SLO.' },
];

export const AUTH_CURL_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# All cluster-scoped endpoints require these three headers:' },
  { type: 'command', text: `curl http://localhost:8080/api/v1/graph \\` },
  { type: 'output',  text: `  -H "X-API-Key: gph_your_token_here" \\` },
  { type: 'output',  text: `  -H "X-Tenant-ID: my-org" \\` },
  { type: 'output',  text: `  -H "X-Cluster-ID: cluster-prod"` },
  { type: 'comment', text: '# Tenant-only endpoints omit X-Cluster-ID:' },
  { type: 'command', text: `curl http://localhost:8080/api/v1/clusters \\` },
  { type: 'output',  text: `  -H "X-API-Key: gph_your_token_here" \\` },
  { type: 'output',  text: `  -H "X-Tenant-ID: my-org"` },
  { type: 'comment', text: '# Some Phase 4 read endpoints accept ?cluster_id= instead of X-Cluster-ID:' },
  { type: 'command', text: `curl "http://localhost:8080/api/v1/cost-config?cluster_id=cluster-prod" \\` },
  { type: 'output',  text: `  -H "X-API-Key: gph_your_token_here" \\` },
  { type: 'output',  text: `  -H "X-Tenant-ID: my-org"` },
];

// ── Webhooks ───────────────────────────────────────────────────────────────

export const GITHUB_WEBHOOK_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# 1. Generate a webhook secret' },
  { type: 'command', text: 'openssl rand -hex 32' },
  { type: 'output',  text: 'a3f8c1... (save this as GITHUB_WEBHOOK_SECRET)' },
  { type: 'comment', text: '# 2. Set the env var on your backend' },
  { type: 'command', text: 'kubectl set env deploy/graphon-backend \\' },
  { type: 'output',  text: '  GITHUB_WEBHOOK_SECRET=a3f8c1... \\' },
  { type: 'output',  text: '  GITHUB_TOKEN=ghp_your_pat_here' },
  { type: 'comment', text: '# 3. Create webhook in GitHub repo settings:' },
  { type: 'output',  text: '  Payload URL: https://your-domain/api/v1/webhooks' },
  { type: 'output',  text: '  Content type: application/json' },
  { type: 'output',  text: '  Secret: a3f8c1...' },
  { type: 'success', text: '  Events: Pull requests ✓' },
];

export const GITLAB_WEBHOOK_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# 1. Set env vars on your backend' },
  { type: 'command', text: 'kubectl set env deploy/graphon-backend \\' },
  { type: 'output',  text: '  GITLAB_WEBHOOK_SECRET=mysecret \\' },
  { type: 'output',  text: '  GITLAB_TOKEN=glpat_your_token \\' },
  { type: 'output',  text: '  GITLAB_INSTANCE_URL=https://gitlab.com' },
  { type: 'comment', text: '# 2. In GitLab project → Settings → Webhooks:' },
  { type: 'output',  text: '  URL: https://your-domain/api/v1/webhooks' },
  { type: 'output',  text: '  Secret token: mysecret' },
  { type: 'success', text: '  Trigger: Merge request events ✓' },
];

// ── OIDC & RBAC ────────────────────────────────────────────────────────────

export const OIDC_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# Enable OIDC (example: Google Workspace)' },
  { type: 'command', text: 'kubectl set env deploy/graphon-backend \\' },
  { type: 'output',  text: '  OIDC_ENABLED=true \\' },
  { type: 'output',  text: '  OIDC_ISSUER_URL=https://accounts.google.com \\' },
  { type: 'output',  text: '  OIDC_CLIENT_ID=123.apps.googleusercontent.com \\' },
  { type: 'output',  text: '  OIDC_CLIENT_SECRET=GOCSPX-... \\' },
  { type: 'output',  text: '  OIDC_REDIRECT_URL=https://graphon.mycompany.com/auth/callback \\' },
  { type: 'output',  text: '  OIDC_SCOPES=openid,email,profile,groups \\' },
  { type: 'output',  text: '  OIDC_GROUP_ROLE_MAPPING=platform-eng:admin,developers:developer \\' },
  { type: 'output',  text: '  RBAC_ENABLED=true \\' },
  { type: 'output',  text: '  RBAC_DEFAULT_ROLE=viewer' },
  { type: 'comment', text: '# Users are then redirected to:' },
  { type: 'output',  text: '  https://graphon.mycompany.com/auth/login' },
];

export interface RbacRow {
  role: string;
  permissions: string;
  typical: string;
}

export const RBAC_ROLES: readonly RbacRow[] = [
  { role: 'viewer',         permissions: 'graph:read, ownership:read, snapshot:read, export:read, search:read, telemetry:read, cost:read, scan:read',       typical: 'On-call engineers, read-only stakeholders' },
  { role: 'developer',      permissions: '+ ownership:write, search:advanced, safedelete:read',                                                             typical: 'Service owners managing their namespaces'  },
  { role: 'manager',        permissions: '+ graph:write, snapshot:write, drift:write, slo:write',                                                           typical: 'Team leads setting baselines, SLOs, and snapshots' },
  { role: 'platform-admin', permissions: '+ cluster:read/register/revoke, audit:read, scan:write, cost:write',                                              typical: 'Platform engineers managing cluster fleet'  },
  { role: 'admin',          permissions: 'All of the above + user:read/write, license:read/write',                                                          typical: 'Graphon administrators'                    },
  { role: 'agent',          permissions: 'events:write only',                                                                                               typical: 'Machine identity for the eBPF agent'       },
];

// ── License ────────────────────────────────────────────────────────────────

export const PRO_LICENSE_STEPS = [
  {
    step: '1',
    title: 'Open a GitHub Issue',
    detail: 'Go to github.com/retr0-kernel/graphon-helm/issues and open a new issue with title "Pro License Request". Include your organisation name, cluster count, and contact email.',
  },
  {
    step: '2',
    title: 'Or reach out on LinkedIn',
    detail: 'Message the Graphon team directly at linkedin.com/in/retr0-kernel with the subject "Graphon Pro License". We typically respond within 24 hours.',
  },
  {
    step: '3',
    title: 'Key Generation',
    detail: 'We generate an RS256-signed JWT using keygen.sh, scoped to your organisation name and cluster limit. The key is emailed to your contact address.',
  },
  {
    step: '4',
    title: 'Apply the Key',
    detail: 'Apply via API or Helm values (see below). The key takes effect immediately — no restart required.',
  },
];

export const APPLY_KEY_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# Option 1: Apply via REST API (takes effect immediately)' },
  { type: 'command', text: `curl -X POST http://localhost:8080/api/v1/license/key \\` },
  { type: 'output',  text: `  -H "X-API-Key: gph_..." -H "X-Tenant-ID: my-org" \\` },
  { type: 'output',  text: `  -H "Content-Type: application/json" \\` },
  { type: 'output',  text: `  -d '{"key":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."}'` },
  { type: 'success', text: '{"plan":"pro","features":[...],"limits":{"clusters":10,...}}' },
  { type: 'comment', text: '# Option 2: Apply via Helm values (persists across restarts)' },
  { type: 'command', text: 'helm upgrade graphon graphon/graphon \\' },
  { type: 'output',  text: '  --set backend.licenseKey="eyJ..."' },
  { type: 'comment', text: '# Check current license status (no auth required)' },
  { type: 'command', text: 'curl http://localhost:8080/api/v1/license' },
  { type: 'success', text: '{"plan":"pro","valid":true,"features":[...],"expiry":"2026-12-31"}' },
];

export const FREE_FEATURES_TABLE = [
  { feature: 'Live dependency graph',        free: true,    pro: true  },
  { feature: 'Service search',               free: true,    pro: true  },
  { feature: 'Ownership CRUD',               free: true,    pro: true  },
  { feature: 'Orphan & drift detection',     free: true,    pro: true  },
  { feature: 'Safe-delete analysis',         free: true,    pro: true  },
  { feature: 'Manual snapshots + diff',      free: true,    pro: true  },
  { feature: 'Export (Mermaid/DOT/SVG)',     free: true,    pro: true  },
  { feature: 'Slack governance alerts',      free: true,    pro: true  },
  { feature: 'REST API + API keys',          free: true,    pro: true  },
  { feature: 'Users',                        free: 'Up to 3', pro: 'Unlimited' },
  { feature: 'Snapshot retention',           free: '30 days', pro: 'Custom'    },
  { feature: 'OIDC/SSO',                     free: false,   pro: true  },
  { feature: 'RBAC (6 roles)',               free: false,   pro: true  },
  { feature: 'Scheduled snapshots (6h)',     free: false,   pro: true  },
  { feature: 'GitHub/GitLab PR comments',    free: false,   pro: true  },
  { feature: 'Draw.io export',              free: false,   pro: true  },
  { feature: 'Multi-cluster',               free: false,   pro: true  },
  { feature: 'ClickHouse telemetry',         free: false,   pro: true  },
  { feature: 'Connections (bytes_sent + bytes_recv)', free: false, pro: true },
  { feature: 'Logs (structured + raw)',      free: false,   pro: true  },
  { feature: 'Distributed traces (OTLP)',    free: false,   pro: true  },
  { feature: 'Prometheus metrics',           free: false,   pro: true  },
  { feature: 'Cost tracking',               free: false,   pro: true  },
  { feature: 'SLO engine',                  free: false,   pro: true  },
  { feature: 'Reliability scanner',         free: false,   pro: true  },
  { feature: 'Priority support',            free: false,   pro: true  },
];

// ── Helm Chart ─────────────────────────────────────────────────────────────

export const HELM_INSTALL_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# Minimal install (Free tier, all defaults)' },
  { type: 'command', text: 'helm upgrade --install graphon graphon/graphon \\' },
  { type: 'output',  text: '  --namespace graphon --create-namespace' },
  { type: 'comment', text: '# Pro install with OIDC + ClickHouse + license key' },
  { type: 'command', text: 'helm upgrade --install graphon graphon/graphon \\' },
  { type: 'output',  text: '  --namespace graphon --create-namespace \\' },
  { type: 'output',  text: '  --set backend.licenseKey=$GRAPHON_LICENSE_KEY \\' },
  { type: 'output',  text: '  --set backend.oidc.enabled=true \\' },
  { type: 'output',  text: '  --set backend.oidc.issuerURL=$OIDC_ISSUER_URL \\' },
  { type: 'output',  text: '  --set backend.oidc.clientID=$OIDC_CLIENT_ID \\' },
  { type: 'output',  text: '  --set backend.oidc.clientSecret=$OIDC_CLIENT_SECRET \\' },
  { type: 'output',  text: '  --set backend.rbac.enabled=true \\' },
  { type: 'output',  text: '  --set clickhouse.enabled=true \\' },
  { type: 'output',  text: '  --set agent.phase4.logsEnabled=true \\' },
  { type: 'output',  text: '  --set agent.phase4.otlpEnabled=true \\' },
  { type: 'output',  text: '  --set agent.phase4.prometheusEnabled=true' },
  { type: 'comment', text: '# Check running pods' },
  { type: 'command', text: 'kubectl get pods -n graphon' },
  { type: 'success', text: 'graphon-backend-xxx       1/1   Running' },
  { type: 'success', text: 'graphon-ui-xxx            1/1   Running' },
  { type: 'success', text: 'graphon-bpf-xxx           1/1   Running  (one per node)' },
  { type: 'success', text: 'graphon-clickhouse-xxx    1/1   Running' },
];

export interface HelmValue {
  key: string;
  default: string;
  description: string;
}

export const HELM_VALUES: readonly HelmValue[] = [
  { key: 'backend.image.tag',             default: 'latest',   description: 'graphon-backend image tag.'                                                },
  { key: 'backend.replicaCount',          default: '1',        description: 'Number of backend replicas.'                                               },
  { key: 'backend.licenseKey',            default: '""',       description: 'Pro license JWT. Leave empty for Free tier.'                               },
  { key: 'backend.authDisabled',          default: 'true',     description: 'Set false in production to enforce API-key auth.'                          },
  { key: 'backend.rbac.enabled',          default: 'false',    description: 'Enable RBAC permission enforcement.'                                       },
  { key: 'backend.oidc.enabled',          default: 'false',    description: 'Enable OIDC/SSO login.'                                                    },
  { key: 'backend.oidc.issuerURL',        default: '""',       description: 'OIDC provider discovery URL.'                                              },
  { key: 'backend.oidc.clientID',         default: '""',       description: 'OAuth2 client ID.'                                                         },
  { key: 'backend.oidc.clientSecret',     default: '""',       description: 'OAuth2 client secret (stored as K8s Secret).'                             },
  { key: 'backend.github.token',          default: '""',       description: 'GitHub PAT for posting PR impact comments.'                                },
  { key: 'backend.gitlab.token',          default: '""',       description: 'GitLab PAT for posting MR notes.'                                          },
  { key: 'backend.slack.webhookURL',      default: '""',       description: 'Slack incoming webhook URL for governance alerts.'                         },
  { key: 'agent.phase4.logsEnabled',      default: 'false',    description: 'Enable container log collection (requires ClickHouse).'                    },
  { key: 'agent.phase4.otlpEnabled',      default: 'false',    description: 'Enable OTLP/HTTP receiver on port 4318.'                                   },
  { key: 'agent.phase4.otlpPort',         default: '4318',     description: 'OTLP/HTTP listen port.'                                                    },
  { key: 'agent.phase4.prometheusEnabled',default: 'false',    description: 'Enable Prometheus pod scraping.'                                           },
  { key: 'costConfig.cloudProvider',      default: 'auto',     description: 'Cloud provider. auto|aws|gcp|azure|unknown.'                               },
  { key: 'costConfig.pricing.crossAZPerGB',default: '""',      description: 'Per-GB cross-AZ pricing override. Empty = use built-in defaults.'          },
  { key: 'costConfig.pricing.internetPerGB',default: '""',     description: 'Per-GB internet egress pricing override. Empty = use built-in defaults.'   },
  { key: 'costConfig.customCIDRs',        default: '[]',       description: 'Custom CIDR list with traffic_class and label. See docs.'                  },
  { key: 'scanConfig.disabledChecks',     default: '[]',       description: 'List of check names to globally disable.'                                  },
  { key: 'scanConfig.excludedNamespaces', default: '[kube-system, kube-public, kube-node-lease]', description: 'Namespaces excluded from all checks.'  },
  { key: 'scanConfig.excludedServices',   default: '[]',       description: 'Specific workload names to skip.'                                          },
  { key: 'scanConfig.ownerLabelKey',      default: 'app.graphon.io/owner-team', description: 'Label key used for ownership checks.'                     },
  { key: 'prometheusConfig.scrapeInterval',default:'30s',      description: 'Global Prometheus scrape interval.'                                        },
  { key: 'azConfig.nodeZoneMap',          default: '{}',       description: 'Static node→zone mapping when topology label is absent.'                   },
  { key: 'clickhouse.enabled',            default: 'false',    description: 'Deploy bundled ClickHouse.'                                                },
  { key: 'clickhouse.persistence.size',   default: '20Gi',     description: 'ClickHouse PVC size.'                                                      },
  { key: 'postgresql.enabled',            default: 'true',     description: 'Deploy bundled PostgreSQL sub-chart.'                                      },
  { key: 'postgresql.auth.password',      default: 'changeme', description: 'PostgreSQL password. Change before deploying to production.'               },
  { key: 'neo4j.enabled',                 default: 'true',     description: 'Deploy bundled Neo4j sub-chart.'                                           },
  { key: 'neo4j.auth.password',           default: 'changeme', description: 'Neo4j password. Change before deploying to production.'                    },
  { key: 'ingress.enabled',               default: 'false',    description: 'Expose the UI and backend via an Ingress resource.'                        },
  { key: 'ingress.hostname',              default: '""',       description: 'Hostname for the Ingress. e.g. graphon.mycompany.com'                      },
];
