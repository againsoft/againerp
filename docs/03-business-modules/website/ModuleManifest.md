# ModuleManifest — Website

> **Module ID:** `website` · **Status:** Active · **Version:** 1.0 · **Date:** 2026-06-19

## Purpose
Install manifest, dependency declarations, and service contracts for the Website module.

## When To Read
Read before installation, dependency mapping, or platform integration planning.

## Related Files
- [README.md](README.md) — module entry
- [Architecture.md](Architecture.md) — full architecture

---

## Module Identity

| Field | Value |
|-------|-------|
| **Module ID** | `website` |
| **Display Name** | Website |
| **Layer** | commerce |
| **Route Namespace** | `/website/*` |
| **API Base** | `/api/v1/website/` |
| **Table Prefix** | `website_*` |
| **Permission Namespace** | `website.*` |
| **Owner Team** | Website Team |
| **Status** | Active |

---

## Package Status

| File | Status |
|------|--------|
| README.md | ✅ Done |
| Architecture.md | ✅ Done |
| ModuleManifest.md | ✅ Done |
| Database.md | ✅ Done |
| API.md | ✅ Done |
| Workflow.md | ✅ Done |
| Permissions.md | ✅ Done |
| UI.md | ✅ Done |
| AI.md | ✅ Done |
| Reports.md | ✅ Done |
| CHANGELOG.md | ✅ Done |
| **Score** | **11/11** |

---

## Dependencies

### Required (Core — always available)

| Module | Service Used | Purpose |
|--------|-------------|---------|
| `core.users` | `UserService` | Page authors, editors |
| `core.contacts` | `ContactService.upsert()` | Form submission → contact |
| `core.companies` | `CompanyService` | Multi-company scope |
| `core.media` | `MediaService.getUrl()` | Page images |
| `core.tags` | `TagService` | Blog post tags |
| `core.localisation` | `LocalisationService` | Multi-language pages |
| `core.workflow` | `WorkflowEngine` | Page approval flow |
| `core.approval` | `ApprovalEngine` | Gated publish (optional) |
| `core.notifications` | `NotificationService` | Form submission alerts |

### Optional (degrade gracefully if off)

| Module | Integration | Fallback |
|--------|------------|---------|
| `crm` | Subscribes to `website.lead.captured` → creates Lead | Leads not created — submissions stored only |
| `ecommerce` | Website pages can embed product widgets | Widgets hidden |
| `marketing` | Form submissions feed campaign segments | Segment not populated |
| `ai` | AI content generation tools | AI screens hidden |

---

## Events Manifest

### Published

| Event | When |
|-------|------|
| `website.page.published` | Page goes live |
| `website.page.unpublished` | Page pulled back to draft |
| `website.form.submitted` | Any form receives submission |
| `website.lead.captured` | New contact created from form |
| `website.blog.published` | Blog post goes live |
| `website.domain.verified` | Custom domain DNS confirmed |

### Subscribed

| Event | Source | Action |
|-------|--------|--------|
| `core.media.deleted` | Core | Remove orphaned media refs in blocks |
| `core.approval.approved` | Core | Publish page awaiting approval |

---

## UX Exceptions

| Exception | Detail |
|-----------|--------|
| **Full-screen builder** | `/website/pages/{id}/builder` uses canvas mode — not standard Sheet drawer |

---

**Maintainer:** Website Team · **Last Updated:** 2026-06-19
