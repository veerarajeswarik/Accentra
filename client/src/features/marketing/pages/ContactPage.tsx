import { useTranslation } from 'react-i18next';
import { PageMeta } from '../../../components/layout/PageMeta';
import { PageIntro } from '../components/PageIntro';
import { ContactForm } from '../contact/ContactForm';

export function ContactPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <PageMeta title={t('contact.title')} description={t('meta.contact')} path="/contact" />
      <PageIntro title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ContactForm />
      </div>
    </>
  );
}
