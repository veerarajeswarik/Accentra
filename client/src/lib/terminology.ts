/**
 * Simple ⇄ Professional vocabulary. Each entry points at two i18n keys (namespace "terms"),
 * so Phase 22 translations need no code changes — only new locale files.
 * Add a term: add the key here AND both strings to locales/en/terms.json.
 */
import { useTranslation } from 'react-i18next';
import { useMode } from '../providers/ModeProvider';

interface TermEntry {
  simple: string;
  professional: string;
}

export const TERMS = {
  revenue: { simple: 'terms:revenue.simple', professional: 'terms:revenue.professional' },
  expenses: { simple: 'terms:expenses.simple', professional: 'terms:expenses.professional' },
  netProfit: { simple: 'terms:netProfit.simple', professional: 'terms:netProfit.professional' },
  receivables: {
    simple: 'terms:receivables.simple',
    professional: 'terms:receivables.professional',
  },
  payables: { simple: 'terms:payables.simple', professional: 'terms:payables.professional' },
  cashBalance: {
    simple: 'terms:cashBalance.simple',
    professional: 'terms:cashBalance.professional',
  },
} as const satisfies Record<string, TermEntry>;

export type TermKey = keyof typeof TERMS;

/** The label for a term in the current mode, e.g. useTerm('revenue') → "Money In". */
export function useTerm(key: TermKey): string {
  const { mode } = useMode();
  const { t } = useTranslation();
  return t(TERMS[key][mode]);
}
