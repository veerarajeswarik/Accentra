import type { ReactNode } from 'react';
import { cn } from '../../../lib/cn';

/** Page-width marketing section with an optional heading block. Layout helper only. */
export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  tone = 'plain',
  align = 'left',
}: {
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  /** "muted" adds a surface band to separate sections. */
  tone?: 'plain' | 'muted';
  align?: 'left' | 'center';
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(tone === 'muted' && 'border-y border-border bg-surface', className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        {title && (
          <div
            className={cn('mb-10 max-w-2xl space-y-3', align === 'center' && 'mx-auto text-center')}
          >
            <h2 id={headingId} className="text-h1">
              {title}
            </h2>
            {subtitle && <p className="text-body-lg text-muted">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Icon + title + one sentence (benefits, trust points). */
export function IconPoint({
  icon,
  title,
  body,
  aside,
}: {
  icon: ReactNode;
  title: ReactNode;
  body: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary [&_svg]:size-4"
      >
        {icon}
      </span>
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-h3">{title}</h3>
          {aside}
        </div>
        <p className="text-body text-muted">{body}</p>
      </div>
    </div>
  );
}
