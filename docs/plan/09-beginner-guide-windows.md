# PART 9 — Beginner Execution Instructions (Windows · VS Code · PowerShell)

### Concepts you'll meet (one-line explanations)

| Term | Meaning |
|---|---|
| **Terminal / PowerShell** | A window where you type commands instead of clicking. VS Code has one built in (`` Ctrl+` ``). |
| **Node.js / npm** | Node runs JavaScript outside the browser (your server). npm installs code libraries ("packages"). |
| **Repository (repo)** | Your project folder tracked by Git, so every saved version can be restored. |
| **Commit** | A saved snapshot of your project. **Tag** = a named bookmark on a commit (e.g., `phase-5-complete`). |
| **Frontend / client** | What runs in the browser (React). **Backend / server** = the API that talks to the database (Express). |
| **API** | URLs the frontend calls to get or save data, e.g., `GET /api/v1/health`. |
| **Environment variables (`.env`)** | Secret settings (database password, keys) kept out of the code and out of Git. |
| **MongoDB Atlas** | The cloud database where your data lives. |
| **Port** | A numbered door on your computer: client on `5173`, server on `5000`. |
| **Agentic AI coding tool** | An AI that can read and edit your project files and run commands (Claude Code, Cursor Agent). |

### Step 1 — Install the software (one time)

Open **PowerShell** (Start menu → type "PowerShell") and run:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install Microsoft.VisualStudioCode
```

Close PowerShell, open a new one, and verify:

```powershell
node -v      # should print v22.x or newer
npm -v
git --version
```

Allow npm scripts to run (PowerShell blocks them by default):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Tell Git who you are:

```powershell
git config --global user.name "Veera"
git config --global user.email "your-email@example.com"
git config --global init.defaultBranch main
```

Also install: **Google Chrome** (best support for testing voice features later) and a free **GitHub** account.

### Step 2 — Install your AI coding tool

Pick **one** as your main builder:
- **Claude Code** — follow the official installation instructions on Anthropic's documentation site (search "Claude Code install"). It runs in the VS Code terminal and edits your files directly.
- **Cursor** — download from cursor.com; it's a VS Code–like editor. Use **Agent** mode for these prompts.

Use Gemini / AI Studio or the regular Claude chat for side questions ("what does this error mean?"), not for editing the project.

### Step 3 — Create MongoDB Atlas (one time)

1. Sign up at mongodb.com/atlas → create a **free (M0) cluster**, region **Mumbai (ap-south-1)** if available.
2. **Database Access** → Add a database user (username `accentra_dev`, auto-generate a strong password, role *Read and write to any database*). Save the password in a password manager.
3. **Network Access** → Add your current IP address.
4. **Connect → Drivers** → copy the connection string. It looks like:
   `mongodb+srv://accentra_dev:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Insert the database name before the `?`: `...mongodb.net/accentra_dev?retryWrites=true&w=majority`. If your password contains special characters (`@ : / ? #`), replace them with their URL-encoded form or regenerate a password without them.

### Step 4 — Create the project folder and save this plan

```powershell
mkdir C:\dev\accentra
cd C:\dev\accentra
git init
mkdir docs
code .
```

VS Code opens. Create `docs/MASTER_PLAN.md` and paste this **entire document** into it. Then:

```powershell
git add .
git commit -m "docs: add master plan"
```

Create an **empty private repository** named `accentra` on GitHub (no README), then:

```powershell
git remote add origin https://github.com/<your-username>/accentra.git
git push -u origin main
```

### Step 5 — The working loop for every phase

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Create a branch:      git switch -c phase-7               │
│ 2. Start a FRESH AI session (new chat / restart the tool)    │
│ 3. Paste the phase prompt (or sub-step)                      │
│ 4. READ the AI's plan. Approve or ask questions.             │
│ 5. Let it implement. Watch for commands it wants to run.     │
│ 6. Review changes:       git status   /   git diff --stat    │
│ 7. Run it yourself:      npm run dev   and   npm run test    │
│ 8. Do the phase checklist manually in the browser            │
│ 9. Commit the sub-step:  git add . ; git commit -m "..."     │
│10. Paste the LEARNING PROMPT (Part 10) — understand the code │
│11. Phase done → merge + tag:                                 │
│      git switch main                                         │
│      git merge phase-7                                       │
│      git tag phase-7-complete                                │
│      git push origin main --tags                             │
└──────────────────────────────────────────────────────────────┘
```

**Why a fresh session each phase?** AI tools get confused in very long conversations. The docs files (`PROJECT_STATE.md`, etc.) carry the memory instead.

### Step 6 — Running the app

```powershell
cd C:\dev\accentra
npm install          # after Phase 1, and whenever package.json changes
npm run dev          # starts client (http://localhost:5173) and server (http://localhost:5000)
```

Stop servers with `Ctrl+C` in the terminal. Other useful commands (available after Phase 1):

```powershell
npm run test         # run all automated tests
npm run lint         # find code-style problems
npm run typecheck    # find TypeScript errors
npm run seed:admin -w server   # (Phase 4+) create the admin account
npm run seed:demo  -w server   # (Phase 15+) load demo data
```

### Step 7 — Setting up environment variables

After Phase 1, copy the example file and edit it:

```powershell
Copy-Item server\.env.example server\.env
code server\.env
```

Paste your Atlas connection string as `MONGODB_URI`. Each later phase tells you which new variables to add. To generate a strong secret:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

**Never** paste secrets into an AI chat, and never commit `.env`. Check with `git status` — `server/.env` must never appear.

### Step 8 — When something breaks (it will; that's normal)

**Where to look:**
1. **The terminal running `npm run dev`** — server errors (red text, stack traces).
2. **Browser DevTools** (`F12`) → **Console** tab — frontend errors.
3. **DevTools → Network** tab — click the failing request (red) → **Response** shows the API's error message.

**How to give errors to the AI** (use the Debugging Prompt in Part 10). Always include:
- What you did (exact clicks), what you expected, what happened.
- The **full** error text (copy it, don't summarise).
- Which phase you're in.

**Golden rules:**
- One problem at a time. Don't ask the AI to fix three things at once.
- If the AI has tried the same fix twice and it's still broken, stop. Run `git diff` to see what changed, then use `git restore .` to undo uncommitted changes and try again with a clearer description.
- If a phase goes badly wrong, return to the last good state:
  ```powershell
  git restore .                       # discard uncommitted changes
  git switch main                     # back to the last merged phase
  git branch -D phase-7               # delete the broken branch
  git switch -c phase-7               # start the phase again
  ```

### Step 9 — Verifying a phase before moving on

Move to the next phase **only when all of these are true**:
- [ ] The phase's checklist (after its prompt) passes when *you* click through it — not just because the AI said so.
- [ ] `npm run test`, `npm run lint`, `npm run typecheck` pass.
- [ ] Every earlier feature still works (spend 3 minutes clicking through the main flows; after Phase 14, run the E2E test).
- [ ] Both themes checked on new screens; narrow the browser to phone width once.
- [ ] `docs/PROJECT_STATE.md` was updated.
- [ ] You can explain in 3 sentences what this phase added (the Learning Prompt helps).

### Step 10 — Deployment (Phase 15)

The Phase 15 prompt walks you through it and pauses at each website you need to click in. Summary of what you'll set up: a production Atlas database user → a Render Web Service connected to your GitHub repo (server) → a Vercel project connected to your GitHub repo (client, root directory `client`) with the `/api` rewrite → Cloudflare R2 bucket for documents → Resend for emails. Expect to spend an afternoon on it the first time.

### Realistic expectations

- Track A is roughly **6–8 weeks** at 3–4 hours a day. Phases 6, 7, and 14 are the hardest; budget extra time there.
- You will understand more of the code with each phase **if you run the Learning Prompt every time**. Treat it as part of the build, not optional homework — in a finance app, you must be able to explain how money flows through your code.
