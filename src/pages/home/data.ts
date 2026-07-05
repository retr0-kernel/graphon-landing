import type { TerminalLine } from '../../components/terminal';
import { type LucideIcon, Network, ArrowLeftRight, AlertTriangle, Users, HelpCircle, Activity, DollarSign, Shield, Layers } from 'lucide-react';
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
    icon: ArrowLeftRight,
    title: 'Drift Detection',
    description: 'Baseline your service dependencies and get alerted the moment an unexpected new connection appears.',
    color: 'text-secondary',
  },
  {
    icon: AlertTriangle,
    title: 'Safe Delete Analysis',
    description: 'Before removing any workload, see every service that depends on it — across all namespaces and clusters.',
    color: 'text-[#ff9e64]',
  },
  {
    icon: Users,
    title: 'Ownership Discovery',
    description: 'Auto-map services to teams via Kubernetes pod labels. No spreadsheets, no manual updates.',
    color: 'text-tertiary',
  },
  {
    icon: Activity,
    title: 'Distributed Tracing & Metrics',
    description: 'OTLP/HTTP receiver built into the agent. Scrape any Prometheus endpoint. Tail container logs. All stored in ClickHouse.',
    color: 'text-primary',
  },
  {
    icon: DollarSign,
    title: 'Egress Cost Tracking',
    description: 'Classify every byte as same-AZ, cross-AZ, or internet. See per-service cloud spend and where the money goes.',
    color: 'text-secondary',
  },
  {
    icon: Shield,
    title: 'Reliability Scanner',
    description: '13 automated checks on your Deployments, StatefulSets, DaemonSets, and CronJobs. Findings with remediation guidance.',
    color: 'text-[#ff9e64]',
  },
  {
    icon: Layers,
    title: 'SLO Monitoring',
    description: 'Define availability and latency objectives per service. Track error budget burn rate and get alerted before SLOs breach.',
    color: 'text-tertiary',
  },
] as const;

export const MODES: readonly Mode[] = [
  {
    badge: 'FREE',
    title: 'Self-Hosted',
    desc: 'Full dependency graph, drift detection, ownership discovery, OIDC SSO, RBAC, and GitHub/GitLab PR impact analysis. Runs entirely in your cluster.',
    cta: 'Deploy Now',
    ctaHref: ROUTES.pricing,
    highlight: false,
  },
  {
    badge: 'PRO',
    title: 'Pro',
    desc: 'Distributed tracing (OTLP), Prometheus scraping, log collection, cross-AZ cost tracking, reliability scanner, SLO monitoring, and custom CIDR rules.',
    cta: 'Get a License',
    ctaHref: ROUTES.pricing,
    highlight: true,
  },
  {
    badge: 'COMING SOON',
    title: 'Graphon Cloud',
    desc: 'Fully managed. Connect your cluster once and get the full dashboard without operating any infrastructure.',
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
