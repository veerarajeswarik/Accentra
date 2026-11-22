import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { Toast as RadixToast } from 'radix-ui';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
}

interface ToastItem extends Required<Pick<ToastOptions, 'variant' | 'title'>> {
  id: number;
  description?: string;
  open: boolean;
}

interface ToastContextValue {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** 5.5: 4 s for success/info; errors stay until the user dismisses them. */
const DURATION: Record<ToastVariant, number> = { success: 4000, info: 4000, error: Infinity };

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info } as const;
const ICON_COLOR = { success: 'text-success', error: 'text-danger', info: 'text-accent' } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('ui');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((all) => all.map((item) => (item.id === id ? { ...item, open: false } : item)));
    // Remove after the 150 ms fade-out.
    setTimeout(() => setToasts((all) => all.filter((item) => item.id !== id)), 200);
  }, []);

  const toast = useCallback(({ variant = 'info', title, description }: ToastOptions) => {
    const id = nextId.current++;
    setToasts((all) => [...all.slice(-4), { id, variant, title, description, open: true }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right" label={t('toast.region')}>
        {children}
        {toasts.map((item) => {
          const Icon = ICONS[item.variant];
          return (
            <RadixToast.Root
              key={item.id}
              open={item.open}
              onOpenChange={(open) => !open && dismiss(item.id)}
              duration={DURATION[item.variant]}
              // Errors interrupt screen readers (assertive); others are polite.
              type={item.variant === 'error' ? 'foreground' : 'background'}
              data-variant={item.variant}
              className={cn(
                'flex w-full items-start gap-3 rounded-card border border-border bg-surface p-4 text-text shadow-elevated',
                'animate-slide-in-right transition-opacity duration-150 data-[state=closed]:opacity-0',
                item.variant === 'error' && 'border-danger',
              )}
            >
              <Icon
                aria-hidden
                className={cn('mt-0.5 size-4 shrink-0', ICON_COLOR[item.variant])}
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <RadixToast.Title className="text-body font-semibold">
                  {item.title}
                </RadixToast.Title>
                {item.description && (
                  <RadixToast.Description className="text-body text-muted">
                    {item.description}
                  </RadixToast.Description>
                )}
              </div>
              <RadixToast.Close
                aria-label={t('toast.dismiss')}
                className="-m-1 inline-flex size-7 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface-2 hover:text-text"
              >
                <X aria-hidden className="size-4" />
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport className="fixed right-0 bottom-0 z-[60] flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/** const { toast } = useToast(); toast({ variant: 'success', title: t('…') }) */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
