import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { TooltipProvider } from '../components/ui/Tooltip';
import { setSystemDarkMode } from '../test/setup';
import { THEME_STORAGE_KEY, ThemeProvider, useTheme } from './ThemeProvider';

function ThemeProbe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button type="button" onClick={() => setTheme('dark')}>
        go dark
      </button>
    </div>
  );
}

function renderTheme(onThemeChange?: (theme: string) => void) {
  return render(
    <ThemeProvider onThemeChange={onThemeChange}>
      <TooltipProvider>
        <ThemeProbe />
        <ThemeToggle />
      </TooltipProvider>
    </ThemeProvider>,
  );
}

const html = () => document.documentElement;

describe('ThemeProvider', () => {
  it('defaults to "system" and follows the OS setting', () => {
    setSystemDarkMode(true);
    renderTheme();
    expect(screen.getByTestId('theme').textContent).toBe('system');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(html().classList.contains('dark')).toBe(true);
  });

  it('applies .dark and persists the choice to localStorage', async () => {
    const onThemeChange = vi.fn();
    renderTheme(onThemeChange);
    expect(html().classList.contains('dark')).toBe(false);

    await userEvent.click(screen.getByRole('button', { name: 'go dark' }));

    expect(html().classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });

  it('restores the saved theme after a reload', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const first = renderTheme();
    expect(html().classList.contains('dark')).toBe(true);
    first.unmount();

    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderTheme();
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(html().classList.contains('dark')).toBe(false);
  });

  it('ignores invalid stored values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    renderTheme();
    expect(screen.getByTestId('theme').textContent).toBe('system');
  });

  it('ThemeToggle cycles light → dark → system with an accessible label', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderTheme();

    const toggle = screen.getByRole('button', { name: 'Switch to Dark theme' });
    await userEvent.click(toggle);
    expect(screen.getByTestId('theme').textContent).toBe('dark');

    await userEvent.click(screen.getByRole('button', { name: 'Switch to System theme' }));
    expect(screen.getByTestId('theme').textContent).toBe('system');

    await act(() => userEvent.click(screen.getByRole('button', { name: 'Switch to Light theme' })));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('throws a clear error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeProbe />)).toThrow(/inside <ThemeProvider>/);
  });
});
