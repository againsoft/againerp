# Module Lifecycle

> **Parent:** [UNIVERSAL_MODULE_FRAMEWORK.md](../../00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md)

---
## Purpose
Documentation: MODULE LIFECYCLE.

## When To Read
Read only if your task involves module lifecycle.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---


## When To Read
Read only if your task involves module lifecycle.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## States

| State | Description |
|-------|-------------|
| `draft` | Documentation in progress |
| `ready` | Approved for install |
| `installed` | Active on tenant |
| `disabled` | Installed but feature off |
| `deprecated` | No new installs |
| `removed` | Uninstalled; data archived |

---

## Install

```
Prerequisites: ModuleManifest Status=Ready, Core version match

1. platform.install_module(manifest)
2. Validate dependencies (services, not DB)
3. Run migrations — module tables only
4. seed permissions → Core ACL
5. register menus → UI shell
6. register workflows → Core
7. subscribe events → EventBus
8. register AI tools → AI OS
9. register search document types
10. enable feature flag (plan permitting)
11. emit platform.module.installed
```

**Rollback:** Reverse migration on failure; no partial permissions.

---

## Enable / Disable

| Action | Data | API | UI |
|--------|------|-----|-----|
| **Disable** | Retained | 403 module disabled | Menus hidden |
| **Enable** | Unchanged | Restored | Menus visible |

Per-tenant via `platform_tenant_feature_overrides` or plan entitlements.

---

## Upgrade

```
1. Compare manifest version old → new
2. Run delta migrations
3. Merge new permissions (don't revoke custom roles)
4. Update menu registry diff
5. Re-register changed workflows
6. Migrate AI tool definitions
7. emit platform.module.upgraded
8. Update module CHANGELOG.md
```

**Breaking upgrade:** Major version + migration guide in CHANGELOG.

---

## Uninstall

```
1. Confirm tenant admin + export offer
2. disable module
3. unsubscribe events
4. unregister menus, permissions, AI tools
5. optional: archive data to cold storage
6. drop tables (hard uninstall) OR retain (soft)
7. emit platform.module.uninstalled
```

**Rule:** Never uninstall Core. Never cascade-delete Core `contacts` from module uninstall.

---

## Independent Maintenance

| Aspect | Independence |
|--------|----------------|
| **Docs** | Own CHANGELOG.md |
| **Migrations** | Own prefix only |
| **Release** | Semver per module |
| **Team** | Owner in ModuleManifest |
| **Bugs** | Fix in module without platform redeploy (hotfix path) |

---

## Module Registry (Runtime)

Table: `platform_installed_modules`

| Column | Purpose |
|--------|---------|
| `tenant_id` | Scope |
| `module_id` | hospital, school, … |
| `version` | Installed semver |
| `status` | installed, disabled |
| `installed_at` | Timestamp |
