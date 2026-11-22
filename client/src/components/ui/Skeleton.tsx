import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

/**
 * Placeholder block shaped like the content that is loading (5.8: never a full-page spinner).
 * Decorative: announce loading elsewhere (e.g. aria-busy on the container).
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-control bg-surface-2', className)}
      {...props}
    />
  );
}
