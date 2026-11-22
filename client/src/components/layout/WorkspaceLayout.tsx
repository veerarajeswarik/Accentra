import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, matchPath, useLocation } from 'react-router';
import { cn } from '../../lib/cn';
import { readStorage, writeStorage } from '../../lib/storage';
import { BELOW_LG, useMediaQuery } from '../../lib/use-media-query';
import { Drawer, DrawerContent } from '../ui/Drawer';
import { ModeToggle } from '../ui/ModeToggle';
import {
  AREA_BASE,
  NAV_BY_AREA,
  flattenNav,
  useNavLabel,
  type NavItem,
  type WorkspaceArea,
} from './nav-config';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const SIDEBAR_STORAGE_KEY = 'accentra-sidebar-collapsed';

/** The nav item for the current URL (longest match wins: /app/settings/business beats /app/settings). */
export function findActiveItem(items: readonly NavItem[], pathname: string): NavItem | undefined {
  return [...items]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => matchPath({ path: item.to, end: item.end ?? false }, pathname));
}

/**
 * Sidebar (248px, collapsible to a 64px icon rail; a drawer below 1024px) + 56px top bar +
 * content area capped at 1440px (DESIGN_SYSTEM.md 5.6).
 */
export function WorkspaceLayout({ area }: { area: WorkspaceArea }) {
  const { t } = useTranslation();
  const labelOf = useNavLabel();
  const { pathname } = useLocation();
  const isBelowLg = useMediaQuery(BELOW_LG);
  const [collapsed, setCollapsed] = useState(() => readStorage(SIDEBAR_STORAGE_KEY) === 'true');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groups = NAV_BY_AREA[area];
  const base = AREA_BASE[area];
  const active = findActiveItem(flattenNav(groups), pathname);
  const title = active ? labelOf(active.label) : t(`nav:areas.${area}`);

  function toggleCollapsed() {
    setCollapsed((value) => {
      writeStorage(SIDEBAR_STORAGE_KEY, String(!value));
      return !value;
    });
  }

  return (
    <div className="flex min-h-dvh bg-bg">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary px-3 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t('nav:shell.skipToContent')}
      </a>

      {!isBelowLg && (
        <aside
          className={cn(
            'sticky top-0 h-dvh shrink-0 border-r border-border transition-[width] duration-200 ease-out',
            collapsed ? 'w-16' : 'w-62',
          )}
        >
          <Sidebar
            groups={groups}
            homeTo={base}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />
        </aside>
      )}

      {isBelowLg && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent side="left" title={t(`nav:areas.${area}`)} hideTitle className="w-72">
            <div className="flex h-full flex-col">
              <div className="min-h-0 flex-1">
                <Sidebar
                  groups={groups}
                  homeTo={base}
                  collapsed={false}
                  onNavigate={() => setDrawerOpen(false)}
                />
              </div>
              <div className="border-t border-border p-4 sm:hidden">
                <ModeToggle className="w-full justify-center" />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          onOpenMenu={isBelowLg ? () => setDrawerOpen(true) : undefined}
          settingsTo={
            area === 'entrepreneur' ? '/app/settings' : area === 'ca' ? '/ca/settings' : '/admin'
          }
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 outline-none lg:px-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
