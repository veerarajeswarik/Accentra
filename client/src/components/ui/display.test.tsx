import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { initialsOf } from './Avatar';
import { FormField } from './FormField';
import { Input } from './Input';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';

describe('FormField', () => {
  it('wires label, helper and error to the control', () => {
    render(
      <FormField label="GSTIN" helper="15 characters" error="Invalid GSTIN" required>
        {(control) => <Input {...control} />}
      </FormField>,
    );
    const input = screen.getByLabelText(/GSTIN/);
    const describedBy = input.getAttribute('aria-describedby') ?? '';

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(describedBy.split(' ')).toHaveLength(2);
    expect(screen.getByRole('alert').textContent).toBe('Invalid GSTIN');
  });

  it('is not invalid when there is no error', () => {
    render(<FormField label="Name">{(control) => <Input {...control} />}</FormField>);
    const input = screen.getByLabelText('Name');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});

describe('StatCard', () => {
  it('shows a sign and an accessible direction, not colour alone', () => {
    render(
      <StatCard
        label="Money In"
        value="₹1.2L"
        delta={{ value: 12.5, format: (n) => `${n}%`, label: 'vs last month' }}
      />,
    );
    expect(screen.getByText('+12.5%')).toBeDefined();
    expect(screen.getByText('Up 12.5%')).toBeDefined();
  });

  it('uses a true minus sign for decreases and marks bad news', () => {
    render(
      <StatCard
        label="Money Out"
        value="₹40,000.00"
        delta={{ value: 8, format: (n) => `${n}%`, positiveIsGood: false }}
      />,
    );
    const delta = screen.getByText('+8%');
    expect(delta.parentElement?.className).toContain('text-danger');
  });

  it('shows skeletons while loading', () => {
    const { container } = render(<StatCard label="Profit" value="₹0.00" loading />);
    expect(screen.queryByText('₹0.00')).toBeNull();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  });
});

describe('StatusBadge', () => {
  it('renders the translated label for every status', () => {
    render(<StatusBadge status="needs_clarification" />);
    expect(screen.getByText('Needs clarification')).toBeDefined();
  });
});

describe('initialsOf', () => {
  it.each([
    ['Priya Sharma', 'PS'],
    ['  ravi  kumar  iyer ', 'RI'],
    ['accentra', 'A'],
    ['', '?'],
  ])('%j → %j', (name, expected) => {
    expect(initialsOf(name)).toBe(expected);
  });
});
