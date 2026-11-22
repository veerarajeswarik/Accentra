import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemePreference } from '../../providers/ThemeProvider';
import { IconButton } from './IconButton';

const NEXT: Record<ThemePreference, ThemePreference> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const ICONS = { light: <Sun />, dark: <Moon />, system: <Monitor /> } as const;

/** Cycles light → dark → system. The icon shows the CURRENT choice. */
export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const next = NEXT[theme];

  return (
    <IconButton
      className={className}
      icon={ICONS[theme]}
      label={t('theme.switchTo', { theme: t(`theme.${next}`) })}
      tooltip={t('theme.current', { theme: t(`theme.${theme}`) })}
      onClick={() => setTheme(next)}
    />
  );
}
