# Product Configurator Engine — Architecture

> **Status:** Spec only — backend **not implemented** (removed for design phase)  
> **UI prototype:** `apps/web/` — mock data only  
> **Future code:** `modules/product_configurator/` (when full dev starts)  
> **Standards:** [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)

---

## Executive Summary

Reusable **Product Configurator Engine** for AgainERP — not limited to PC builds. A **profile** defines the builder type; **categories**, **rules**, **templates**, and **builds** are scoped to that profile.

| Future builder | `profile_type` |
|----------------|----------------|
| PC Builder | `pc_builder` |
| Laptop Builder | `laptop_builder` |
| CCTV Builder | `cctv_builder` |
| Networking Builder | `networking_builder` |
| Server Builder | `server_builder` |
| Solar Builder | `solar_builder` |

---

## Module Structure

```
Product Configurator
├── Configurator Profiles      → configurator_profiles
├── Component Categories       → configurator_categories
├── Compatibility Rules        → configurator_rules
├── Build Templates            → configurator_templates
├── Saved Configurations       → configurator_builds
├── Recommendation Engine      → RecommendationService
└── AI Assistant               → AiAssistantService
```

---

## Layered architecture

```
FastAPI routes (thin)
    → Services (business logic)
        → Repositories (data access)
            → PostgreSQL (configurator_*)
```

Cross-module: Catalog product resolution via `CatalogService` (future) — no direct SQL to `catalog_*`.

---

## Key flows

### 1. Admin setup

```
Create profile (cctv_builder) → Add categories (Camera, DVR, Cable)
→ Define rules (exclusion, requirement) → Publish templates
```

### 2. Customer build

```
Select profile → Pick components per category → Rule engine validates
→ Recommendation suggests missing parts → Save build → Add to cart (Orders)
```

### 3. AI assist

```
User prompt + current components → AiAssistantService
→ Compatibility warnings + suggested next category (AI OS in production)
```

---

## Code map

| Layer | Path |
|-------|------|
| Models | `modules/product_configurator/models/` |
| Schemas | `modules/product_configurator/schemas/` |
| Repositories | `modules/product_configurator/repositories/` |
| Services | `modules/product_configurator/services/` |
| Routes | `modules/product_configurator/routes/` |
| Migrations | `modules/product_configurator/migrations/` |
| Manifest | `modules/product_configurator/manifest.yaml` |
| API entry | `apps/api/main.py` |

---

## Events (planned)

| Event | When |
|-------|------|
| `configurator.profile.created` | New builder profile |
| `configurator.build.saved` | Customer/admin saves configuration |
| `configurator.build.validated` | Rule check passed |

---

## Related

- [Database.md](./Database.md)
- [API.md](./API.md)
- [Permissions.md](./Permissions.md)
- [Catalog ARCHITECTURE](../ecommerce/catalog/ARCHITECTURE.md)
