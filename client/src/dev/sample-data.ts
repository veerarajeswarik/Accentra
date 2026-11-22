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
