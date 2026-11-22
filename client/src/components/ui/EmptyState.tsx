import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Usually one primary Button, e.g. "Record your first transaction". */
  action?: ReactNode;
  className?: string;
}

/** 5.8 Empty: icon, one-line explanation, primary action. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
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
        <p className="text-h3">{title}</p>
        {description && <p className="text-body text-muted">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
