# Partner Directory — UI Spec (Planned)

> **Status:** Draft (Planning)  
> **Route:** `/partners/directory`  
> **Drawer:** `?create=1` · `?view={id}` · `?edit={id}`  
> **Build guide:** [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](./BUSINESS_PARTNERS_UI_BUILD_GUIDE.md) §6–8

---

## Purpose

Central searchable list of all business partners — filter by **role** (vendor, retailer, wholesaler, …), status, territory, tier.

Replaces prototype `/suppliers/all` with unified directory.

---

## Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ Page header: Partner directory · [+ New partner]            │
├─────────────────────────────────────────────────────────────┤
│ Role chips: All | Vendors | Retailers | Wholesalers | …     │
├─────────────────────────────────────────────────────────────┤
│ Search · Status · Territory · Tier · [Export]                 │
├─────────────────────────────────────────────────────────────┤
│ AG Grid (partner rows)                                      │
└─────────────────────────────────────────────────────────────┘
         │
         └──► Right Sheet drawer (?view / ?edit / ?create)
```

---

## Grid columns

| Column | Width | Notes |
|--------|-------|-------|
| Partner | flex | Avatar/logo + name + `BP-####` |
| Roles | 140px | Badge chips, max 2 + overflow |
| Status | 100px | active / on_hold / blocked |
| Primary contact | 160px | Email or phone |
| Territory | 120px | e.g. Dhaka, Chittagong |
| Tier | 100px | WHOLESALE-A |
| Terms | 90px | Net 30 |
| Rating | 70px | ★ 4.2 |
| YTD spend | 100px | Vendor role only |
| YTD revenue | 100px | Customer/wholesale roles |
| Open docs | 80px | PO+SO count |
| ⋮ | 48px | View · Edit · Block |

**Row click** → `?view={id}`

---

## Filters

| Filter | Type |
|--------|------|
| `q` | Search name, code, email, tax ID |
| `role` | URL param + chip sync |
| `status` | multi-select |
| `territory` | select |
| `tier` | select |
| `assigned_to` | user select |

---

## Header actions

| Button | Action |
|--------|--------|
| **New partner** | `?create=1` |
| **Export** | Toast prototype |
| **Import** | P8 backlog |

---

## Mobile (`< 768px`)

| Element | Behavior |
|---------|----------|
| Grid | Card list: name, roles, status, primary metric |
| Role chips | Horizontal scroll |
| Filters | Collapse into "Filters" sheet |
| New partner | FAB or header button |
| Drawer | Full viewport width |

---

## Dummy data (plan)

| Partner | Roles | Notes |
|---------|-------|-------|
| TechPro Distribution | vendor, wholesaler | Migrate from suppliers seed |
| Shenzhen Audio Co. | vendor | |
| UrbanWear Retail Ltd | retailer, customer | |
| National Wholesale Hub | wholesaler, distributor | |
| Channel Partner BD | channel_partner | CRM link |

Minimum **20 rows** covering all role types.

---

## Permissions

`bp.partner.read` (view grid) · `bp.partner.write` (create/edit)

---

**Last Updated:** 2026-06-17
