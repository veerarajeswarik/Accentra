import { X } from 'lucide-react';
import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { overlayClasses } from './Dialog';

export const Drawer = RadixDialog.Root;
export const DrawerTrigger = RadixDialog.Trigger;
export const DrawerClose = RadixDialog.Close;

export interface DrawerContentProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  /** Visually hide the title (it stays available to screen readers). */
  hideTitle?: boolean;
  className?: string;
  closeLabel?: string;
}

/** Side sheet for details, filters, and the mobile navigation menu. */
export function DrawerContent({
  title,
  description,
  children,
  footer,
  side = 'right',
  hideTitle = false,
  className,
  closeLabel,
}: DrawerContentProps) {
  const { t } = useTranslation('ui');
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={overlayClasses} />
      <RadixDialog.Content
        {...(description ? {} : { 'aria-describedby': undefined })}
        className={cn(
          'fixed inset-y-0 z-50 flex w-[min(24rem,calc(100vw-3rem))] flex-col border-border bg-surface text-text shadow-elevated',
          side === 'right'
            ? 'right-0 border-l animate-slide-in-right'
            : 'left-0 border-r animate-slide-in-left',
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className={cn('space-y-1', hideTitle && 'sr-only')}>
            <RadixDialog.Title className="text-h3">{title}</RadixDialog.Title>
            {description && (
              <RadixDialog.Description className="text-body text-muted">
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close
            aria-label={closeLabel ?? t('close')}
            className="-m-1 ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface-2 hover:text-text"
          >
            <X aria-hidden className="size-4" />
          </RadixDialog.Close>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </footer>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
