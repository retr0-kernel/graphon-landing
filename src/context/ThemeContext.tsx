import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeCtx {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
  cycle: (originX?: number, originY?: number) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const ORDER: ThemePreference[] = ['dark', 'system', 'light'];
const STORAGE_KEY = 'graphon-theme';
const THEME_TRANSITION_MS = 1100;

function resolve(pref: ThemePreference): ResolvedTheme {
  if (pref === 'system')
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  return pref;
}

function applyDOM(pref: ThemePreference) {
  const theme = resolve(pref);
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function apply(pref: ThemePreference, originX?: number, originY?: number, animate = true) {
  const x = originX ?? window.innerWidth / 2;
  const y = originY ?? window.innerHeight / 2;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip animation on initial load or when not supported
  if (!animate || reduceMotion) {
    applyDOM(pref);
    return;
  }

  // Pin the curl pivot to the button position as a % of the viewport
  const xPct = `${((x / window.innerWidth) * 100).toFixed(1)}%`;
  const yPct = `${((y / window.innerHeight) * 100).toFixed(1)}%`;
  document.documentElement.style.setProperty('--vt-x', xPct);
  document.documentElement.style.setProperty('--vt-y', yPct);
  document.documentElement.classList.add('theme-transitioning');

  if (!('startViewTransition' in document)) {
    applyDOM(pref);
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, THEME_TRANSITION_MS);
    return;
  }

  const transition = (document as any).startViewTransition(() => applyDOM(pref));
  transition.finished.finally(() => {
    document.documentElement.classList.remove('theme-transitioning');
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? 'dark',
  );
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolve(preference));

  const setPreference = (p: ThemePreference, originX?: number, originY?: number) => {
    setPreferenceState(p);
    localStorage.setItem(STORAGE_KEY, p);
    apply(p, originX, originY);
    setResolved(resolve(p));
  };

  const cycle = (originX?: number, originY?: number) => {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
    setPreference(next, originX, originY);
  };

  useEffect(() => {
    apply(preference, undefined, undefined, false); // no animation on mount/reload
    setResolved(resolve(preference));

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (preference === 'system') {
        apply('system', undefined, undefined, false); // no animation on OS preference change
        setResolved(resolve('system'));
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  return (
    <Ctx.Provider value={{ preference, resolved, setPreference, cycle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
