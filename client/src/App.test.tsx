import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('temporary health page', () => {
  it('shows live health status and a sample amount from the shared package', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: { status: 'ok', db: 'up', version: '0.1.0', time: new Date().toISOString() },
          }),
          { status: 200 },
        ),
      ),
    );

    renderApp();

    expect(screen.getByText(/Checking API health/)).toBeDefined();
    expect((await screen.findByTestId('api-status')).textContent).toBe('ok');
    expect(screen.getByTestId('db-status').textContent).toBe('up');
    expect(screen.getByTestId('sample-amount').textContent).toBe('₹1,23,456.78');
  });

  it('shows an error state when the API is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    renderApp();

    expect((await screen.findByRole('alert')).textContent).toContain('API unreachable');
  });
});
