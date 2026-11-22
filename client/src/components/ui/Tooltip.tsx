import { Tooltip as RadixTooltip } from 'radix-ui';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Wrap the app once (AppProviders) so tooltips share open/close delays. */
export const TooltipProvider = RadixTooltip.Provider;

export interface TooltipProps {
  content: ReactNode;
  /** A single focusable element (button, link). */
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

/** Supplementary hint on hover AND keyboard focus. Never put essential information only here. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 max-w-xs rounded-control bg-text px-2 py-1 text-small text-surface shadow-elevated',
            'animate-fade-in',
            className,
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-text" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
