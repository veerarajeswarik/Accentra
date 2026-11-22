import { Check, Minus } from 'lucide-react';
import { Checkbox as RadixCheckbox } from 'radix-ui';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface CheckboxProps extends ComponentProps<typeof RadixCheckbox.Root> {
  label?: ReactNode;
  description?: ReactNode;
}

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const boxId = id ?? generatedId;
  const descriptionId = `${boxId}-description`;

  const box = (
    <RadixCheckbox.Root
      id={boxId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border bg-surface',
        'transition-colors duration-150 ease-out hover:border-muted',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-fg',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-fg',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        {props.checked === 'indeterminate' ? (
          <Minus aria-hidden className="size-3" strokeWidth={3} />
        ) : (
          <Check aria-hidden className="size-3" strokeWidth={3} />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );

  if (!label) return box;

  return (
    <div className="flex items-start gap-2">
      <div className="flex h-5.5 items-center">{box}</div>
      <div className="flex flex-col">
        <label htmlFor={boxId} className="text-body text-text peer-disabled:opacity-50">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-small font-normal text-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
