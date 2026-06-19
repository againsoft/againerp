# AgainERP — Workflow Registry

> **Purpose:** Track all platform workflows and state machines.  
> **Engine:** [core/engines/WORKFLOW_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/WORKFLOW_ENGINE_ARCHITECTURE.md)

---

## Purpose
Documentation: WORKFLOW REGISTRY.

## When To Read
Read only if your task involves workflow registry.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Registry Schema

| Field | Description |
|-------|-------------|
| Workflow ID | `{module}.{entity}` |
| Model | Database table / entity |
| States | Ordered states |
| Transitions | From → To + guards |
| Approvals | Required approval steps |
| Events | Published on transition |
| Module | Owner |
| Status | Planned · Active |

---

## Core Workflows

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `core.approval` | `approvals` | pending → approved / rejected | core | Planned |
| `core.activity` | `activities` | open → done / cancelled | core | Planned |

---

## Ecommerce — Order Workflow

| ID | `commerce.order` |
|----|------------------|
| **Model** | `commerce_orders` |
| **Module** | ecommerce/orders |

| State | Description |
|-------|-------------|
| `draft` | Cart / unpaid |
| `pending` | Payment received, awaiting fulfillment |
| `processing` | Picking / packing |
| `shipped` | Dispatched |
| `delivered` | Completed delivery |
| `cancelled` | Cancelled |
| `refunded` | Refund processed |

| Transition | From | To | Permission | Event |
|--------------|------|-----|------------|-------|
| confirm | draft | pending | `commerce.orders.confirm` | `commerce.order.confirmed` |
| process | pending | processing | `commerce.orders.process` | `commerce.order.processing` |
| ship | processing | shipped | `commerce.orders.ship` | `commerce.order.shipped` |
| deliver | shipped | delivered | `commerce.orders.deliver` | `commerce.order.delivered` |
| cancel | draft,pending | cancelled | `commerce.orders.cancel` | `commerce.order.cancelled` |
| refund | * | refunded | `commerce.orders.refund` | `commerce.order.refunded` |

**Doc:** [modules/ecommerce/orders/ARCHITECTURE.md](../../03-business-modules/ecommerce/orders/ARCHITECTURE.md)

---

## Ecommerce — Product Workflow

| ID | `catalog.product` |
|----|-------------------|
| **Model** | `catalog_products` |
| **Module** | ecommerce/catalog |

| State | Description |
|-------|-------------|
| `draft` | Not visible |
| `pending_approval` | Awaiting review |
| `published` | Live on storefront |
| `archived` | Hidden, retained |

| Transition | From | To | Permission |
|--------------|------|-----|------------|
| submit | draft | pending_approval | `catalog.products.submit` |
| approve | pending_approval | published | `catalog.products.approve` |
| reject | pending_approval | draft | `catalog.products.approve` |
| archive | published | archived | `catalog.products.archive` |

---

## Ecommerce — Return Workflow

| ID | `commerce.return` |
|----|-------------------|
| **States** | requested → approved → received → refunded / rejected |
| **Module** | ecommerce/orders |
| **Approval** | Manager approval on `requested → approved` |

---

## Ecommerce — Refund Workflow

| ID | `commerce.refund` |
|----|-------------------|
| **States** | pending → processing → completed / failed |
| **Module** | ecommerce/orders |
| **Dependencies** | AccountingService (payment reversal) |

---

## Inventory Workflows

**Doc:** [modules/inventory/INVENTORY_WORKFLOW.md](../../03-business-modules/inventory/INVENTORY_WORKFLOW.md)

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `inventory.stock_in` | inbound movements | expected → qc_pending → receiving → received → posted | inventory | Approved |
| `inventory.stock_out` | outbound movements | requested → allocated → picking → picked → shipped | inventory | Approved |
| `inventory.transfer` | `inventory_transfers` | draft → approved → in_transit → received → completed | inventory | Approved |
| `inventory.adjustment` | `inventory_adjustments` | draft → submitted → approved → posted | inventory | Approved |
| `inventory.reservation` | `inventory_reservations` | pending → active → fulfilled / released / expired | inventory | Approved |
| `inventory.batch` | `inventory_batches` | created → active → quarantined / recalled / expired → depleted | inventory | Approved |
| `inventory.serial` | `inventory_serials` | registered → in_stock → reserved → sold → returned / scrapped | inventory | Approved |
| `inventory.cycle_count` | `inventory_cycle_counts` | scheduled → in_progress → counted → reviewed → adj_posted → closed | inventory | Approved |
| `inventory.purchase_suggestion` | — | open → ordered → closed | inventory | Planned |

---

## Approval Workflows (Cross-Module)

| ID | Use Case | Engine |
|----|----------|--------|
| `approval.discount` | High-value discount | Approval Engine |
| `approval.product` | Product publish | Approval Engine |
| `approval.refund` | Large refund | Approval Engine |
| `approval.stock_adjustment` | Stock write-off | Approval Engine |

**Doc:** [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)

---

## AI Workflows

| ID | Description | States |
|----|-------------|--------|
| `ai.tool_invocation` | High-risk tool call | proposed → approved → executed / rejected |
| `ai.content_generation` | AI content publish | generated → reviewed → published |
| `ai.automation` | Scheduled AI task | scheduled → running → completed / failed |

**Doc:** [modules/ai/AI_AUDIT_AND_APPROVAL.md](../../06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md)

