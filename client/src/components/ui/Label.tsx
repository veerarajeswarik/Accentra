import { Label as RadixLabel } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

export interface LabelProps extends ComponentProps<typeof RadixLabel.Root> {
  /** Adds a visual asterisk; pass the screen-reader word via `requiredText`. */
  required?: boolean;
  requiredText?: string;
}

/** Labels always sit ABOVE their control — never use a placeholder as a label. */
export function Label({ className, required, requiredText, children, ...props }: LabelProps) {
  return (
    <RadixLabel.Root
      className={cn('inline-flex items-center gap-1 text-body font-medium text-text', className)}
      {...props}
    >
      {children}
      {required && (
        <>
          <span aria-hidden className="text-danger">
            *
          </span>
          {requiredText && <span className="sr-only">({requiredText})</span>}
        </>
      )}
    </RadixLabel.Root>
  );
}
