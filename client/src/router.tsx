/**
 * Every route in the app. Placeholders render an honest ComingSoonPage until their phase.
 * When a page is built, replace its placeholder element here — do not add a second route.
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, ScrollRestoration, type RouteObject } from 'react-router';
import { AuthLayout } from './components/layout/AuthLayout';
import {
  AREA_BASE,
  NAV_BY_AREA,
  flattenNav,
  useNavLabel,
  type NavItem,
  type WorkspaceArea,
} from './components/layout/nav-config';
import { PublicLayout } from './components/layout/PublicLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { Spinner } from './components/ui/Spinner';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { AUTH_PAGES, CA_EXTRA_PAGES, type PlaceholderPage } from './routes/placeholders';
import { PUBLIC_PAGES, type PublicPageComponent } from './routes/public-pages';

function NavPlaceholder({ item }: { item: NavItem }) {
  const labelOf = useNavLabel();
  return <ComingSoonPage title={labelOf(item.label)} phase={item.phase} />;
}

function PagePlaceholder({ page }: { page: PlaceholderPage }) {
  const { t } = useTranslation();
  return <ComingSoonPage title={t(page.titleKey)} phase={page.phase} />;
}

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

function placeholderRoute(page: PlaceholderPage, element: ReactNode): RouteObject {
  return page.path === '' ? { index: true, element } : { path: page.path, element };
}

function workspaceRoutes(area: WorkspaceArea, extra: PlaceholderPage[] = []): RouteObject {
  const base = AREA_BASE[area];
  return {
    path: base.slice(1),
    element: (
      <RequireAuth>
        <WorkspaceLayout area={area} />
      </RequireAuth>
    ),
    children: [
      ...flattenNav(NAV_BY_AREA[area]).map((item) => {
        const relative = item.to.slice(base.length).replace(/^\//, '');
        const element = <NavPlaceholder item={item} />;
        return relative === '' ? { index: true, element } : { path: relative, element };
      }),
      ...extra.map((page) => placeholderRoute(page, <PagePlaceholder page={page} />)),
      { path: '*', element: <NotFoundPage homeTo={base} /> },
    ],
  };
}

/** Developer-only routes. `import.meta.env.DEV` is false in production builds, so Vite drops them. */
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'dev/components',
        lazy: async () => {
          const { ComponentsShowcase } = await import('./dev/ComponentsShowcase');
          return { Component: ComponentsShowcase };
        },
      },
    ]
  : [];

/** The public website is one lazily loaded chunk (features/marketing). */
const loadMarketing = () => import('./features/marketing');
function marketingRoute(path: string, page: PublicPageComponent): RouteObject {
  const lazy = async () => ({ Component: (await loadMarketing())[page] });
  return path === '' ? { index: true, lazy } : { path, lazy };
}

/** Shown while a lazy route's code downloads (first visit only). */
function RouteLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <Spinner size="lg" label={t('loading')} />
    </div>
  );
}

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    HydrateFallback: RouteLoading,
    children: [
      {
        element: <PublicLayout />,
        children: [
          ...PUBLIC_PAGES.map(({ path, page }) => marketingRoute(path, page)),
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: AUTH_PAGES.map((page) => placeholderRoute(page, <PagePlaceholder page={page} />)),
      },
      workspaceRoutes('entrepreneur'),
      workspaceRoutes('ca', CA_EXTRA_PAGES),
      workspaceRoutes('admin'),
      ...devRoutes,
    ],
  },
];
