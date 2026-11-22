### 10.8 Deployment Prompt

```text
You are a DevOps engineer preparing Accentra for deployment: client on Vercel (with /api/* rewrite to the backend), server on Render, MongoDB Atlas, Cloudflare R2 storage, Resend email. Read docs/DEPLOYMENT.md (if present), docs/PROJECT_STATE.md, docs/AI_RULES.md, server/src/config/env.ts.

Target environment: [staging | production].

1. Verify the production build works from a clean state: npm ci && npm run build; paste output.
2. Produce a complete environment-variable checklist for the target (name, purpose, where to obtain, which service it's set in) — never ask me to paste secret values into chat.
3. Verify config: COOKIE_SECURE=true, trust proxy, CORS/CLIENT_ORIGIN, STORAGE_DRIVER=s3, EMAIL_DRIVER=resend, separate database and DB user, Vercel rewrites and security headers, Render health check path.
4. Give me exact numbered click-by-click steps for each dashboard; pause after each service and wait for my confirmation.
5. After deploy: run the smoke tests against the deployed URL; check /api/v1/health, login flow, document upload/download, and cookie flags in DevTools; paste results.
6. Document rollback steps for this deployment and update docs/DEPLOYMENT.md and PROJECT_STATE.md.
```
