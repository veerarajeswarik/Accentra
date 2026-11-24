import { QueryClient } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it, vi } from 'vitest';
import { SIDEBAR_STORAGE_KEY, findActiveItem } from './components/layout/WorkspaceLayout';
import { entrepreneurNav, flattenNav } from './components/layout/nav-config';
import { AppProviders } from './providers/AppProviders';
import { routes } from './router';

function renderAt(path: string) {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

const mainNav = () => screen.getByRole('navigation', { name: 'Main navigation' });

describe('workspace shell', () => {
  it('renders the entrepreneur sidebar with Part 4.3 group headings', async () => {
    renderAt('/app');
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' });
    for (const heading of ['Overview', 'Money', 'Records', 'Accountant', 'Assist', 'Settings']) {
      expect(within(nav).getAllByText(heading).length).toBeGreaterThan(0);
    }
    expect(within(nav).getAllByRole('link')).toHaveLength(flattenNav(entrepreneurNav).length);
  });

  it('navigates to an honest ComingSoon page with its planned phase', async () => {
    const router = renderAt('/app');
    await userEvent.click(
      within(await screen.findByRole('navigation', { name: 'Main navigation' })).getByRole('link', {
        name: 'Documents',
      }),
    );

    expect(router.state.location.pathname).toBe('/app/documents');
    expect(await screen.findByTestId('planned-phase')).toHaveProperty(
      'textContent',
      'Planned for Phase 8',
    );
    // No fake actions on placeholders.
    expect(within(screen.getByRole('main')).queryAllByRole('button')).toHaveLength(0);
  });

  it('switches sidebar labels with Simple / Professional mode', async () => {
    renderAt('/app/transactions');
    expect(
      within(await screen.findByRole('navigation', { name: 'Main navigation' })).getByRole('link', {
        name: 'Money In & Out',
      }),
    ).toBeDefined();

    await userEvent.click(screen.getByRole('radio', { name: 'Professional' }));

    expect(within(mainNav()).getByRole('link', { name: 'Transactions' })).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Transactions' })).toBeDefined();
  });

  it('collapses the sidebar to an icon rail and remembers it', async () => {
    renderAt('/app');
    await userEvent.click(await screen.findByRole('button', { name: 'Collapse sidebar' }));

    expect(window.localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe('true');
    // Labels are still available to assistive tech via aria-label.
    expect(within(mainNav()).getByRole('link', { name: 'Documents' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeDefined();
  });

  it('renders the CA and admin workspaces', async () => {
    renderAt('/ca/requests');
    expect(
      within(await screen.findByRole('navigation', { name: 'Main navigation' })).getByRole('link', {
        name: 'Requests & Invitations',
      }),
    ).toBeDefined();
    expect(screen.getByTestId('planned-phase').textContent).toBe('Planned for Phase 11');
  });

  it('shows a workspace 404 for unknown workspace paths', async () => {
    renderAt('/app/nope');
    expect(await screen.findByText('Page not found')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Go to home page' }).getAttribute('href')).toBe('/app');
  });
});

describe('public and auth routes', () => {
  it('renders public pages inside the PublicLayout', async () => {
    renderAt('/features');
    // Built in Phase 3 (lazy marketing chunk), no longer a placeholder.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Features' }, { timeout: 15_000 }),
    ).toBeDefined();
    expect(screen.queryByTestId('planned-phase')).toBeNull();
    expect(screen.getByRole('link', { name: 'Get started' }).getAttribute('href')).toBe(
      '/register',
    );
    expect(screen.getByRole('contentinfo', { name: 'Footer' })).toBeDefined();
  });

  it('renders auth pages inside the AuthLayout', async () => {
    renderAt('/login');
    expect(await screen.findByText('Sign in')).toBeDefined();
    expect(screen.getByTestId('planned-phase').textContent).toBe('Planned for Phase 4');
  });

  it('shows 404 for unknown public paths', async () => {
    renderAt('/definitely-not-a-page');
    expect(await screen.findByText('Page not found')).toBeDefined();
  });

  it('registers /dev/components in development', async () => {
    renderAt('/dev/components');
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: 'Component showcase' },
        { timeout: 15_000 },
      ),
    ).toBeDefined();
  });
});

describe('findActiveItem', () => {
  const items = flattenNav(entrepreneurNav);
  it.each([
    ['/app', 'dashboard'],
    ['/app/settings/business', 'business-profile'],
    ['/app/settings', 'settings'],
    ['/app/transactions/123', 'transactions'],
  ])('%s → %s', (path, id) => {
    expect(findActiveItem(items, path)?.id).toBe(id);
  });
});
