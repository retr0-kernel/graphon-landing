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
  cycle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const ORDER: ThemePreference[] = ['dark', 'system', 'light'];
const STORAGE_KEY = 'graphon-theme';

function resolve(pref: ThemePreference): ResolvedTheme {
  if (pref === 'system')
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  return pref;
}

function apply(pref: ThemePreference) {
  const theme = resolve(pref);
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? 'dark',
  );
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolve(preference));

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    localStorage.setItem(STORAGE_KEY, p);
    apply(p);
    setResolved(resolve(p));
  };

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
    setPreference(next);
  };

  useEffect(() => {
    apply(preference);
    setResolved(resolve(preference));

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (preference === 'system') {
        apply('system');
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