---

## Purchase Workflows

**Doc:** [modules/purchase/PURCHASE_WORKFLOW.md](../../03-business-modules/purchase/PURCHASE_WORKFLOW.md)

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `purchase.rfq` | `purchase_rfq` | draft → sent → vendor_response → quotation → approved → po_created | purchase | Approved |
| `purchase.quotation` | `purchase_rfq_responses` | draft → submitted → accepted / rejected | purchase | Approved |
| `purchase.order` | `purchase_orders` | draft → pending_approval → approved → ordered → partially_received → received → closed | purchase | Approved |
| `purchase.receipt` | `purchase_receipts` | draft → receiving → qc_pending → posted → completed | purchase | Approved |
| `purchase.bill` | `purchase_vendor_bills` | draft → unmatched → matched → approved → posted → paid | purchase | Approved |
| `purchase.return` | `purchase_returns` | requested → approved → shipped → vendor_received → credited | purchase | Approved |

---

## Sales Workflows

**Doc:** [modules/sales/SALES_WORKFLOW.md](../../03-business-modules/sales/SALES_WORKFLOW.md)

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `sales.quotation` | `sales_quotations` | draft → sent → negotiation → approved → so_created | sales | Approved |
| `sales.order` | `sales_orders` | draft → confirmed → reserved → packed → shipped → delivered → closed | sales | Approved |
| `sales.shipment` | `sales_shipments` | draft → picked → packed → shipped → delivered | sales | Approved |
| `sales.return` | `sales_returns` | requested → approved → received → restocked → completed | sales | Approved |
| `sales.refund` | `sales_refunds` | requested → approved → processing → completed | sales | Approved |
| `sales.invoice` | `sales_invoices` | draft → posted → partially_paid → paid → closed | sales | Approved |
| `sales.payment` | `sales_payments` | pending → cleared → allocated → reconciled | sales | Approved |
| `sales.credit_note` | `sales_credit_notes` | draft → posted → applied → refunded | sales | Approved |

---

## CRM Workflows

**Doc:** [modules/crm/CRM_MODULE_ARCHITECTURE.md](../../03-business-modules/crm/CRM_MODULE_ARCHITECTURE.md)

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `crm.lead` | `crm_leads` | new → contacted → qualified → converted / unqualified / lost | crm | Approved |
| `crm.opportunity` | `crm_opportunities` | new → qualified → proposal → negotiation → won / lost | crm | Approved |
| `crm.task` | `crm_tasks` | pending → in_progress → completed / cancelled | crm | Approved |

---

## Marketing Workflows

**Doc:** [modules/marketing/MARKETING_MODULE_ARCHITECTURE.md](../../03-business-modules/marketing/MARKETING_MODULE_ARCHITECTURE.md)

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `marketing.campaign` | `marketing_campaigns` | draft → pending_approval → scheduled → running → paused → completed → archived | marketing | Approved |
| `marketing.journey` | `marketing_journeys` | draft → pending_approval → active → paused → archived | marketing | Approved |
| `marketing.coupon` | `marketing_coupons` | draft → active → expired → archived | marketing | Approved |
| `marketing.referral_program` | `marketing_referral_programs` | draft → active → paused → archived | marketing | Approved |
| `marketing.loyalty_program` | `marketing_loyalty_programs` | draft → active → archived | marketing | Approved |

---

## Finance Workflows

**Doc:** [modules/finance/FINANCE_MODULE_ARCHITECTURE.md](../../03-business-modules/finance/FINANCE_MODULE_ARCHITECTURE.md)

| ID | Model | States | Module | Status |
|----|-------|--------|--------|--------|
| `finance.journal_entry` | `finance_journal_entries` | draft → pending_approval → posted → reversed | finance | Approved |
| `finance.ar_invoice` | `finance_ar_invoices` | draft → posted → partial → paid → written_off | finance | Approved |
| `finance.ap_bill` | `finance_ap_bills` | draft → posted → partial → paid | finance | Approved |
| `finance.payment` | `finance_payments` | draft → pending_approval → posted → reconciled | finance | Approved |
| `finance.receipt` | `finance_receipts` | draft → posted → reconciled | finance | Approved |
| `finance.expense` | `finance_expenses` | draft → submitted → approved → posted → reimbursed | finance | Approved |
| `finance.reconciliation` | `finance_reconciliations` | draft → in_progress → completed | finance | Approved |
| `finance.period` | `finance_periods` | open → closing → closed | finance | Approved |

---

## ERP Workflows (Planned)

| ID | Module | States |
|----|--------|--------|
| `hr.leave` | hr | requested → approved → taken |
| `hospital.admission` | hospital | requested → approved → admitted → discharged |

---

## Event Mapping

| Workflow Transition | Event Published |
|--------------------|-----------------|
| order confirmed | `commerce.order.confirmed` |
| order shipped | `commerce.order.shipped` |
| product published | `catalog.product.published` |
| refund completed | `commerce.refund.completed` |
| opportunity won | `crm.opportunity.won` |
| lead converted | `crm.lead.converted` |
| campaign launched | `marketing.campaign.started` |
| journey enrolled | `marketing.journey.enrolled` |
| period closed | `finance.period.closed` |
| journal posted | `finance.journal_entry.posted` |

---

**Last Updated:** 2026-06-13 · **Maintainer:** Platform Architecture Team
