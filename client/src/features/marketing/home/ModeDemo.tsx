import { formatINR } from '@accentra/shared';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/ui/Badge';
import { ModeToggle } from '../../../components/ui/ModeToggle';
import { StatCard } from '../../../components/ui/StatCard';
import { useTerm, type TermKey } from '../../../lib/terminology';
import { Section } from '../components/Section';

const SAMPLE: { term: TermKey; paise: number }[] = [
  { term: 'revenue', paise: 48_250_000 },
  { term: 'expenses', paise: 31_400_000 },
  { term: 'receivables', paise: 6_200_000 },
  { term: 'payables', paise: 2_850_000 },
];

function TermCard({ term, paise }: { term: TermKey; paise: number }) {
  return <StatCard label={useTerm(term)} value={formatINR(paise, { compact: true })} />;
}

/** Uses the REAL terminology map and the app-wide mode, so the demo can't drift from the product. */
export function ModeDemo() {
  const { t } = useTranslation('marketing');
  return (
    <Section id="modes" title={t('home.modes.title')} subtitle={t('home.modes.subtitle')}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-body text-muted">{t('home.modes.toggleHint')}</span>
        <ModeToggle />
        <Badge variant="warning">{t('status.sample')}</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-live="polite">
        {SAMPLE.map((s) => (
          <TermCard key={s.term} {...s} />
        ))}
      </div>
    </Section>
  );
}
