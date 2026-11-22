import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

export interface StatDelta {
  /** Change amount; its sign decides the arrow and the +/− prefix. */
  value: number;
  /** Format the ABSOLUTE value, e.g. (n) => `${n}%`. Default: String(n). */
  format?: (absValue: number) => string;
  /** Context after the delta, e.g. "vs last month". */
  label?: string;
  /** Is "up" good news? True for revenue, false for expenses. Default true. */
  positiveIsGood?: boolean;
}

export interface StatCardProps {
  label: ReactNode;
  /** Already-formatted value (e.g. formatINR(paise)). Numbers are computed by the server. */
  value: ReactNode;
  delta?: StatDelta;
  /** Slot for a small chart. */
  sparkline?: ReactNode;
  /** Link/button to the source of the number ("cards earn their space", 5.1). */
  footer?: ReactNode;
  loading?: boolean;
  className?: string;
}

const MINUS = '−';

function DeltaLine({ delta }: { delta: StatDelta }) {
  const { t } = useTranslation('ui');
  const { value, format = String, label, positiveIsGood = true } = delta;
  const direction = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  const text = format(Math.abs(value));
  const good = direction === 'flat' ? null : (direction === 'up') === positiveIsGood;
  const Icon =
    direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : ArrowRight;
  const sign = direction === 'up' ? '+' : direction === 'down' ? MINUS : '';

  return (
    <p className="flex items-center gap-1 text-small">
      <span
        className={cn(
          'inline-flex items-center gap-0.5 font-medium tabular',
          good === null ? 'text-muted' : good ? 'text-success' : 'text-danger',
        )}
      >
        <Icon aria-hidden className="size-3.5" />
        <span aria-hidden>
          {sign}
          {text}
        </span>
        <span className="sr-only">
          {direction === 'flat' ? t('delta.flat') : t(`delta.${direction}`, { value: text })}
        </span>
      </span>
      {label && <span className="font-normal text-muted">{label}</span>}
    </p>
  );
}

/** A headline number with its trend. Money is never shown by colour alone (sign + arrow). */
export function StatCard({
  label,
  value,
  delta,
  sparkline,
  footer,
  loading = false,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-3 p-5', className)} aria-busy={loading || undefined}>
      <p className="label-caps text-muted">{label}</p>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-stat tabular">{value}</p>
            {delta && <DeltaLine delta={delta} />}
          </div>
          {sparkline && <div className="h-10 w-24 shrink-0">{sparkline}</div>}
        </div>
      )}
      {footer && <div className="border-t border-border pt-3 text-small">{footer}</div>}
    </Card>
  );
}
