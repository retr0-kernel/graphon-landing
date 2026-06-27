import type { TerminalLine } from '../../components/terminal';
import { ROUTES } from '../../config/routes';

export type { TerminalLine };

export interface Feature {
  icon: string;
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
  icon: string;
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
    icon: 'account_tree',
    title: 'Live Dependency Graph',
    description: 'eBPF traces every TCP/UDP connection. Your service topology is always current — no agents, no sidecars.',
    color: 'text-primary',
  },
  {
    icon: 'compare_arrows',
    title: 'Drift Detection',
    description: 'Compare snapshots across time. Know exactly when a service started talking to a new endpoint.',
    color: 'text-secondary',
  },
  {
    icon: 'warning',
    title: 'Safe Delete Analysis',
    description: 'Before removing a workload, Graphon shows you every service that depends on it.',
    color: 'text-[#ff9e64]',
  },
  {
    icon: 'manage_accounts',
    title: 'Ownership Discovery',
    description: 'Auto-detect team ownership from pod labels. No manual spreadsheet maintenance.',
    color: 'text-tertiary',
  },
] as const;

export const MODES: readonly Mode[] = [
  {
    badge: 'FREE',
    title: 'Self-Hosted',
    desc: 'Full dependency graph, drift detection, and ownership discovery. Runs entirely in your cluster.',
    cta: 'Deploy Now',
    ctaHref: ROUTES.pricing,
    highlight: false,
  },
  {
    badge: 'ENTERPRISE',
    title: 'Enterprise',
    desc: 'RBAC, SSO/OIDC, GitHub & GitLab PR impact analysis, graph snapshots, and multi-cluster support.',
    cta: 'Get a License',
    ctaHref: ROUTES.pricing,
    highlight: true,
  },
  {
    badge: 'COMING SOON',
    title: 'Graphon Cloud',
    desc: 'Fully managed. Connect your cluster once and get the full dashboard without operating anything.',
    cta: 'Join Waitlist',
    ctaHref: ROUTES.pricing,
    highlight: false,
  },
] as const;

export const PROBLEMS: readonly Problem[] = [
  { icon: 'help', q: '"Which services call payment-svc?"',     a: 'Impossible to answer from docs alone.' },
  { icon: 'help', q: '"Is it safe to delete this deployment?"', a: 'Unknown without tracing every dependent.' },
  { icon: 'help', q: '"What changed since last Tuesday?"',      a: 'No baseline. No diff. No answer.' },
] as const;
