/**
 * i18n setup (react-i18next). English only until Phase 22 adds Tamil and Hindi.
 * RULE: every user-facing string goes through t('namespace:key').
 * Locale files: src/locales/<lang>/<namespace>.json
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import common from '../locales/en/common.json';
import nav from '../locales/en/nav.json';
import pages from '../locales/en/pages.json';
import terms from '../locales/en/terms.json';
import ui from '../locales/en/ui.json';
import validation from '../locales/en/validation.json';

export const LANGUAGE_STORAGE_KEY = 'accentra-lang';

export interface LanguageOption {
  code: string;
  /** Shown in its own script, so it is not translated. */
  nativeName: string;
  /** False until its translations ship (Phase 22). */
  available: boolean;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', nativeName: 'English', available: true },
  { code: 'ta', nativeName: 'தமிழ்', available: false },
  { code: 'hi', nativeName: 'हिन्दी', available: false },
];

export const resources = {
  en: { common, terms, ui, nav, pages, validation },
} as const;

export const NAMESPACES = Object.keys(resources.en);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: NAMESPACES,
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.filter((l) => l.available).map((l) => l.code),
    initAsync: false,
    interpolation: { escapeValue: false }, // React already escapes output
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
