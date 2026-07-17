import type { TerminalLine } from '../../components/terminal';
import { type LucideIcon, Network, ArrowLeftRight, AlertTriangle, Users, HelpCircle, Activity, DollarSign, Shield, Layers, HardDrive, Filter } from 'lucide-react';
import { ROUTES } from '../../config/routes';

export type { TerminalLine };

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface Mode {
  badge: string;
  title: string;
  desc: string;
  cta: string;
  ctaHref: string;
  highlight: boolean;
}

export interface Problem {
  icon: LucideIcon;
  q: string;
  a: string;
}

export const INSTALL_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# 1. Add the Helm repo' },
  { type: 'command', text: 'helm repo add graphon https://retr0-kernel.github.io/graphon-helm' },
  { type: 'command', text: 'helm repo update' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '# 2. Deploy to your cluster' },
  { type: 'command', text: 'helm install graphon graphon/graphon --namespace graphon --create-namespace' },
  { type: 'comment', text: '' },
  { type: 'output',  text: 'NAME: graphon' },
  { type: 'output',  text: 'STATUS: deployed' },
  { type: 'output',  text: 'REVISION: 1' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '# 3. Open the dashboard' },
  { type: 'command', text: 'kubectl port-forward svc/graphon-ui 3000:80 -n graphon' },
  { type: 'success', text: '✓  Visit http://localhost:3000' },
] as const;

export const FEATURES: readonly Feature[] = [
  {
    icon: Network,
    title: 'Live Dependency Graph',
    description: 'eBPF captures every TCP connection on every node. Your full service topology — always current, zero instrumentation.',
    color: 'text-primary',
  },
  {
    icon: HardDrive,
    title: 'Crash-Safe Spill Buffer',
    description: 'Batches that fail their HTTP POST land on disk with fsync. Replay on agent startup. No events lost across restarts.',
    color: 'text-secondary',
  },
  {
    icon: Filter,
    title: 'Edge & Node Sampler',
    description: 'Dampen hot edges and runaway pods with rate-limit + per-pod cap policies. First observation of any new edge always ships.',
    color: 'text-tertiary',
  },
  {
    icon: ArrowLeftRight,
    title: 'Drift Detection',
    description: 'Baseline your service dependencies and get alerted the moment an unexpected new connection appears.',
    color: 'text-[#ff9e64]',
  },
  {
    icon: AlertTriangle,
    title: 'Safe Delete Analysis',
    description: 'Before removing any workload, see every service that depends on it — across all namespaces and clusters.',
    color: 'text-primary',
  },
  {
    icon: Users,
    title: 'Ownership Discovery',
    description: 'Auto-map services to teams via Kubernetes pod labels. No spreadsheets, no manual updates.',
    color: 'text-secondary',
  },
  {
    icon: Activity,
    title: 'Distributed Tracing & Metrics',
    description: 'OTLP/HTTP receiver on port 4318. Scrape any Prometheus endpoint. Tail container logs. All stored in ClickHouse.',
    color: 'text-tertiary',
  },
  {
    icon: DollarSign,
    title: 'Egress Cost Tracking',
    description: 'Classify every byte as same-AZ, cross-AZ, or internet. See per-service cloud spend and where the money goes.',
    color: 'text-[#ff9e64]',
  },
] as const;

export const MODES: readonly Mode[] = [
  {
    badge: 'FREE',
    title: 'Self-Hosted',
    desc: 'Full live dependency graph, drift detection, safe-delete analysis, ownership discovery, and per-cluster snapshots. Apache-2.0 — runs entirely in your cluster, forever.',
    cta: 'Deploy Now',
    ctaHref: ROUTES.pricing,
    highlight: false,
  },
  {
    badge: 'PRO',
    title: 'Pro',
    desc: 'RBAC, OIDC SSO, GitHub/GitLab PR impact, distributed tracing (OTLP), Prometheus scraping, log collection, cross-AZ cost tracking, reliability scanner, SLO monitoring, and custom CIDR rules.',
    cta: 'Get a License',
    ctaHref: ROUTES.pricing,
    highlight: true,
  },
  {
    badge: 'COMING SOON',
    title: 'Graphon Cloud (Enterprise)',
    desc: 'Fully managed. We run the control plane, you run the agent on your cluster. Connect once and get the full dashboard without operating any infrastructure.',
    cta: 'Join Waitlist',
    ctaHref: ROUTES.pricing,
    highlight: false,
  },
] as const;

export const PROBLEMS: readonly Problem[] = [
  { icon: HelpCircle, q: '"Which services call payment-svc?"',          a: 'Impossible to answer from docs alone.' },
  { icon: HelpCircle, q: '"Is it safe to delete this deployment?"',     a: 'Unknown without tracing every dependent.' },
  { icon: HelpCircle, q: '"Where is our cloud egress cost coming from?"', a: 'No per-service visibility. Impossible to optimise.' },
] as const;
