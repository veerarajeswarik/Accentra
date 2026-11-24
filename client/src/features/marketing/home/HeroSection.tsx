import { formatINR } from '@accentra/shared';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Timeline } from '../../../components/ui/Timeline';
import { useTerm } from '../../../lib/terminology';

/**
 * Miniature dashboard built from REAL design-system components with obviously sample
 * numbers. `inert` keeps it out of the tab order; role="img" + label describes it.
 */
function ProductPreview() {
  const { t } = useTranslation('marketing');
  const moneyIn = useTerm('revenue');
  const moneyOut = useTerm('expenses');
  const profit = useTerm('netProfit');

  return (
    <div role="img" aria-label={t('home.hero.previewLabel')} className="relative">
      <div
        inert
        className="space-y-3 rounded-dialog border border-border bg-bg p-3 shadow-elevated sm:p-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-h3">{t('home.hero.previewTitle')}</p>
          <Badge variant="warning">{t('status.sample')}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={moneyIn}
            value={formatINR(48_250_000, { compact: true })}
            delta={{ value: 12, format: (n) => `${n}%` }}
          />
          <StatCard
            label={moneyOut}
            value={formatINR(31_400_000, { compact: true })}
            delta={{ value: 4, format: (n) => `${n}%`, positiveIsGood: false }}
          />
          <StatCard
            className="col-span-2"
            label={profit}
            value={formatINR(16_850_000)}
            delta={{ value: 18, format: (n) => `${n}%` }}
          />
        </div>
        <Card>
          <CardBody className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body font-medium">{t('home.hero.previewReview')}</p>
              <StatusBadge status="approved" />
            </div>
            <Timeline
              items={[
                {
                  id: 'p1',
                  actor: t('home.workflow.actors.ca'),
                  action: t('home.workflow.actions.clarification'),
                  at: '2026-11-03T16:40:00',
                  tone: 'warning',
                },
                {
                  id: 'p2',
                  actor: t('home.workflow.actors.ca'),
                  action: t('home.workflow.actions.approved'),
                  at: '2026-11-04T18:30:00',
                  tone: 'success',
                },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useTranslation('marketing');
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <Badge variant="info">{t('status.inDevelopment')}</Badge>
          <h1 id="hero-title" className="text-h1 text-brand-navy sm:text-display">
            {t('home.hero.title')}
          </h1>
          <p className="max-w-xl text-body-lg text-muted">{t('home.hero.subtitle')}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                {t('home.hero.primary')}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/how-it-works">{t('home.hero.secondary')}</Link>
            </Button>
          </div>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}
