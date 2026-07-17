import { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import styles from './Mermaid.module.css';

interface MermaidProps {
  source: string;
}

/**
 * Resolve a CSS custom property to a value Mermaid can parse.
 *
 * The landing page stores colours as raw RGB triplets (e.g. `221 184 255`) in
 * CSS variables so Tailwind can apply opacity via `<alpha-value>`. Mermaid's
 * `classDef` parser rejects bare triplets — it wants `#rrggbb`, `rgb(r,g,b)`,
 * `hsl(h,s,l)`, or a named colour. This helper normalises the value.
 */
function getCssColor(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallback;

  // Raw RGB triplet: "221 184 255" or "221 184 255 / 0.4"
  const tripletMatch = raw.match(
    /^([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?$/,
  );
  if (tripletMatch) {
    const [, r, g, b, a] = tripletMatch;
    if (a !== undefined) {
      // Convert to rgba()
      const alpha = a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Already a valid CSS colour (hex, rgb(), hsl(), named) — pass through.
  return raw;
}

let mermaidInitialized = false;

function buildThemeVariables() {
  return {
    // Surfaces
    background: getCssColor('--c-bg', '#131316'),
    primaryColor: getCssColor('--c-sc', '#1f1f22'),
    primaryBorderColor: getCssColor('--c-outline-v', '#3b494c'),
    primaryTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    secondaryColor: getCssColor('--c-sc-high', '#2a2a2d'),
    secondaryBorderColor: getCssColor('--c-outline-v', '#3b494c'),
    secondaryTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    tertiaryColor: getCssColor('--c-sc-low', '#1b1b1e'),
    tertiaryBorderColor: getCssColor('--c-outline-v', '#3b494c'),
    tertiaryTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    // Lines + arrows
    lineColor: getCssColor('--c-secondary', '#ddb8ff'),
    arrowheadColor: getCssColor('--c-secondary', '#ddb8ff'),
    // Text
    noteBkgColor: getCssColor('--c-sc-high', '#2a2a2d'),
    noteTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    noteBorderColor: getCssColor('--c-outline-v', '#3b494c'),
    // Sequence/flow extras
    actorBkg: getCssColor('--c-sc', '#1f1f22'),
    actorBorder: getCssColor('--c-outline-v', '#3b494c'),
    actorTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    actorLineColor: getCssColor('--c-outline', '#849396'),
    signalColor: getCssColor('--c-on-surface', '#e4e1e6'),
    signalTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    labelBoxBkgColor: getCssColor('--c-sc', '#1f1f22'),
    labelBoxBorderColor: getCssColor('--c-outline-v', '#3b494c'),
    labelTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    loopTextColor: getCssColor('--c-on-surface', '#e4e1e6'),
    // Typography
    fontFamily: 'inherit',
    fontSize: '13px',
  };
}

function readResolvedTheme(): 'dark' | 'light' {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'light'
    : 'dark';
}

export function Mermaid({ source }: MermaidProps) {
  const rawId = useId();
  // Mermaid ids must be alphanumeric + underscore only (colons break mermaid.render).
  const stableId = rawId.replace(/[^a-zA-Z0-9_]/g, '_');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let renderId = 0;

    async function render() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      setError(null);

      // Bump the render id so a slow render from the previous theme
      // can never overwrite the current one.
      const myRender = ++renderId;
      const uniqueId = `mmd-${stableId}-${myRender}`;

      try {
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'strict',
            themeVariables: buildThemeVariables(),
          });
          mermaidInitialized = true;
        }

        const { svg } = await mermaid.render(uniqueId, source.trim());
        if (cancelled || myRender !== renderId || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (!cancelled && myRender === renderId) setError(message);
      }
    }

    render();

    // Re-render when the page theme changes so diagrams stay in sync.
    const observer = new MutationObserver(() => {
      // Reset initialization so a fresh themeVariables pass takes effect.
      mermaidInitialized = false;
      render();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [source, stableId]);

  if (error) {
    return (
      <div className={styles.errorWrap} role="alert">
        <span className={styles.errorBadge}>Mermaid error</span>
        <pre className={styles.errorSource}>{source}</pre>
        <span className={styles.errorMessage}>{error}</span>
      </div>
    );
  }

  return <div ref={containerRef} className={styles.diagram} aria-label="Diagram" />;
}
