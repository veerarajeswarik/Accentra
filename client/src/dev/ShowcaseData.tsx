/**
 * DEV-ONLY showcase sections for data, overlay and feedback components (Phase 2c).
 * Everything here uses clearly labelled sample data.
 */
import { formatINR } from '@accentra/shared';
import { format, parseISO } from 'date-fns';
import { FileText, Inbox, Pencil, Plus, Settings, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Accordion } from '../components/ui/Accordion';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { ChartCard } from '../components/ui/ChartCard';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DataTable, type DataTableColumn, type SortState } from '../components/ui/DataTable';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../components/ui/Dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '../components/ui/Drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/DropdownMenu';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { FileDropzone } from '../components/ui/FileDropzone';
import { FilterBar } from '../components/ui/FilterBar';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Timeline } from '../components/ui/Timeline';
import { useToast } from '../components/ui/Toast';
import { useChartColors } from '../lib/chart-colors';
import { SAMPLE_ROWS, SAMPLE_TREND, type SampleRow } from './sample-data';
import { Demo, ShowcaseSection } from './showcase-parts';

const PAGE_SIZE = 10;

const COLUMNS: DataTableColumn<SampleRow>[] = [
  {
    id: 'date',
    header: 'Date',
    sortable: true,
    cell: (r) => <span className="tabular">{format(parseISO(r.date), 'dd MMM yyyy')}</span>,
  },
  { id: 'party', header: 'Party', sortable: true, cell: (r) => r.party },
  { id: 'category', header: 'Category', cell: (r) => r.category, hideOnMobile: true },
  { id: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
  {
    id: 'amount',
    header: 'Amount',
    numeric: true,
    sortable: true,
    cell: (r) => formatINR(r.amountPaise),
  },
];

/** Client-side sort/filter is ONLY for this demo; real tables sort and paginate on the server. */
function TableDemo() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>('all');
  const [sort, setSort] = useState<SortState>({ columnId: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'rows' | 'loading' | 'empty'>('rows');

  const filtered = useMemo(() => {
    const rows = SAMPLE_ROWS.filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        r.party.toLowerCase().includes(search.trim().toLowerCase()),
    );
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      if (sort.columnId === 'amount') return (a.amountPaise - b.amountPaise) * dir;
      const key = sort.columnId === 'party' ? 'party' : 'date';
      return a[key].localeCompare(b[key]) * dir;
    });
  }, [search, status, sort]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rows = view === 'empty' ? [] : pageRows;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="warning">Sample data</Badge>
        <span className="text-small text-muted">Show state:</span>
        {(['rows', 'loading', 'empty'] as const).map((v) => (
          <Button
            key={v}
            size="sm"
            variant={view === v ? 'primary' : 'secondary'}
            onClick={() => setView(v)}
          >
            {v}
          </Button>
        ))}
      </div>
      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search party"
        hasActiveFilters={search !== '' || status !== 'all'}
        onReset={() => {
          setSearch('');
          setStatus('all');
          setPage(1);
        }}
      >
        <Select
          aria-label="Status"
          className="sm:w-40"
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'paid', label: 'Paid' },
            { value: 'unpaid', label: 'Unpaid' },
            { value: 'overdue', label: 'Overdue' },
          ]}
        />
      </FilterBar>
      <DataTable<SampleRow>
        caption="Sample transactions"
        columns={COLUMNS}
        rows={rows}
        getRowId={(r) => r.id}
        loading={view === 'loading'}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPage(1);
        }}
        rowActions={(row) => [
          {
            label: 'Edit',
            icon: <Pencil />,
            onSelect: () => toast({ title: `Edit ${row.party}`, description: 'Demo action only.' }),
          },
          {
            label: 'Void',
            icon: <Trash2 />,
            destructive: true,
            onSelect: () =>
              toast({
                variant: 'error',
                title: `Void ${row.party}`,
                description: 'Demo action only.',
              }),
          },
        ]}
        emptyState={
          <EmptyState
            icon={<Inbox />}
            title="No transactions yet"
            description="Record money in or out and it will appear here."
            action={<Button leftIcon={<Plus />}>Record your first transaction</Button>}
          />
        }
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total: view === 'empty' ? 0 : filtered.length,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}

