import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { fieldBase, fieldHeight } from './field-styles';

export interface InputProps extends ComponentProps<'input'> {
  /** Decoration inside the left edge (e.g. "₹" or a search icon). Not announced. */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export function Input({ className, startAdornment, endAdornment, ...props }: InputProps) {
  const hasStart = startAdornment !== undefined && startAdornment !== null;
  const hasEnd = endAdornment !== undefined && endAdornment !== null;
  const input = (
    <input
      className={cn(fieldBase, fieldHeight, hasStart && 'pl-8', hasEnd && 'pr-8', className)}
      {...props}
    />
  );

  if (!hasStart && !hasEnd) return input;

  return (
    <div className="relative">
      {hasStart && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted [&_svg]:size-4"
        >
          {startAdornment}
        </span>
      )}
      {input}
      {hasEnd && (
        <span className="absolute inset-y-0 right-2 flex items-center text-muted [&_svg]:size-4">
          {endAdornment}
        </span>
      )}
    </div>
  );
}
