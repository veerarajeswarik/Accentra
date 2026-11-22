import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../test/render';
import { ApiStatus } from './ApiStatus';

describe('ApiStatus indicator', () => {
  it('shows live API and database status', async () => {
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

    renderWithProviders(<ApiStatus />);

    expect(screen.getByText(/Checking API health/)).toBeDefined();
    expect((await screen.findByTestId('db-status')).textContent).toBe('Database: up');
    expect(screen.getByText('API: ok')).toBeDefined();
  });

  it('shows an error state when the API is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    renderWithProviders(<ApiStatus />);

    expect((await screen.findByRole('alert')).textContent).toContain('API unreachable');
  });
});
