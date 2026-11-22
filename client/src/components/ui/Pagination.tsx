import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';
import { Select } from './Select';

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  /** Total rows on the SERVER (lists are always paginated server-side). */
  total: number;
  onPageChange: (page: number) => void;
  /** Shows a rows-per-page selector when provided. */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationProps) {
  const { t } = useTranslation('ui');
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={t('pagination.label')}
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-body text-muted',
        className,
      )}
    >
      <p className="tabular" aria-live="polite">
        {t('pagination.range', { from, to, total })}
      </p>
      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">{t('pagination.rowsPerPage')}</span>
            <Select
              aria-label={t('pagination.rowsPerPage')}
              className="h-8 w-20"
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
              options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
            />
          </div>
        )}
        <span className="tabular">{t('pagination.page', { page, pages })}</span>
        <div className="flex gap-1">
          <IconButton
            variant="secondary"
            size="sm"
            icon={<ChevronLeft />}
            label={t('pagination.previous')}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
          <IconButton
            variant="secondary"
            size="sm"
            icon={<ChevronRight />}
            label={t('pagination.next')}
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          />
        </div>
      </div>
    </nav>
  );
}
