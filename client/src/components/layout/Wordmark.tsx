import { cn } from '../../lib/cn';

/**
 * The "Accentra" wordmark: a simple ledger-tick mark + name. Pure SVG/CSS, colours from tokens.
 * `compact` shows only the mark (collapsed sidebar).
 */
export function Wordmark({
  compact = false,
  className,
  name = 'Accentra',
}: {
  compact?: boolean;
  className?: string;
  /** Brand name (not translated). */
  name?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold text-brand-navy', className)}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0">
        <rect x="2" y="2" width="20" height="20" rx="6" className="fill-primary" />
        <path
          d="M7 12.5l3.2 3.2L17 9"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-primary-fg"
        />
      </svg>
      <span className={cn('text-h3 tracking-tight', compact && 'sr-only')}>{name}</span>
    </span>
  );
}
