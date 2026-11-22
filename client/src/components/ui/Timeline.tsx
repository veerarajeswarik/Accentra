import { format, parseISO } from 'date-fns';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface TimelineItem {
  id: string;
  /** Who did it, e.g. "Priya (CA)". */
  actor: ReactNode;
  /** What happened, e.g. "requested clarification". */
  action: ReactNode;
  /** ISO timestamp. */
  at: string;
  /** Optional comment shown under the entry. */
  note?: ReactNode;
  icon?: ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

const TONE = {
  neutral: 'bg-surface-2 text-muted',
  primary: 'bg-primary/12 text-primary',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/14 text-warning',
  danger: 'bg-danger/12 text-danger',
} as const;

/** Vertical history list (review history, audit trail). Oldest first unless you sort otherwise. */
export function Timeline({
  items,
  className,
}: {
  items: readonly TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn('relative space-y-5', className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3">
          {index < items.length - 1 && (
            <span
              aria-hidden
              className="absolute top-8 bottom-[-1.25rem] left-3.5 w-px bg-border"
            />
          )}
          <span
            aria-hidden
            className={cn(
              'relative z-[1] flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-surface [&_svg]:size-3.5',
              TONE[item.tone ?? 'neutral'],
            )}
          >
            {item.icon ?? <span className="size-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1 space-y-1 pt-0.5">
            <p className="text-body">
              <span className="font-semibold">{item.actor}</span> {item.action}
            </p>
            <time dateTime={item.at} className="block text-small font-normal text-muted tabular">
              {format(parseISO(item.at), 'dd MMM yyyy, HH:mm')}
            </time>
            {item.note && (
              <div className="rounded-control border border-border bg-surface-2 px-3 py-2 text-body">
                {item.note}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
