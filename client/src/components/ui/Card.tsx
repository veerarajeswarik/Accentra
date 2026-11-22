import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Surface with a 1px border and NO shadow at rest (5.4). Padding 20px. */
export function Card({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn('rounded-card border border-border bg-surface text-text', className)}
      {...props}
    />
  );
}

export interface CardHeaderProps extends Omit<ComponentProps<'header'>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons/links shown on the right (e.g. "View all"). */
  actions?: ReactNode;
  /** Heading level for the title (default h3 — card titles). */
  as?: 'h2' | 'h3' | 'h4';
}

export function CardHeader({
  title,
  description,
  actions,
  as: Heading = 'h3',
  className,
  ...props
}: CardHeaderProps) {
  return (
    <header
      className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}
      {...props}
    >
      <div className="min-w-0">
        <Heading className="text-h3">{title}</Heading>
        {description && <p className="mt-0.5 text-body text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border px-5 py-3',
        className,
      )}
      {...props}
    />
  );
}
