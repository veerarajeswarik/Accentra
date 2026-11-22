import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { TooltipProvider } from '../components/ui/Tooltip';
import { ModeProvider } from './ModeProvider';
import { ThemeProvider } from './ThemeProvider';

/** Every app-wide provider, in one place. Used by main.tsx and by tests. */
export function AppProviders({
  queryClient,
  children,
}: {
  queryClient: QueryClient;
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <ModeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </QueryClientProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}
