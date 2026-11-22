import { AlertCircle } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Label } from './Label';

/** Props FormField hands to its control so label, helper and error are wired for screen readers. */
export interface FieldControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  'aria-required': true | undefined;
}

export interface FormFieldProps {
  label: ReactNode;
  /** Render the control with the provided accessibility props spread onto it. */
  children: (control: FieldControlProps) => ReactNode;
  helper?: ReactNode;
  /** Error text; when present the control is marked aria-invalid and the error is announced. */
  error?: ReactNode;
  required?: boolean;
  /** Screen-reader word for the required asterisk, e.g. t('ui:required'). */
  requiredText?: string;
  className?: string;
  /** Use a fixed id instead of a generated one. */
  id?: string;
}

/**
 * Label + control + helper + error, with correct aria wiring:
 *   <FormField label="Amount" error={err}>{(p) => <MoneyInput {...p} … />}</FormField>
 */
export function FormField({
  label,
  children,
  helper,
  error,
  required = false,
  requiredText,
  className,
  id: fixedId,
}: FormFieldProps) {
  const generatedId = useId();
  const id = fixedId ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy =
    [helper ? helperId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} required={required} requiredText={requiredText}>
        {label}
      </Label>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {helper && (
        <p id={helperId} className="text-small font-normal text-muted">
          {helper}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-small font-normal text-danger"
        >
          <AlertCircle aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
