import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiClient';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Retry network/server hiccups, but never 4xx errors (they will not fix themselves).
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
      },
    },
  });
}
