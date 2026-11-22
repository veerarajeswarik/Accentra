import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from './Tooltip';
import { DataTable, type DataTableColumn } from './DataTable';
import { EmptyState } from './EmptyState';

interface Row {
  id: string;
  name: string;
  amount: string;
}

const columns: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
  { id: 'amount', header: 'Amount', cell: (r) => r.amount, numeric: true, sortable: true },
];

function renderTable(props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}) {
  return render(
    <TooltipProvider>
      <DataTable<Row>
        caption="Sample rows"
        columns={columns}
        rows={[]}
        getRowId={(r) => r.id}
        emptyState={<EmptyState title="No transactions yet" />}
        {...props}
      />
    </TooltipProvider>,
  );
}

describe('DataTable', () => {
  it('renders the empty state inside the table frame', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'Sample rows' });
    expect(within(table).getByText('No transactions yet')).toBeDefined();
  });

  it('renders skeleton rows (not the empty state) while loading', () => {
    renderTable({ loading: true, skeletonRows: 3 });
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(3);
    expect(screen.queryByText('No transactions yet')).toBeNull();
    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true');
  });

  it('renders rows with numeric columns right-aligned', () => {
    renderTable({ rows: [{ id: '1', name: 'Sample Supplier', amount: '₹1,500.50' }] });
    const cell = screen.getByText('₹1,500.50');
    expect(cell.className).toContain('text-right');
    expect(cell.className).toContain('tabular');
  });

  it('reports sort changes and exposes aria-sort', async () => {
    const onSortChange = vi.fn();
    renderTable({
      rows: [{ id: '1', name: 'A', amount: '1' }],
      sort: { columnId: 'name', direction: 'asc' },
      onSortChange,
    });
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');

    await userEvent.click(within(nameHeader).getByRole('button'));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'desc' });

    await userEvent.click(
      within(screen.getByRole('columnheader', { name: /Amount/ })).getByRole('button'),
    );
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'amount', direction: 'asc' });
  });

  it('runs row actions from the overflow menu', async () => {
    const onEdit = vi.fn();
    const row = { id: '1', name: 'Sample Supplier', amount: '₹10.00' };
    renderTable({ rows: [row], rowActions: () => [{ label: 'Edit', onSelect: onEdit }] });

    await userEvent.click(screen.getByRole('button', { name: 'Row actions' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledWith(row);
  });
});
