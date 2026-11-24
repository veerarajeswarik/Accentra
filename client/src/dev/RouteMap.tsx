/** DEV-ONLY: every route in the app with its planned phase, for clicking through the shell. */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import {
  AREA_BASE,
  NAV_BY_AREA,
  flattenNav,
  useNavLabel,
  type WorkspaceArea,
} from '../components/layout/nav-config';
import { AUTH_PAGES, CA_EXTRA_PAGES } from '../routes/placeholders';
import { PUBLIC_PAGES } from '../routes/public-pages';

interface Entry {
  to: string;
  label: string;
  phase: number;
  track?: 'mvp' | 'full';
}

function RouteList({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody>
        <ul className="space-y-1">
          {entries.map((e) => (
            <li key={e.to} className="flex items-center justify-between gap-3">
              <Link to={e.to} className="truncate text-body text-primary hover:underline">
                {e.label} <span className="text-small text-muted">{e.to}</span>
              </Link>
              <span className="flex shrink-0 gap-1">
                {e.track === 'full' && <Badge variant="neutral">Track B</Badge>}
                <Badge variant="info" className="tabular">
                  P{e.phase}
                </Badge>
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export function RouteMap() {
  const { t } = useTranslation();
  const labelOf = useNavLabel();
  const toUrl = (path: string) => `/${path.replace(':token', 'sample-token')}`;

  const workspace = (area: WorkspaceArea): Entry[] => [
    ...flattenNav(NAV_BY_AREA[area]).map((item) => ({
      to: item.to,
      label: labelOf(item.label),
      phase: item.phase,
      track: item.track,
    })),
    ...(area === 'ca'
      ? CA_EXTRA_PAGES.map((p) => ({
          to: `${AREA_BASE.ca}/${p.path.replace(':businessId', 'sample-business')}`,
          label: t(p.titleKey),
          phase: p.phase,
        }))
      : []),
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <RouteList
        title="Public (PublicLayout) — built in Phase 3"
        entries={PUBLIC_PAGES.map((p) => ({
          to: toUrl(p.path),
          label: t(p.titleKey),
          phase: 3,
        }))}
      />
      <RouteList
        title="Auth (AuthLayout)"
        entries={AUTH_PAGES.map((p) => ({
          to: toUrl(p.path),
          label: t(p.titleKey),
          phase: p.phase,
        }))}
      />
      <RouteList title="Entrepreneur /app" entries={workspace('entrepreneur')} />
      <RouteList title="CA /ca" entries={workspace('ca')} />
      <RouteList title="Admin /admin" entries={workspace('admin')} />
      <RouteList
        title="Error pages"
        entries={[
          { to: '/this-page-does-not-exist', label: 'Public 404', phase: 2 },
          { to: '/app/does-not-exist', label: 'Workspace 404', phase: 2 },
        ]}
      />
    </div>
  );
}
