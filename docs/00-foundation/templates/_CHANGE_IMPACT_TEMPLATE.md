# Change Impact Analysis

> Complete this **before** implementing any change.  
> See [GOVERNANCE.md](../GOVERNANCE.md#change-impact-analysis).

---

## Purpose
Documentation:  CHANGE IMPACT TEMPLATE.

## When To Read
Read only if your task involves  change impact template.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Change Request

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Requested By** | — |
| **Module** | — |
| **Change Type** | Added / Modified / Deleted |
| **Summary** | — |
| **Reason** | — |

---

## 1. Affected Modules

| Module | Impact Level | Description |
|--------|--------------|-------------|
| _—_ | Direct / Indirect / None | _—_ |

---

## 2. Affected Menus

| Menu Path | Screen Doc | Change |
|-----------|------------|--------|
| _Module → Menu → Screen_ | `Menus/.../*.md` | Added / Modified / Deleted |

---

## 3. Affected APIs

| Method | Endpoint | Change | Module API Doc |
|--------|----------|--------|----------------|
| _GET_ | `/api/v1/...` | Added / Modified / Deleted | `API.md` |

---

## 4. Affected Database Tables

| Table | Columns | Change | Module DB Doc |
|-------|---------|--------|---------------|
| _—_ | _—_ | Added / Modified / Deleted | `Database.md` |

---

## 5. Affected Permissions

| Permission Key | Change | Roles Affected |
|----------------|--------|----------------|
| `module.resource.action` | Added / Modified / Deleted | _—_ |

---

## 6. Affected Workflows

| Workflow | State Change | Module Workflow Doc |
|----------|--------------|---------------------|
| _—_ | _—_ | `Workflow.md` |

---

## Files To Update

| File | Action Required |
|------|-----------------|
| `Architecture.md` | _—_ |
| `Database.md` | _—_ |
| `API.md` | _—_ |
| `Workflow.md` | _—_ |
| `Permissions.md` | _—_ |
| `Development.md` | _—_ |
| `Roadmap.md` | _—_ |
| `ModuleManifest.md` | _—_ |
| `CHANGELOG.md` | _—_ |
| `DependencyMap.md` | _—_ |

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| _—_ | Low / Medium / High | _—_ |

---

## Approval

| Role | Name | Date | Approved |
|------|------|------|----------|
| Architect | — | — | [ ] |
| Product Owner | — | — | [ ] |

**Proceed with implementation:** ☐ Yes · ☐ No
