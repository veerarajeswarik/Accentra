import { AlertDialog } from 'radix-ui';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Button } from './Button';
import { overlayClasses } from './Dialog';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  /** Explicit verb, e.g. "Void transaction" — never just "OK" (5.5 Dialogs). */
  confirmLabel: string;
  cancelLabel?: string;
  /** Called ONLY when the confirm button is pressed. May return a promise (shows loading). */
  onConfirm: () => void | Promise<void>;
  /** Red confirm button for irreversible actions. */
  destructive?: boolean;
}

/** Asks before acting. Esc / Cancel / clicking outside never call onConfirm. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation('ui');
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={overlayClasses} />
        <AlertDialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-dialog border border-border bg-surface p-6 text-text shadow-elevated animate-pop-in',
          )}
        >
          <AlertDialog.Title className="text-h2">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-body text-muted">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={busy}>
                {cancelLabel ?? t('cancel')}
              </Button>
            </AlertDialog.Cancel>
            {/* Not AlertDialog.Action: we close only after onConfirm succeeds. */}
            <Button
              variant={destructive ? 'danger' : 'primary'}
              loading={busy}
              onClick={() => void handleConfirm()}
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
