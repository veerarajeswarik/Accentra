import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';

function ConfirmHarness({ onConfirm }: { onConfirm: () => void | Promise<void> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Void</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Void this transaction?"
        description="A reversal entry will be posted."
        confirmLabel="Void transaction"
        onConfirm={onConfirm}
        destructive
      />
    </>
  );
}

describe('ConfirmDialog', () => {
  it('calls onConfirm only when the confirm button is pressed', async () => {
    const onConfirm = vi.fn();
    renderWithProviders(<ConfirmHarness onConfirm={onConfirm} />);

    // Cancel → no call
    await userEvent.click(screen.getByRole('button', { name: 'Void' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).toBeNull();

    // Escape → no call
    await userEvent.click(screen.getByRole('button', { name: 'Void' }));
    await screen.findByRole('alertdialog');
    await userEvent.keyboard('{Escape}');
    expect(onConfirm).not.toHaveBeenCalled();

    // Confirm → exactly one call, dialog closes
    await userEvent.click(screen.getByRole('button', { name: 'Void' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Void transaction' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('stays open and shows loading while an async confirm runs', async () => {
    let resolve!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    renderWithProviders(<ConfirmHarness onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole('button', { name: 'Void' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Void transaction' }));

    const confirm = screen.getByRole('button', { name: 'Void transaction' });
    expect(confirm.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('alertdialog')).toBeDefined();

    await act(async () => resolve());
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });
});

function ToastHarness() {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast({ variant: 'success', title: 'Saved' })}>ok</Button>
      <Button onClick={() => toast({ variant: 'error', title: 'Upload failed' })}>fail</Button>
    </>
  );
}

describe('Toast', () => {
  it('shows success toasts and lets the user dismiss errors', async () => {
    renderWithProviders(<ToastHarness />);

    await userEvent.click(screen.getByRole('button', { name: 'ok' }));
    expect(await screen.findByText('Saved')).toBeDefined();

    await userEvent.click(screen.getByRole('button', { name: 'fail' }));
    expect(await screen.findByText('Upload failed')).toBeDefined();

    const dismissButtons = screen.getAllByRole('button', { name: 'Dismiss notification' });
    await userEvent.click(dismissButtons[dismissButtons.length - 1]!);
    await vi.waitFor(() => expect(screen.queryByText('Upload failed')).toBeNull());
  });
});
