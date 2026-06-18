# Sales & Marketing Workspace — Lead Management UI Design

> **Status:** Draft (Ready for implementation)  
> **Version:** 1.0  
> **Document Type:** UI Design · Step UI-03  
> **Primary route:** `/sales-marketing/leads`  
> **360 route:** `/sales-marketing/leads/[id]`  
> **Screen ID:** `SCR-SMW-LDS-001` (list) · `SCR-SMW-LDS-360` (profile)  
> **Parent:** [01_MASTER_LAYOUT_UI.md](./01_MASTER_LAYOUT_UI.md)

---

## 1. Objective

End-to-end **lead capture → qualification → conversion** UX. Reference: `components/hr/employees/employee-directory.tsx`.

---

## 2. Lead list workspace

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Toolbar: search · filters · saved views · layout toggle · New lead          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Bulk bar (when selected): Assign · Tag · Export · Archive                     │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ Main (9 cols)                │ Insights rail (3 cols, xl+)                  │
│ table | kanban | compact     │ AI lead insights · source perf · quality     │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 3. View modes

| Mode | URL | Component |
|------|-----|-----------|
| Table | `?layout=table` (default) | TanStack Table |
| Kanban | `?layout=kanban` | Columns by status |
| Compact | `?layout=compact` | Dense list rows |

---

## 4. Toolbar filters

| Filter | Type |
|--------|------|
| Search | Debounced 300ms — name, company, email, number |
| Status | Multi-select |
| Source | Multi-select |
| Owner | Select |
| Territory | Select |
| Score | Range |
| Saved views | Dropdown |

Register filter state in URL query params.

---

## 5. Table columns

| Column | Notes |
|--------|-------|
| Select | Checkbox |
| Lead # | Link → 360 or `?view=` |
| Name / Company | Primary + subtitle |
| Source | Badge |
| Status | `StatusBadge` |
| Score | Progress + color |
| Owner | Avatar + name |
| Expected value | BDT formatted |
| Last activity | Relative time |
| Actions | ⋮ menu · Activity icon |

Row click: open **view drawer** (`?view=`). “Open full profile” → `/leads/[id]`.

---

## 6. Drawer CRUD

| Mode | URL | Sheet |
|------|-----|-------|
| Create | `?create=1` | Lead form — name, company, email, phone, source, owner |
| View | `?view={id}` | Summary + quick actions: Assign, Convert, Edit |
| Edit | `?edit={id}` | Same form |

Mutual exclusion of params. Mobile: full-width sheet.

---

## 7. Lead 360 profile (`/leads/[id]`)

Three-column layout (mirror employee profile):

```text
┌──────────┬─────────────────────────────┬──────────┐
│ Sidebar  │ Tab content                 │ AI panel │
│ avatar   │ overview · activity · docs  │ insights │
│ KPI mini │ timeline · notes            │ actions  │
└──────────┴─────────────────────────────┴──────────┘
```

### Tabs (`?tab=`)

| Tab | Content |
|-----|---------|
| overview | Contact, scoring, tags, related opportunity |
| activity | Timeline + tasks |
| documents | Attachments placeholder |
| history | Audit / field changes |

Header actions: Edit · Assign · Convert to opportunity · Archive.

---

## 8. Bulk actions

| Action | Permission |
|--------|------------|
| Assign owner | `smw.leads.assign` |
| Add tag | `smw.leads.edit` |
| Export CSV | `smw.leads.view` |
| Archive | `smw.leads.delete` |

---

## 9. Kanban columns (status)

`new` · `contacted` · `qualified` · `unqualified` · `converted` (read-only)

Drag between columns → status change mutation + optimistic UI.

---

## 10. Empty & error states

| State | Message + CTA |
|-------|-----------------|
| Empty list | “No leads yet” · **Create lead** |
| No filter results | “No matches” · **Clear filters** |
| Error | Retry button |

---

## 11. Implementation checklist (Impl Step 03)

- [ ] `leads/page.tsx`
- [ ] `leads/[id]/page.tsx`
- [ ] `LeadWorkspace`, `LeadTable`, `LeadKanban`, `LeadFormSheet`
- [ ] `LeadProfileWorkspace` + tabs
- [ ] `fixtures` + mock API routes

---

**Last updated:** 2026-06-18
