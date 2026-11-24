import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/IconButton';
import { Tooltip } from '../ui/Tooltip';
import { useNavLabel, type NavGroup, type NavItem } from './nav-config';
import { Wordmark } from './Wordmark';

interface SidebarProps {
  groups: readonly NavGroup[];
  homeTo: string;
  /** 64px icon rail instead of the full 248px sidebar. */
  collapsed: boolean;
  /** Omit to hide the collapse button (e.g. inside the mobile drawer). */
  onToggleCollapsed?: () => void;
  /** Called after a link is chosen (closes the mobile drawer). */
  onNavigate?: () => void;
}

function SidebarLink({
  item,
  label,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  label: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'relative flex h-9 items-center gap-3 rounded-control px-3 text-body text-muted',
          'transition-colors duration-150 ease-out hover:bg-surface-2 hover:text-text',
          isActive &&
            'bg-primary/10 font-medium text-primary-strong hover:bg-primary/10 hover:text-primary-strong',
          collapsed && 'justify-center px-0',
        )
      }
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {item.badge !== undefined &&
        item.badge > 0 &&
        (collapsed ? (
          <span aria-hidden className="absolute top-1.5 right-2 size-2 rounded-full bg-danger" />
        ) : (
          <Badge variant="danger" className="ml-auto tabular">
            {item.badge}
          </Badge>
        ))}
    </NavLink>
  );

  return collapsed ? (
    <Tooltip content={label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

export function Sidebar({
  groups,
  homeTo,
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: SidebarProps) {
  const { t } = useTranslation();
  const labelOf = useNavLabel();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-border px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <Link
          to={homeTo}
          onClick={onNavigate}
          className="rounded-control"
          aria-label={t('nav:public.home')}
        >
          <Wordmark compact={collapsed} />
        </Link>
      </div>

      <nav aria-label={t('nav:shell.mainNav')} className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((g, index) => (
          <Fragment key={g.id}>
            {collapsed ? (
              index > 0 && <hr className="my-3 border-border" />
            ) : (
              <p className={cn('label-caps px-3 pb-1 text-muted', index > 0 && 'pt-5')}>
                {t(g.label)}
              </p>
            )}
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.id}>
                  <SidebarLink
                    item={item}
                    label={labelOf(item.label)}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </nav>

      {onToggleCollapsed && (
        <div
          className={cn('shrink-0 border-t border-border p-3', collapsed && 'flex justify-center')}
        >
          <IconButton
            icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            label={collapsed ? t('nav:shell.expand') : t('nav:shell.collapse')}
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
          />
        </div>
      )}
    </div>
  );
}
