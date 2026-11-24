/**
 * Entry of the lazily loaded marketing chunk (public website).
 * Importing it registers the "marketing" translations, then exposes the pages.
 * Every export here must match a `page` in client/src/routes/public-pages.ts.
 */
import './i18n';

export { AboutPage } from './pages/AboutPage';
export { ContactPage } from './pages/ContactPage';
export { FeaturesPage } from './pages/FeaturesPage';
export { HomePage } from './pages/HomePage';
export { HowItWorksPage } from './pages/HowItWorksPage';
export { PrivacyPage, TermsPage } from './pages/LegalPage';