function ChartDemo() {
  const colors = useChartColors();
  const [empty, setEmpty] = useState(false);
  return (
    <ChartCard
      title="Money In vs Money Out"
      description="Sample data · last 6 months"
      summary="Sample data: Money In rose from ₹4.2L in June to ₹7.2L in November; Money Out rose from ₹3.1L to ₹4.8L."
      isEmpty={empty}
      actions={
        <Button size="sm" variant="ghost" onClick={() => setEmpty((v) => !v)}>
          {empty ? 'Show data' : 'Show empty'}
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SAMPLE_TREND} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={colors.axis}
            tick={{ fill: colors.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            width={56}
            stroke={colors.axis}
            tick={{ fill: colors.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatINR(v, { compact: true })}
          />
          <ChartTooltip
            formatter={(v) => formatINR(Number(v))}
            contentStyle={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              color: colors.text,
              fontSize: 13,
            }}
            labelStyle={{ color: colors.text }}
          />
          <Area
            type="monotone"
            dataKey="inPaise"
            name="Money In"
            stroke={colors.series[0]}
            fill={colors.series[0]}
            fillOpacity={0.15}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="outPaise"
            name="Money Out"
            stroke={colors.series[1]}
            fill={colors.series[1]}
            fillOpacity={0.1}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function OverlaysDemo() {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className="space-y-6">
      <Demo label="Dialog · ConfirmDialog · Drawer · DropdownMenu">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent
            title="Add a contact"
            description="Customers and suppliers you deal with."
            footer={
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save contact</Button>
                </DialogClose>
              </>
            }
          >
            <FormField label="Name">
              {(p) => <Input {...p} placeholder="Sample Traders" />}
            </FormField>
          </DialogContent>
        </Dialog>

        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Void transaction…
        </Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Void this transaction?"
          description="A reversal entry is posted and the original stays in history. This cannot be undone."
          confirmLabel="Void transaction"
          destructive
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 800));
            toast({ variant: 'success', title: 'Transaction voided (demo)' });
          }}
        />

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent
            title="Transaction details"
            description="Side sheet for details and filters."
            footer={<Button variant="secondary">Close</Button>}
          >
            <div className="p-5 text-body text-muted">Drawer body content.</div>
          </DrawerContent>
        </Drawer>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" leftIcon={<Settings />}>
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => toast({ title: 'Edit selected' })}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast({ title: 'Export selected' })}>
              <FileText /> Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              destructive
              onSelect={() => toast({ variant: 'error', title: 'Delete selected' })}
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>

      <Demo label="Toasts (bottom-right · errors stay until dismissed)">
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              variant: 'success',
              title: 'Transaction saved',
              description: 'Your dashboard is up to date.',
            })
          }
        >
          Success toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ variant: 'info', title: 'Your CA viewed the document' })}
        >
          Info toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              variant: 'error',
              title: 'Upload failed',
              description: 'The file is larger than 10 MB.',
            })
          }
        >
          Error toast
        </Button>
      </Demo>
    </div>
  );
}

function FeedbackDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <PageHeader
            breadcrumbs={
              <Breadcrumbs
                items={[
                  { label: 'Workspace', to: '/app' },
                  { label: 'Reviews', to: '/app/reviews' },
                  { label: 'Q2 GST working' },
                ]}
              />
            }
            title="Q2 GST working"
            status={<StatusBadge status="needs_clarification" />}
            description="PageHeader with breadcrumbs, status and actions."
            actions={
              <>
                <Button variant="secondary">Reply</Button>
                <Button>Resubmit</Button>
              </>
            }
            className="mb-0"
          />
        </CardBody>
      </Card>

      <Tabs defaultValue="history">
        <TabsList aria-label="Review sections">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="states">Empty & error</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="accordion">Accordion</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Timeline
            items={[
              {
                id: '1',
                actor: 'Sample Owner',
                action: 'submitted the document for review',
                at: '2026-11-02T10:15:00',
                tone: 'primary',
              },
              {
                id: '2',
                actor: 'Sample CA',
                action: 'requested clarification',
                at: '2026-11-03T16:40:00',
                tone: 'warning',
                note: 'Please attach the rent agreement for October.',
              },
              {
                id: '3',
                actor: 'Sample Owner',
                action: 'resubmitted with 1 new file',
                at: '2026-11-04T09:05:00',
                tone: 'primary',
              },
              {
                id: '4',
                actor: 'Sample CA',
                action: 'approved',
                at: '2026-11-04T18:30:00',
                tone: 'success',
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="states">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <EmptyState
                icon={<Inbox />}
                title="No documents yet"
                description="Upload bills, receipts and statements so your CA can review them."
                action={<Button leftIcon={<Plus />}>Upload a document</Button>}
              />
            </Card>
            <Card>
              <ErrorState
                message="We couldn't load your transactions. Check your connection and try again."
                onRetry={() => undefined}
              />
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="accordion">
          <Accordion
            className="max-w-2xl"
            items={[
              {
                id: 'q1',
                title: 'Is my data shared with anyone?',
                content: 'Only with the CA you connect with.',
              },
              { id: 'q2', title: 'Does Accentra file GST returns?', content: 'No, not currently.' },
              {
                id: 'q3',
                title: 'What does Simple mode change?',
                content: 'Only the words on screen.',
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="upload">
          <FileDropzone
            files={files}
            onFilesChange={setFiles}
            accept=".pdf,image/*"
            maxSizeBytes={10 * 1024 * 1024}
            multiple
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ShowcaseDataSections() {
  return (
    <>
      <ShowcaseSection id="data" title="Data: FilterBar · DataTable · Pagination">
        <TableDemo />
      </ShowcaseSection>
      <ShowcaseSection id="charts" title="ChartCard (useChartColors)">
        <ChartDemo />
      </ShowcaseSection>
      <ShowcaseSection id="overlays" title="Overlays & toasts">
        <OverlaysDemo />
      </ShowcaseSection>
      <ShowcaseSection
        id="feedback"
        title="PageHeader · Tabs · Timeline · Empty/Error · FileDropzone"
      >
        <FeedbackDemo />
      </ShowcaseSection>
    </>
  );
}
