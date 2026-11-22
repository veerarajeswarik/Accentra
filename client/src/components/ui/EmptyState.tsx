import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  /** Element for the title. Use "h1" when the empty state IS the page (placeholders, 404). */
  titleAs?: 'p' | 'h1' | 'h2' | 'h3';
  description?: ReactNode;
  /** Usually one primary Button, e.g. "Record your first transaction". */
  action?: ReactNode;
  className?: string;
}

/** 5.8 Empty: icon, one-line explanation, primary action. */
export function EmptyState({
  icon,
  title,
  titleAs: Title = 'p',
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div
          aria-hidden
          className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-muted [&_svg]:size-5"
        >
          {icon}
        </div>
      )}
      <div className="max-w-sm space-y-1">
        <Title className={Title === 'h1' ? 'text-h1' : 'text-h3'}>{title}</Title>
        {description && <div className="text-body text-muted">{description}</div>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
