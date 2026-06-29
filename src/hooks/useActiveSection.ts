import { useEffect, useState } from 'react';

/**
 * Tracks which section ID is currently most visible in the viewport.
 * Used by the docs sidebar to highlight the active anchor.
 */
export function useActiveSection(ids: string[], rootMargin = '-20% 0px -60% 0px') {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first entry that is intersecting
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}
