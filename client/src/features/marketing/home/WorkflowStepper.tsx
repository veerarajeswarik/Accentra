import { Check } from 'lucide-react';
import { Tabs as RadixTabs } from 'radix-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../../components/ui/Card';
import { StatusBadge, type Status } from '../../../components/ui/StatusBadge';
import { Timeline, type TimelineItem } from '../../../components/ui/Timeline';
import { cn } from '../../../lib/cn';
import { Section } from '../components/Section';

/** The five review steps, each with the status the request has at that point. */
const STEPS: {
  key: string;
  status: Status;
  event: Omit<TimelineItem, 'actor' | 'action'> & { actor: 'owner' | 'ca'; action: string };
}[] = [
  {
    key: 'upload',
    status: 'draft',
    event: {
      id: 'e1',
      actor: 'owner',
      action: 'uploaded',
      at: '2026-11-02T10:05:00',
      tone: 'neutral',
    },
  },
  {
    key: 'submit',
    status: 'submitted',
    event: {
      id: 'e2',
      actor: 'owner',
      action: 'submitted',
      at: '2026-11-02T10:15:00',
      tone: 'primary',
    },
  },
  {
    key: 'clarify',
    status: 'needs_clarification',
    event: {
      id: 'e3',
      actor: 'ca',
      action: 'clarification',
      at: '2026-11-03T16:40:00',
      tone: 'warning',
    },
  },
  {
    key: 'resubmit',
    status: 'under_review',
    event: {
      id: 'e4',
      actor: 'owner',
      action: 'resubmitted',
      at: '2026-11-04T09:05:00',
      tone: 'primary',
    },
  },
  {
    key: 'approved',
    status: 'approved',
    event: {
      id: 'e5',
      actor: 'ca',
      action: 'approved',
      at: '2026-11-04T18:30:00',
      tone: 'success',
    },
  },
];

/**
 * Interactive 5-step walkthrough. Built on Radix Tabs, so arrow keys move between steps
 * and each step's panel is announced; panels reuse StatusBadge, Timeline and Card.
 */
export function WorkflowStepper() {
  const { t } = useTranslation('marketing');
  const [active, setActive] = useState(STEPS[0]!.key);
  const activeIndex = STEPS.findIndex((s) => s.key === active);

  return (
    <Section
      id="workflow"
      title={t('home.workflow.title')}
      subtitle={t('home.workflow.subtitle')}
      tone="muted"
    >
      <RadixTabs.Root value={active} onValueChange={setActive} className="space-y-6">
        <RadixTabs.List
          aria-label={t('home.workflow.stepsLabel')}
          className="grid grid-cols-1 gap-2 sm:grid-cols-5"
        >
          {STEPS.map((step, index) => {
            const done = index < activeIndex;
            return (
              <RadixTabs.Trigger
                key={step.key}
                value={step.key}
                className={cn(
                  'group flex items-center gap-3 rounded-card border border-border bg-surface px-3 py-3 text-left',
                  'transition-colors duration-150 ease-out hover:border-muted',
                  'data-[state=active]:border-primary data-[state=active]:bg-primary/5',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-small tabular',
                    done && 'border-primary bg-primary text-primary-fg',
                    'group-data-[state=active]:border-primary group-data-[state=active]:text-primary',
                  )}
                >
                  {done ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="text-body font-medium">
                  {t(`home.workflow.steps.${step.key}.title`)}
                </span>
              </RadixTabs.Trigger>
            );
          })}
        </RadixTabs.List>

        {STEPS.map((step, index) => (
          <RadixTabs.Content key={step.key} value={step.key}>
            <Card>
              <CardBody className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr]">
                <div className="space-y-3">
                  <StatusBadge status={step.status} />
                  <h3 className="text-h2">{t(`home.workflow.steps.${step.key}.title`)}</h3>
                  <p className="text-body-lg text-muted">
                    {t(`home.workflow.steps.${step.key}.body`)}
                  </p>
                </div>
                <Timeline
                  items={STEPS.slice(0, index + 1).map(({ event }) => ({
                    ...event,
                    actor: t(`home.workflow.actors.${event.actor}`),
                    action: t(`home.workflow.actions.${event.action}`),
                    note: event.action === 'clarification' ? t('home.workflow.note') : undefined,
                  }))}
                />
              </CardBody>
            </Card>
          </RadixTabs.Content>
        ))}
      </RadixTabs.Root>
    </Section>
  );
}
