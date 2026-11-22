<!-- Track A · Phase 4 -->
## PHASE 4 — Authentication

**Objective:** Real, secure accounts with roles, sessions that survive refresh, email verification, and password reset.
**Prerequisites:** Phases 1–2.

```text
=== ACCENTRA — PHASE 4: AUTHENTICATION & ROLE-BASED ROUTING ===

You are a senior backend + security engineer. Implement authentication for a financial application where a compromised account exposes a business's books. Correctness and security outrank convenience.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TypeScript). Roles: entrepreneur, ca, admin. Admins are NEVER created through public registration.

--- B. EXISTING PROJECT STATE ---
Phases 1–3 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md (section 3.5 auth flow is the specification), DESIGN_SYSTEM.md. Inspect server/src/app.ts, the error handler, client router, AuthLayout, and the <RequireAuth> placeholder from Phase 2.

--- C. IMPLEMENTATION OBJECTIVE ---
Registration with role, email verification, login, access/refresh token sessions, logout, forgot/reset password, current-user endpoint, client auth state, route guards with role-based redirects, and an admin seed script.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. Register (/register): role selection cards (Entrepreneur / Chartered Accountant; preselect from ?role=); fields name (2–80), email, mobile (Indian format: optional +91, 10 digits starting 6–9), password (min 10 chars, at least one letter and one number; strength meter), confirm password, accept terms checkbox (links to /terms, /privacy). On success: account created with emailVerified=false, verification email sent, user logged in, redirected to onboarding (/onboarding/business for entrepreneurs, /onboarding/ca-profile for CAs — these pages will be built in Phases 5 and 10; until then route to ComingSoon). Duplicate email → generic message "If this email can be used, you'll receive a verification email" is NOT appropriate for registration UX; instead return 409 "An account with this email already exists" (acceptable trade-off; document it in the decisions log).
2. Email verification: single-use token (32 random bytes, stored hashed, 24h expiry); /verify-email?token= page shows success/expired/invalid states; "Resend verification" (rate-limited). Unverified users can use the app but see a persistent banner; CAs cannot be verified by admins until their email is verified (enforced in Phase 10).
3. Login (/login): email + password; generic error "Incorrect email or password" for both unknown email and wrong password; rate limit 10 attempts / 15 min per IP+email; after 5 consecutive failures for an account, lock for 15 minutes (store failedLoginCount, lockUntil). On success redirect by role: entrepreneur → /app (or onboarding if no business yet — check via /auth/me response field), ca → /ca (or profile onboarding if incomplete), admin → /admin. Respect a ?next= param only if it is a relative path within the same role's area.
4. Tokens (exactly as ARCHITECTURE 3.5):
   - Access token: JWT HS256, 15 minutes, claims { sub, role, sid }, signed with JWT_ACCESS_SECRET (≥ 32 chars, validated in env.ts). Returned in JSON; client keeps it IN MEMORY only (never localStorage/sessionStorage).
   - Refresh token: 32 random bytes base64url; stored as SHA-256(token + REFRESH_TOKEN_PEPPER) in refreshTokens collection with userId, sessionId, expiresAt (30 days), userAgent, ip hash. Sent as cookie "accentra_rt": httpOnly, Secure (configurable via COOKIE_SECURE for local http), SameSite=Lax, path=/api/v1/auth.
   - POST /auth/refresh rotates: old token marked revoked with replacedBy; new token issued. If a REVOKED token is presented → revoke all sessions for that user (reuse detection) and return 401.
5. Logout: revokes current refresh token, clears cookie. "Log out of all devices" option in user menu → revokes all.
6. Forgot / reset password: /forgot-password always responds "If an account exists, we've sent a reset link" (no enumeration); token single-use, hashed, 1h expiry; /reset-password?token= sets new password (same rules), revokes all existing sessions, and logs the user in.
7. GET /auth/me: returns { id, name, email, role, emailVerified, preferredLanguage, themePreference, onboarding: { hasBusiness: boolean, caProfileComplete: boolean } } (the onboarding fields return false until Phases 5/10 implement them — compute them through a small function that later phases will extend).
8. PATCH /users/me/preferences: { themePreference?, preferredLanguage? } — wire the Phase 2 ThemeProvider "onThemeChange" hook to call this when logged in, and apply the server preference on login.
9. Admin seed: server/src/scripts/seed-admin.ts run via "npm run seed:admin -w server"; reads ADMIN_EMAIL and ADMIN_PASSWORD from env (or prompts in the terminal), creates or updates an admin with emailVerified=true, prints no secrets. Document in README.
10. Email adapter: server/src/lib/email/ with interface sendEmail({to, subject, html, text}); drivers "console" (dev: logs subject + link to terminal) and "resend" (prod, RESEND_API_KEY, EMAIL_FROM). Plain, branded HTML templates for verification and reset (inline styles, no external images).

--- E. FRONTEND REQUIREMENTS ---
- AuthProvider: holds accessToken in memory + user; on app start calls POST /auth/refresh to restore the session (show a full-screen branded loading state, not a flash of the login page); exposes login, register, logout, refreshUser.
- apiClient: attaches Authorization header; on 401 performs ONE refresh attempt (de-duplicated if several requests fail at once), retries the request, otherwise logs out and redirects to /login?next=.
- Replace <RequireAuth> placeholder with real guards: <RequireAuth roles={[...]}> redirects unauthenticated users to /login?next=, wrong-role users to their own home. /login and /register redirect already-logged-in users to their home.
- Forms use React Hook Form + shared Zod schemas; show field errors, loading buttons, server error toasts; password visibility toggle; autocomplete attributes (email, current-password, new-password).
- User menu in WorkspaceLayout top bar: name, email, role badge, "Settings", "Log out", "Log out of all devices".
- All strings via t() (namespace "auth").

--- F. BACKEND REQUIREMENTS ---
Module server/src/modules/auth/ (routes, controller, service, tests) and modules/users/. Routes: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, POST /auth/logout-all, POST /auth/verify-email, POST /auth/resend-verification, POST /auth/forgot-password, POST /auth/reset-password, GET /auth/me, PATCH /users/me/preferences.
Middleware server/src/middleware/authenticate.ts (verifies access token, loads minimal user, rejects suspended users) and requireRole.ts. Password hashing with argon2id (or bcrypt cost 12 if argon2 fails to install on Windows — explain).
New env vars: JWT_ACCESS_SECRET, REFRESH_TOKEN_PEPPER, COOKIE_SECURE, EMAIL_DRIVER, RESEND_API_KEY (optional in dev), EMAIL_FROM, APP_URL (for links), ADMIN_EMAIL/ADMIN_PASSWORD (seed only). Add to env.ts and .env.example with instructions to generate secrets (provide a PowerShell one-liner or node -e command).

--- G. DATABASE REQUIREMENTS ---
users: name, email (unique, lowercase, trimmed), phone, passwordHash (select: false), role, emailVerified, status ("active" | "suspended"), preferredLanguage ("en" default), themePreference ("system" default), failedLoginCount, lockUntil, lastLoginAt, timestamps.
refreshTokens: userId, sessionId, tokenHash (unique), expiresAt (TTL index), revokedAt, replacedByHash, userAgent, ipHash, createdAt.
emailTokens: userId, purpose ("verify" | "reset"), tokenHash (unique), expiresAt (TTL), usedAt.
Never return passwordHash or token hashes in any API response (toJSON transform).

--- H. INTEGRATION REQUIREMENTS ---
ThemeProvider syncs with user preferences. Marketing CTAs (?role=) prefill registration. Phase 5 will extend /auth/me onboarding.hasBusiness; Phase 10 will extend caProfileComplete.

--- I. SECURITY REQUIREMENTS ---
No tokens in localStorage/sessionStorage. No user enumeration on forgot-password. Constant-time token comparison. Rate limits on login, register (5/hour/IP), forgot-password, resend-verification. Account lockout. Role in JWT is never trusted for business data access (Phase 5 checks memberships in DB). Suspended users rejected in authenticate. Registration ignores any "role: admin" in the payload (test this). CSRF: refresh/logout rely on SameSite=Lax cookie + require a custom header "X-Requested-With: accentra" on these routes (simple CSRF mitigation; document it).

--- J. TESTING REQUIREMENTS ---
Server integration tests: register success; register with role "admin" → 400; duplicate email → 409; weak password → 400; login success sets cookie with correct flags; wrong password → 401 generic; lockout after 5 failures; refresh rotates token; reusing old refresh token revokes all sessions; logout revokes; /auth/me without token → 401; expired access token → 401; forgot-password for unknown email → 200 same message; reset token single-use and expiring; suspended user → 401/403. Client tests: RequireAuth redirects; apiClient refresh-once logic de-duplicates concurrent 401s. Run all tests; show output.

--- K. COMPLETION CRITERIA ---
1. Register as entrepreneur and as CA; verification link appears in the server terminal (console driver) and works.
2. Refresh the browser on /app — still logged in. Close and reopen the tab — still logged in (cookie).
3. DevTools → Application → Local Storage contains no token. Cookie accentra_rt is HttpOnly.
4. Entrepreneur visiting /ca is redirected to /app; CA visiting /app is redirected to /ca; logged-out user visiting /app goes to /login?next=/app.
5. seed:admin creates an admin who lands on /admin.
6. All tests pass; PROJECT_STATE.md updated with routes, models, env vars.

--- L. FINAL AI INSTRUCTIONS ---
Plan first; wait for approval. Implement in sub-steps and pause after each: (4a) models + service + routes + tests (backend only); (4b) AuthProvider, apiClient refresh logic, guards; (4c) pages (register, login, verify, forgot, reset) + user menu + preference sync. Follow docs/AI_RULES.md. Never weaken a security requirement to make a test pass; if something is impossible locally (e.g., Secure cookies over http), use the documented env flag. Run tests; show output. Update PROJECT_STATE.md and ARCHITECTURE.md if anything differs. Report changes, new env vars, and the exact manual test steps.
```

**Git:** commit after 4a, 4b, 4c → `git tag phase-4-complete`

**Checklist:** [ ] Login survives refresh · [ ] No token in localStorage · [ ] Role redirects correct · [ ] Lockout works · [ ] Admin only via seed script · [ ] All auth tests pass
