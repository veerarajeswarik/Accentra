<!-- Track A · Phase 10 -->
## PHASE 10 — CA Professional Profiles & Admin Verification

**Objective:** CAs build professional profiles and get verified by an admin before receiving the "Verified" badge.
**Prerequisites:** Phases 4, 8.

```text
=== ACCENTRA — PHASE 10: CA PROFILES & ADMIN CREDENTIAL VERIFICATION ===

You are a senior full-stack engineer building a professional-verification flow. A falsely "verified" CA on a financial platform is a serious trust and legal problem; verification must be manual, logged, and reversible.

--- A. PROJECT CONTEXT ---
Accentra (MERN + TS). Chartered Accountants are members of ICAI (Institute of Chartered Accountants of India) with a membership number. Accentra does NOT have automated access to ICAI records; an admin manually checks the submitted details and certificate.

--- B. EXISTING PROJECT STATE ---
Phases 1–9 complete. Read docs/PROJECT_STATE.md, AI_RULES.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Inspect auth (/auth/me onboarding.caProfileComplete), the documents upload pipeline (user-owned "ca_certificate" variant from Phase 8), adminNav, and the admin seed script.

--- C. IMPLEMENTATION OBJECTIVE ---
CAProfile model; CA onboarding wizard; CA profile page with verification status; admin verification queue with certificate viewer and approve/reject/revoke; verified badge component; basic admin dashboard; notifications are NOT yet available (Phase 13) — send emails via the email adapter for verification decisions.

--- D. DETAILED FUNCTIONAL REQUIREMENTS ---
1. CA onboarding (/onboarding/ca-profile), 3 steps:
   Step 1 Professional identity: full name as per ICAI records, ICAI membership number (6 digits — validate format; note in UI "we verify this manually"), year of qualifying (1950–current), qualifications (multi-select: CA, CS, CMA, CPA, DISA, other + free text), firm name (optional), firm registration number (optional).
   Step 2 Practice: city, state, years of experience, specializations (multi-select: GST, income tax, audit, bookkeeping, company law, startup advisory, payroll, other), services offered (multi-select: monthly bookkeeping review, GST return preparation, ITR filing, audit, advisory, other), languages spoken (multi-select including English, Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, other), consultation modes (online, in-person), short bio (≤ 600 chars), accepting new clients (yes/no).
   Step 3 Verification: upload membership certificate or ICAI ID card (PDF/JPG/PNG via the user-owned document pipeline), declaration checkbox ("The information is true; I consent to verification"). Submit → verificationStatus "pending".
   /auth/me onboarding.caProfileComplete becomes true after submission; CA guard redirects incomplete profiles to onboarding.
2. /ca/profile: view/edit profile; status banner: Pending ("Under review — usually within 2 business days"), Verified (badge + date), Rejected (reason + "Resubmit" which returns status to pending after changes), Revoked (reason). Editing identity fields (name, membership number, certificate) after verification resets status to "pending" (warn with ConfirmDialog first). Practice fields can be edited freely.
3. Admin workspace:
   - /admin dashboard: counts (users by role, CAs pending/verified/rejected, businesses, documents) — real queries.
   - /admin/ca-verifications: tabs Pending / Verified / Rejected / Revoked; DataTable (name, membership no., city, submitted at, email verified?); detail page with all profile fields, the certificate preview (authorized stream; admin-only access), email-verified status, history timeline of verification actions.
   - Actions: Approve (only if the CA's email is verified), Reject (reason required, from presets + free text), Revoke verified (reason required). Each action is audit-logged (ca.verified, ca.rejected, ca.revoked) with admin id and reason, and emails the CA via the email adapter.
   - Admin checklist panel on the detail page (UI only, not stored): "Name matches certificate", "Membership number matches certificate", "Check ICAI's public member directory if available" — reminds the admin what to check.
4. VerifiedBadge component (components/ui) with tooltip "Credentials manually verified by Accentra on <date>". Never shown unless verificationStatus === "verified".
5. Public CA profile view model (used by Phase 11 directory): a serializer that exposes ONLY safe fields (name, firm name, city, state, experience, specializations, services, languages, consultation modes, bio, verified flag, verifiedAt) — never the certificate, membership number, phone, or email.

--- E. FRONTEND REQUIREMENTS ---
Reuse Stepper, FormField, Combobox (multi-select variant — add if missing), FileDropzone, Timeline, StatusBadge. CA workspace /ca shows a temporary panel "Your profile is under review" when pending (the full CA dashboard comes in Phase 12). Both themes, responsive, t().

--- F. BACKEND REQUIREMENTS ---
Modules ca-profiles/ (POST/GET/PATCH /ca-profiles/me) and admin/ (GET /admin/stats, GET /admin/ca-verifications?status, GET /admin/ca-verifications/:userId, POST .../approve, .../reject, .../revoke, GET .../certificate/content). All admin routes: authenticate + requireRole("admin"). Shared Zod schemas.

--- G. DATABASE REQUIREMENTS ---
caProfiles per ARCHITECTURE 3.4 plus verificationHistory [{ action, byUserId, reason?, at }], rejectionReason, revokedReason. Indexes: unique userId; (verificationStatus, createdAt); (verificationStatus, state, city); text index on bio + firm name for later search.

--- H. INTEGRATION REQUIREMENTS ---
Document pipeline (user-owned); email adapter; audit log; /auth/me; Phase 11 directory consumes the public serializer; Phase 13 will add in-app notifications for these events (leave a notify() call through a NotificationPort interface that currently does nothing but is clearly named).

--- I. SECURITY REQUIREMENTS ---
Only admins verify; a CA cannot set their own status (ignore status fields in CA payloads — test). Certificates visible only to the owning CA and admins. Membership numbers never exposed publicly. Admin actions audited with reasons.

--- J. TESTING REQUIREMENTS ---
CA submits profile → pending; CA PATCH with verificationStatus "verified" → ignored/400; entrepreneur cannot access /ca-profiles/me write → 403; admin approve unverified-email CA → 409; admin approve → verified + audit + email logged; reject requires reason; editing identity fields after verification → pending; non-admin on admin routes → 403; certificate content for another CA → 404; public serializer omits sensitive fields. Run; show output.

--- K. COMPLETION CRITERIA ---
Register a CA → complete profile → admin approves → CA sees Verified badge; reject and resubmit flow works; audit entries present; certificate never publicly reachable; PROJECT_STATE.md updated.

--- L. FINAL AI INSTRUCTIONS ---
Plan first. Sub-steps: (10a) model + CA onboarding + profile; (10b) admin verification + stats. Follow docs/AI_RULES.md. Run tests; show output. Update docs. Report changes.
```

**Git:** → `git tag phase-10-complete`

**Checklist:** [ ] CA cannot self-verify · [ ] Admin approve/reject/revoke with reasons, audited · [ ] Certificate admin-only · [ ] Badge only when verified
