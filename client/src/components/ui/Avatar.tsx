import { Avatar as RadixAvatar } from 'radix-ui';
import { cn } from '../../lib/cn';

export interface AvatarProps {
  /** Person or business name; used for the initials fallback and the image alt text. */
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'size-7 text-[11px]',
  md: 'size-9 text-small',
  lg: 'size-12 text-body',
} as const;

/** "Priya Sharma" → "PS"; "accentra" → "A". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 font-semibold text-primary select-none',
        SIZES[size],
        className,
      )}
    >
      {src && <RadixAvatar.Image src={src} alt={name} className="size-full object-cover" />}
      <RadixAvatar.Fallback aria-label={name} delayMs={src ? 300 : 0}>
        <span aria-hidden>{initialsOf(name)}</span>
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
