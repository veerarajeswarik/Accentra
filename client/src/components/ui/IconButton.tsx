import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';
import { Tooltip } from './Tooltip';

const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-150 ease-out',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
  ],
  {
    variants: {
      variant: {
        ghost: 'text-muted hover:bg-surface-2 hover:text-text',
        secondary: 'border border-border bg-surface text-text hover:bg-surface-2',
        primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
        danger: 'text-danger hover:bg-surface-2',
      },
      size: {
        sm: 'size-8',
        md: 'size-9',
        lg: 'size-11 [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export interface IconButtonProps
  extends Omit<ComponentProps<'button'>, 'children'>, VariantProps<typeof iconButtonVariants> {
  /** Required accessible name — icon-only buttons are invisible to screen readers without it. */
  label: string;
  icon: ReactNode;
  /** Tooltip text; defaults to `label`. Pass `false` to hide the tooltip. */
  tooltip?: ReactNode | false;
  loading?: boolean;
}

export function IconButton({
  label,
  icon,
  tooltip,
  loading = false,
  variant,
  size,
  className,
  disabled,
  type,
  ...props
}: IconButtonProps) {
  const button = (
    <button
      type={type ?? 'button'}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
    </button>
  );

  if (tooltip === false) return button;
  return <Tooltip content={tooltip ?? label}>{button}</Tooltip>;
}
