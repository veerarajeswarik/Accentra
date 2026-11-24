import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

/** 404 for unknown routes. `homeTo` lets each workspace send users back to its own home. */
export function NotFoundPage({ homeTo = '/' }: { homeTo?: string }) {
  const { t } = useTranslation('pages');
  return (
    <div className="mx-auto max-w-xl py-16">
      <title>{`${t('notFound.title')} · Accentra`}</title>
      <meta name="robots" content="noindex" />
      <EmptyState
        icon={<SearchX />}
        titleAs="h1"
        title={t('notFound.title')}
        description={t('notFound.body')}
        action={
          <Button asChild>
            <Link to={homeTo}>{t('notFound.home')}</Link>
          </Button>
        }
      />
    </div>
  );
}
