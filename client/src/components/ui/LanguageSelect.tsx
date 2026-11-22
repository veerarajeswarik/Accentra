import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../lib/i18n';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './DropdownMenu';

/** English / தமிழ் / हिन्दी. Tamil and Hindi stay disabled until Phase 22 ships translations. */
export function LanguageSelect({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          leftIcon={<Languages />}
          aria-label={`${t('language.label')}: ${current.nativeName}`}
        >
          {current.nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={current.code}
          onValueChange={(code) => void i18n.changeLanguage(code)}
        >
          {LANGUAGES.map((language) => (
            <DropdownMenuRadioItem
              key={language.code}
              value={language.code}
              disabled={!language.available}
              lang={language.code}
            >
              <span>{language.nativeName}</span>
              {!language.available && (
                <span className="ml-auto text-small text-muted">{t('language.comingSoon')}</span>
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
