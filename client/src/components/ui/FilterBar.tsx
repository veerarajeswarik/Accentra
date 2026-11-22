import { RotateCcw, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Button } from './Button';
import { Input } from './Input';

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Accessible label of the search box; defaults to t('ui:filter.search'). */
  searchLabel?: string;
  /** Filter controls (Select, DatePicker, …). */
  children?: ReactNode;
  /** Shows the reset button when any filter differs from its default. */
  hasActiveFilters?: boolean;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}

/** List page pattern: PageHeader → FilterBar → DataTable (5.6). */
export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  children,
  hasActiveFilters = false,
  onReset,
  resetLabel,
  className,
}: FilterBarProps) {
  const { t } = useTranslation('ui');
  return (
    <div
      role="search"
      className={cn('mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', className)}
    >
      <div className="w-full sm:w-72">
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder ?? t('filter.search')}
          aria-label={searchLabel ?? t('filter.search')}
          startAdornment={<Search />}
        />
      </div>
      {children}
      {hasActiveFilters && onReset && (
        <Button variant="ghost" leftIcon={<RotateCcw />} onClick={onReset} className="sm:ml-auto">
          {resetLabel ?? t('filter.reset')}
        </Button>
      )}
    </div>
  );
}
