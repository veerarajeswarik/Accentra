import { ToggleGroup } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { useMode, type AppMode } from '../../providers/ModeProvider';

const MODES: readonly AppMode[] = ['simple', 'professional'];

/** Segmented control: Simple ⇄ Professional vocabulary. Arrow keys move between options. */
export function ModeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { mode, setMode } = useMode();

  return (
    <ToggleGroup.Root
      type="single"
      value={mode}
      // Radix sends "" when the active item is clicked again; keep one option selected.
      onValueChange={(value) => value && setMode(value as AppMode)}
      aria-label={t('mode.label')}
      className={cn(
        'inline-flex rounded-control border border-border bg-surface-2 p-0.5',
        className,
      )}
    >
      {MODES.map((value) => (
        <ToggleGroup.Item
          key={value}
          value={value}
          className={cn(
            'h-7 rounded-[5px] px-3 text-small text-muted transition-colors duration-150 ease-out',
            'hover:text-text data-[state=on]:bg-surface data-[state=on]:text-text data-[state=on]:shadow-sm',
          )}
        >
          {t(`mode.${value}`)}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
