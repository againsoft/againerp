# AgainERP — Permission System Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Owner:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Layer:** Core Platform (global authorization)  
> **Governance:** [GOVERNANCE.md](../00-foundation/GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../00-foundation/standards/DEVELOPMENT_STANDARDS.md)

## Purpose
RBAC and permission system architecture.

## When To Read
Read only when working on roles, permissions, or record-level access.

## Related Files
- [Core hub](ARCHITECTURE.md)
- [Permissions entity](entities/permissions.md)

## Read Next
- [Roles entity](entities/roles.md)

---

**No backend code. No database implementation. No API implementation.**  
This document is the source of truth for **AgainERP's global authorization system** — RBAC, resource ACL, field/branch/warehouse scoping, approval gates, AI permissions, and audit access across ERP, Ecommerce, CRM, Marketplace, and AI OS.

### Step 15 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Global authorization system | §1 Purpose |
| ERP, Ecommerce, CRM, Marketplace, AI OS | §4 · §5 · §11 |
| RBAC through API model | §3–§15 |
| Examples: Product.View, AI.Execute, … | §4 · §6 |
| Future: Hospital, School, Restaurant, Manufacturing | §15 (Future) |

**Related:** [core/entities/permissions.md](./entities/permissions.md) · [core/entities/roles.md](./entities/roles.md) · [DATABASE_REGISTRY.md](../00-foundation/registries/DATABASE_REGISTRY.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](./engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [ui-ux/permission-aware-ui.md](../04-uiux/standards/permission-aware-ui.md)

---

## Executive Summary

The **Permission System** is AgainERP's **single authorization kernel** — every module, API endpoint, UI action, AI tool, and approval gate resolves permissions through one engine.

| Principle | Rule |
|-----------|------|
| **One registry** | All permissions registered centrally — no module-specific ACL tables |
| **RBAC foundation** | User → Roles → Permissions |
| **Layered enforcement** | Resource → Record → Field → Branch → Warehouse |
| **Fail closed** | Deny by default; explicit grant required |
| **Server authoritative** | UI hides actions; API always re-checks |
| **AI inherits user** | AI OS never exceeds acting user's permissions |
| **Industry extensible** | New verticals register keys — no engine redesign |
| **Audit on change** | Role/permission mutations logged immutably |

**Table namespace:** `permissions`, `roles`, `role_permissions`, `user_roles`, `record_rules`, `field_permissions` · **API base:** `/api/v1/core/permissions/`

---

## 1. Purpose

### Why a Global Permission System Exists

AgainERP spans ecommerce storefronts, B2B ERP, CRM pipelines, marketplace seller portals, and AI-assisted operations. Without unified authorization:

| Problem | Impact |
|---------|--------|
| Per-module ACL silos | Inconsistent keys, duplicate role admin |
| UI-only security | API bypass via direct calls |
| AI elevated access | Ungoverned writes across modules |
| Branch/warehouse leakage | User sees all company stock |
| Approval bypass | Sensitive action without role check |
| Marketplace sellers | No tenant-scoped seller isolation |

The Permission System answers:

- **Who can do what?** (resource actions)
- **On which records?** (record rules)
- **Which fields?** (field ACL)
- **In which branch/warehouse?** (dimensional scope)
- **Can AI act on behalf of user?** (AI namespace)
- **Who can approve?** (approval permissions)

### What This System Owns

| Owns | Does Not Own |
|------|--------------|
| Permission & role registry | Business document content |
| Effective permission resolution | Authentication (identity provider) |
| Record/field/branch/warehouse rules | Workflow state definitions |
| API authorization middleware | Approval routing logic (Approval Engine) |
| UI permission manifest contract | Module business validation |

---

## 2. Security Vision

### Vision Statement

> **Least privilege by default. Explicit grant for every action. Scope every query.**

### Security Goals

| Goal | Implementation |
|------|----------------|
| **Zero trust between modules** | Services check permissions on every call |
| **Defense in depth** | RBAC + record rules + field ACL + approval |
| **Separation of duties** | Creator ≠ approver policies |
| **Tenant isolation** | `company_id` mandatory filter |
| **Dimensional isolation** | Branch / warehouse scopes |
| **AI containment** | Separate `ai.*` namespace; inherits user |
| **Marketplace isolation** | Seller scope on vendor-owned records |
| **Auditability** | All grants/revokes logged |

### Authorization Stack

```text
┌─────────────────────────────────────────────────────────────────┐
│  Request (User or AI-on-behalf-of-user)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Authentication — valid session / API token                   │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Company context — active company_id                          │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. RBAC — role → permission keys                                │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Record rules — row-level domain filters                      │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Field permissions — column read/write                        │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Branch / warehouse scope — dimensional filters               │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Approval gate — if action requires human approval            │
└───────────────────────────────┬─────────────────────────────────┘
                                ▼
                         Allow / Deny (403)
```

---

## 3. RBAC Architecture

**Role-Based Access Control (RBAC)** is the foundation — users receive permissions through roles, not direct assignment (except break-glass super admin).

### RBAC Model

```text
User ──< user_roles >── Role ──< role_permissions >── Permission
  │                        │
  │                        └── record_rules (optional domain)
  │                        └── field_permissions (optional columns)
  └── user_branches / user_warehouses (dimensional scope)
```

### Core Tables (Registry — No DDL)

| Entity | Purpose |
|--------|---------|
| **Permission** | Atomic capability key |
| **Role** | Named bundle per company |
| **Role Permission** | Role ↔ permission pivot |
| **User Role** | User ↔ role pivot (company-scoped) |
| **Record Rule** | Row-level filter on entity |
| **Field Permission** | Column read/write/hide |

### Evaluation Order

1. Resolve active `company_id` from session / header
2. Load user's roles for that company
3. Union all permission keys from roles
4. Apply super-admin bypass (platform only — audited)
5. Check requested permission key — if missing → **deny**
6. Apply record rule domain to query
7. Apply branch/warehouse filters
8. Apply field permissions to response DTO

### System vs Custom Roles

| Type | Description |
|------|-------------|
| **System role** | Shipped with module install — non-deletable (`is_system=true`) |
| **Custom role** | Company admin creates — clone from template |

### Caching

- Effective permissions cached per user+company (TTL 15 min)
- Invalidation on role assignment, permission grant, rule change
- Never cache across companies

---

## 4. Permission Registry

The **Permission Registry** is the canonical catalog of all capability keys. Modules **register** at install; they do not invent parallel ACL systems.

### Permission Key Format

| Layer | Format | Example |
|-------|--------|---------|
| **Display label** | `{Resource}.{Action}` PascalCase | `Product.View`, `Inventory.Transfer` |
| **Canonical key** | `{module}.{resource}.{action}` lowercase | `catalog.product.view`, `inventory.transfer.create` |

Both refer to the same registry row: `key` = canonical, `label` = display.

### Standard Actions

| Action | Meaning |
|--------|---------|
| `view` | Read single/list |
| `create` | Insert new record |
| `edit` | Update existing |
| `delete` | Soft delete |
| `export` | Bulk export |
| `import` | Bulk import |
| `approve` | Approval Engine action |
| `assign` | Change owner |
| `execute` | Run operation (AI, workflow) |
| `manage` | Admin/config CRUD |
| `access` | Module/menu entry |

### Module Prefixes

| Module | Prefix | Example Key |
|--------|--------|-------------|
| Catalog / Product Master | `catalog` | `catalog.product.view` |
| Inventory | `inventory` | `inventory.transfer.create` |
| Purchase | `purchase` | `purchase.order.approve` |
| Sales | `sales` | `sales.order.create` |
| CRM | `crm` | `crm.lead.assign` |
| Marketing | `marketing` | `marketing.campaign.send` |
| Finance | `finance` | `finance.journal.post` |
| Ecommerce | `commerce` | `commerce.order.process` |
| Marketplace | `marketplace` | `marketplace.seller.manage` |
| Workflow | `workflow` | `workflow.definition.manage` |
| Approval | `approval` | `approval.request.approve` |
| AI OS | `ai` | `ai.tool.execute` |
| Core | `core` | `core.role.manage` |

### Registration Contract

On module install / upgrade:

```yaml
permissions:
  - key: catalog.product.view
    label: Product.View
    group: Catalog — Products
    resource: catalog.product
    action: view
    risk: low
  - key: catalog.product.publish
    label: Product.Publish
    group: Catalog — Products
    resource: catalog.product
    action: publish
    risk: high
    approval_policy: catalog.product.publish
```

### Step 15 Example Permissions

| Display Label | Canonical Key | Domain |
|---------------|---------------|--------|
| **Product.View** | `catalog.product.view` | Catalog |
| **Product.Create** | `catalog.product.create` | Catalog |
| **Inventory.Transfer** | `inventory.transfer.create` | Inventory |
| **Purchase.Approve** | `purchase.order.approve` | Purchase |
| **CRM.Assign** | `crm.lead.assign` | CRM |
| **AI.Execute** | `ai.tool.execute` | AI OS |
| **Workflow.Manage** | `workflow.definition.manage` | Workflow |

### Permission Groups (UI)

Permissions grouped for role editor UI:

- Catalog — Products · Catalog — Categories · Inventory — Stock · Sales — Orders · CRM — Pipeline · Finance — Journals · AI — Assistant · …

---
## 5. Role Registry

The **Role Registry** defines named role templates — system defaults and company custom roles.

### System Roles (Platform)

| Role | Scope | Purpose |
|------|-------|---------|
| **Platform Super Admin** | Cross-tenant | SaaS operator — audited break-glass |
| **Platform Support** | Read-only cross-tenant | Support diagnostics |

### System Roles (Company)

| Role | Typical Permissions |
|------|---------------------|
| **Company Admin** | All company permissions except platform |
| **Finance Controller** | Finance.* + read sales/purchase |
| **Catalog Manager** | Product.* + media + SEO |
| **Warehouse Manager** | Inventory.* scoped to warehouses |
| **Sales Manager** | Sales.* + CRM read + approve quotes |
| **Purchase Manager** | Purchase.* + approve PO |
| **CRM Manager** | CRM.* + assign |
| **Marketing Manager** | Marketing.* + AI content apply |
| **Staff** | View + limited create per module |
| **Portal Customer** | Commerce order view (own contact) |
| **Portal Vendor** | Purchase RFQ respond (own vendor) |

### Marketplace Roles

| Role | Scope |
|------|-------|
| **Marketplace Admin** | Platform marketplace config |
| **Seller Admin** | Seller's products, orders, payouts |
| **Seller Staff** | Limited seller operations |

Seller roles scoped by `seller_id` record rule — see §6.

### Role Assignment Rules

- User may hold **multiple roles** per company — permissions union
- Role assignment requires `core.role.manage` + audit log
- System roles: permissions extensible, slug immutable
- Custom roles: clone from template recommended

---

## 6. Resource Permissions

**Resource permissions** control CRUD and operations on **entity types** — the primary RBAC layer.

### Resource Registry ID

Aligns with [DATABASE_REGISTRY.md](../00-foundation/registries/DATABASE_REGISTRY.md): `{module}.{entity}`

Examples: `catalog.product`, `sales.order`, `finance.journal_entry`

### Resource × Action Matrix (Representative)

#### Catalog

| Resource | View | Create | Edit | Delete | Approve | Publish | Export |
|----------|------|--------|------|--------|---------|---------|--------|
| `catalog.product` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `catalog.category` | ✓ | ✓ | ✓ | ✓ | — | — | — |

#### Inventory

| Resource | View | Create | Edit | Transfer | Adjust | Approve |
|----------|------|--------|------|----------|--------|---------|
| `inventory.stock_level` | ✓ | — | — | — | — | — |
| `inventory.transfer` | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| `inventory.adjustment` | ✓ | ✓ | ✓ | — | ✓ | ✓ |

#### Purchase

| Resource | View | Create | Edit | Approve | Match |
|----------|------|--------|------|---------|-------|
| `purchase.order` | ✓ | ✓ | ✓ | ✓ | — |
| `purchase.bill` | ✓ | ✓ | ✓ | ✓ | ✓ |

#### Sales

| Resource | View | Create | Edit | Approve | Invoice |
|----------|------|--------|------|---------|---------|
| `sales.quotation` | ✓ | ✓ | ✓ | ✓ | — |
| `sales.order` | ✓ | ✓ | ✓ | ✓ | ✓ |

#### CRM

| Resource | View | Create | Edit | Assign | Convert |
|----------|------|--------|------|--------|---------|
| `crm.lead` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `crm.opportunity` | ✓ | ✓ | ✓ | ✓ | ✓ |

#### Ecommerce / Commerce

| Resource | View | Process | Refund | Cancel |
|----------|------|---------|--------|--------|
| `commerce.order` | ✓ | ✓ | ✓ | ✓ |

#### Marketplace

| Resource | View | Manage | Payout |
|----------|------|--------|--------|
| `marketplace.seller` | ✓ | ✓ | ✓ |
| `marketplace.listing` | ✓ | ✓ | — |

### Composite Checks

Some operations require **multiple permissions**:

| Operation | Required Keys |
|-----------|---------------|
| Publish product | `catalog.product.publish` + `catalog.product.edit` |
| Post journal | `finance.journal.post` + open period rule |
| AI apply price | `ai.tool.execute` + `catalog.product.price.edit` |

---

## 7. Field-Level Permissions

**Field permissions** restrict **column-level** read and write — sensitive data hidden even when row is visible.

### Field Permission Entity

| Attribute | Description |
|-----------|-------------|
| `entity_type` | Registry resource ID |
| `field_name` | Column / DTO property |
| `access` | `read`, `write`, `hidden` |
| `role_id` | Scoped to role |

### Common Field ACL Examples

| Entity | Field | Default Roles |
|--------|-------|---------------|
| `catalog.product` | `cost_price` | Finance, Catalog Manager — hidden from Staff |
| `catalog.product` | `margin_percent` | Manager+ |
| `sales.quotation` | `discount_percent` | Sales Manager write; Staff read-only |
| `crm.opportunity` | `expected_revenue` | CRM Manager |
| `finance.journal_entry` | `line.amount` | Finance only |
| `purchase.order` | `unit_cost` | Purchase Manager, Finance |

### Enforcement

| Layer | Behavior |
|-------|----------|
| **API response** | Strip hidden fields from DTO |
| **API write** | Reject payload touching forbidden fields |
| **UI form** | Omit or mask (`••••`) fields |
| **Export** | Exclude hidden columns |
| **AI context** | Field permissions filter AI context bundle |

### Field Permission Rules

- Field deny **overrides** resource edit grant
- More specific rule wins: role + entity + field
- `hidden` fields omitted from list columns by default

---

## 8. Branch-Level Permissions

**Branch scope** restricts data visibility to **locations** under a company — stores, offices, regional divisions.

### Branch Scope Model

| Mechanism | Description |
|-----------|-------------|
| `user_branches` | Explicit branch allow-list per user |
| `record_rules` | `branch_id IN (:user_branch_ids)` |
| **HQ override** | Company Admin sees all branches |
| **No assignment** | Empty = all branches (default for admin roles) |

### Branch-Scoped Entities

| Entity | Branch Column |
|--------|---------------|
| Sales Order | `branch_id` |
| Shipment | `branch_id` |
| POS Session | `branch_id` |
| CRM Territory | `branch_id` |
| Report filters | User branch default |

### Branch Permission Keys

| Key | Purpose |
|-----|---------|
| `core.branch.view` | See branch in switcher |
| `core.branch.manage` | CRUD branches |
| `core.branch.assign` | Assign users to branches |

### UI Behavior

- Branch switcher visible when user has >1 branch
- Lists auto-filter to active branch unless "All branches" permission (`core.branch.view_all`)

---

## 9. Warehouse-Level Permissions

**Warehouse scope** restricts **inventory operations** to authorized stock locations — finer than branch for logistics.

### Warehouse Scope Model

| Mechanism | Description |
|-----------|-------------|
| `user_warehouses` | Allow-list of warehouse IDs |
| Record rules on `inventory_*` | `warehouse_id IN (:user_warehouse_ids)` |
| Transfer constraint | User must have **both** source and target warehouse |

### Warehouse-Scoped Operations

| Operation | Permission + Scope |
|-----------|------------------|
| View stock | `inventory.stock.view` + warehouse rule |
| Create transfer | `inventory.transfer.create` + source/target in scope |
| Post adjustment | `inventory.adjustment.approve` + warehouse in scope |
| Receive goods | `purchase.receipt.post` + receipt warehouse in scope |

### Warehouse Permission Keys

| Key | Purpose |
|-----|---------|
| `inventory.warehouse.view` | See warehouse |
| `inventory.warehouse.manage` | CRUD warehouses |
| `inventory.warehouse.assign` | Assign users to warehouses |
| `inventory.stock.view_all` | All warehouses in company |

### Branch vs Warehouse

| Dimension | Use Case |
|-----------|----------|
| **Branch** | Sales, CRM, reporting, org structure |
| **Warehouse** | Stock movements, picking, logistics |

A branch may contain multiple warehouses; scopes are **independent but combinable**.

---

## 10. Approval Permissions

Integrates [Approval Engine](../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md).

### Approval Permission Types

| Type | Key Pattern | Purpose |
|------|-------------|---------|
| **Submit for approval** | `{module}.{resource}.submit` | Start approval flow |
| **Approve** | `{module}.{resource}.approve` | Grant approval step |
| **Reject** | `{module}.{resource}.reject` | Deny approval step |
| **Delegate** | `approval.delegation.manage` | Configure delegates |
| **Inbox view** | `approval.inbox.view` | See pending approvals |

### Separation of Duties

| Rule | Enforcement |
|------|-------------|
| Creator ≠ approver | Approval Engine policy + permission check |
| Dual approval | Two distinct users with `approve` permission |
| Self-approval block | Cannot approve own `created_by` records (configurable) |

### Module Approval Examples

| Display | Key | Module |
|---------|-----|--------|
| Purchase.Approve | `purchase.order.approve` | Purchase PO |
| Product.Approve | `catalog.product.approve` | Catalog publish |
| Finance.Approve | `finance.journal.approve` | Journal post |
| Expense.Approve | `finance.expense.approve` | Expense claim |

Approval permission alone is **insufficient** — user must also appear in approval chain policy (role/team/dimension).

---

## 11. AI Permissions

Integrates [AI OS Architecture](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md).

### AI Namespace: `ai.*`

| Key | Label | Purpose |
|-----|-------|---------|
| `ai.access` | AI.Access | Use AI features |
| `ai.chat` | AI.Chat | Chief Agent conversation |
| `ai.tool.execute` | **AI.Execute** | Invoke agent tools |
| `ai.tool.apply` | AI.Apply | Apply approved proposal |
| `ai.automation.manage` | AI.Automation.Manage | Configure AI automations |
| `ai.prompt.manage` | AI.Prompt.Manage | Edit prompts |
| `ai.provider.manage` | AI.Provider.Manage | API keys, routing |
| `ai.cost.view` | AI.Cost.View | Token spend reports |
| `ai.audit.view` | AI.Audit.View | AI audit logs |

### Domain AI Write Keys

| Key | Purpose |
|-----|---------|
| `ai.write.catalog` | Propose catalog changes |
| `ai.write.sales` | Propose sales changes |
| `ai.write.finance` | Propose finance changes (always + approval) |

### AI Permission Rules

1. **AI inherits user permissions** — tool checks both `ai.tool.execute` and target resource permission
2. **No AI super-user** — break-glass is human platform admin only
3. **Automation runs as triggering user** — scheduled job stores `run_as_user_id`
4. **Marketplace seller AI** — scoped to seller record rules

```text
AI tool call allowed =
  ai.tool.execute
  AND ai.write.{domain} (if write)
  AND {module}.{resource}.{action} (inherited)
  AND record/field/branch/warehouse rules
  AND approval if high-risk
```

---

## 12. Audit Permissions

Permissions governing **visibility of audit trails** — distinct from business resource view.

| Key | Purpose |
|-----|---------|
| `core.audit.view` | Activity log explorer |
| `core.audit.export` | Export audit CSV |
| `finance.audit.view` | Finance immutable audit log |
| `ai.audit.view` | AI operation audit |
| `approval.audit.view` | Approval decision history |
| `core.security.view` | Login history, failed auth |

### Audit Access Rules

- Audit read **does not** imply business record read (separate keys)
- Compliance officer role: audit.* without operational write
- Audit exports require `*.export` + MFA (future)
- Field-level audit shows old/new values only if user had field read at time of change

---

## 13. Delegation Rules

**Delegation** temporarily transfers approval authority — integrates Approval Engine and RBAC.

### Delegation Types

| Type | Description |
|------|-------------|
| **Approval delegation** | Approver A → B for date range |
| **Record assignment** | Owner reassignment (CRM.Assign) |
| **Role delegation** | **Not supported** — roles not transferable |
| **AI delegation** | **Not supported** — AI acts as user only |

### Approval Delegation Entity

| Field | Notes |
|-------|-------|
| `delegator_id` | Original approver |
| `delegate_id` | Substitute approver |
| `starts_at`, `ends_at` | Window |
| `scope` | all, module, policy_id |
| `status` | active, expired, revoked |

### Delegation Permission Keys

| Key | Purpose |
|-----|---------|
| `approval.delegation.create` | Create own delegation |
| `approval.delegation.manage` | Admin manage all delegations |
| `crm.record.delegate` | Assign leads/opps to others |

### Rules

- Delegate must have same or higher approval permission
- Delegation chain max depth: 1 (no delegate's delegate)
- All delegations audited
- Expired delegations fail closed

---

## 14. UI Permission Model

Integrates [permission-aware-ui.md](../04-uiux/standards/permission-aware-ui.md).

### UI Manifest Contract

Each module declares in architecture / manifest:

```yaml
menus:
  - id: sales.orders
    route: /sales/orders
    permission: sales.order.view

pages:
  - route: /sales/orders/[id]
    permissions:
      read: sales.order.view
      write: sales.order.edit

actions:
  - id: confirm_order
    permission: sales.order.approve
    placement: [toolbar, row]

columns:
  - field: grand_total
    permission: sales.order.view

fields:
  - name: discount_percent
    permission: sales.order.discount.edit
    mode: write
```

### UI Rules

| Rule | Implementation |
|------|----------------|
| **Hide, don't disable** | Remove forbidden buttons/menus |
| **403 page** | No read permission → full page deny |
| **Read-only form** | View without edit — inputs disabled, save hidden |
| **Bulk actions** | Intersection of permissions on selected rows |
| **Smart buttons** | Hidden if related resource not readable |
| **Module sidebar** | `{module}.access` gates entire section |
| **AI panel** | Requires `ai.access` + resource view |

### Client Permission Cache

- Loaded on login: `GET /api/v1/me/permissions`
- Includes: keys[], field ACL map, branch/warehouse IDs, menu tree
- **UX only** — never sole security control

### Marketplace Seller UI

- Seller portal uses seller-scoped permission subset
- Platform admin UI separate auth context
- Shared components, different manifest file

---

## 15. API Permission Model

Every API endpoint declares required permission(s). Middleware enforces before controller logic.

### Endpoint Declaration

```python
@router.post("/orders/{id}/confirm")
@requires_permission("sales.order.approve")
@record_rule("sales.order")
async def confirm_order(id: UUID, ctx: AuthContext): ...
```

### Auth Context Object

| Field | Source |
|-------|--------|
| `user_id` | JWT |
| `company_id` | Header `X-Company-Id` |
| `branch_id` | Header or default |
| `permissions` | Cached effective set |
| `warehouse_ids` | Scope array |
| `is_ai_session` | True if AI-on-behalf-of-user |

### API Enforcement Layers

| Layer | Check |
|-------|-------|
| **Route middleware** | Permission key present |
| **Service layer** | Business rules + record ownership |
| **Query builder** | Record rules → SQL WHERE |
| **Response serializer** | Field permissions strip |
| **Write validator** | Reject forbidden fields |

### Standard HTTP Responses

| Code | Condition |
|------|-----------|
| `401` | Unauthenticated |
| `403` | Authenticated, permission denied |
| `404` | Record not found **or** hidden by record rule (no leak) |
| `422` | Field write forbidden |

### API Surfaces

| Base | Auth |
|------|------|
| `/api/v1/core/` | Core + admin |
| `/api/v1/catalog/` | Catalog permissions |
| `/api/v1/sales/` | Sales permissions |
| `/api/v1/ai/os/` | AI + inherited module |
| `/api/v1/marketplace/seller/` | Seller-scoped |

### Public / Portal APIs

- Storefront: customer sees own `commerce.order` via contact linkage — not full RBAC
- Vendor portal: `purchase.rfq.respond` scoped to vendor contact
- Permission engine still applies — reduced key set on portal roles

### AI Tool API

`POST /api/v1/ai/os/tools/propose`

Requires: `ai.tool.execute` + target resource permission + record scope

Returns: `proposal_id` — not executed until apply/approval

---

## Future Support (No Redesign)

New industries and modules **register permissions** — engine unchanged.

| Vertical | Prefix | Example Keys |
|----------|--------|--------------|
| **Hospital** | `hospital` | `hospital.patient.view`, `hospital.admission.approve` |
| **School** | `school` | `school.student.view`, `school.enrollment.create` |
| **Restaurant** | `restaurant` | `restaurant.order.view`, `restaurant.kitchen.manage` |
| **Manufacturing** | `mfg` | `mfg.work_order.create`, `mfg.bom.edit` |

### Extension Checklist

1. Define module prefix and resource IDs
2. Register permissions in §4 format
3. Add system role templates in §5
4. Declare record rules (branch/plant/department)
5. Add field ACL for sensitive vertical fields
6. Wire UI manifest + API decorators
7. Update [DATABASE_REGISTRY.md](../00-foundation/registries/DATABASE_REGISTRY.md) entities

---

## Appendix A — Effective Permission Resolution (Pseudocode)

```text
function can(user, action_key, record?, fields?):
  if not authenticated(user): return DENY
  if not user.has_company(company_id): return DENY
  if not user.permissions.contains(action_key): return DENY
  if record and not record_rule_allows(user, record): return DENY
  if branch_scope and record.branch_id not in user.branches: return DENY
  if warehouse_scope and record.warehouse_id not in user.warehouses: return DENY
  if fields and not field_acl_allows(user, fields): return DENY
  if action_requires_approval(action_key) and not approval_granted: return PENDING
  return ALLOW
```

---

## Appendix B — Governance Rules

| # | Rule |
|---|------|
| 1 | **Central registry** — all keys in Permission Registry |
| 2 | **Module registers, Core owns** — no module ACL tables |
| 3 | **Fail closed** — deny if key missing |
| 4 | **Server enforces** — UI is advisory |
| 5 | **AI inherits user** — no elevation |
| 6 | **Audit role changes** — append-only log |
| 7 | **Document before code** — permission in architecture doc before endpoint |
| 8 | **CHANGELOG on new keys** — traceability |

### Anti-Patterns (Forbidden)

```text
❌ if (user.isAdmin) skip permission check
❌ Module-specific permissions table outside Core
❌ AI service account with finance.journal.post for all users
❌ Client-only permission gate on API
❌ Hard-coded role name checks in business logic
❌ Cross-company permission cache
❌ Granting approve without separation-of-duties policy
```

---

## Related Documents

| Document | Role |
|----------|------|
| [core/entities/permissions.md](./entities/permissions.md) | Entity spec |
| [core/entities/roles.md](./entities/roles.md) | Role entity |
| [DATABASE_REGISTRY.md](../00-foundation/registries/DATABASE_REGISTRY.md) | Domain entities |
| [APPROVAL_ENGINE_ARCHITECTURE.md](./engines/APPROVAL_ENGINE_ARCHITECTURE.md) | Approval gates |
| [AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI permissions |
| [ui-ux/permission-aware-ui.md](../04-uiux/standards/permission-aware-ui.md) | UI patterns |
| Module `*_MODULE_ARCHITECTURE.md` | Per-module permission tables |

---

*End of Permission System Architecture — Step 15*
