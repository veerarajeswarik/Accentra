import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SpinnerProps {
  /** Screen-reader text. Omit when the spinner is decorative (e.g. inside a busy button). */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = { sm: 'size-4', md: 'size-5', lg: 'size-8' } as const;

export function Spinner({ label, size = 'md', className }: SpinnerProps) {
  if (!label) {
    return <Loader2 aria-hidden className={cn('animate-spin', SIZES[size], className)} />;
  }
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 aria-hidden className={cn('animate-spin text-muted', SIZES[size], className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
