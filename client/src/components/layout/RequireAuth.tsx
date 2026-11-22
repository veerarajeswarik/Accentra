import type { ReactNode } from 'react';

/**
 * PLACEHOLDER route guard — currently renders its children for everyone.
 * TODO(Phase 4): redirect to /login when not signed in, and check the user's role
 * (entrepreneur → /app, ca → /ca, admin → /admin). The SERVER still enforces every
 * permission; this guard only improves navigation.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
