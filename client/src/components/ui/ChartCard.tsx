import { BarChart3 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Card, CardHeader } from './Card';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';

export interface ChartCardProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** The chart (e.g. a Recharts <ResponsiveContainer>). Hidden from screen readers. */
  children: ReactNode;
  /** REQUIRED text alternative: what the chart shows, in one or two sentences (5.7, 5.10). */
  summary: string;
  isEmpty?: boolean;
  /** Custom empty content; defaults to t('ui:chart.noData'). */
  emptyState?: ReactNode;
  loading?: boolean;
  /** Chart area height in px (default 240). */
  height?: number;
  className?: string;
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  summary,
  isEmpty = false,
  emptyState,
  loading = false,
  height = 240,
  className,
}: ChartCardProps) {
  const { t } = useTranslation('ui');
  return (
    <Card className={className} aria-busy={loading || undefined}>
      <CardHeader title={title} description={description} actions={actions} />
      <figure className="m-0 p-5">
        <div style={{ height }} className="w-full">
          {loading ? (
            <Skeleton className="size-full" />
          ) : isEmpty ? (
            (emptyState ?? (
              <EmptyState icon={<BarChart3 />} title={t('chart.noData')} className="h-full py-0" />
            ))
          ) : (
            <div aria-hidden className="size-full">
              {children}
            </div>
          )}
        </div>
        <figcaption className={cn('sr-only')}>{summary}</figcaption>
      </figure>
    </Card>
  );
}
