import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router';
import { LanguageSelect } from '../ui/LanguageSelect';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Wordmark } from './Wordmark';

/** Abstract product illustration (pure SVG, no stock images): a ledger card + CA approval tick. */
function LedgerIllustration({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={label} className="w-full max-w-sm">
      <rect
        x="8"
        y="16"
        width="260"
        height="168"
        rx="14"
        className="fill-brand-panel-fg/6 stroke-brand-panel-fg/20"
      />
      <rect x="28" y="38" width="96" height="10" rx="5" className="fill-brand-panel-fg/40" />
      <rect x="28" y="56" width="60" height="8" rx="4" className="fill-brand-panel-fg/20" />
      {[0, 1, 2, 3].map((row) => (
        <g key={row} transform={`translate(0 ${86 + row * 22})`}>
          <rect x="28" y="0" width="120" height="8" rx="4" className="fill-brand-panel-fg/25" />
          <rect x="196" y="0" width="52" height="8" rx="4" className="fill-brand-panel-fg/35" />
          <line x1="28" y1="15" x2="248" y2="15" className="stroke-brand-panel-fg/10" />
        </g>
      ))}
      <circle cx="268" cy="44" r="30" className="fill-chart-6" />
      <path
        d="M254 44l10 10 18-20"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand-panel"
      />
    </svg>
  );
}

/** Split screen ≥ lg: navy brand panel (left) + form panel (right). Single column on mobile. */
export function AuthLayout() {
  const { t } = useTranslation();
  const points = ['point1', 'point2', 'point3'] as const;

  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand-panel p-10 text-brand-panel-fg lg:flex">
        <Link to="/" className="self-start rounded-control" aria-label={t('nav:public.home')}>
          {/* The wordmark text inherits the light-on-navy colour here. */}
          <Wordmark className="text-brand-panel-fg" />
        </Link>
        <div className="max-w-md space-y-8">
          <h2 className="text-h1 text-brand-panel-fg">{t('pages:authBrand.headline')}</h2>
          <ul className="space-y-3">
            {points.map((key) => (
              <li key={key} className="flex items-start gap-3 text-body-lg">
                <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-chart-6" />
                {t(`pages:authBrand.${key}`)}
              </li>
            ))}
          </ul>
          <LedgerIllustration label={t('pages:authBrand.illustration')} />
        </div>
        <p className="text-small font-normal opacity-70">{t('nav:public.tagline')}</p>
      </aside>

      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="rounded-control lg:invisible" aria-label={t('nav:public.home')}>
            <Wordmark />
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </div>
        <main
          id="main-content"
          className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6"
        >
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
