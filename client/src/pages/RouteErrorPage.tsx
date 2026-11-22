import { useTranslation } from 'react-i18next';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { NotFoundPage } from './NotFoundPage';

/**
 * Router error boundary: a 404 response shows NotFound; anything else shows a plain-language
 * ErrorState. Technical details are only logged to the console (and to Sentry from Phase 15).
 */
export function RouteErrorPage() {
  const { t } = useTranslation('pages');
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  console.error(error);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg p-4">
      <ErrorState
        title={t('routeError.title')}
        message={t('routeError.body')}
        onRetry={() => window.location.reload()}
        retryLabel={t('routeError.reload')}
        actions={
          <Button asChild variant="ghost">
            <Link to="/" reloadDocument>
              {t('routeError.home')}
            </Link>
          </Button>
        }
      />
    </div>
  );
}
