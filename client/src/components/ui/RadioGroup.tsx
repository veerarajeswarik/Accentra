import { RadioGroup as RadixRadio } from 'radix-ui';
import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: readonly RadioOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  /** Accessible name for the group (or use aria-labelledby). */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** One choice from a few visible options. Arrow keys move between options. */
export function RadioGroup({
  options,
  value,
  onValueChange,
  orientation = 'vertical',
  className,
  ...props
}: RadioGroupProps) {
  const baseId = useId();
  return (
    <RadixRadio.Root
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const id = `${baseId}-${option.value}`;
        return (
          <div key={option.value} className="flex items-start gap-2">
            <RadixRadio.Item
              id={id}
              value={option.value}
              disabled={option.disabled}
              aria-describedby={option.description ? `${id}-description` : undefined}
              className={cn(
                'mt-0.75 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-surface',
                'transition-colors duration-150 ease-out hover:border-muted data-[state=checked]:border-primary',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <RadixRadio.Indicator className="size-2 rounded-full bg-primary" />
            </RadixRadio.Item>
            <div className="flex flex-col">
              <label htmlFor={id} className="text-body text-text">
                {option.label}
              </label>
              {option.description && (
                <p id={`${id}-description`} className="text-small font-normal text-muted">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </RadixRadio.Root>
  );
}
