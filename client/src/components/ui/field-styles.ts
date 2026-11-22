/**
 * Shared look of every text-like control (Input, Textarea, Select, Combobox, DatePicker),
 * so all fields are 36px high with the same border, focus and error treatment (5.5 Inputs).
 */
export const fieldBase = [
  'w-full rounded-control border border-border bg-surface text-body text-text',
  'placeholder:text-muted transition-colors duration-150 ease-out',
  'hover:border-muted focus-visible:border-primary',
  'aria-invalid:border-danger',
  'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60',
].join(' ');

export const fieldHeight = 'h-9 px-3';
