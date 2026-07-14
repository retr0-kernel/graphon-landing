import { useEffect, useRef, useState } from 'react';

export function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);

    // Right after a client-side route change, IntersectionObserver's first
    // callback can be delayed on some mobile browsers until layout settles —
    // leaving content that's already on-screen stuck at opacity: 0 until a
    // scroll/resize forces recalculation. Manually check post-paint so
    // already-in-view elements reveal immediately without needing a nudge.
    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visibleFraction = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (rect.height > 0 && visibleFraction / rect.height >= threshold) {
        setVisible(true);
      }
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return { ref, visible };
}
