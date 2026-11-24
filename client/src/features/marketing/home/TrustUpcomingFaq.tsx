import { Bot, FileText, History, Languages, Lock, Mic, ShieldCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Accordion } from '../../../components/ui/Accordion';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { IconPoint, Section } from '../components/Section';

const TRUST = [
  { key: 'https', icon: <Lock /> },
  { key: 'sharing', icon: <Users /> },
  { key: 'history', icon: <History /> },
  { key: 'verified', icon: <ShieldCheck /> },
] as const;

/** TRUE statements only — no certifications or standards we don't have. */
export function TrustSection() {
  const { t } = useTranslation('marketing');
  return (
    <Section id="trust" title={t('home.trust.title')} tone="muted">
      <ul className="grid gap-8 md:grid-cols-2">
        {TRUST.map((item) => (
          <li key={item.key}>
            <IconPoint
              icon={item.icon}
              title={t(`home.trust.items.${item.key}.title`)}
              body={t(`home.trust.items.${item.key}.body`)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

const UPCOMING = [
  { key: 'ai', icon: <Bot /> },
  { key: 'languages', icon: <Languages /> },
  { key: 'voice', icon: <Mic /> },
  { key: 'gst', icon: <FileText /> },
] as const;

export function UpcomingSection() {
  const { t } = useTranslation('marketing');
  return (
    <Section id="upcoming" title={t('home.upcoming.title')} subtitle={t('home.upcoming.subtitle')}>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {UPCOMING.map((item) => (
          <li key={item.key}>
            <Card className="h-full">
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <span aria-hidden className="text-muted [&_svg]:size-5">
                    {item.icon}
                  </span>
                  <Badge variant="neutral">{t('status.comingSoon')}</Badge>
                </div>
                <h3 className="text-h3">{t(`home.upcoming.items.${item.key}.title`)}</h3>
                <p className="text-body text-muted">{t(`home.upcoming.items.${item.key}.body`)}</p>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export const FAQ_KEYS = [
  'sharing',
  'needCa',
  'replaceCa',
  'gst',
  'caNotOnAccentra',
  'languages',
  'simpleMode',
  'realBooks',
] as const;

export function FaqSection() {
  const { t } = useTranslation('marketing');
  return (
    <Section id="faq" title={t('home.faq.title')} tone="muted">
      <Accordion
        className="max-w-3xl"
        items={FAQ_KEYS.map((key) => ({
          id: key,
          title: t(`home.faq.items.${key}.q`),
          content: <p>{t(`home.faq.items.${key}.a`)}</p>,
        }))}
      />
    </Section>
  );
}

export function CtaBand() {
  const { t } = useTranslation('marketing');
  return (
    <section aria-labelledby="cta-title" className="bg-brand-panel text-brand-panel-fg">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-2">
          <h2 id="cta-title" className="text-h1">
            {t('home.cta.title')}
          </h2>
          <p className="text-body-lg opacity-80">{t('home.cta.body')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/register">{t('home.cta.primary')}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-brand-panel-fg hover:bg-brand-panel-fg/10"
          >
            <Link to="/contact">{t('home.cta.secondary')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
