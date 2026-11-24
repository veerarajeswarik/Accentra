import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { PageMeta } from '../../../components/layout/PageMeta';
import { PageIntro } from '../components/PageIntro';

/** When the drafts below were last changed (update together with the copy). */
const LAST_UPDATED = '24 Nov 2026';

const DOCUMENTS = {
  privacy: {
    path: '/privacy',
    sections: ['collect', 'why', 'sharing', 'delete', 'contact'],
  },
  terms: {
    path: '/terms',
    sections: ['demo', 'advice', 'account', 'data', 'changes'],
  },
} as const;

type LegalDoc = keyof typeof DOCUMENTS;

/** Draft legal page with a prominent "pending legal review" banner. Plain text only. */
function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t } = useTranslation('marketing');
  const { path, sections } = DOCUMENTS[doc];

  return (
    <>
      <PageMeta title={t(`legal.${doc}.title`)} description={t(`meta.${doc}`)} path={path} />
      <PageIntro title={t(`legal.${doc}.title`)} />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div
          role="note"
          className="mb-8 flex items-start gap-3 rounded-card border border-warning bg-warning/10 p-4 text-text"
        >
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-warning" />
          <p className="text-body font-semibold">{t('legal.banner')}</p>
        </div>

        <p className="mb-2 text-small font-normal text-muted">
          {t('legal.updated', { date: LAST_UPDATED })}
        </p>
        <p className="mb-10 text-body-lg">{t(`legal.${doc}.intro`)}</p>

        <div className="space-y-8">
          {sections.map((key, index) => (
            <section key={key} aria-labelledby={`${doc}-${key}`} className="space-y-2">
              <h2 id={`${doc}-${key}`} className="text-h2">
                {index + 1}. {t(`legal.${doc}.sections.${key}.title`)}
              </h2>
              <p className="text-body-lg text-muted">{t(`legal.${doc}.sections.${key}.body`)}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-border pt-6 text-body text-muted">
          <Link to="/contact" className="text-primary hover:underline">
            {t('legal.contactLine')}
          </Link>
        </p>
      </div>
    </>
  );
}

export function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}

export function TermsPage() {
  return <LegalPage doc="terms" />;
}
