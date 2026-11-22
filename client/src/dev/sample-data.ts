/**
 * OBVIOUSLY FAKE sample data for the dev showcase only. Never import outside src/dev.
 */
import type { ComboboxOption } from '../components/ui/Combobox';
import type { SelectOption } from '../components/ui/Select';

export const SAMPLE_PAYMENT_METHODS: SelectOption[] = [
  { value: 'upi', label: 'UPI' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'cheque', label: 'Cheque', disabled: true },
];

export const SAMPLE_STATES: ComboboxOption[] = [
  ['33', 'Tamil Nadu'],
  ['29', 'Karnataka'],
  ['27', 'Maharashtra'],
  ['32', 'Kerala'],
  ['36', 'Telangana'],
  ['37', 'Andhra Pradesh'],
  ['07', 'Delhi'],
  ['24', 'Gujarat'],
  ['09', 'Uttar Pradesh'],
  ['19', 'West Bengal'],
].map(([code, name]) => ({ value: code!, label: name!, keywords: [code!] }));

export interface SampleRow {
  id: string;
  date: string;
  party: string;
  category: string;
  amountPaise: number;
  status: 'paid' | 'unpaid' | 'overdue';
}

const CATEGORIES = ['Rent', 'Sales', 'Utilities', 'Salaries', 'Supplies'];
const STATUSES: SampleRow['status'][] = ['paid', 'unpaid', 'overdue'];

/** 25 rows of OBVIOUSLY fake data ("Sample Party 01" …) for the DataTable demo. */
export const SAMPLE_ROWS: SampleRow[] = Array.from({ length: 25 }, (_, i) => {
  const n = i + 1;
  return {
    id: `sample-${n}`,
    date: `2026-10-${String(((n * 7) % 28) + 1).padStart(2, '0')}`,
    party: `Sample Party ${String(n).padStart(2, '0')}`,
    category: CATEGORIES[i % CATEGORIES.length]!,
    amountPaise: ((n * 7919) % 500) * 10_000 + n * 1_25,
    status: STATUSES[i % STATUSES.length]!,
  };
});

/** Six months of made-up totals (paise) for the chart demo. */
export const SAMPLE_TREND = [
  { month: 'Jun', inPaise: 42_000_000, outPaise: 31_000_000 },
  { month: 'Jul', inPaise: 51_500_000, outPaise: 36_000_000 },
  { month: 'Aug', inPaise: 47_000_000, outPaise: 39_500_000 },
  { month: 'Sep', inPaise: 63_000_000, outPaise: 41_000_000 },
  { month: 'Oct', inPaise: 58_500_000, outPaise: 44_000_000 },
  { month: 'Nov', inPaise: 72_000_000, outPaise: 47_500_000 },
];
