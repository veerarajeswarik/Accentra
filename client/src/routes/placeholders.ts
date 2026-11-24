/**
 * Auth routes that are not built yet, with the roadmap phase that builds them
 * (MASTER_PLAN Part 4.2 and Part 7). Public pages (built in Phase 3) live in public-pages.ts;
 * workspace routes live in components/layout/nav-config.ts.
 */
export interface PlaceholderPage {
  /** Path relative to the root, "" for the home page. */
  path: string;
  /** i18n key of the page name. */
  titleKey: string;
  phase: number;
}

export const AUTH_PAGES: PlaceholderPage[] = [
  { path: 'login', titleKey: 'pages:titles.login', phase: 4 },
  { path: 'register', titleKey: 'pages:titles.register', phase: 4 },
  { path: 'forgot-password', titleKey: 'pages:titles.forgotPassword', phase: 4 },
  { path: 'reset-password', titleKey: 'pages:titles.resetPassword', phase: 4 },
  { path: 'verify-email', titleKey: 'pages:titles.verifyEmail', phase: 4 },
  { path: 'onboarding/business', titleKey: 'pages:titles.onboardingBusiness', phase: 5 },
  { path: 'onboarding/ca-profile', titleKey: 'pages:titles.onboardingCaProfile', phase: 5 },
  { path: 'invite/:token', titleKey: 'pages:titles.invite', phase: 11 },
];

/** Workspace routes that are not sidebar items (detail pages). */
export const CA_EXTRA_PAGES: PlaceholderPage[] = [
  { path: 'clients/:businessId', titleKey: 'pages:titles.clientWorkspace', phase: 12 },
];
