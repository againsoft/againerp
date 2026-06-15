# Industry Module Catalog

> **Parent:** [UNIVERSAL_MODULE_FRAMEWORK.md](../UNIVERSAL_MODULE_FRAMEWORK.md)

---

## Vertical Modules (Planned)

Each follows identical 9-file package + `Menus/`.

| Module | ID | Prefix | Core Entities Reused | Key Own Tables |
|--------|-----|--------|----------------------|----------------|
| **Ecommerce** | `ecommerce` | `catalog_*`, `commerce_*` | contacts, media | products, orders |
| **Hospital** | `hospital` | `hospital_*` | contacts (patients), activities | admissions, appointments, beds |
| **School** | `school` | `school_*` | contacts (students) | classes, enrollments, exams |
| **Restaurant** | `restaurant` | `restaurant_*` | contacts | tables, orders, kitchen tickets |
| **Hotel** | `hotel` | `hotel_*` | contacts, addresses | rooms, reservations, housekeeping |
| **Real Estate** | `realestate` | `realestate_*` | contacts, media | properties, leases, viewings |
| **NGO** | `ngo` | `ngo_*` | contacts | projects, donations, beneficiaries |
| **Courier** | `courier` | `courier_*` | contacts, addresses | shipments, routes, hubs |
| **Manufacturing** | `manufacturing` | `mfg_*` | contacts | bom, work_orders, production |
| **Diagnostic** | `diagnostic` | `diagnostic_*` | contacts | tests, results, appointments |
| **POS** | `pos` | `pos_*` | contacts | sessions, terminals (orders via CommerceService) |
| **Marketplace** | `marketplace` | `marketplace_*` | contacts | vendors, listings |

---

## Cross-Module Examples (Services Only)

| Scenario | Pattern |
|----------|---------|
| Hospital bills patient | `hospital` event → `AccountingService.createInvoice()` |
| School sells uniforms | `CatalogService` + `CommerceService` |
| Restaurant uses inventory | `InventoryService.reserve()` |
| Hotel POS checkout | `pos` → `CommerceService.createOrder()` |
| NGO donation receipt | `ngo` event → `AccountingService` |

---

## Layer Classification

| Layer | Modules |
|-------|---------|
| **core** | Core (not installable) |
| **platform** | SaaS, subscription |
| **commerce** | Ecommerce submodules |
| **erp** | CRM, accounting, HR |
| **industry** | Hospital, school, hotel, … |
| **ai** | AI OS |

---

## Adding New Industry

1. Copy [framework/templates/](../framework/templates/) stubs
2. Pick unique `module_id` and table prefix
3. Map entities to Core contacts/media first
4. Document service deps in Architecture.md
5. No FK to other module tables — UUID references only
