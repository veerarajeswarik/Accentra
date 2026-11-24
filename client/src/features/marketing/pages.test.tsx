import { QueryClient } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../providers/AppProviders';
import { routes } from '../../router';
import { FEATURES, featureStatus } from './featureStatus';

async function renderAt(path: string, h1: string | RegExp) {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
  render(
    <AppProviders queryClient={new QueryClient()}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
    </AppProviders>,
  );
  await screen.findByRole('heading', { level: 1, name: h1 }, { timeout: 15_000 });
}

describe('public pages', () => {
  it.each([
    ['/features', 'Features', 'Features · Accentra'],
    ['/how-it-works', 'How it works', 'How it works · Accentra'],
    ['/about', 'About Accentra', 'About Accentra · Accentra'],
    ['/contact', 'Contact us', 'Contact us · Accentra'],
    ['/privacy', 'Privacy policy', 'Privacy policy · Accentra'],
    ['/terms', 'Terms of service', 'Terms of service · Accentra'],
  ])('%s renders its page and sets the document title', async (path, h1, title) => {
    await renderAt(path, h1);
    expect(document.title).toBe(title);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBeTruthy();
  });

  it('features page labels come from featureStatus', async () => {
    await renderAt('/features', 'Features');
    for (const feature of FEATURES) {
      const card = screen.getByTestId(`feature-${feature.id}`);
      const expected = featureStatus(feature) === 'available' ? 'Available' : 'Coming soon';
      expect(within(card).getByText(expected)).toBeDefined();
    }
  });

  it('how it works switches between the entrepreneur and CA flows', async () => {
    await renderAt('/how-it-works', 'How it works');
    expect(screen.getByText('Create your business')).toBeDefined();
    await userEvent.click(screen.getByRole('tab', { name: 'For CAs' }));
    expect(screen.getByText('Accept client invitations')).toBeDefined();
  });

  it.each(['/privacy', '/terms'])(
    '%s shows the draft / pending legal review banner',
    async (path) => {
      await renderAt(path, /Privacy policy|Terms of service/);
      expect(screen.getByRole('note').textContent).toMatch(/Draft — pending legal review/);
    },
  );

  it('privacy policy mentions DPDP as intended alignment, not compliance', async () => {
    await renderAt('/privacy', 'Privacy policy');
    expect(
      screen.getByText(/intend to align with India's Digital Personal Data Protection Act/),
    ).toBeDefined();
    expect(document.body.textContent).not.toMatch(/\bis compliant\b|\bcertified\b/i);
  });

  it('about page shows a clearly marked TODO instead of a made-up founder', async () => {
    await renderAt('/about', 'About Accentra');
    expect(screen.getByText('To be added')).toBeDefined();
  });
});

describe('featureStatus', () => {
  it('is Available only once its phase is completed', () => {
    expect(featureStatus({ phase: 7 }, 6)).toBe('coming_soon');
    expect(featureStatus({ phase: 7 }, 7)).toBe('available');
    expect(featureStatus({ phase: 7 }, 9)).toBe('available');
  });
});
