import { format, isValid, parseISO } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import { Popover } from 'radix-ui';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { fieldBase, fieldHeight } from './field-styles';

/** Display format used everywhere in Accentra: 05 Nov 2026. */
export const DISPLAY_DATE_FORMAT = 'dd MMM yyyy';

export interface DatePickerProps {
  /** ISO calendar date "yyyy-MM-dd", or null. */
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  /** Earliest / latest selectable ISO dates. */
  min?: string;
  max?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

function toDate(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const date = parseISO(iso);
  return isValid(date) ? date : undefined;
}

/**
 * Calendar popover (keyboard: arrows move by day, PageUp/PageDown by month, Enter selects).
 * Returns an ISO date string with no time or timezone, so dates never shift by a day.
 */
export function DatePicker({
  value,
  onValueChange,
  placeholder,
  min,
  max,
  clearable = false,
  disabled,
  className,
  ...triggerProps
}: DatePickerProps) {
  const { t } = useTranslation('ui');
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const minDate = toDate(min);
  const maxDate = toDate(max);

  const disabledDays = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div className={cn('relative', className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            className={cn(
              fieldBase,
              fieldHeight,
              'inline-flex items-center gap-2 text-left',
              !selected && 'text-muted',
              clearable && selected && 'pr-9',
            )}
            {...triggerProps}
          >
            <CalendarDays aria-hidden className="size-4 shrink-0 text-muted" />
            <span className="tabular truncate">
              {selected
                ? format(selected, DISPLAY_DATE_FORMAT)
                : (placeholder ?? t('date.placeholder'))}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            aria-label={t('date.open')}
            className="accentra-calendar z-50 rounded-card border border-border bg-surface p-3 text-text shadow-elevated animate-pop-in"
          >
            <DayPicker
              mode="single"
              selected={selected}
              defaultMonth={selected ?? maxDate}
              disabled={disabledDays}
              weekStartsOn={1}
              autoFocus
              onSelect={(date) => {
                onValueChange(date ? format(date, 'yyyy-MM-dd') : null);
                setOpen(false);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {clearable && selected && !disabled && (
        <button
          type="button"
          aria-label={t('date.clear')}
          onClick={() => onValueChange(null)}
          className="absolute inset-y-0 right-2 my-auto inline-flex size-6 items-center justify-center rounded-control text-muted hover:bg-surface-2 hover:text-text"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      )}
    </div>
  );
}
