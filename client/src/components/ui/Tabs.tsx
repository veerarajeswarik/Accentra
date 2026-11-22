import { Tabs as RadixTabs } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

/** Arrow keys move between tabs; Home/End jump to first/last (Radix). */
export const Tabs = RadixTabs.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn('flex gap-1 overflow-x-auto border-b border-border', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        '-mb-px inline-flex h-10 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-body font-medium text-muted',
        'transition-colors duration-150 ease-out hover:text-text',
        'data-[state=active]:border-primary data-[state=active]:text-text',
        'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof RadixTabs.Content>) {
  return <RadixTabs.Content className={cn('pt-4', className)} {...props} />;
}
