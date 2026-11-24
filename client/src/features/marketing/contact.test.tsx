import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../providers/AppProviders';
import { routes } from '../../router';

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function renderContact(fetchImpl: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetchImpl);
  const router = createMemoryRouter(routes, { initialEntries: ['/contact'] });
  render(
    <AppProviders queryClient={new QueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  await screen.findByRole('heading', { level: 1, name: 'Contact us' }, { timeout: 15_000 });
}

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(/Your name/), 'Sample Person');
  await userEvent.type(screen.getByLabelText(/Email/), 'sample@example.com');
  await userEvent.click(screen.getByRole('combobox', { name: /I am/ }));
  await userEvent.click(await screen.findByRole('option', { name: 'A business owner' }));
  await userEvent.type(screen.getByLabelText(/Subject/), 'Question about reviews');
  await userEvent.type(
    screen.getByLabelText(/^Message/),
    'How does my CA ask for clarification on a document?',
  );
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Send message' }));

describe('Contact form', () => {
  it('shows translated field errors from the shared schema without calling the API', async () => {
    const fetchMock = vi.fn();
    await renderContact(fetchMock);

    await submit();

    expect(await screen.findByText('Enter your name')).toBeDefined();
    expect(screen.getByText('Enter your email address')).toBeDefined();
    expect(screen.getByText('Choose one option')).toBeDefined();
    expect(screen.getByLabelText(/Your name/).getAttribute('aria-invalid')).toBe('true');
    expect(fetchMock).not.toHaveBeenCalled();

    await userEvent.type(screen.getByLabelText(/^Message/), 'too short');
    await userEvent.tab();
    expect(await screen.findByText('Message must be at least 20 characters')).toBeDefined();
  });

  it('shows loading while sending, then a confirmation instead of the form', async () => {
    let resolve!: (r: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>((r) => (resolve = r)));
    await renderContact(fetchMock);
    await fillValidForm();

    await submit();

    const button = screen.getByRole('button', { name: 'Send message' });
    expect(button.getAttribute('aria-busy')).toBe('true');

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/v1/contact');
    expect(JSON.parse(init.body as string)).toMatchObject({
      email: 'sample@example.com',
      role: 'entrepreneur',
    });

    resolve(json(201, { data: { id: 'abc' } }));

    expect(await screen.findByRole('heading', { name: 'Message sent' })).toBeDefined();
    expect(screen.getByText(/We will reply to sample@example.com/)).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
  });

  it('maps server field errors back onto the fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      json(400, {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Some fields are invalid',
          details: [{ path: 'email', message: 'validation:email.invalid' }],
        },
      }),
    );
    await renderContact(fetchMock);
    await fillValidForm();

    await submit();

    expect(await screen.findByText(/Enter a valid email address/)).toBeDefined();
  });

  it('shows a friendly toast when rate limited', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(json(429, { error: { code: 'RATE_LIMITED', message: 'Too many' } }));
    await renderContact(fetchMock);
    await fillValidForm();

    await submit();

    expect(await screen.findByText('Your message was not sent')).toBeDefined();
    expect(screen.getByText(/try again in about 15 minutes/)).toBeDefined();
    // The form stays so nothing the user typed is lost.
    expect((screen.getByLabelText(/Your name/) as HTMLInputElement).value).toBe('Sample Person');
  });

  it('keeps the honeypot out of reach of people and assistive tech', async () => {
    await renderContact(vi.fn());
    const honeypot = document.getElementById('contact-website')!;
    expect(honeypot.getAttribute('tabindex')).toBe('-1');
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
