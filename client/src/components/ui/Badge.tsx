import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

/** Subtle tinted background + strong text (5.5 Status badges). Colours from tokens only. */
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-small whitespace-nowrap [&_svg]:size-3',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-2 text-muted ring-1 ring-border ring-inset',
        primary: 'bg-primary/12 text-primary-strong',
        info: 'bg-accent/12 text-accent',
        indigo: 'bg-chart-2/12 text-chart-2',
        success: 'bg-success/12 text-success-strong',
        warning: 'bg-warning/14 text-warning-strong',
        danger: 'bg-danger/12 text-danger-strong',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
