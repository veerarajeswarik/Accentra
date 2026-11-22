import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FileDropzone, matchesAccept, type FileRejection } from './FileDropzone';

const MB = 1024 * 1024;

function fileOfSize(name: string, bytes: number, type: string): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: bytes });
  return file;
}

function Harness({ onReject }: { onReject?: (r: FileRejection[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <FileDropzone
      files={files}
      onFilesChange={setFiles}
      accept=".pdf,image/*"
      maxSizeBytes={5 * MB}
      multiple
      onReject={onReject}
    />
  );
}

describe('FileDropzone', () => {
  it('rejects files larger than maxSize with a clear message', async () => {
    const onReject = vi.fn();
    render(<Harness onReject={onReject} />);

    await userEvent.upload(
      screen.getByTestId('file-input'),
      fileOfSize('big-invoice.pdf', 6 * MB, 'application/pdf'),
    );

    expect(screen.getByRole('alert').textContent).toBe('big-invoice.pdf is larger than 5 MB');
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'too-large' })]);
    expect(screen.queryByRole('list', { name: 'Selected files' })).toBeNull();
  });

  it('accepts valid files and lets the user remove them', async () => {
    render(<Harness />);

    await userEvent.upload(
      screen.getByTestId('file-input'),
      fileOfSize('receipt.png', 200 * 1024, 'image/png'),
    );

    expect(screen.getByRole('list', { name: 'Selected files' }).textContent).toContain(
      'receipt.png',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove receipt.png' }));
    expect(screen.queryByText('receipt.png')).toBeNull();
  });

  it('has a keyboard-reachable browse button', async () => {
    render(<Harness />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'browse' }));
  });
});

describe('matchesAccept', () => {
  it.each([
    ['a.pdf', 'application/pdf', '.pdf', true],
    ['a.PDF', 'application/pdf', '.pdf', true],
    ['a.png', 'image/png', 'image/*', true],
    ['a.exe', 'application/x-msdownload', '.pdf,image/*', false],
    ['a.csv', 'text/csv', 'text/csv', true],
    ['a.txt', 'text/plain', undefined, true],
  ])('%s (%s) vs %s → %s', (name, type, accept, expected) => {
    expect(matchesAccept(new File([''], name, { type }), accept)).toBe(expected);
  });
});
