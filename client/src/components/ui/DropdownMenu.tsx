import { Check } from 'lucide-react';
import { DropdownMenu as Radix } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

/* Keyboard: Enter/Space opens, arrows move, Esc closes, typeahead jumps — all from Radix. */

export const DropdownMenu = Radix.Root;
export const DropdownMenuTrigger = Radix.Trigger;
export const DropdownMenuGroup = Radix.Group;
export const DropdownMenuRadioGroup = Radix.RadioGroup;

const itemClasses = cn(
  'relative flex cursor-default items-center gap-2 rounded-control px-2 py-1.5 text-body text-text outline-none select-none',
  'data-highlighted:bg-surface-2 data-disabled:pointer-events-none data-disabled:opacity-50',
  '[&_svg]:size-4 [&_svg]:shrink-0',
);

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = 'end',
  ...props
}: ComponentProps<typeof Radix.Content>) {
  return (
    <Radix.Portal>
      <Radix.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'z-50 min-w-44 rounded-card border border-border bg-surface p-1 shadow-elevated animate-pop-in',
          className,
        )}
        {...props}
      />
    </Radix.Portal>
  );
}

export function DropdownMenuItem({
  className,
  destructive = false,
  ...props
}: ComponentProps<typeof Radix.Item> & { destructive?: boolean }) {
  return (
    <Radix.Item className={cn(itemClasses, destructive && 'text-danger', className)} {...props} />
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof Radix.RadioItem>) {
  return (
    <Radix.RadioItem className={cn(itemClasses, 'pl-8', className)} {...props}>
      <span className="absolute left-2 inline-flex size-4 items-center justify-center">
        <Radix.ItemIndicator>
          <Check />
        </Radix.ItemIndicator>
      </span>
      {children}
    </Radix.RadioItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof Radix.Label>) {
  return <Radix.Label className={cn('label-caps px-2 py-1.5 text-muted', className)} {...props} />;
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof Radix.Separator>) {
  return <Radix.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}
