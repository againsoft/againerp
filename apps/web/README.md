# AgainERP — Ecommerce Admin UI Prototype

> **Phase 1** · Frontend only · Mock data · No backend

**Docs:** [docs/ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md](../../docs/ECOMMERCE_ADMIN_PROTOTYPE_PHASE1.md)

## Run

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → redirects to `/dashboard`.

## Stack

Next.js · TypeScript · Tailwind · Shadcn-style UI · AG Grid · Recharts · CMDK · Sonner

## Deliverables (Phase 1)

| # | Feature | Route |
|---|---------|-------|
| 1 | Admin shell | all `(admin)` routes |
| 2 | Sidebar | — |
| 3 | Header | — |
| 4 | Dashboard | `/dashboard` |
| 5 | Product list | `/catalog/products` |
| 6 | Product details | `/catalog/products/[id]` |
| 7–8 | Product create/edit | modal dialog |
| 9 | Media manager | `/media` |
| 10 | AI assistant | header sparkle · ⌘K |

## Mock data

`src/lib/mock-data/` — 120 products, dashboard charts, variants demo on product details.
