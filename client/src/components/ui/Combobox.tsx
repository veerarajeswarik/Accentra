import { Command } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover } from 'radix-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { fieldBase, fieldHeight } from './field-styles';
import type { SelectOption } from './Select';

export interface ComboboxOption extends SelectOption {
  /** Extra words to match when searching (e.g. GSTIN, city). */
  keywords?: string[];
}

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'aria-label'?: string;
}

/** Searchable single-select for long lists (categories, contacts, states). */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
  className,
  ...triggerProps
}: ComboboxProps) {
  const { t } = useTranslation('ui');
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            fieldBase,
            fieldHeight,
            'inline-flex items-center justify-between gap-2 text-left',
            !selected && 'text-muted',
            className,
          )}
          {...triggerProps}
        >
          <span className="truncate">
            {selected?.label ?? placeholder ?? t('combobox.placeholder')}
          </span>
          <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-(--radix-popover-trigger-width) min-w-56 rounded-card border border-border bg-surface shadow-elevated animate-pop-in"
        >
          <Command className="flex flex-col">
            <Command.Input
              placeholder={searchPlaceholder ?? t('combobox.search')}
              className="h-9 border-b border-border bg-transparent px-3 text-body text-text outline-none placeholder:text-muted"
            />
            <Command.List className="max-h-64 overflow-y-auto p-1">
              <Command.Empty className="px-2 py-4 text-center text-body text-muted">
                {emptyText ?? t('combobox.empty')}
              </Command.Empty>
              {options.map((option) => (
                <Command.Item
                  key={option.value}
                  value={option.value}
                  keywords={[option.label, ...(option.keywords ?? [])]}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex cursor-default items-center gap-2 rounded-control px-2 py-1.5 text-body text-text select-none',
                    'data-[selected=true]:bg-surface-2 data-[disabled=true]:opacity-50',
                  )}
                >
                  <Check
                    aria-hidden
                    className={cn(
                      'size-4 text-primary',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
