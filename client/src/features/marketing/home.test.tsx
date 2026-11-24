import { QueryClient } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../providers/AppProviders';
import { routes } from '../../router';

async function renderHome() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  render(
    <AppProviders queryClient={new QueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  await screen.findByRole('heading', { level: 1 }, { timeout: 15_000 });
  return router;
}

describe('Home page', () => {
  it('has one h1 (≤ 10 words), the CTAs, and a page title', async () => {
    await renderHome();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]!.textContent!.split(/\s+/).length).toBeLessThanOrEqual(10);

    const hero = within(screen.getByRole('region', { name: h1s[0]!.textContent! }));
    expect(hero.getByRole('link', { name: /Get started free/ }).getAttribute('href')).toBe(
      '/register',
    );
    expect(hero.getByRole('link', { name: 'See how it works' }).getAttribute('href')).toBe(
      '/how-it-works',
    );
    expect(document.title).toBe('Accentra');
  });

  it('links each audience CTA with its role', async () => {
    await renderHome();
    expect(
      screen.getByRole('link', { name: 'Start as an entrepreneur' }).getAttribute('href'),
    ).toBe('/register?role=entrepreneur');
    expect(screen.getByRole('link', { name: 'Start as a CA' }).getAttribute('href')).toBe(
      '/register?role=ca',
    );
  });

  it('labels the product preview as sample data and keeps it out of the tab order', async () => {
    await renderHome();
    const preview = screen.getByRole('img', { name: /sample numbers/ });
    expect(preview.querySelector('[inert]')).not.toBeNull();
  });

  it('walks through the review workflow with the keyboard', async () => {
    await renderHome();
    const steps = screen.getByRole('tablist', { name: 'Review workflow steps' });
    const tabs = within(steps).getAllByRole('tab');
    expect(tabs).toHaveLength(5);

    tabs[0]!.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');

    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText('Needs clarification')).toBeDefined();
    expect(within(panel).getByText('Please attach the October rent agreement.')).toBeDefined();
  });

  it('switches the mode demo labels using the real terminology map', async () => {
    await renderHome();
    const modes = document.getElementById('modes')!;
    expect(within(modes).getByText('Bills to Pay')).toBeDefined();

    await userEvent.click(within(modes).getByRole('radio', { name: 'Professional' }));

    expect(within(modes).getByText('Accounts Payable')).toBeDefined();
  });

  it('answers honestly that Accentra does not file GST returns', async () => {
    await renderHome();
    await userEvent.click(
      screen.getByRole('button', { name: 'Does Accentra file my GST returns?' }),
    );
    expect(screen.getByText(/No, not currently/)).toBeDefined();
    expect(within(document.getElementById('faq')!).getAllByRole('button')).toHaveLength(8);
  });

  it('marks upcoming features as Coming soon', async () => {
    await renderHome();
    const upcoming = document.getElementById('upcoming')!;
    expect(within(upcoming).getAllByText('Coming soon')).toHaveLength(4);
  });
});
