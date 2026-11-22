import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '../../lib/cn';

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page (the last item). */
  to?: string;
}

export interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
  className?: string;
  /** Accessible name of the nav landmark; defaults to t('ui:breadcrumbs'). */
  label?: string;
}

export function Breadcrumbs({ items, className, label }: BreadcrumbsProps) {
  const { t } = useTranslation('ui');
  return (
    <nav aria-label={label ?? t('breadcrumbs')} className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-body text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.to && !isLast ? (
                  <Link to={item.to} className="rounded-control hover:text-text hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(isLast && 'text-text')}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden>
                  <ChevronRight className="size-3.5" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
