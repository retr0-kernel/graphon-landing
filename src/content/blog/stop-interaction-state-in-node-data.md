---
title: "Stop putting interaction state in your React node data"
excerpt: "We wrapped every node in React.memo. We still had hundreds of re-renders on every click. The problem was not memo — it was where we stored selected and dimmed."
date: 2026-07-16
author: "Aryan Ranjan"
avatar: "assets/images/photo1.webp"
tags: ["React", "Performance", "React Flow", "State Management"]
reading_minutes: 4
---

`React.memo` wraps your component. It checks: did any props change? If not, skip the render. Simple, powerful, and — when you make this one mistake — completely useless.

The mistake: putting interaction state inside the data you pass to each node.

---

## What we were doing

We had a graph with hundreds of nodes. Each node was a `React.memo` component. We were proud of this. We had done the right thing.

But every time the user clicked a node, every card in the graph re-rendered.

Here is why. We were computing selection and dimming state inside the `flowNodes` array:

```typescript
const flowNodes = useMemo(() => {
  return visibleNodes.map(node => ({
    id: node.id,
    position: positions.get(node.id),
    data: {
      ...node,
      selected: node.id === selectedNodeId,   // 👈 changes on every click
      dimmed: !highlightedIds.has(node.id),   // 👈 changes on every click
    },
  }));
}, [visibleNodes, positions, selectedNodeId, highlightedIds]); // 👈 selectedNodeId is a dep
```

Every click changes `selectedNodeId`. `selectedNodeId` is a dependency of the memo. The memo reruns. Every node gets a new `data` object. `React.memo` sees new props on every card. Every card re-renders.

We were doing O(n) work for an O(1) user action.

---

## Why `React.memo` couldn't save us

`React.memo` compares props with shallow equality. It compares references, not deep values.

`data: { ...node, selected: true }` is a new object on every render — even if the values inside it are identical. Spread always creates a new reference.

So `React.memo` did its job correctly. It checked the props. The `data` prop had a new reference. It re-rendered. Every time.

We had built an elaborate system that reliably defeated its own optimization on every interaction.

---

## The fix: move interaction state outside node data

The core insight is this: **if a field in `data` can change during user interaction, `React.memo` on that node is useless**.

Move interaction state to a Zustand store. Let each card subscribe to exactly its own slice:

```typescript
// store
export const useGraphInteractionStore = create(set => ({
  selectedNodeId: null,
  highlightedNodeIds: new Set(),
  selectNode: id => set({ selectedNodeId: id }),
}));

// inside the node component
const isSelected = useGraphInteractionStore(
  s => s.selectedNodeId === data.id || s.highlightedNodeIds.has(data.id)
);
```

When you click a node:

1. Zustand updates `selectedNodeId`
2. Each card's selector re-evaluates: `s.selectedNodeId === data.id`
3. Only the cards where this value *actually changed* re-render

That is 2–3 re-renders instead of hundreds. The `flowNodes` memo doesn't even run — `selectedNodeId` is no longer in its dependency array.

---

## The `onSelect` trap

We also had an `onSelect` callback inside `data`:

```typescript
data: {
  ...node,
  onSelect: (id: string) => setSelectedNodeId(id), // 👈 new function on every render
}
```

Inline arrow functions create a new reference on every render. `React.memo` sees a new `onSelect`, re-renders, generates a new `onSelect`, and so on.

React Flow already provides `onNodeClick` at the `<ReactFlow>` level. Use that. Remove `onSelect` from `data` entirely. It was handling the same click twice and destroying memoization in the process.

---

## The rule

Node `data` should contain only what is needed to **render the static appearance** of the node:

- ID, name, display name, type
- Connection counts (not arrays — just numbers)
- Overlay data (error rates, latency)

Node `data` should never contain:

- `selected` — put it in a store, derive it with a selector
- `dimmed` — same
- `highlighted` — same
- `onSelect`, `onClick`, `onHover` — use React Flow's graph-level event props

The moment any field in `data` depends on which node the user has clicked, your `React.memo` is a no-op.

---

## Before and after

**Before:** click a node → `flowNodes` memo reruns → 500 new `data` objects → `React.memo` sees 500 new props → 500 re-renders.

**After:** click a node → Zustand writes `selectedNodeId` → 2 selectors change value → 2 re-renders.

Same visual result. Two hundred and fifty times fewer renders.

`React.memo` works. You just have to stop giving it new objects to compare.

— *Aryan Ranjan — the Graphon team*
