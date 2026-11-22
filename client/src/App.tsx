/**
 * TEMPORARY development page (Phase 2a preview). Replaced by the router in Phase 2d,
 * when the health check moves to the "API status" indicator on /dev/components.
 */
import { formatINR, type HealthStatus } from '@accentra/shared';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LanguageSelect } from './components/ui/LanguageSelect';
import { ModeToggle } from './components/ui/ModeToggle';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { apiClient } from './lib/apiClient';
import { TERMS, useTerm, type TermKey } from './lib/terminology';

function HealthPanel() {
  const { t } = useTranslation();
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async () => (await apiClient.get<HealthStatus>('/health')).data,
    refetchInterval: 15_000,
  });

  if (health.isPending) {
    return <p className="text-muted">{t('health.checking')}</p>;
  }

  if (health.isError) {
    return (
      <div role="alert" className="rounded-card border border-danger p-4 text-danger">
        <p className="font-semibold">{t('health.unreachable')}</p>
        <p className="text-small">{health.error.message}</p>
        <p className="mt-1 text-small">{t('health.hint')}</p>
      </div>
    );
  }

  const { status, db, version, time } = health.data;
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
      <dt className="text-muted">{t('health.api')}</dt>
      <dd data-testid="api-status" className="font-medium text-success">
        {status}
      </dd>
      <dt className="text-muted">{t('health.database')}</dt>
      <dd
        data-testid="db-status"
        className={db === 'up' ? 'font-medium text-success' : 'font-medium text-danger'}
      >
        {db}
      </dd>
      <dt className="text-muted">{t('health.version')}</dt>
      <dd>{version}</dd>
      <dt className="text-muted">{t('health.serverTime')}</dt>
      <dd className="tabular">{new Date(time).toLocaleString('en-IN')}</dd>
    </dl>
  );
}

function TermRow({ termKey }: { termKey: TermKey }) {
  return <li>{useTerm(termKey)}</li>;
}

export function App() {
  const { t } = useTranslation();
  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h1 text-brand-navy">{t('devBuild')}</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </header>

      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="mb-3 text-h3">{t('health.title')}</h2>
        <HealthPanel />
        <p className="mt-4 text-small text-muted">
          {t('health.sample')}:{' '}
          <span data-testid="sample-amount" className="tabular text-text">
            {formatINR(12345678)}
          </span>
        </p>
      </section>

      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="mb-3 text-h3">{t('preview.terms')}</h2>
        <ul data-testid="terms" className="list-inside list-disc space-y-1">
          {(Object.keys(TERMS) as TermKey[]).map((key) => (
            <TermRow key={key} termKey={key} />
          ))}
        </ul>
      </section>
    </main>
  );
}
