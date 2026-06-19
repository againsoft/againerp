# Activities

> **Status:** Draft · **Owner:** Core · **Table:** `activities`

## Purpose
Core entity specification: `activities`.

## When To Read
Read only when working on the shared `activities` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Purpose

Scheduled tasks, calls, meetings, and timeline events on any record. Powers follow-ups, reminders, and the activity feed across modules.

## Used By

CRM (calls, meetings), Ecommerce (order follow-up), Sales, HR, Project, Helpdesk.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `activitable_type` | VARCHAR | Related entity class |
| `activitable_id` | BIGINT | Related entity ID |
| `type` | ENUM | `call`, `meeting`, `task`, `email`, `deadline`, `system` |
| `subject` | VARCHAR | Activity title |
| `description` | TEXT | Details |
| `assigned_to` | FK → users | Assigned user |
| `due_at` | TIMESTAMP | Due date/time |
| `completed_at` | TIMESTAMP | Completion time |
| `priority` | ENUM | `low`, `normal`, `high`, `urgent` |
| `status` | ENUM | `planned`, `in_progress`, `done`, `cancelled` |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/activities` | List (filter by user, entity, date) |
| POST | `/api/v1/core/activities` | Create activity |
| PATCH | `/api/v1/core/activities/{uuid}` | Update / complete |
| DELETE | `/api/v1/core/activities/{uuid}` | Soft delete |
| GET | `/api/v1/core/activities/timeline` | Unified timeline feed |

## Activity Log vs Activities

| Table | Purpose |
|-------|---------|
| `activity_logs` | Automatic audit (login, create, edit) — see DEVELOPMENT_STANDARDS §4 |
| `activities` | User-created tasks and scheduled follow-ups |

## Ecommerce Usage

- Follow up on abandoned cart → `activitable_type: Contact`
- Order issue task → `activitable_type: EcommerceOrder`

## Permissions

| Key | Description |
|-----|-------------|
| `core.activity.read` | View activities |
| `core.activity.write` | Create / edit activities |
| `core.activity.assign` | Assign to other users |
