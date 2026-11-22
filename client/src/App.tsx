/**
 * TEMPORARY development page (replaced in Phase 3).
 * Proves the full chain works: React → /api/v1/health → Vite proxy → Express → MongoDB,
 * and that the shared package is usable from the client (formatINR).
 */
import { formatINR, type HealthStatus } from '@accentra/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './lib/apiClient';

function HealthPanel() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async () => (await apiClient.get<HealthStatus>('/health')).data,
    refetchInterval: 15_000,
  });

  if (health.isPending) {
    return <p className="text-slate-500">Checking API health…</p>;
  }

  if (health.isError) {
    return (
      <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
        <p className="font-semibold">API unreachable</p>
        <p className="text-sm">{health.error.message}</p>
        <p className="mt-1 text-sm">
          Is the server running? Try <code>npm run dev</code> from the project root.
        </p>
      </div>
    );
  }

  const { status, db, version, time } = health.data;
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
      <dt className="text-slate-500">API status</dt>
      <dd data-testid="api-status" className="font-medium text-green-700">
        {status}
      </dd>
      <dt className="text-slate-500">Database</dt>
      <dd
        data-testid="db-status"
        className={db === 'up' ? 'font-medium text-green-700' : 'font-medium text-red-700'}
      >
        {db}
      </dd>
      <dt className="text-slate-500">Version</dt>
      <dd>{version}</dd>
      <dt className="text-slate-500">Server time</dt>
      <dd>{new Date(time).toLocaleString('en-IN')}</dd>
    </dl>
  );
}

export function App() {
  return (
    <main className="mx-auto max-w-xl p-8 font-sans">
      <h1 className="mb-6 text-2xl font-bold">Accentra — development build</h1>
      <HealthPanel />
      <p className="mt-6 text-sm text-slate-500">
        Sample: <span data-testid="sample-amount">{formatINR(12345678)}</span>
      </p>
    </main>
  );
}
