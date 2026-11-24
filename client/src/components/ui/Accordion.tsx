import { ChevronDown } from 'lucide-react';
import { Accordion as RadixAccordion } from 'radix-ui';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: readonly AccordionItemData[];
  /** "single": one open at a time (default). "multiple": any number open. */
  type?: 'single' | 'multiple';
  /** Heading level of each question (keeps the page outline correct). */
  headingLevel?: 'h2' | 'h3' | 'h4';
  defaultOpen?: string[];
  className?: string;
}

/**
 * Expandable list (FAQ, help). Keyboard: Tab between questions, Enter/Space toggles,
 * arrow keys move between headers (Radix).
 */
export function Accordion({
  items,
  type = 'single',
  headingLevel = 'h3',
  defaultOpen,
  className,
}: AccordionProps) {
  const Heading = headingLevel;
  const rootClass = cn(
    'divide-y divide-border rounded-card border border-border bg-surface',
    className,
  );

  const children = items.map((item) => (
    <RadixAccordion.Item key={item.id} value={item.id}>
      <RadixAccordion.Header asChild>
        <Heading className="m-0">
          <RadixAccordion.Trigger
            className={cn(
              'group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-body-lg font-medium text-text',
              'transition-colors duration-150 ease-out hover:bg-surface-2',
            )}
          >
            {item.title}
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-muted transition-transform duration-150 group-data-[state=open]:rotate-180"
            />
          </RadixAccordion.Trigger>
        </Heading>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="px-5 pb-4 text-body text-muted">
        {item.content}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  ));

  return type === 'multiple' ? (
    <RadixAccordion.Root type="multiple" defaultValue={defaultOpen} className={rootClass}>
      {children}
    </RadixAccordion.Root>
  ) : (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={defaultOpen?.[0]}
      className={rootClass}
    >
      {children}
    </RadixAccordion.Root>
  );
}
