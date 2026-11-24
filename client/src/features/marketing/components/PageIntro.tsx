import type { ReactNode } from 'react';

/** The top of each marketing page: its only <h1> and a one-line summary. */
export function PageIntro({ title, subtitle }: { title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-h1 text-brand-navy sm:text-display">{title}</h1>
        {subtitle && <p className="max-w-2xl text-body-lg text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

/** Numbered vertical steps (How it works). */
export function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="relative max-w-2xl space-y-8">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4">
          {index < steps.length - 1 && (
            <span aria-hidden className="absolute top-10 bottom-[-2rem] left-4.5 w-px bg-border" />
          )}
          <span
            aria-hidden
            className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-body font-semibold text-primary-fg tabular"
          >
            {index + 1}
          </span>
          <div className="space-y-1 pt-1">
            <h3 className="text-h3">{step.title}</h3>
            <p className="text-body-lg text-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
