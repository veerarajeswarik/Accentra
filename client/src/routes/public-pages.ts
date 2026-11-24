/**
 * The public website pages (built in Phase 3). Each maps to a component exported by the
 * lazily loaded marketing chunk (client/src/features/marketing/index.ts).
 */
export const PUBLIC_PAGES = [
  { path: '', titleKey: 'pages:titles.home', page: 'HomePage' },
  { path: 'features', titleKey: 'pages:titles.features', page: 'FeaturesPage' },
  { path: 'how-it-works', titleKey: 'pages:titles.howItWorks', page: 'HowItWorksPage' },
  { path: 'about', titleKey: 'pages:titles.about', page: 'AboutPage' },
  { path: 'contact', titleKey: 'pages:titles.contact', page: 'ContactPage' },
  { path: 'privacy', titleKey: 'pages:titles.privacy', page: 'PrivacyPage' },
  { path: 'terms', titleKey: 'pages:titles.terms', page: 'TermsPage' },
] as const;

export type PublicPageComponent = (typeof PUBLIC_PAGES)[number]['page'];
