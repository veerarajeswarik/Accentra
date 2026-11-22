import '../lib/i18n';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/*
 * jsdom lacks a few browser APIs that Radix UI and our providers use.
 * These are minimal stand-ins for tests only.
 */
let prefersDark = false;

/** Tests can simulate the OS colour-scheme setting. */
export function setSystemDarkMode(value: boolean): void {
  prefersDark = value;
}

beforeEach(() => {
  prefersDark = false;
  window.localStorage.clear();
  document.documentElement.className = '';

  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes('dark') ? prefersDark : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
