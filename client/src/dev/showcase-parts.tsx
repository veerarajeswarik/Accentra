/**
 * DEV-ONLY building blocks for the component showcase. Not shipped to production
 * (the /dev route is registered only when import.meta.env.DEV). Literal English is allowed here.
 */
import type { ReactNode } from 'react';

export function ShowcaseSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-4">
      <h2 id={`${id}-title`} className="border-b border-border pb-2 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="label-caps text-muted">{label}</p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}
