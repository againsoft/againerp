# AgainERP Apps

## Active (design phase)

| App | Path | Run |
|-----|------|-----|
| **Web (Next.js)** | `apps/web/` | `cd apps/web && npm run dev` → http://localhost:3000 |

UI prototype only — mock data, Zustand stores, no API calls.

## Removed (until full development)

| App | Status |
|-----|--------|
| `apps/api/` (FastAPI) | Removed |
| `modules/` (Python modules) | Removed |
| `packages/core/` (shared Python) | Removed |

When backend development starts, recreate FastAPI + module structure per `docs/modules/product-configurator/` specs.

Design guide: [docs/ui-prototype/product-configurator/PROJECT.md](../docs/ui-prototype/product-configurator/PROJECT.md)
