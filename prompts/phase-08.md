<!-- Track A · Phase 8 -->
## PHASE 8 — Document Management

**Objective:** Secure upload, storage, preview, organization, and linking of financial documents.
**Prerequisites:** Phase 5 (Phase 7 for linking).

```text
=== ACCENTRA — PHASE 8: SECURE DOCUMENT MANAGEMENT ===

You are a senior backend engineer with application-security expertise. Financial documents (bank statements, invoices, PAN/GST certificates) are among the most sensitive files a small business owns. Nothing in this phase may produce a publicly reachable file URL.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Documents are uploaded by entrepreneurs (and later CA verification certificates), linked to transactions and (in Phase 14) to review requests. CAs read them only with the "documents:read" scope.

--- B. EXISTING PROJECT STATE ---
Phases 1–7 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, ACCOUNTING_RULES.md. Inspect transactions module (documentIds field) and FileDropzone component.

--- C. IMPLEMENTATION OBJECTIVE ---
Storage adapter (local + S3-compatible), upload pipeline with strict validation, Document model with versions and links, authorized preview/download, documents page, linking documents to transactions, and access logging.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Storage adapter (server/src/lib/storage/): interface { put(key, buffer, contentType): Promise<void>; getStream(key): Promise<Readable>; getSignedUrl(key, { expiresInSeconds, downloadName? }): Promise<string|null>; delete(key): Promise<void> }.
   - LocalStorageDriver: stores under server/uploads/<businessId>/<yyyy>/<uuid> (folder git-ignored); getSignedUrl returns null (files are streamed through the API).
   - S3StorageDriver using @aws-sdk/client-s3 + s3-request-presigner, compatible with Cloudflare R2 and AWS S3 (S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY). Bucket must be private; presigned GET URLs expire in 300 seconds.
   - STORAGE_DRIVER env selects; env.ts validates required vars per driver.
   - Keys are random UUIDs — never derived from user-supplied filenames.
2. Upload pipeline (POST /businesses/:businessId/documents, multipart):
   - multer memoryStorage with limits: 10 MB per file, max 5 files per request.
   - Allowed types: PDF, JPEG, PNG, WEBP, HEIC (images converted? no — store as-is), XLSX, CSV. Validate by MAGIC BYTES (file-type package), not by extension or client mimetype; reject mismatches.
   - Reject PDFs containing JavaScript or embedded files (basic check for /JavaScript, /JS, /EmbeddedFile, /Launch tokens; document the limitation that this is not a full malware scan, and leave a ScanProvider interface with a "none" implementation for a future ClamAV/cloud scanner).
   - Compute SHA-256 checksum; if the same checksum already exists in this business, return a warning flag "possibleDuplicate" with the existing document id (do not block).
   - Sanitize originalName for display (strip path characters, limit 150 chars).
   - Fields: category (invoice_sales, invoice_purchase, receipt, bank_statement, tax_document, registration_document, other), financialYear (default current FY from business settings), optional description, optional link { type: "transaction", id }.
3. Document model: businessId, uploadedBy, category, financialYear, originalName, mimeType, sizeBytes, storageKey, checksum, version (1..n), versionGroupId (same for all versions), isLatest, links [{ type: "transaction" | "review" | "task" | "invoice" | "bill", id }], description, isDeleted, deletedAt, deletedBy, timestamps.
4. Versions: POST .../documents/:id/versions uploads a new version: new document record with version+1, same versionGroupId, previous isLatest=false. Version list endpoint. Old versions remain downloadable.
5. Access:
   - GET .../documents (paginated; filters category, FY, linked/unlinked, text search on name/description; latest versions only by default).
   - GET .../documents/:id (metadata).
   - GET .../documents/:id/content?disposition=inline|attachment → authorized; local driver streams with correct Content-Type, Content-Disposition (RFC 5987 filename encoding), X-Content-Type-Options: nosniff, Cache-Control: private, no-store; S3 driver responds with a 302 to a fresh presigned URL. Inline preview allowed only for PDF and images; everything else forces attachment.
   - Every content access writes a documentAccess audit record (actor, document, action view|download).
6. Linking: POST .../documents/:id/links { type, id } and DELETE .../documents/:id/links (validates the target exists in the same business). Transaction detail drawer gains an "Attachments" section: upload new (FileDropzone) or attach existing (searchable picker); the transaction's documentIds stays in sync (keep ONE source of truth — prefer Document.links and compute the transaction's attachments by query; remove/replace the documentIds field if it would duplicate; explain the decision).
7. Delete: soft delete only (isDeleted) by owners; documents linked to an active or approved review cannot be deleted (Phase 14 will enforce the review side; implement the check hook now returning false).
8. Documents page /app/documents: PageHeader with "Upload" primary; folder-style left filter by category and FY (collapsible on mobile); DataTable (name with file-type icon, category badge, FY, size, uploaded by, date, linked-to chips); row click opens a preview Drawer: PDF via the browser's built-in viewer in an <iframe> pointing to the authorized content URL (use a blob URL fetched with the access token — do NOT put the access token in the URL), images inline, others show metadata + download; versions list; links list; actions (download, upload new version, link to transaction, delete).
9. Upload dialog: drag and drop multiple files; per-file category select and progress bar (XHR/fetch with upload progress); per-file success/error; duplicate warning shown with "View existing".

--- E. FRONTEND REQUIREMENTS ---
Feature folder features/documents. Never construct file URLs containing tokens. Revoke blob URLs on close. Both themes, responsive; all strings via t().

--- F. BACKEND REQUIREMENTS ---
Module documents/ with routes above. Owners: all actions. CAs with "documents:read": list, metadata, content (view/download). Rate limit uploads (30/hour/user). Body size limits on the multipart route only.

--- G. DATABASE REQUIREMENTS ---
documents: (businessId, isLatest, category, financialYear), (businessId, checksum), (businessId, "links.type", "links.id"), (versionGroupId, version). documentAccessLogs: (businessId, at), (documentId, at). tenantGuard on both.

--- H. INTEGRATION REQUIREMENTS ---
Transactions detail attachments; Phase 10 reuses the pipeline for CA certificates (design upload service to accept an ownerType of "business" or "user" — CA certificates belong to the CA user, not to a business; implement the user-owned variant now with category "ca_certificate" and access limited to the CA and admins); Phase 14 links documents to reviews.

--- I. SECURITY REQUIREMENTS ---
Magic-byte validation; size limits; random storage keys; no public URLs; nosniff; inline only for safe types; tenant + scope checks; access audit; no file path ever built from user input; uploads directory outside any static-serving path.

--- J. TESTING REQUIREMENTS ---
Valid PDF/PNG upload 201; renamed .exe as .pdf → 400; 11 MB file → 413/400; PDF with /JavaScript → 400; duplicate checksum → 201 with possibleDuplicate; owner download 200 with correct headers; other business owner → 404; CA without connection → 404; CA with documents:read → 200; CA without scope → 404; version upload increments version and preserves old; soft delete hides from list; link to another business's transaction → 400; access log written on download. Run with the local driver; show output. Describe how to test the S3 driver manually with an R2 bucket.

--- K. COMPLETION CRITERIA ---
Upload, preview (PDF + image), download, version, link to transaction, soft delete all work; unauthorized access returns 404 (tested); no token ever appears in a URL (check DevTools Network); uploads folder git-ignored; PROJECT_STATE.md updated with storage env vars.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (8a) storage adapter + upload pipeline + model + tests; (8b) access endpoints + linking + tests; (8c) documents page + preview + transaction attachments. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes and list exactly what I must configure to use Cloudflare R2 in production.
```

**Git:** commit per sub-step → `git tag phase-8-complete`

**Checklist:** [ ] Fake `.pdf` rejected · [ ] Preview works without token in URL · [ ] Other business can't download (404) · [ ] Versions kept · [ ] Attachments visible on transaction
