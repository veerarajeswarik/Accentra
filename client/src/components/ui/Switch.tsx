import { Switch as RadixSwitch } from 'radix-ui';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface SwitchProps extends ComponentProps<typeof RadixSwitch.Root> {
  label?: ReactNode;
  description?: ReactNode;
}

/** On/off setting that takes effect immediately (use Checkbox inside forms that need "Save"). */
export function Switch({ label, description, className, id, ...props }: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const descriptionId = `${switchId}-description`;

  const control = (
    <RadixSwitch.Root
      id={switchId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-border',
        'transition-colors duration-150 ease-out data-[state=checked]:bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform duration-150 ease-out data-[state=checked]:translate-x-4" />
    </RadixSwitch.Root>
  );

  if (!label) return control;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col">
        <label htmlFor={switchId} className="text-body text-text">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-small font-normal text-muted">
            {description}
          </p>
        )}
      </div>
      {control}
    </div>
  );
}
