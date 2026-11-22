import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('keeps a custom font size and a text colour together', () => {
    expect(cn('text-small', 'text-muted')).toBe('text-small text-muted');
  });

  it('lets later conflicting classes win', () => {
    expect(cn('text-small', 'text-h1')).toBe('text-h1');
    expect(cn('bg-surface', 'bg-primary')).toBe('bg-primary');
    expect(cn('rounded-control', 'rounded-card')).toBe('rounded-card');
    expect(cn('px-4', false, undefined, 'px-2')).toBe('px-2');
  });
});
