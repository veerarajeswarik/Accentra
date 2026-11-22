/**
 * /dev/components — every design-system component in every variant and state.
 * DEV-ONLY (excluded from production builds). Literal English and sample data allowed here.
 */
import { formatINR } from '@accentra/shared';
import { ArrowRight, Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardFooter, CardHeader } from '../components/ui/Card';
import { Checkbox } from '../components/ui/Checkbox';
import { Combobox } from '../components/ui/Combobox';
import { DatePicker } from '../components/ui/DatePicker';
import { FormField } from '../components/ui/FormField';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import { Kbd } from '../components/ui/Kbd';
import { LanguageSelect } from '../components/ui/LanguageSelect';
import { ModeToggle } from '../components/ui/ModeToggle';
import { MoneyInput } from '../components/ui/MoneyInput';
import { RadioGroup } from '../components/ui/RadioGroup';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { Spinner } from '../components/ui/Spinner';
import { StatCard } from '../components/ui/StatCard';
import { STATUS_VARIANTS, StatusBadge, type Status } from '../components/ui/StatusBadge';
import { Switch } from '../components/ui/Switch';
import { Textarea } from '../components/ui/Textarea';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Tooltip } from '../components/ui/Tooltip';
import { TERMS, useTerm, type TermKey } from '../lib/terminology';
import { ApiStatus } from './ApiStatus';
import { SAMPLE_PAYMENT_METHODS, SAMPLE_STATES } from './sample-data';
import { Demo, ShowcaseSection } from './showcase-parts';

const SECTIONS = [
  ['tokens', 'Tokens'],
  ['buttons', 'Buttons'],
  ['forms', 'Form controls'],
  ['choices', 'Choices'],
  ['display', 'Cards & stats'],
  ['badges', 'Badges & avatars'],
  ['misc', 'Feedback & navigation'],
] as const;

const COLOR_TOKENS = [
  'bg-bg',
  'bg-surface',
  'bg-surface-2',
  'bg-border',
  'bg-text',
  'bg-muted',
  'bg-primary',
  'bg-accent',
  'bg-success',
  'bg-warning',
  'bg-danger',
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
  'bg-chart-6',
] as const;

function TermPreview({ termKey }: { termKey: TermKey }) {
  return (
    <li className="flex justify-between gap-4">
      <code className="text-muted">{termKey}</code>
      <span>{useTerm(termKey)}</span>
    </li>
  );
}

function FormsDemo() {
  const [amount, setAmount] = useState<number | null>(150050);
  const [method, setMethod] = useState<string | undefined>('upi');
  const [state, setState] = useState<string | undefined>();
  const [date, setDate] = useState<string | null>('2026-11-05');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        label="Business name"
        helper="As it appears on your invoices."
        required
        requiredText="required"
      >
        {(p) => <Input {...p} placeholder="e.g. Sample Traders" />}
      </FormField>
      <FormField label="Search" helper="Input with an icon adornment.">
        {(p) => <Input {...p} startAdornment={<Search />} placeholder="Search transactions" />}
      </FormField>
      <FormField label="GSTIN" error="GSTIN must be 15 characters">
        {(p) => <Input {...p} defaultValue="33ABCDE1234" />}
      </FormField>
      <FormField label="Disabled field">
        {(p) => <Input {...p} disabled defaultValue="Read only" />}
      </FormField>
      <FormField
        label="Amount (MoneyInput)"
        helper={`Emits integer paise: ${amount === null ? 'null' : amount} · try 12.345 then Tab`}
      >
        {(p) => <MoneyInput {...p} valuePaise={amount} onValueChange={setAmount} />}
      </FormField>
      <FormField label="Payment method (Select)">
        {(p) => (
          <Select
            {...p}
            options={SAMPLE_PAYMENT_METHODS}
            value={method}
            onValueChange={setMethod}
          />
        )}
      </FormField>
      <FormField label="State (Combobox)" helper={`Selected state code: ${state ?? '—'}`}>
        {(p) => (
          <Combobox
            {...p}
            options={SAMPLE_STATES}
            value={state}
            onValueChange={setState}
            placeholder="Choose a state"
          />
        )}
      </FormField>
      <FormField label="Transaction date (DatePicker)" helper={`ISO value: ${date ?? 'null'}`}>
        {(p) => (
          <DatePicker {...p} value={date} onValueChange={setDate} max="2026-12-31" clearable />
        )}
      </FormField>
      <FormField label="Notes (Textarea)" className="md:col-span-2">
        {(p) => <Textarea {...p} placeholder="Anything your CA should know" />}
      </FormField>
    </div>
  );
}

function ChoicesDemo() {
  const [gst, setGst] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [kind, setKind] = useState<string | undefined>('money_out');
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-3">
        <Checkbox
          label="Registered under GST"
          description="Shows GST fields on invoices."
          checked={gst}
          onCheckedChange={(v) => setGst(v === true)}
        />
        <Checkbox label="Indeterminate" checked="indeterminate" />
        <Checkbox label="Disabled" disabled />
      </div>
      <div className="space-y-3">
        <Switch
          label="Email reminders"
          description="Due-date reminders for unpaid bills."
          checked={reminders}
          onCheckedChange={setReminders}
        />
        <Switch label="Disabled switch" disabled />
      </div>
      <RadioGroup
        aria-label="Transaction kind"
        value={kind}
        onValueChange={setKind}
        options={[
          { value: 'money_in', label: 'Money In', description: 'A customer paid you.' },
          { value: 'money_out', label: 'Money Out', description: 'You paid for something.' },
          { value: 'transfer', label: 'Transfer', disabled: true },
        ]}
      />
    </div>
  );
}

