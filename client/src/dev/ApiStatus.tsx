/**
 * Small live "API status" indicator for the /dev/components page (replaces the Phase 1 health page).
 * Proves React → /api/v1/health → Vite proxy → Express → MongoDB end to end.
 */
import type { HealthStatus } from '@accentra/shared';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/Badge';
import { Tooltip } from '../components/ui/Tooltip';
import { apiClient } from '../lib/apiClient';

export function ApiStatus() {
  const { t } = useTranslation();
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async () => (await apiClient.get<HealthStatus>('/health')).data,
    refetchInterval: 15_000,
  });

  if (health.isPending) {
    return (
      <Badge data-testid="api-status" variant="neutral">
        {t('health.checking')}
      </Badge>
    );
  }

  if (health.isError) {
    return (
      <Tooltip content={t('health.hint')}>
        <Badge data-testid="api-status" variant="danger" role="alert" tabIndex={0}>
          {t('health.unreachable')}
        </Badge>
      </Tooltip>
    );
  }

  const { status, db, version } = health.data;
  return (
    <span className="inline-flex items-center gap-2" data-testid="api-status">
      <Badge variant="success">
        {t('health.api')}: {status}
      </Badge>
      <Badge variant={db === 'up' ? 'success' : 'danger'} data-testid="db-status">
        {t('health.database')}: {db}
      </Badge>
      <span className="text-small text-muted tabular">v{version}</span>
    </span>
  );
}
