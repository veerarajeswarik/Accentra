import { FileText, UploadCloud, X } from 'lucide-react';
import { useId, useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { formatBytes } from '../../lib/format-bytes';

export interface FileRejection {
  file: File;
  reason: 'too-large' | 'wrong-type';
  message: string;
}

export interface FileDropzoneProps {
  /** Selected files (controlled). */
  files: readonly File[];
  onFilesChange: (files: File[]) => void;
  /** Same syntax as <input accept>: ".pdf,image/*,application/pdf". */
  accept?: string;
  maxSizeBytes: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Called with files that were refused (also shown to the user). */
  onReject?: (rejections: FileRejection[]) => void;
  className?: string;
  id?: string;
  'aria-describedby'?: string;
}

/** Does `file` match an accept string? Client-side check only — the server re-validates by magic bytes. */
export function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith('.')) return name.endsWith(token);
      if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

/**
 * Drag & drop OR click/keyboard to browse. Shows selected files, refuses oversized or
 * wrongly-typed files with a clear message. Uploading itself happens elsewhere (Phase 8).
 */
export function FileDropzone({
  files,
  onFilesChange,
  accept,
  maxSizeBytes,
  multiple = false,
  disabled = false,
  onReject,
  className,
  id,
  'aria-describedby': describedBy,
}: FileDropzoneProps) {
  const { t } = useTranslation('ui');
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [dragging, setDragging] = useState(false);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const maxSize = formatBytes(maxSizeBytes);

  function addFiles(incoming: File[]) {
    const accepted: File[] = [];
    const refused: FileRejection[] = [];
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        refused.push({
          file,
          reason: 'wrong-type',
          message: t('dropzone.wrongType', { name: file.name }),
        });
      } else if (file.size > maxSizeBytes) {
        refused.push({
          file,
          reason: 'too-large',
          message: t('dropzone.tooLarge', { name: file.name, size: maxSize }),
        });
      } else {
        accepted.push(file);
      }
    }
    setRejections(refused);
    if (refused.length > 0) onReject?.(refused);
    if (accepted.length > 0) {
      onFilesChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    addFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center gap-2 rounded-card border border-dashed border-border bg-surface-2/50 px-6 py-8 text-center',
          'transition-colors duration-150 ease-out',
          dragging && 'border-primary bg-primary/5',
          disabled && 'opacity-50',
        )}
      >
        <UploadCloud aria-hidden className="size-6 text-muted" />
        <p className="text-body text-text">
          {t('dropzone.prompt')}{' '}
          <button
            id={id}
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            aria-describedby={[hintId, describedBy].filter(Boolean).join(' ')}
            className="rounded-control font-medium text-primary underline-offset-4 hover:underline"
          >
            {t('dropzone.browse')}
          </button>
        </p>
        <p id={hintId} className="text-small font-normal text-muted">
          {t('dropzone.hint', { size: maxSize })}
          {accept && <> · {t('dropzone.accepts', { types: accept.replaceAll(',', ', ') })}</>}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          data-testid="file-input"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = ''; // allow choosing the same file again
          }}
        />
      </div>

      {rejections.length > 0 && (
        <ul role="alert" className="space-y-1">
          {rejections.map((r) => (
            <li key={`${r.file.name}-${r.reason}`} className="text-small font-normal text-danger">
              {r.message}
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul
          aria-label={t('dropzone.selected')}
          className="divide-y divide-border rounded-card border border-border"
        >
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-3 py-2">
              <FileText aria-hidden className="size-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate text-body">{file.name}</span>
              <span className="text-small text-muted tabular">{formatBytes(file.size)}</span>
              <button
                type="button"
                aria-label={t('dropzone.remove', { name: file.name })}
                onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
                className="inline-flex size-7 items-center justify-center rounded-control text-muted hover:bg-surface-2 hover:text-text"
              >
                <X aria-hidden className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
