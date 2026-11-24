/**
 * SINGLE source of truth for what the public site calls "Available" vs "Coming soon".
 * A feature is Available only when the phase that builds it is complete.
 *
 * At the END of every phase, set COMPLETED_PHASE to that phase number (and check the list).
 */
import {
  ArrowLeftRight,
  BarChart3,
  BookOpenCheck,
  Bot,
  ClipboardCheck,
  FileBarChart,
  FileText,
  FolderOpen,
  GraduationCap,
  History,
  Bell,
  Languages,
  LayoutDashboard,
  MessageSquare,
  Mic,
  ReceiptIndianRupee,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';

/** The last fully completed roadmap phase (Part 7). */
export const COMPLETED_PHASE = 3;

export const FEATURE_GROUPS = ['bookkeeping', 'collaboration', 'insights', 'india'] as const;
export type FeatureGroup = (typeof FEATURE_GROUPS)[number];

export interface MarketingFeature {
  /** Also the i18n key: marketing:features.items.<id>.title / .body */
  id: string;
  group: FeatureGroup;
  icon: LucideIcon;
  /** Roadmap phase that builds it. */
  phase: number;
}

export const FEATURES: readonly MarketingFeature[] = [
  { id: 'recordMoney', group: 'bookkeeping', icon: ArrowLeftRight, phase: 7 },
  { id: 'ledger', group: 'bookkeeping', icon: BookOpenCheck, phase: 6 },
  { id: 'contacts', group: 'bookkeeping', icon: Users, phase: 7 },
  { id: 'invoices', group: 'bookkeeping', icon: ReceiptIndianRupee, phase: 16 },
  { id: 'purchases', group: 'bookkeeping', icon: ShoppingCart, phase: 18 },

  { id: 'inviteCa', group: 'collaboration', icon: UserPlus, phase: 11 },
  { id: 'documents', group: 'collaboration', icon: FolderOpen, phase: 8 },
  { id: 'reviews', group: 'collaboration', icon: ClipboardCheck, phase: 14 },
  { id: 'history', group: 'collaboration', icon: History, phase: 14 },
  { id: 'notifications', group: 'collaboration', icon: Bell, phase: 13 },
  { id: 'messages', group: 'collaboration', icon: MessageSquare, phase: 20 },

  { id: 'dashboard', group: 'insights', icon: LayoutDashboard, phase: 9 },
  { id: 'profitLoss', group: 'insights', icon: BarChart3, phase: 9 },
  { id: 'statements', group: 'insights', icon: FileBarChart, phase: 19 },
  { id: 'modes', group: 'insights', icon: SlidersHorizontal, phase: 9 },
  { id: 'aiExplain', group: 'insights', icon: Bot, phase: 21 },

  { id: 'verifiedCas', group: 'india', icon: ShieldCheck, phase: 11 },
  { id: 'gstSummaries', group: 'india', icon: FileText, phase: 17 },
  { id: 'languages', group: 'india', icon: Languages, phase: 22 },
  { id: 'voice', group: 'india', icon: Mic, phase: 23 },
  { id: 'learning', group: 'india', icon: GraduationCap, phase: 24 },
];

export type FeatureStatus = 'available' | 'coming_soon';

export function featureStatus(
  feature: Pick<MarketingFeature, 'phase'>,
  completedPhase: number = COMPLETED_PHASE,
): FeatureStatus {
  return feature.phase <= completedPhase ? 'available' : 'coming_soon';
}

export function featuresByGroup(group: FeatureGroup): MarketingFeature[] {
  return FEATURES.filter((f) => f.group === group);
}
