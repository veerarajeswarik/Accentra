/**
 * localStorage access that never throws (storage can be blocked by privacy settings,
 * full, or unavailable). Use only for UI preferences — never for tokens or secrets.
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preference simply won't persist; the app keeps working.
  }
}
