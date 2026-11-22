import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';
import { fieldBase } from './field-styles';

export function Textarea({ className, rows = 4, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea rows={rows} className={cn(fieldBase, 'min-h-20 px-3 py-2', className)} {...props} />
  );
}
