import { Check, ChevronDown } from 'lucide-react';
import { Select as RadixSelect } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { fieldBase, fieldHeight } from './field-styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: readonly SelectOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'aria-label'?: string;
}

/** Short fixed list (≤ ~10 options). For long or searchable lists use Combobox. */
export function Select({
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
  name,
  ...triggerProps
}: SelectProps) {
  const { t } = useTranslation('ui');
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
      <RadixSelect.Trigger
        className={cn(
          fieldBase,
          fieldHeight,
          'inline-flex items-center justify-between gap-2 text-left data-placeholder:text-muted',
          className,
        )}
        {...triggerProps}
      >
        <RadixSelect.Value placeholder={placeholder ?? t('select.placeholder')} />
        <RadixSelect.Icon>
          <ChevronDown aria-hidden className="size-4 text-muted" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-card border border-border bg-surface shadow-elevated animate-pop-in"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'relative flex cursor-default items-center rounded-control py-1.5 pr-2 pl-8 text-body text-text outline-none select-none',
                  'data-highlighted:bg-surface-2 data-disabled:opacity-50',
                )}
              >
                <span className="absolute left-2 inline-flex size-4 items-center justify-center">
                  <RadixSelect.ItemIndicator>
                    <Check aria-hidden className="size-4 text-primary" />
                  </RadixSelect.ItemIndicator>
                </span>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
