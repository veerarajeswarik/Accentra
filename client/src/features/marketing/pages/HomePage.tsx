import { useTranslation } from 'react-i18next';
import { PageMeta } from '../../../components/layout/PageMeta';
import { HeroSection } from '../home/HeroSection';
import { ModeDemo } from '../home/ModeDemo';
import { AudienceSections, ProblemStrip } from '../home/ProblemsAudiences';
import { CtaBand, FaqSection, TrustSection, UpcomingSection } from '../home/TrustUpcomingFaq';
import { WorkflowStepper } from '../home/WorkflowStepper';

export function HomePage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <PageMeta description={t('meta.home')} path="/" />
      <HeroSection />
      <ProblemStrip />
      <AudienceSections />
      <WorkflowStepper />
      <ModeDemo />
      <TrustSection />
      <UpcomingSection />
      <FaqSection />
      <CtaBand />
    </>
  );
}
