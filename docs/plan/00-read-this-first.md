# ACCENTRA — Complete Analysis, Architecture & AI Development Roadmap
### Your Smart Accounting Partner · MERN Edition · v2.0 (November 2026)

> **How to read this document.** Parts 1–7 are the *thinking*: what Accentra is, how it's built, and in what order. Part 8 is the *doing*: one copy-paste prompt per phase. Parts 9–12 are the *operating manual*: how to run prompts as a beginner, recover from errors, verify the product, and demo it.
>
> Start with the "Read This First" section. It contains the decisions I changed from your brief and why. Skipping it means building on assumptions I've already found problems with.

---

## READ THIS FIRST — The CTO's Corrections to the Brief

You asked me to "identify and correct technical inconsistencies or unsafe assumptions." Here they are, before any planning. Each one is reflected throughout the rest of this document.

### 1. This pivot replaces the September plan. Say so explicitly, and own it.

In September we planned **Accentra for freelancers** (income clarity + tax set-aside) on **Next.js + PostgreSQL + Clerk**, with invoicing deferred. This description targets **entrepreneurs and small businesses collaborating with Chartered Accountants**, on **MERN**, with invoicing central.

That is a legitimate product decision, but it is a *different product*. Two consequences:

- **The new product is a two-sided marketplace.** Entrepreneurs only get value from "Find a CA" if verified CAs are already on the platform, and CAs only join if clients are there. This is the classic cold-start problem, and it kills marketplaces. **Fix:** the primary connection path in the MVP is **"Invite your existing CA"** by email. The entrepreneur brings their own accountant, so the product is useful with one CA. Discovery and matchmaking become a growth feature on top, not the foundation.
- **The freelancer validation work still matters.** Talk to 3 entrepreneurs and 2 practicing CAs before the hackathon. Ask the CAs specifically: *"How do your clients send you documents today, and what's the most annoying part?"* That answer is your pitch.

### 2. MongoDB for double-entry accounting: accepted, with non-negotiable guardrails.

Relational databases are the natural fit for ledgers (I recommended PostgreSQL in September for that reason). You've specified MERN, and MongoDB *can* support correct accounting **if** the rules below are enforced in code. Every database-related prompt in this plan enforces them:

| Rule | Why |
|------|-----|
| All money stored as **integers in paise** (`amountPaise: 150050` = ₹1,500.50). Never floats, never strings. | `0.1 + 0.2 !== 0.3` in JavaScript. Floating-point money produces wrong totals. |
| **Journal entries are immutable.** Corrections are made by posting a *reversal* entry plus a new entry. | Accountants (and auditors) need a trail. Editing history destroys trust. |
| Every journal entry must balance (**total debits = total credits**), checked in the service layer *and* by a schema validator. | An unbalanced ledger means every report is wrong. |
| Multi-document writes use **MongoDB transactions** (sessions). MongoDB Atlas clusters, including the free tier, are replica sets that support them. | A transaction saved without its journal entry is a corrupted book. |
| Reports are computed **from journal lines**, never from cached totals on dashboards. | One source of truth. |

### 3. The scope is 6–12 months of work for a beginner. The hackathon needs a different finish line.

The description is essentially *Zoho Books + a CA marketplace + a review-workflow tool + an AI assistant + voice + three languages*. That is not a criticism; it's a vision. But building it all before a hackathon is how teams arrive with 30 half-working pages.

So the roadmap has **two tracks**:

- **Track A — Hackathon MVP (Phases 1–15).** Ends with a deployed app demonstrating the complete Entrepreneur → CA review → clarification → approval workflow on a real ledger.
- **Track B — Full Product (Phases 16–27).** Invoicing with GST, purchases, full statements, messaging, AI, multilingual, voice, learning hub, and production hardening.

Nothing from the vision is dropped. It is sequenced.

### 4. "Hackathon prototype" and "real financial data" must not mix.

Until Phase 26 (security hardening) and a legal review against India's **Digital Personal Data Protection (DPDP) Act**, Accentra must run on **clearly labelled demo data only**. Don't onboard a real business's books onto a hackathon build. This is written into the prompts.

### 5. Five AI-coding mistakes this plan prevents by design

| Common AI-generated mistake | What this plan does instead |
|---|---|
| JWT stored in `localStorage` (stealable by any XSS) | Short-lived access token in memory + refresh token in an **httpOnly, Secure cookie** |
| Frontend hides buttons, backend allows everything | Every API route passes through `authenticate` → `requireRole` → `requireBusinessAccess` middleware |
| AI assistant "calculates" profit itself (and gets it wrong) | The AI only **calls server functions** that compute numbers from the ledger, then explains them |
| Socket.IO built before notifications are stored | Notifications are **database records first**, polling second, real-time push last |
| Every phase rewrites the last | A `docs/PROJECT_STATE.md` file is updated at the end of every phase and read at the start of the next |

### 6. Two hosting realities to plan around

- **Free backend hosting sleeps.** Render's free tier spins down after inactivity, and the first request can take ~30–60 seconds. Your judges will not wait. Phase 15 includes a warm-up procedure (or use a paid instance for demo week).
- **Cross-site cookies are fragile.** If the frontend is on `accentra.vercel.app` and the backend on `accentra-api.onrender.com`, auth cookies become "third-party" and browsers increasingly block them. **Fix:** Vercel *rewrites* `/api/*` to the backend, so the browser only ever talks to one domain. This is set up in Phase 1 for development and Phase 15 for production.

### 7. Which AI coding tool to use

Google AI Studio's app builder is excellent for single-page prototypes, but it is the wrong tool for a multi-folder MERN project that must evolve over 27 phases. Use an **agentic tool that reads and edits your actual project folder**: **Claude Code** or **Cursor** (Agent mode). Use Gemini/AI Studio for side questions and explanations. All prompts in this document are written to work with any agentic coding tool.
