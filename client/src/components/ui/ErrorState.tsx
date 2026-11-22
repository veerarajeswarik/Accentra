import { AlertTriangle, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  /** Defaults to t('ui:error.title'). */
  title?: ReactNode;
  /** Plain-language explanation. Never show stack traces or raw technical errors. */
  message?: ReactNode;
  /** Shows a "Try again" button when provided. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Extra actions (e.g. "Go to dashboard"). */
  actions?: ReactNode;
  className?: string;
}

/** 5.8 Error: message in plain language + "Try again"; technical details hidden. */
export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
  actions,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation('ui');
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      <div
        aria-hidden
        className="flex size-11 items-center justify-center rounded-full bg-danger/12 text-danger"
      >
        <AlertTriangle className="size-5" />
      </div>
      <div className="max-w-md space-y-1">
        <p className="text-h3">{title ?? t('error.title')}</p>
        {message && <p className="text-body text-muted">{message}</p>}
      </div>
      {(onRetry || actions) && (
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {onRetry && (
            <Button variant="secondary" leftIcon={<RotateCcw />} onClick={onRetry}>
              {retryLabel ?? t('error.retry')}
            </Button>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
