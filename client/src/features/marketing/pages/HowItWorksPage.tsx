import { useTranslation } from 'react-i18next';
import { PageMeta } from '../../../components/layout/PageMeta';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { PageIntro, StepList } from '../components/PageIntro';
import { Section } from '../components/Section';

const STEP_KEYS = ['s1', 's2', 's3', 's4', 's5'] as const;
const ROLES = ['entrepreneur', 'ca'] as const;

export function HowItWorksPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <PageMeta
        title={t('howItWorks.title')}
        description={t('meta.howItWorks')}
        path="/how-it-works"
      />
      <PageIntro title={t('howItWorks.title')} subtitle={t('howItWorks.subtitle')} />
      <Section>
        <Tabs defaultValue="entrepreneur">
          <TabsList aria-label={t('howItWorks.tabsLabel')} className="mb-8">
            {ROLES.map((role) => (
              <TabsTrigger key={role} value={role}>
                {t(`howItWorks.tabs.${role}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          {ROLES.map((role) => (
            <TabsContent key={role} value={role}>
              <StepList
                steps={STEP_KEYS.map((key) => ({
                  title: t(`howItWorks.${role}.${key}.title`),
                  body: t(`howItWorks.${role}.${key}.body`),
                }))}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Section>
    </>
  );
}
