import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from './FormField';
import { MoneyInput } from './MoneyInput';

function Harness({
  onPaise,
  initial = null,
  allowNegative,
}: {
  onPaise: (p: number | null) => void;
  initial?: number | null;
  allowNegative?: boolean;
}) {
  const [paise, setPaise] = useState<number | null>(initial);
  return (
    <FormField label="Amount">
      {(control) => (
        <MoneyInput
          {...control}
          allowNegative={allowNegative}
          valuePaise={paise}
          onValueChange={(p) => {
            setPaise(p);
            onPaise(p);
          }}
        />
      )}
    </FormField>
  );
}

describe('MoneyInput', () => {
  it('converts "1,500.50" to 150050 integer paise', async () => {
    const onPaise = vi.fn();
    render(<Harness onPaise={onPaise} />);

    await userEvent.type(screen.getByLabelText('Amount'), '1,500.50');

    expect(onPaise).toHaveBeenLastCalledWith(150050);
    expect(Number.isInteger(onPaise.mock.lastCall?.[0])).toBe(true);
  });

  it('formats with Indian grouping on blur', async () => {
    render(<Harness onPaise={vi.fn()} />);
    const input = screen.getByLabelText('Amount');

    await userEvent.type(input, '123456.7');
    await userEvent.tab();

    expect((input as HTMLInputElement).value).toBe('1,23,456.70');
  });

  it('rejects "12.345" with an error and emits null', async () => {
    const onPaise = vi.fn();
    render(<Harness onPaise={onPaise} />);
    const input = screen.getByLabelText('Amount');

    await userEvent.type(input, '12.345');
    await userEvent.tab();

    expect(onPaise).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('alert').textContent).toMatch(/up to 2 decimal places/);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain(screen.getByRole('alert').id);
  });

  it('waits for blur before showing the error (no shouting while typing)', async () => {
    render(<Harness onPaise={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('Amount'), 'abc');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('rejects negatives unless allowed', async () => {
    const onPaise = vi.fn();
    const { unmount } = render(<Harness onPaise={onPaise} />);
    await userEvent.type(screen.getByLabelText('Amount'), '-5');
    await userEvent.tab();
    expect(screen.getByRole('alert').textContent).toMatch(/cannot be negative/);
    unmount();

    render(<Harness onPaise={onPaise} allowNegative />);
    await userEvent.type(screen.getByLabelText('Amount'), '-5');
    expect(onPaise).toHaveBeenLastCalledWith(-500);
  });

  it('shows an initial value formatted, and empty text means null', async () => {
    const onPaise = vi.fn();
    render(<Harness onPaise={onPaise} initial={12345678} />);
    const input = screen.getByLabelText('Amount');
    expect((input as HTMLInputElement).value).toBe('1,23,456.78');

    await userEvent.clear(input);
    expect(onPaise).toHaveBeenLastCalledWith(null);
  });
});
