import { useCallback, useSyncExternalStore } from 'react';

/** True while the CSS media query matches; re-renders when it changes. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}

/** Breakpoints from DESIGN_SYSTEM.md 5.9. */
export const BELOW_MD = '(max-width: 767.98px)';
export const BELOW_LG = '(max-width: 1023.98px)';
