import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useTerm } from '../../lib/terminology';
import { MODE_STORAGE_KEY } from '../../providers/ModeProvider';
import { renderWithProviders } from '../../test/render';
import { ModeToggle } from './ModeToggle';

function Terms() {
  return (
    <ul>
      <li data-testid="revenue">{useTerm('revenue')}</li>
      <li data-testid="payables">{useTerm('payables')}</li>
    </ul>
  );
}

describe('ModeToggle + useTerm', () => {
  it('switches terminology between Simple and Professional', async () => {
    renderWithProviders(
      <>
        <ModeToggle />
        <Terms />
      </>,
    );

    expect(screen.getByTestId('revenue').textContent).toBe('Money In');
    expect(screen.getByTestId('payables').textContent).toBe('Bills to Pay');

    await userEvent.click(screen.getByRole('radio', { name: 'Professional' }));

    expect(screen.getByTestId('revenue').textContent).toBe('Revenue');
    expect(screen.getByTestId('payables').textContent).toBe('Accounts Payable');
    expect(window.localStorage.getItem(MODE_STORAGE_KEY)).toBe('professional');

    await userEvent.click(screen.getByRole('radio', { name: 'Simple' }));
    expect(screen.getByTestId('revenue').textContent).toBe('Money In');
  });

  it('keeps a mode selected when the active option is clicked again', async () => {
    renderWithProviders(
      <>
        <ModeToggle />
        <Terms />
      </>,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Simple' }));

    expect(screen.getByRole('radio', { name: 'Simple' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByTestId('revenue').textContent).toBe('Money In');
  });

  it('restores the saved mode', () => {
    window.localStorage.setItem(MODE_STORAGE_KEY, 'professional');
    renderWithProviders(<Terms />);
    expect(screen.getByTestId('revenue').textContent).toBe('Revenue');
  });
});