export function ComponentsShowcase() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 p-4 md:p-6">
      <header className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div>
          <h1 className="text-h1">Component showcase</h1>
          <p className="text-body text-muted">
            Development only · not included in production builds
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ApiStatus />
          <ModeToggle />
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </header>

      <nav aria-label="Showcase sections" className="flex flex-wrap gap-2">
        {SECTIONS.map(([id, title]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-control px-2 py-1 text-body text-primary hover:bg-surface-2"
          >
            {title}
          </a>
        ))}
      </nav>

      <ShowcaseSection id="tokens" title="Tokens">
        <Demo label="Colours (switch theme to compare)">
          {COLOR_TOKENS.map((token) => (
            <div key={token} className="w-24 space-y-1">
              <div className={`h-12 rounded-control border border-border ${token}`} />
              <code className="text-small text-muted">{token.replace('bg-', '')}</code>
            </div>
          ))}
        </Demo>
        <Demo label="Typography">
          <div className="space-y-2">
            <p className="text-display text-brand-navy">Display 48</p>
            <p className="text-h1">H1 — Page title 28</p>
            <p className="text-h2">H2 — Section title 20</p>
            <p className="text-h3">H3 — Card title 16</p>
            <p className="text-body-lg">Body large 16 — marketing and learning content.</p>
            <p className="text-body">Body 14 — default app text.</p>
            <p className="label-caps text-muted">Small 12 — table header</p>
            <p className="text-stat tabular">{formatINR(1234567890)}</p>
          </div>
        </Demo>
        <Demo label="Simple / Professional terminology (toggle mode in the header)">
          <ul className="w-full max-w-sm space-y-1">
            {(Object.keys(TERMS) as TermKey[]).map((key) => (
              <TermPreview key={key} termKey={key} />
            ))}
          </ul>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection id="buttons" title="Buttons">
        <Demo label="Variants">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Void transaction</Button>
          <Button variant="link">Link button</Button>
        </Demo>
        <Demo label="Sizes">
          <Button size="sm">Small 32</Button>
          <Button size="md">Medium 36</Button>
          <Button size="lg">Large 44</Button>
        </Demo>
        <Demo label="Icons, loading, disabled">
          <Button leftIcon={<Plus />}>Record transaction</Button>
          <Button variant="secondary" rightIcon={<ArrowRight />}>
            Next
          </Button>
          <Button loading>Saving</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Demo>
        <Demo label="IconButton (hover or focus for tooltip)">
          <IconButton label="Edit" icon={<Pencil />} />
          <IconButton label="Download" icon={<Download />} variant="secondary" />
          <IconButton label="Add" icon={<Plus />} variant="primary" />
          <IconButton label="Delete" icon={<Trash2 />} variant="danger" />
          <IconButton label="Working" icon={<Plus />} loading />
          <IconButton label="Large" icon={<Plus />} size="lg" variant="secondary" />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection id="forms" title="Form controls">
        <FormsDemo />
      </ShowcaseSection>

      <ShowcaseSection id="choices" title="Choices">
        <ChoicesDemo />
      </ShowcaseSection>

      <ShowcaseSection id="display" title="Cards & stats">
        <p className="text-small text-muted">Sample data — numbers below are made up.</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Money In"
            value={formatINR(12_045_000, { compact: true })}
            delta={{ value: 12.5, format: (n) => `${n}%`, label: 'vs last month' }}
            footer={
              <a href="#display" className="text-primary hover:underline">
                View transactions
              </a>
            }
          />
          <StatCard
            label="Money Out"
            value={formatINR(4_000_000)}
            delta={{
              value: 8,
              format: (n) => `${n}%`,
              label: 'vs last month',
              positiveIsGood: false,
            }}
          />
          <StatCard
            label="Profit"
            value={formatINR(8_045_000)}
            delta={{ value: 0, label: 'vs last month' }}
          />
          <StatCard label="Loading" value="—" loading />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader
              title="Card title"
              description="Optional description under the title."
              actions={
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              }
            />
            <CardBody>Card body — 20px padding, 1px border, no shadow at rest.</CardBody>
            <CardFooter>
              <Button variant="secondary">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-9 w-28" />
            </CardBody>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="badges" title="Badges & avatars">
        <Demo label="Badge variants">
          {(['neutral', 'primary', 'info', 'indigo', 'success', 'warning', 'danger'] as const).map(
            (v) => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
            ),
          )}
        </Demo>
        <Demo label="StatusBadge (every status)">
          {(Object.keys(STATUS_VARIANTS) as Status[]).map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </Demo>
        <Demo label="Avatar (initials fallback, sizes)">
          <Avatar name="Sample Person" size="sm" />
          <Avatar name="Sample Person" />
          <Avatar name="Sample Chartered Accountant" size="lg" />
          <Avatar name="Broken Image" src="/does-not-exist.png" />
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection id="misc" title="Feedback & navigation">
        <Demo label="Spinner">
          <Spinner size="sm" label="Loading" />
          <Spinner label="Loading" />
          <Spinner size="lg" label="Loading" />
        </Demo>
        <Demo label="Tooltip">
          <Tooltip content="Tooltips also appear on keyboard focus">
            <Button variant="secondary">Hover or focus me</Button>
          </Tooltip>
        </Demo>
        <Demo label="Kbd">
          <span className="text-body">
            Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search (Track B)
          </span>
        </Demo>
        <Demo label="Breadcrumbs">
          <Breadcrumbs
            items={[
              { label: 'Workspace', to: '/app' },
              { label: 'Transactions', to: '/app/transactions' },
              { label: 'Sample entry' },
            ]}
          />
        </Demo>
      </ShowcaseSection>
    </div>
  );
}
