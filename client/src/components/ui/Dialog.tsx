import { X } from 'lucide-react';
import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export const overlayClasses = 'fixed inset-0 z-40 bg-black/40 animate-fade-in';

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' } as const;

export interface DialogContentProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons: secondary first, primary last (5.5 Dialogs). */
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
  /** Accessible label of the close (×) button; defaults to t('ui:close'). */
  closeLabel?: string;
}

/**
 * Modal dialog. Focus is trapped inside, Esc closes, focus returns to the trigger (Radix).
 *   <Dialog open={open} onOpenChange={setOpen}><DialogContent title="…" footer={…}>…</DialogContent></Dialog>
 */
export function DialogContent({
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  closeLabel,
}: DialogContentProps) {
  const { t } = useTranslation('ui');
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={overlayClasses} />
      <RadixDialog.Content
        // Without a description Radix warns; undefined opts out explicitly.
        {...(description ? {} : { 'aria-describedby': undefined })}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col',
          'rounded-dialog border border-border bg-surface text-text shadow-elevated animate-pop-in',
          SIZES[size],
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="space-y-1">
            <RadixDialog.Title className="text-h2">{title}</RadixDialog.Title>
            {description && (
              <RadixDialog.Description className="text-body text-muted">
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close
            aria-label={closeLabel ?? t('close')}
            className="-m-1 inline-flex size-8 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface-2 hover:text-text"
          >
            <X aria-hidden className="size-4" />
          </RadixDialog.Close>
        </header>
        {children && <div className="overflow-y-auto px-6 py-4">{children}</div>}
        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
