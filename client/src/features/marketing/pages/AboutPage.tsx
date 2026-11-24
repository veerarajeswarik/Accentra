import { Bot, Eye, IndianRupee, Sparkles, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageMeta } from '../../../components/layout/PageMeta';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardBody } from '../../../components/ui/Card';
import { PageIntro } from '../components/PageIntro';
import { IconPoint, Section } from '../components/Section';

const PRINCIPLES = [
  { key: 'simple', icon: <Sparkles /> },
  { key: 'transparent', icon: <Eye /> },
  { key: 'india', icon: <IndianRupee /> },
  { key: 'ai', icon: <Bot /> },
] as const;

export function AboutPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <PageMeta title={t('about.title')} description={t('meta.about')} path="/about" />
      <PageIntro title={t('about.title')} />

      <Section id="mission" title={t('about.mission.title')}>
        <p className="max-w-3xl text-body-lg text-text">{t('about.mission.body')}</p>
      </Section>

      <Section id="principles" title={t('about.principles.title')} tone="muted">
        <ul className="grid gap-8 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.key}>
              <IconPoint
                icon={p.icon}
                title={t(`about.principles.${p.key}.title`)}
                body={t(`about.principles.${p.key}.body`)}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="team" title={t('about.team.title')}>
        {/* TODO(founder): replace with the founder's real name, photo and short bio. */}
        <Card className="max-w-md border-dashed">
          <CardBody className="flex items-center gap-4">
            <span
              aria-hidden
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted"
            >
              <UserRound className="size-6" />
            </span>
            <div className="space-y-1">
              <Badge variant="warning">{t('about.team.todoLabel')}</Badge>
              <p className="text-body text-muted">{t('about.team.todo')}</p>
            </div>
          </CardBody>
        </Card>
      </Section>
    </>
  );
}
