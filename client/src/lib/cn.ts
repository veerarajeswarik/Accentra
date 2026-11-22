import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * tailwind-merge must know our custom font sizes and radii, otherwise it would treat
 * `text-small` (a size) and `text-muted` (a colour) as conflicting and drop one of them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'h1', 'h2', 'h3', 'body', 'body-lg', 'small', 'stat'],
      radius: ['control', 'card', 'dialog'],
    },
  },
});

/** Combine class names; later Tailwind classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
