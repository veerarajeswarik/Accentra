import { formatINR, MoneyError, toPaise } from '@accentra/shared';
import { useId, useState, type ComponentProps, type FocusEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Input } from './Input';

/** "₹1,23,456.78" → "1,23,456.78" (and "-₹50.00" → "-50.00"). */
function formatForInput(paise: number): string {
  return formatINR(paise).replace('₹', '');
}

export interface MoneyInputProps extends Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type'
> {
  /** Current amount in integer paise, or null when empty/invalid. */
  valuePaise: number | null;
  /** Called on every keystroke with integer paise, or null when the text is empty or invalid. */
  onValueChange: (paise: number | null) => void;
  allowNegative?: boolean;
  /** Override the default invalid-amount message. */
  invalidMessage?: string;
}

/**
 * Rupee amount field. Accepts "1500", "1,500.50", "1,23,456.78"; emits INTEGER PAISE via
 * @accentra/shared toPaise (never floats). Formats with Indian grouping on blur and shows its
 * own error for text that is not a valid amount.
 */
export function MoneyInput({
  valuePaise,
  onValueChange,
  allowNegative = false,
  invalidMessage,
  onBlur,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: MoneyInputProps) {
  const { t } = useTranslation('ui');
  const errorId = useId();
  const [text, setText] = useState(() => (valuePaise === null ? '' : formatForInput(valuePaise)));
  const [lastValue, setLastValue] = useState<number | null>(valuePaise);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // If the parent changes the value (e.g. form reset), show the new value.
  if (valuePaise !== lastValue) {
    setLastValue(valuePaise);
    setText(valuePaise === null ? '' : formatForInput(valuePaise));
    setError(null);
  }

  function parse(raw: string): { paise: number | null; error: string | null } {
    if (raw.trim() === '') return { paise: null, error: null };
    try {
      return { paise: toPaise(raw, { allowNegative }), error: null };
    } catch (err) {
      const negative = err instanceof MoneyError && /negative/.test(err.message);
      return {
        paise: null,
        error: negative ? t('money.negative') : (invalidMessage ?? t('money.invalid')),
      };
    }
  }

  function handleChange(raw: string) {
    setText(raw);
    const result = parse(raw);
    setError(result.error);
    setLastValue(result.paise);
    onValueChange(result.paise);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setTouched(true);
    const result = parse(text);
    if (result.paise !== null) setText(formatForInput(result.paise));
    onBlur?.(event);
  }

  const showError = touched && error !== null;

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        startAdornment="₹"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        aria-invalid={showError || ariaInvalid ? true : undefined}
        aria-describedby={
          [describedBy, showError ? errorId : null].filter(Boolean).join(' ') || undefined
        }
        className={cn('tabular text-right', className)}
        {...props}
      />
      {showError && (
        <p id={errorId} role="alert" className="text-small font-normal text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
