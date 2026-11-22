import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

/**
 * Simple mode uses everyday words ("Money In"); Professional mode uses accounting terms
 * ("Revenue"). Mode changes LABELS only — never numbers or behaviour.
 */
export type AppMode = 'simple' | 'professional';

export const MODE_STORAGE_KEY = 'accentra-mode';

interface ModeContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

function readStoredMode(): AppMode {
  return readStorage(MODE_STORAGE_KEY) === 'professional' ? 'professional' : 'simple';
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(readStoredMode);

  const setMode = useCallback((next: AppMode) => {
    setModeState(next);
    writeStorage(MODE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used inside <ModeProvider>');
  return context;
}
