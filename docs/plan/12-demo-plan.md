# PART 12 — Hackathon Demonstration Plan

### 12.1 The story you're telling

> *"Every month, 60 million Indian small businesses send their accountant a mess of WhatsApp photos, and their CA spends hours chasing the same missing invoice. Accentra turns that back-and-forth into one structured workflow on a real accounting ledger — understandable by the owner, trustworthy for the CA."*

One problem, one workflow, one "aha" moment: **the clarification loop resolved in 60 seconds, with history.** (Verify any market statistic you use from a credible, citable source before putting it on a slide; if you can't, say "millions of".)

### 12.2 Setup (from `docs/DEMO_RUNBOOK.md`)

- Laptop with **two Chrome profiles side by side** (or laptop + second screen): left = Priya (entrepreneur), right = CA Meenakshi. Both logged in, zoom 110%, notifications polling verified.
- Re-run `seed:demo` the morning of the demo; hit `/api/v1/health` 3 minutes before presenting (cold start).
- A **2-minute backup screen recording** of the full flow on the desktop, ready to play if Wi-Fi fails.
- A real-looking but clearly watermarked demo purchase invoice PDF missing a supplier GSTIN, saved on the desktop.
- Phone in pocket with the app open (to show responsiveness in Q&A).

### 12.3 The 5-minute script

| Time | Screen | What you do | What you say (gist) |
|---|---|---|---|
| 0:00–0:30 | Slide or landing page | — | The problem: scattered documents, owners who can't read their numbers, CAs chasing clients. |
| 0:30–1:15 | Priya · Dashboard (Simple Mode) | Show Money In / Money Out / Profit / Bills to Pay; toggle to **Professional Mode** | "Same numbers, two languages. Priya sees *Money Out*; her CA sees *Expenditure* and *Accounts Payable*. Underneath is a real double-entry ledger." |
| 1:15–1:45 | Priya · Money Out | Record ₹1,180 supplier purchase (unpaid) in 15 seconds; open its detail in Pro mode | "Every entry becomes a balanced journal entry — here are the debit and credit lines. Edits never overwrite history." |
| 1:45–2:15 | Priya · Transaction detail | Drag the invoice PDF onto it → **Submit for CA review** | "No more WhatsApp. The document is attached to the exact transaction it supports." |
| 2:15–2:50 | Meenakshi · CA Dashboard | Bell shows new notification → open review → inspect PDF and transaction → **Request clarification** with template "Supplier GSTIN missing on this invoice" | "Meenakshi manages all her clients here. She can only see what Priya chose to share." |
| 2:50–3:30 | Priya | Bell → amber "Needs your response" panel → upload corrected invoice (new version) → resubmit with note | "Priya knows exactly what's wrong and fixes it in place." |
| 3:30–3:55 | Meenakshi | Open → compare versions → **Approve** | — |
| 3:55–4:20 | Both | Show the **history timeline** (every step, who, when, notes); Priya's document now shows "Approved by CA ✓"; both dashboards updated | "This is the audit trail CAs need and never have." |
| 4:20–4:45 | Priya · My CA | Show scopes; mention one-click revoke | "The owner is always in control of their data." |
| 4:45–5:00 | Slide | Roadmap: GST invoicing, AI explanations, Tamil/Hindi + voice | "We built the foundation right — the ledger and the permissions — so everything next sits on solid ground." |

### 12.4 What judges will ask (prepare these answers)

| Question | Strong answer |
|---|---|
| "How is this different from Zoho Books / Tally?" | They're accounting tools with accountant access bolted on. Accentra's core is the **review workflow** and the owner-friendly dual mode on one ledger, designed for India from day one. |
| "How do you get CAs on the platform?" | Entrepreneurs **invite their existing CA** — the product works with one CA. The directory is a growth layer, not a dependency. *(Mention CA conversations you held.)* |
| "Is the accounting correct?" | Integer-paise money, immutable balanced journal entries, MongoDB transactions, trial balance tested to always balance with randomized tests. Show the test output if asked. |
| "Is financial data secure?" | Server-side tenant isolation on every request (automated cross-business test), scoped revocable CA access, private document storage, httpOnly session cookies, audit logs. Currently demo data only; DPDP-aligned privacy features are on the roadmap before real users. |
| "Does it file GST?" | No — deliberately. Accentra organises and summarises; filing integration requires regulatory authorisation and comes later. Honesty here builds trust. |
| "What's the business model?" | Free for entrepreneurs; subscription for CAs managing many clients (they save hours per client per month). *(Treat this as a hypothesis to validate.)* |
| "What would you build next?" | GST invoicing → AI explanations grounded in the ledger → Tamil/Hindi voice entry. |

### 12.5 Failure recovery

- **Notification slow?** Say "polling every 30 seconds in this build; real-time is next," and click the Reviews tab directly.
- **Server cold start?** You warmed it up; if not, the "Waking up the server" screen buys time — narrate the architecture while it loads.
- **Anything breaks?** Switch to the backup recording without apologising at length: "Let me show you the recorded run while that reconnects."

### 12.6 Rehearsal

Run the script **at least three times** with a timer, once with a friend acting as a skeptical judge. After each run, re-seed. Know exactly which tab to click without looking for it.

---

## Closing note from your co-founder

This plan preserves every idea in your vision — CA marketplace, dual mode, GST, AI, Tamil and Hindi, voice, learning, gamification, eco-tracking, funding readiness — but it insists on an order where each layer stands on something solid. The three things that will decide whether Accentra is a real product rather than an impressive demo are: **the ledger is correct, the permissions are airtight, and real CAs say "yes, I'd use this."** The first two are in Phases 5 and 6. The third requires you to talk to CAs this month.

Two things I need from you to sharpen this further:
1. **Your hackathon date** — I'll cut Track A to a demo-critical subset if the timeline is tight.
2. **The AI coding tool you'll use** — I'll tune prompt formatting and sub-step sizes for it.
