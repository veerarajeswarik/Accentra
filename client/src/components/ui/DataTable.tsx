import { ArrowDown, ArrowUp, ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { BELOW_MD, useMediaQuery } from '../../lib/use-media-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { Pagination, type PaginationProps } from './Pagination';
import { Skeleton } from './Skeleton';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Right-aligned with tabular figures (money, counts, dates). */
  numeric?: boolean;
  sortable?: boolean;
  className?: string;
  /** Hide this column in the stacked mobile cards. */
  hideOnMobile?: boolean;
}

export interface RowAction<T> {
  label: string;
  onSelect: (row: T) => void;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  /** Accessible name of the table (e.g. "Transactions"). */
  caption: string;
  loading?: boolean;
  skeletonRows?: number;
  /** Shown inside the table frame when there are no rows (use <EmptyState>). */
  emptyState: ReactNode;
  sort?: SortState;
  /** Server-side sorting: you refetch with the new sort. */
  onSortChange?: (sort: SortState) => void;
  rowActions?: (row: T) => RowAction<T>[];
  /** Server-side pagination footer. */
  pagination?: PaginationProps;
  className?: string;
}

function ariaSort(column: { id: string }, sort?: SortState) {
  if (sort?.columnId !== column.id) return 'none' as const;
  return sort.direction === 'asc' ? ('ascending' as const) : ('descending' as const);
}

function RowActionsMenu<T>({ row, actions }: { row: T; actions: RowAction<T>[] }) {
  const { t } = useTranslation('ui');
  if (actions.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          size="sm"
          icon={<MoreHorizontal />}
          label={t('table.rowActions')}
          tooltip={false}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            destructive={action.destructive}
            disabled={action.disabled}
            onSelect={() => action.onSelect(row)}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Generic, dense (44px rows) data table: sticky header, sortable columns, right-aligned
 * numbers, row action menu, skeleton loading rows, empty state inside the frame, server-side
 * pagination. Below 768px it becomes a list of stacked cards.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  loading = false,
  skeletonRows = 5,
  emptyState,
  sort,
  onSortChange,
  rowActions,
  pagination,
  className,
}: DataTableProps<T>) {
  const { t } = useTranslation('ui');
  const isMobile = useMediaQuery(BELOW_MD);
  const showEmpty = !loading && rows.length === 0;

  function toggleSort(columnId: string) {
    if (!onSortChange) return;
    const direction = sort?.columnId === columnId && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ columnId, direction });
  }

  const frame = cn('overflow-hidden rounded-card border border-border bg-surface', className);

  if (isMobile) {
    return (
      <div className={frame} aria-busy={loading || undefined}>
        <h3 className="sr-only">{caption}</h3>
        {loading ? (
          <ul className="divide-y divide-border">
            {Array.from({ length: skeletonRows }, (_, i) => (
              <li key={i} className="space-y-2 p-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </li>
            ))}
          </ul>
        ) : showEmpty ? (
          emptyState
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={getRowId(row)} className="flex items-start gap-3 p-4">
                <dl className="grid min-w-0 flex-1 grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                  {columns
                    .filter((c) => !c.hideOnMobile)
                    .map((column) => (
                      <div key={column.id} className="contents">
                        <dt className="label-caps text-muted">{column.header}</dt>
                        <dd className={cn('min-w-0 text-right', column.numeric && 'tabular')}>
                          {column.cell(row)}
                        </dd>
                      </div>
                    ))}
                </dl>
                {rowActions && <RowActionsMenu row={row} actions={rowActions(row)} />}
              </li>
            ))}
          </ul>
        )}
        {pagination && <Pagination {...pagination} />}
      </div>
    );
  }

  return (
    <div className={frame}>
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full border-collapse text-body" aria-busy={loading || undefined}>
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-[1] bg-surface-2">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={column.sortable ? ariaSort(column, sort) : undefined}
                  className={cn(
                    'label-caps h-10 border-b border-border px-4 text-muted',
                    column.numeric ? 'text-right' : 'text-left',
                    column.className,
                  )}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      className={cn(
                        'label-caps inline-flex items-center gap-1 rounded-control hover:text-text',
                        column.numeric && 'flex-row-reverse',
                      )}
                    >
                      {column.header}
                      {sort?.columnId === column.id ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp aria-hidden className="size-3.5" />
                        ) : (
                          <ArrowDown aria-hidden className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown aria-hidden className="size-3.5 opacity-60" />
                      )}
                      <span className="sr-only">
                        {sort?.columnId === column.id && sort.direction === 'asc'
                          ? t('table.sortDescending')
                          : t('table.sortAscending')}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className="h-10 w-12 border-b border-border">
                  <span className="sr-only">{t('table.rowActions')}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={`skeleton-${i}`} data-testid="skeleton-row" className="h-11">
                  {columns.map((column) => (
                    <td key={column.id} className="border-b border-border px-4">
                      <Skeleton className={cn('h-4', column.numeric ? 'ml-auto w-20' : 'w-3/4')} />
                    </td>
                  ))}
                  {rowActions && <td className="border-b border-border" />}
                </tr>
              ))}
            {showEmpty && (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)}>{emptyState}</td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="h-11 transition-colors duration-150 hover:bg-surface-2"
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        'border-b border-border px-4',
                        column.numeric && 'text-right tabular',
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="border-b border-border pr-2 text-right">
                      <RowActionsMenu row={row} actions={rowActions(row)} />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {loading && <span className="sr-only">{t('table.loading')}</span>}
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
