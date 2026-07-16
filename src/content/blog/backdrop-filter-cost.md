---
title: "backdrop-filter: blur is beautiful and expensive — use it wisely"
excerpt: "One CSS property caused our entire browser to lag — not just the tab, the URL bar and the OS window chrome. Here is what happens under the hood and how to fix it."
date: 2026-07-16
author: "Aryan Ranjan"
avatar: "assets/images/photo1.webp"
tags: ["CSS", "Performance", "Frontend", "Engineering"]
reading_minutes: 4
---

Here is a fun way to destroy your app's GPU performance with one line of CSS:

```css
.card {
  backdrop-filter: blur(18px);
}
```

It looks incredible. It also nearly broke our product.

---

## What `backdrop-filter` actually does

When the browser sees `backdrop-filter`, it has to do something unusual: capture the pixels *behind* the element before painting the element itself.

For a static background, this is cheap. The browser captures once, blurs once, composites once.

For an animated background — like, say, hundreds of animated SVG edges — it has to do this *every frame*. For *every card* that sits on top of those edges.

Our service map had:
- Hundreds of nodes, each rendered as a card with `backdrop-filter: blur(18px)`
- Every edge animated with a `stroke-dashoffset` keyframe at 60 fps

The browser was capturing, blurring, and compositing every card region, on every frame, for every edge animation tick. That is a combinatorial explosion of GPU work happening 60 times a second.

---

## How we noticed it was the GPU, not JavaScript

React DevTools showed no long tasks. The flame chart was clean. JavaScript was fine.

But the browser chrome was sluggish — the URL bar, the tab bar, even the OS window title bar. That is the giveaway.

JavaScript cannot lag browser chrome. Those elements run on the browser's compositor thread, not the JavaScript thread. Only one thing makes the compositor lag: **GPU exhaustion**. The GPU was saturated by our CSS, and the browser compositor — which renders the URL bar using the same GPU — was losing the fight for resources.

Open the DevTools Rendering panel → **GPU raster** to see this. You will not find it in the JavaScript flame chart.

---

## The fix: stop animating behind it

There are three ways out, depending on your constraints:

**Option 1: Remove `backdrop-filter` entirely.**
The most effective fix. Use a solid or semi-transparent background instead. Your glass UI becomes opaque glass, but the browser compositor becomes instant.

**Option 2: Pause the animations behind it.**
If you need both effects, pause the background animations when they are not adding value. We pause edge animations after 1.5 seconds of inactivity:

```css
.idle .react-flow__edge-path {
  animation-play-state: paused;
}
```

When the edges are paused, `backdrop-filter` costs nothing — there is nothing changing behind the cards.

**Option 3: `contain: strict` on the animated layer.**
Add CSS containment to the layer that is animating. This tells the browser not to let repaints leak outside the layer boundary. In practice, the compositor can sometimes avoid re-capturing the backdrop if it knows the animated area cannot affect what is visible behind the card. Results vary by browser.

---

## The rule

`backdrop-filter` is safe on static or rarely-changing backgrounds. It is expensive proportional to:

- The size of the blurred area
- The number of elements with `backdrop-filter` simultaneously
- How frequently the pixels *behind* those elements change

If anything animated sits behind your blurred elements, you are paying a continuous GPU cost. The bigger the graph, the more edges, the more cards — the higher the cost.

Use it. It looks great. But pair it with animation pausing or you will hear about it from users on the other side of the world asking why clicking your app's URL bar feels slow.

— *Aryan Ranjan — the Graphon team*
