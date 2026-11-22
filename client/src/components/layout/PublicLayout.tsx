import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Drawer, DrawerContent } from '../ui/Drawer';
import { IconButton } from '../ui/IconButton';
import { LanguageSelect } from '../ui/LanguageSelect';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Wordmark } from './Wordmark';

const PRIMARY_LINKS = [
  { to: '/features', key: 'features' },
  { to: '/how-it-works', key: 'howItWorks' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
] as const;

const FOOTER_COLUMNS = [
  {
    key: 'product',
    links: [
      { to: '/features', key: 'nav:public.features' },
      { to: '/how-it-works', key: 'nav:public.howItWorks' },
    ],
  },
  {
    key: 'company',
    links: [
      { to: '/about', key: 'nav:public.about' },
      { to: '/contact', key: 'nav:public.contact' },
    ],
  },
  {
    key: 'legal',
    links: [
      { to: '/privacy', key: 'nav:public.footer.privacy' },
      { to: '/terms', key: 'nav:public.footer.terms' },
    ],
  },
] as const;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-control px-3 py-2 text-body text-muted transition-colors duration-150 hover:text-text',
    isActive && 'font-medium text-text',
  );

/** Marketing site shell: sticky top nav, mobile menu drawer, footer. */
export function PublicLayout() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
          <Link to="/" className="rounded-control" aria-label={t('nav:public.home')}>
            <Wordmark />
          </Link>

          <nav aria-label={t('nav:shell.mainNav')} className="ml-6 hidden md:block">
            <ul className="flex items-center gap-1">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={linkClass}>
                    {t(`nav:public.${link.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageSelect className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/login">{t('nav:public.signIn')}</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/register">{t('nav:public.getStarted')}</Link>
            </Button>
            <IconButton
              icon={<Menu />}
              label={t('nav:public.menu')}
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </header>

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent title={t('nav:public.menu')}>
          <nav aria-label={t('nav:shell.mainNav')} className="flex flex-col gap-1 p-4">
            {PRIMARY_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-control px-3 py-2.5 text-body-lg text-text hover:bg-surface-2',
                    isActive && 'bg-surface-2 font-medium',
                  )
                }
              >
                {t(`nav:public.${link.key}`)}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Button asChild variant="secondary" size="lg">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  {t('nav:public.signIn')}
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  {t('nav:public.getStarted')}
                </Link>
              </Button>
              <LanguageSelect className="self-start" />
            </div>
          </nav>
        </DrawerContent>
      </Drawer>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer
        aria-label={t('nav:public.footer.label')}
        className="border-t border-border bg-surface"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-6">
          <div className="space-y-3">
            <Wordmark />
            <p className="max-w-xs text-body text-muted">{t('nav:public.tagline')}</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.key} className="space-y-3">
              <p className="label-caps text-muted">{t(`nav:public.footer.${column.key}`)}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-control text-body text-text hover:text-primary"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-small font-normal text-muted md:px-6">
            <p>{t('nav:public.footer.rights', { year })}</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-text">
                {t('nav:public.footer.privacy')}
              </Link>
              <Link to="/terms" className="hover:text-text">
                {t('nav:public.footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
