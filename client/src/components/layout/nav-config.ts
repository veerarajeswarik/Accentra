/**
 * Sidebar navigation for the three workspaces — MASTER_PLAN Part 4.3–4.5.
 * This file is the SINGLE source for: sidebar items, workspace routes (router.tsx), and the
 * "Planned for Phase N" placeholder pages. When a page is built, set `built: true` and give
 * the route a real element in router.tsx.
 */
import {
  Bot,
  Building2,
  CheckSquare,
  ClipboardCheck,
  FileBarChart,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Receipt,
  ReceiptIndianRupee,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  UserRound,
  Users,
  Bell,
  ArrowLeftRight,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMode } from '../../providers/ModeProvider';

/** A label key, or a pair that switches with Simple/Professional mode. */
export type NavLabel = string | { simple: string; professional: string };

export interface NavItem {
  id: string;
  /** Absolute route, e.g. "/app/transactions". */
  to: string;
  label: NavLabel;
  icon: LucideIcon;
  /** MVP = Track A (Phases 1–15); FULL = Track B (16–27). */
  track: 'mvp' | 'full';
  /** Roadmap phase that builds this page (shown on its placeholder). */
  phase: number;
  /** Optional count badge (e.g. pending reviews) — wired to real data in later phases. */
  badge?: number;
  /** Match only the exact path (for index routes like "/app"). */
  end?: boolean;
}

export interface NavGroup {
  id: string;
  /** i18n key of the group heading. */
  label: string;
  items: NavItem[];
}

export type WorkspaceArea = 'entrepreneur' | 'ca' | 'admin';

const both = (key: string): NavLabel => ({
  simple: `nav:items.${key}.simple`,
  professional: `nav:items.${key}.professional`,
});
const one = (key: string): NavLabel => `nav:items.${key}`;
const group = (key: string) => `nav:groups.${key}`;

/** Entrepreneur workspace — Part 4.3, including its group headings. */
export const entrepreneurNav: NavGroup[] = [
  {
    id: 'overview',
    label: group('overview'),
    items: [
      {
        id: 'dashboard',
        to: '/app',
        end: true,
        label: one('dashboard'),
        icon: LayoutDashboard,
        track: 'mvp',
        phase: 9,
      },
    ],
  },
  {
    id: 'money',
    label: group('money'),
    items: [
      {
        id: 'transactions',
        to: '/app/transactions',
        label: both('transactions'),
        icon: ArrowLeftRight,
        track: 'mvp',
        phase: 7,
      },
      {
        id: 'expenses',
        to: '/app/expenses',
        label: both('expenses'),
        icon: Receipt,
        track: 'mvp',
        phase: 7,
      },
      {
        id: 'sales',
        to: '/app/sales',
        label: both('sales'),
        icon: ReceiptIndianRupee,
        track: 'full',
        phase: 16,
      },
      {
        id: 'purchases',
        to: '/app/purchases',
        label: both('purchases'),
        icon: ShoppingCart,
        track: 'full',
        phase: 18,
      },
      {
        id: 'contacts',
        to: '/app/contacts',
        label: both('contacts'),
        icon: Users,
        track: 'mvp',
        phase: 7,
      },
    ],
  },
  {
    id: 'records',
    label: group('records'),
    items: [
      {
        id: 'documents',
        to: '/app/documents',
        label: one('documents'),
        icon: FolderOpen,
        track: 'mvp',
        phase: 8,
      },
      {
        id: 'reports',
        to: '/app/reports',
        label: both('reports'),
        icon: FileBarChart,
        track: 'mvp',
        phase: 9,
      },
      { id: 'gst', to: '/app/gst', label: one('gst'), icon: FileText, track: 'full', phase: 17 },
    ],
  },
  {
    id: 'accountant',
    label: group('accountant'),
    items: [
      {
        id: 'my-ca',
        to: '/app/my-ca',
        label: one('myCa'),
        icon: UserCheck,
        track: 'mvp',
        phase: 11,
      },
      {
        id: 'find-ca',
        to: '/app/find-ca',
        label: one('findCa'),
        icon: Search,
        track: 'mvp',
        phase: 11,
      },
      {
        id: 'reviews',
        to: '/app/reviews',
        label: one('reviews'),
        icon: ClipboardCheck,
        track: 'mvp',
        phase: 14,
      },
      {
        id: 'messages',
        to: '/app/messages',
        label: one('messages'),
        icon: MessageSquare,
        track: 'full',
        phase: 20,
      },
      {
        id: 'tasks',
        to: '/app/tasks',
        label: one('tasks'),
        icon: CheckSquare,
        track: 'full',
        phase: 20,
      },
    ],
  },
  {
    id: 'assist',
    label: group('assist'),
    items: [
      {
        id: 'assistant',
        to: '/app/assistant',
        label: one('assistant'),
        icon: Bot,
        track: 'full',
        phase: 21,
      },
      {
        id: 'learn',
        to: '/app/learn',
        label: one('learn'),
        icon: GraduationCap,
        track: 'full',
        phase: 24,
      },
    ],
  },
  {
    id: 'settings',
    label: group('settings'),
    items: [
      {
        id: 'business-profile',
        to: '/app/settings/business',
        label: one('businessProfile'),
        icon: Building2,
        track: 'mvp',
        phase: 5,
      },
      {
        id: 'settings',
        to: '/app/settings',
        end: true,
        label: one('settings'),
        icon: Settings,
        track: 'mvp',
        phase: 5,
      },
    ],
  },
];

