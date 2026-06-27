import type { TerminalLine } from '../../components/terminal';

export type { TerminalLine };

export interface Component {
  icon: string;
  title: string;
  color: string;
  description: string;
}

export interface TimelineItem {
  time: string;
  label: string;
}

export interface SchemaTable {
  table: string;
  cols: readonly string[];
}

export const EVENTS_LINES: readonly TerminalLine[] = [
  { type: 'comment', text: '# Kernel event captured by eBPF probe' },
  { type: 'output',  text: '{ "src": "payment-svc:8080", "dst": "postgres:5432",' },
  { type: 'output',  text: '  "proto": "TCP", "op": "connect", "ns": "payments" }' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '# Sent to backend over gRPC' },
  { type: 'output',  text: 'POST /api/events  →  200 OK  (3ms)' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '# Graph edge upserted in Neo4j' },
  { type: 'success', text: 'MERGE (a:Service {name:"payment-svc"})-[:CALLS]->(b:Service {name:"postgres"})' },
] as const;

export const COMPONENTS: readonly Component[] = [
  {
    icon: 'bug_report',
    title: 'graphon-bpf',
    color: 'text-primary',
    description: 'eBPF probe DaemonSet. Runs one pod per node with CAP_BPF and CAP_NET_ADMIN. Hooks into kprobe/tcp_connect, accept, and close syscalls.',
  },
  {
    icon: 'dns',
    title: 'graphon-backend',
    color: 'text-secondary',
    description: 'Go/Fiber HTTP API. Receives events over REST, stores metadata in PostgreSQL, writes graph edges to Neo4j, enforces RBAC/OIDC, and dispatches webhook analysis.',
  },
  {
    icon: 'storage',
    title: 'PostgreSQL',
    color: 'text-tertiary',
    description: 'Primary relational store. Holds cluster registry, users, OIDC sessions, graph snapshots, audit events, and ownership records. Full-text search via tsvector.',
  },
  {
    icon: 'hub',
    title: 'Neo4j',
    color: 'text-[#ff9e64]',
    description: 'Graph database. Stores service nodes and directed CALLS edges. Powers dependency traversal, blast-radius queries, and safe-delete checks via Cypher.',
  },
  {
    icon: 'web',
    title: 'graphon-ui',
    color: 'text-primary',
    description: 'React (Vite) SPA served from inside the cluster. Renders the live graph with @xyflow/react, review panels, settings, and the ownership overlay.',
  },
  {
    icon: 'schedule',
    title: 'Scheduler',
    color: 'text-secondary',
    description: 'In-process background ticker. Runs governance jobs: scheduled snapshot capture, orphan detection, cluster heartbeat. Enterprise-only jobs gated by license feature flags.',
  },
] as const;

export const TIMELINE: readonly TimelineItem[] = [
  { time: '~0 ms',   label: 'eBPF probe fires on kernel tcp_connect/accept syscall' },
  { time: '< 1 ms',  label: 'Event serialised to JSON, sent to backend over HTTP' },
  { time: '< 5 ms',  label: 'Backend persists to PostgreSQL, upserts Neo4j edge' },
  { time: '< 50 ms', label: 'UI polls /api/graph — new edge rendered in browser' },
] as const;

export const SCHEMA_TABLES: readonly SchemaTable[] = [
  { table: 'clusters',        cols: ['id', 'tenant_id', 'display_name', 'region', 'last_seen', 'metadata'] },
  { table: 'users',           cols: ['id', 'tenant_id', 'email', 'role', 'created_at'] },
  { table: 'sessions',        cols: ['id', 'user_id', 'token_hash', 'expires_at', 'created_at'] },
  { table: 'graph_snapshots', cols: ['id', 'cluster_id', 'label', 'description', 'graph_json', 'captured_at'] },
  { table: 'events',          cols: ['id', 'tenant_id', 'cluster_id', 'type', 'payload', 'ts'] },
  { table: 'ownership',       cols: ['service', 'namespace', 'team', 'labels', 'updated_at'] },
] as const;
