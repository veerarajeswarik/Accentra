import { Hammer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

export interface ComingSoonPageProps {
  /** Already-translated page name. */
  title: string;
  /** Roadmap phase that builds this page. */
  phase: number;
}

/**
 * Honest placeholder for a route that is not built yet. It deliberately has NO buttons:
 * nothing here pretends to work (AI_RULES 4, 15, 16).
 */
export function ComingSoonPage({ title, phase }: ComingSoonPageProps) {
  const { t } = useTranslation('pages');
  return (
    <div className="mx-auto max-w-2xl py-6">
      <title>{`${title} · Accentra`}</title>
      <Card>
        <EmptyState
          icon={<Hammer />}
          titleAs="h1"
          title={title}
          description={
            <>
              <Badge variant="info" className="mb-3">
                {t('comingSoon.badge')}
              </Badge>
              <p className="font-medium text-text" data-testid="planned-phase">
                {t('comingSoon.planned', { phase })}
              </p>
              <p className="mt-1">{t('comingSoon.body')}</p>
            </>
          }
        />
      </Card>
    </div>
  );
}