/** CA workspace — Part 4.4 (group headings are our grouping; Part 4.4 lists routes only). */
export const caNav: NavGroup[] = [
  {
    id: 'overview',
    label: group('overview'),
    items: [
      {
        id: 'ca-dashboard',
        to: '/ca',
        end: true,
        label: one('dashboard'),
        icon: LayoutDashboard,
        track: 'mvp',
        phase: 12,
      },
    ],
  },
  {
    id: 'clients',
    label: group('clients'),
    items: [
      {
        id: 'clients',
        to: '/ca/clients',
        label: one('clients'),
        icon: Users,
        track: 'mvp',
        phase: 12,
      },
      {
        id: 'ca-reviews',
        to: '/ca/reviews',
        label: one('pendingReviews'),
        icon: ClipboardCheck,
        track: 'mvp',
        phase: 14,
      },
      {
        id: 'requests',
        to: '/ca/requests',
        label: one('requests'),
        icon: Inbox,
        track: 'mvp',
        phase: 11,
      },
    ],
  },
  {
    id: 'work',
    label: group('work'),
    items: [
      {
        id: 'compliance',
        to: '/ca/compliance',
        label: one('compliance'),
        icon: FileCheck2,
        track: 'full',
        phase: 20,
      },
      {
        id: 'ca-messages',
        to: '/ca/messages',
        label: one('messages'),
        icon: MessageSquare,
        track: 'full',
        phase: 20,
      },
      {
        id: 'ca-notifications',
        to: '/ca/notifications',
        label: one('notifications'),
        icon: Bell,
        track: 'mvp',
        phase: 13,
      },
    ],
  },
  {
    id: 'account',
    label: group('account'),
    items: [
      {
        id: 'ca-profile',
        to: '/ca/profile',
        label: one('profile'),
        icon: UserRound,
        track: 'mvp',
        phase: 10,
      },
      {
        id: 'ca-settings',
        to: '/ca/settings',
        label: one('settings'),
        icon: Settings,
        track: 'mvp',
        phase: 10,
      },
    ],
  },
];

/** Admin workspace — Part 4.5. */
export const adminNav: NavGroup[] = [
  {
    id: 'overview',
    label: group('overview'),
    items: [
      {
        id: 'admin-dashboard',
        to: '/admin',
        end: true,
        label: one('platformOverview'),
        icon: LayoutDashboard,
        track: 'full',
        phase: 25,
      },
    ],
  },
  {
    id: 'trust',
    label: group('trust'),
    items: [
      {
        id: 'ca-verifications',
        to: '/admin/ca-verifications',
        label: one('caVerifications'),
        icon: ShieldCheck,
        track: 'mvp',
        phase: 10,
      },
    ],
  },
  {
    id: 'platform',
    label: group('platform'),
    items: [
      {
        id: 'users',
        to: '/admin/users',
        label: one('users'),
        icon: Users,
        track: 'full',
        phase: 25,
      },
      {
        id: 'audit',
        to: '/admin/audit',
        label: one('audit'),
        icon: ScrollText,
        track: 'full',
        phase: 25,
      },
      {
        id: 'support',
        to: '/admin/support',
        label: one('support'),
        icon: LifeBuoy,
        track: 'full',
        phase: 25,
      },
    ],
  },
];

export const NAV_BY_AREA: Record<WorkspaceArea, NavGroup[]> = {
  entrepreneur: entrepreneurNav,
  ca: caNav,
  admin: adminNav,
};

export const AREA_BASE: Record<WorkspaceArea, string> = {
  entrepreneur: '/app',
  ca: '/ca',
  admin: '/admin',
};

export function flattenNav(groups: readonly NavGroup[]): NavItem[] {
  return groups.flatMap((g) => g.items);
}

/** Translate a NavLabel for the current Simple/Professional mode. */
export function useNavLabel(): (label: NavLabel) => string {
  const { t } = useTranslation();
  const { mode } = useMode();
  return (label) => t(typeof label === 'string' ? label : label[mode]);
}
