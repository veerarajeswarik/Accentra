import { useTranslation } from 'react-i18next';
import { Badge, type BadgeProps } from './Badge';

/** Every workflow / payment / verification status used in the app, mapped to one look. */
export const STATUS_VARIANTS = {
  draft: 'neutral',
  submitted: 'indigo',
  under_review: 'info',
  needs_clarification: 'warning',
  approved: 'success',
  rejected: 'danger',
  paid: 'success',
  unpaid: 'warning',
  overdue: 'danger',
  verified: 'success',
  pending: 'warning',
} as const satisfies Record<string, NonNullable<BadgeProps['variant']>>;

export type Status = keyof typeof STATUS_VARIANTS;

export interface StatusBadgeProps {
  status: Status;
  /** Override the default translated label. */
  label?: string;
  className?: string;
}

/** The label always names the status, so meaning never depends on colour alone. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { t } = useTranslation('ui');
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label ?? t(`status.${status}`)}
    </Badge>
  );
}
