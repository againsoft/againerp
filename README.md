# AgainERP

ERP + Ecommerce + AI OS platform (UI prototype phase).

## Structure

| Path | Description |
|------|-------------|
| `apps/web` | Next.js admin + storefront UI prototype |
| `docs/` | Platform architecture & module documentation |
| `docs/PROJECT_BRAIN.md` | **Read first** — project map, rules, patterns, AI readiness |
| `docs/ai_os/` | AI OS vision & experience specs (admin, storefront, UX) |

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
