import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { readStorage, writeStorage } from '../lib/storage';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/** Must match the key read by the pre-mount script in client/index.html. */
export const THEME_STORAGE_KEY = 'accentra-theme';
const THEMES: readonly ThemePreference[] = ['light', 'dark', 'system'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
  /** What the user chose. */
  theme: ThemePreference;
  /** What is actually applied ("system" resolved via the OS setting). */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemePreference {
  const stored = readStorage(THEME_STORAGE_KEY);
  return THEMES.includes(stored as ThemePreference) ? (stored as ThemePreference) : 'system';
}

function subscribeToSystemTheme(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Hook point called whenever the user changes the theme.
   * TODO(Phase 4/5): once logged in, sync to users.themePreference via the API
   * so the theme follows the user across devices (DESIGN_SYSTEM.md 5.12).
   */
  onThemeChange?: (theme: ThemePreference) => void;
}

export function ThemeProvider({ children, onThemeChange }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredTheme);
  // Re-renders automatically when the OS switches between light and dark.
  const prefersDark = useSyncExternalStore(subscribeToSystemTheme, systemPrefersDark);
  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setThemeState(next);
      writeStorage(THEME_STORAGE_KEY, next);
      onThemeChange?.(next);
    },
    [onThemeChange],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
