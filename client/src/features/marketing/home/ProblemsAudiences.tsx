import {
  BadgeCheck,
  ClipboardList,
  FileStack,
  FolderOpen,
  HelpCircle,
  LineChart,
  MessageCircleQuestion,
  NotebookPen,
  Repeat,
  Scale,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { IconPoint, Section } from '../components/Section';

const PROBLEMS = [
  { key: 'scattered', icon: <FileStack /> },
  { key: 'numbers', icon: <HelpCircle /> },
  { key: 'chasing', icon: <Repeat /> },
] as const;

export function ProblemStrip() {
  const { t } = useTranslation('marketing');
  return (
    <Section id="problems" title={t('home.problems.title')} tone="muted">
      <ul className="grid gap-6 md:grid-cols-3">
        {PROBLEMS.map((p) => (
          <li key={p.key}>
            <IconPoint
              icon={p.icon}
              title={t(`home.problems.items.${p.key}.title`)}
              body={t(`home.problems.items.${p.key}.body`)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

const AUDIENCES = [
  {
    key: 'entrepreneurs',
    role: 'entrepreneur',
    items: [
      ['record', <NotebookPen key="i" />],
      ['oneplace', <FolderOpen key="i" />],
      ['understand', <LineChart key="i" />],
      ['ownCa', <UserCheck key="i" />],
    ],
  },
  {
    key: 'cas',
    role: 'ca',
    items: [
      ['queue', <ClipboardList key="i" />],
      ['clarify', <MessageCircleQuestion key="i" />],
      ['ledger', <Scale key="i" />],
      ['verified', <BadgeCheck key="i" />],
    ],
  },
] as const;

export function AudienceSections() {
  const { t } = useTranslation('marketing');
  return (
    <Section id="audiences">
      <div className="grid gap-6 lg:grid-cols-2">
        {AUDIENCES.map((audience) => (
          <Card key={audience.key} className="flex flex-col">
            <CardBody className="flex flex-1 flex-col gap-6 p-6 md:p-8">
              <div className="space-y-2">
                <h2 className="text-h2">{t(`home.audiences.${audience.key}.title`)}</h2>
                <p className="text-body-lg text-muted">
                  {t(`home.audiences.${audience.key}.body`)}
                </p>
              </div>
              <ul className="flex-1 space-y-5">
                {audience.items.map(([key, icon]) => (
                  <li key={key}>
                    <IconPoint
                      icon={icon}
                      title={t(`home.audiences.${audience.key}.items.${key}.title`)}
                      body={t(`home.audiences.${audience.key}.items.${key}.body`)}
                    />
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={audience.role === 'ca' ? 'secondary' : 'primary'}
                className="self-start"
              >
                <Link to={`/register?role=${audience.role}`}>
                  {t(`home.audiences.${audience.key}.cta`)}
                </Link>
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}
