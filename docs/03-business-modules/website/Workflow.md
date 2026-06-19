# Workflow — Website

> **Module:** Website · **Status:** Draft · **Date:** 2026-06-19

## Purpose
Business workflows and state machines for the Website module.

## When To Read
Read for workflow, state machine, or approval logic work.

## Related Files
- [Architecture.md §3](Architecture.md#3-features)
- [Permissions.md](Permissions.md)

---

## 1. Page Lifecycle

```
DRAFT ──────────────────► REVIEW ──────────► PUBLISHED
  ▲                          │                    │
  │    (approval off)        │ (rejected)         │
  │◄─────────────────────────┘                    │
  │                                               │
  │◄──────────────────────────────────────────────┘
  │              (unpublish)
  │
  └──► ARCHIVED
```

| State | Description | Who can set |
|-------|-------------|-------------|
| `draft` | Work in progress — not visible publicly | Page editor |
| `review` | Submitted for review — locked for editing | Editor / auto |
| `published` | Live on website | Publisher |
| `archived` | Hidden, kept for history | Publisher |

### Transitions

| From | To | Trigger | Permission |
|------|----|---------|-----------|
| `draft` | `review` | Editor submits for approval | `website.pages.manage` |
| `draft` | `published` | Direct publish (approval off) | `website.pages.publish` |
| `review` | `published` | Reviewer approves | `website.pages.publish` |
| `review` | `draft` | Reviewer rejects | `website.pages.publish` |
| `published` | `draft` | Unpublish | `website.pages.publish` |
| `published` | `archived` | Archive | `website.pages.manage` |
| `archived` | `draft` | Restore | `website.pages.manage` |

**Event fired on publish:** `website.page.published` → `{page_id, slug, company_id}`

---

## 2. Blog Post Lifecycle

```
DRAFT ──► SCHEDULED ──► PUBLISHED ──► ARCHIVED
  │                          ▲
  └──────────────────────────┘
       (direct publish)
```

| State | Description |
|-------|-------------|
| `draft` | Being written |
| `scheduled` | Set to auto-publish at future date |
| `published` | Live on blog |
| `archived` | Hidden from public |

### Scheduled Publish

- Cron job checks `published_at <= NOW()` for scheduled posts
- On trigger: status → `published`, fires `website.blog.published`

---

## 3. Form Submission Flow

```
Visitor submits form
        │
        ▼
  CAPTCHA / rate-limit check
        │
        ▼
  Validate field schema
        │
        ▼
  Save to website_form_submissions
        │
        ▼
  Upsert Core Contact (ContactService)
        │
        ├──► Notify configured emails
        │
        ├──► Publish event: website.form.submitted
        │            │
        │            └──► website.lead.captured (if new contact)
        │                         │
        │                         └──► CRM subscribes (if installed)
        │                               → Creates Lead in pipeline
        └──► Return success message to visitor
```

---

## 4. Domain Verification Flow

```
Admin adds domain
        │
        ▼
  Status: PENDING
        │
  (system shows DNS instructions)
        │
        ▼
  Admin clicks "Verify"
        │
        ▼
  DNS lookup check (async job)
        │
        ├── DNS OK ──► Status: VERIFIED
        │                    │
        │              SSL provisioning starts
        │                    │
        │              Status: ACTIVE + SSL: ISSUED
        │
        └── DNS FAIL ──► Status: ERROR (retry allowed)
```

---

## 5. Approval Engine Integration

When page approval is enabled for a company:

```
Editor submits page
        │
        ▼
  Approval request created (Core ApprovalEngine)
        │
        ▼
  Reviewer notified (Core NotificationService)
        │
        ▼
  Reviewer approves in Approval Center
        │
        ▼
  core.approval.approved event fired
        │
        ▼
  Website module subscribes → Page status → published
  website.page.published event fired
```

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
