### 10.4 Backend Integration Prompt

```text
You are a senior full-stack engineer connecting existing Accentra UI to real backend functionality. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md (API conventions 3.8, authorization 3.6), ACCOUNTING_RULES.md.

Target: [page/feature, e.g., "the Customers tab shows a hardcoded list"].

1. Find every piece of mock, hardcoded, or localStorage-only data in the target and list it.
2. For each, identify the existing API endpoint and service, or design the missing ones following the module pattern (routes → controller → service → model), the response envelope, shared Zod schemas, authenticate + requireRole + requireBusinessAccess(scope), and tenant scoping by businessId. Present the plan and wait for approval.
3. Implement: backend (with tests: success, validation error, unauthorized, other-business 404), client api.ts functions, TanStack Query hooks with businessId in the query key, loading/empty/error states, cache invalidation after mutations so the UI updates without refresh.
4. Delete the mock data once real data works (do not leave both paths).
5. Verify persistence: create data, refresh the page, restart the server, data still there. Run all tests; paste output. Update PROJECT_STATE.md.
```
