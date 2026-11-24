import { useTranslation } from 'react-i18next';
import { PageMeta } from '../../../components/layout/PageMeta';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardBody } from '../../../components/ui/Card';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { FEATURE_GROUPS, featureStatus, featuresByGroup } from '../featureStatus';

/** Status pills come ONLY from featureStatus.ts, so this page can't overclaim. */
export function FeaturesPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <PageMeta title={t('features.title')} description={t('meta.features')} path="/features" />
      <PageIntro title={t('features.title')} subtitle={t('features.subtitle')} />
      {FEATURE_GROUPS.map((group, index) => (
        <Section
          key={group}
          id={`group-${group}`}
          title={t(`features.groups.${group}`)}
          tone={index % 2 === 1 ? 'muted' : 'plain'}
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuresByGroup(group).map((feature) => {
              const status = featureStatus(feature);
              const Icon = feature.icon;
              return (
                <li key={feature.id} data-testid={`feature-${feature.id}`}>
                  <Card className="h-full">
                    <CardBody className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden
                          className="flex size-9 items-center justify-center rounded-control bg-primary/10 text-primary"
                        >
                          <Icon className="size-4" />
                        </span>
                        <Badge variant={status === 'available' ? 'success' : 'neutral'}>
                          {status === 'available' ? t('status.available') : t('status.comingSoon')}
                        </Badge>
                      </div>
                      <h3 className="text-h3">{t(`features.items.${feature.id}.title`)}</h3>
                      <p className="text-body text-muted">
                        {t(`features.items.${feature.id}.body`)}
                      </p>
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      ))}
    </>
  );
}
