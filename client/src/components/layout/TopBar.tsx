import { Bell, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { IconButton } from '../ui/IconButton';
import { ModeToggle } from '../ui/ModeToggle';
import { ThemeToggle } from '../ui/ThemeToggle';

interface TopBarProps {
  title: ReactNode;
  /** Shown below lg: opens the navigation drawer. */
  onOpenMenu?: () => void;
  /** Where the user menu's "Settings" goes. */
  settingsTo: string;
  /** Unread notifications — wired to real data in Phase 13. */
  notificationCount?: number;
}

export function TopBar({ title, onOpenMenu, settingsTo, notificationCount }: TopBarProps) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur lg:px-6">
      {onOpenMenu && (
        <IconButton
          icon={<Menu />}
          label={t('nav:shell.openMenu')}
          onClick={onOpenMenu}
          className="-ml-2"
        />
      )}
      <p className="min-w-0 flex-1 truncate text-h3">{title}</p>

      <div className="flex items-center gap-1 sm:gap-2">
        <ModeToggle className="hidden sm:inline-flex" />

        {/* Placeholder until Phase 13: focusable, marked unavailable, tooltip explains why. */}
        <span className="relative inline-flex">
          <IconButton
            icon={<Bell />}
            label={t('nav:shell.notifications')}
            tooltip={t('nav:shell.notificationsSoon')}
            aria-disabled
            className="cursor-not-allowed opacity-60"
          />
          {notificationCount !== undefined && notificationCount > 0 && (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger"
            />
          )}
        </span>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              icon={<UserRound />}
              label={t('nav:shell.userMenu')}
              variant="secondary"
              tooltip={false}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="tracking-normal normal-case">
              {t('nav:shell.signedOut')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={settingsTo}>
                <Settings />
                {t('nav:items.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LogOut />
              {t('nav:shell.signOutSoon')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
