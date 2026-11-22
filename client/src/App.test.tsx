import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { renderWithProviders } from './test/render';

describe('App (temporary showcase root)', () => {
  it('renders the component showcase without crashing', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Component showcase' })).toBeDefined();
    expect(screen.getByText('₹1,23,45,678.90')).toBeDefined();
  });
});
