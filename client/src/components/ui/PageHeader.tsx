import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Primary action(s) on the right, e.g. <Button>Record transaction</Button>. */
  actions?: ReactNode;
  /** Optional <Breadcrumbs> above the title. */
  breadcrumbs?: ReactNode;
  /** Status badge next to the title (detail pages). */
  status?: ReactNode;
  className?: string;
}

/** Top of every page: the page's only <h1>. */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  status,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('mb-6 space-y-2', className)}>
      {breadcrumbs}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1">{title}</h1>
            {status}
          </div>
          {description && <p className="max-w-2xl text-body text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
