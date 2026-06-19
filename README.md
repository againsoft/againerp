# AgainERP

ERP + Ecommerce + AI OS platform (UI prototype phase).

## Structure

| Path | Description |
|------|-------------|
| `apps/web` | Next.js admin + storefront UI prototype |
| `docs/` | Platform architecture & module documentation |
| **Reading hierarchy** | [docs/BRAIN.md](./docs/BRAIN.md#reading-hierarchy-token-efficient) — stop at lowest level for your task |
| `docs/BRAIN.md` | Level 1 — AI Brain entry |
| `docs/PROJECT_MAP.md` | Level 2 — doc locations |
| `docs/ARCHITECTURE_DECISIONS.md` | Level 2 — core decisions |
| `docs/MODULE_REGISTRY.md` | Level 2 — module index → `{module}/README.md` |
| `docs/00-foundation/PROJECT_BRAIN.md` | Extended brain — checklists, AI matrix |

## Local development

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000

## Deploy on Vercel

The Next.js app lives in **`apps/web`**, not the repo root.

In Vercel → **Project Settings → General → Root Directory**:

1. Click **Edit**
2. Set Root Directory to: `apps/web`
3. Save
4. Go to **Deployments** → **Redeploy** (latest deployment)

Recommended build settings (auto-detected after root directory is set):

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Build Command | `npm run build` |
| Output Directory | *(leave default)* |
| Install Command | `npm install` |

After redeploy, the site should load at your Vercel URL (e.g. `/` storefront, `/dashboard` admin).
