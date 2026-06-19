# Theme System

> **Status:** Draft  
> **Standards:** [design-system.md](./design-system.md) · [dark-mode.md](./dark-mode.md) · [DEVELOPMENT_STANDARDS.md §9](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#9-multi-company-ready)

## Purpose
Global UI standard: theme system.

## When To Read
Read only if working on UI patterns related to theme system.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Define how AgainERP applies theming via CSS variables — company branding, white-label support, and token override hierarchy. No hardcoded colors in components.

---

## CSS Variable Architecture

All visual values flow through CSS custom properties on `:root` with theme/company scopes.

```css
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  /* … full token set from design-system.md */
}

[data-theme="dark"] {
  --color-surface: #1e293b;
  /* … dark overrides — see dark-mode.md */
}

[data-company-theme] {
  --color-primary: var(--company-primary, #2563eb);
  --company-logo-url: url('/branding/acme/logo.svg');
}
```

**Rule:** Components reference `--color-*` tokens only. Theme files define token values, never component styles.

---

## Theme Layers (Cascade)

| Layer | Scope | Set By |
|-------|-------|--------|
| 1 — Base | Global defaults | Core theme file |
| 2 — Mode | Light / dark | `data-theme` attribute |
| 3 — Company | Per-tenant branding | Company settings API |
| 4 — User | Density, sidebar prefs | User preferences |
| 5 — Module | None by default | Requires platform approval |

Higher layers override lower. Missing token falls back to base.

---

## Company Branding

Configured in **Settings → Company → Branding** (Core module).

| Setting | Token / Effect |
|---------|----------------|
| Primary color | `--color-primary`, `--color-primary-hover` |
| Secondary color | `--color-secondary` |
| Logo (light) | `--company-logo-url` |
| Logo (dark) | `--company-logo-dark-url` |
| Favicon | Served per company subdomain |
| Login background | Optional custom image |

**Color generation:** Primary input (hex) auto-generates hover, subtle, and contrast-safe text variants. WCAG AA contrast validated on save.

**Preview:** Live preview panel before applying branding changes.

---

## White-Label

For resellers and enterprise deployments with custom domains.

| Feature | Detail |
|---------|--------|
| Custom domain | `erp.client.com` maps to company tenant |
| Full branding | Logo, colors, login page, email templates |
| Hide AgainERP | Optional "Powered by" footer removal (license tier) |
| Custom CSS | Inject approved CSS variables only — no raw selectors in v1 |
| Sub-tenants | Parent company branding cascades unless overridden |

**Security:** Custom CSS sanitized; only `--*` variable declarations allowed. No script injection.

---

## Multi-Company Switching

| Behavior | Detail |
|----------|--------|
| Switcher | Top bar dropdown |
| Theme apply | Instant on switch — no full reload |
| Cache | Company theme cached client-side, invalidated on settings change |
| Cross-company | User sees active company branding only |

Document per [DEVELOPMENT_STANDARDS.md §9](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#9-multi-company-ready).

---

## Typography & Asset Overrides

| Token | Branding Override |
|-------|-------------------|
| `--font-family` | Optional custom web font (self-hosted) |
| `--font-family-mono` | Code/ID fields |
| `--company-logo-url` | Header and login |
| `--company-name` | Content string for `<title>` suffix |

**Font loading:** `font-display: swap` required. Fallback to system stack during load.

---

## Email & PDF Theming

| Channel | Branding Applied |
|---------|------------------|
| Transactional email | Logo, primary color, footer |
| PDF reports | Header logo, brand color accents |
| Public storefront | Full white-label (Ecommerce module) |

Email templates use inline styles derived from company tokens at send time.

---

## Theme API

```
GET  /api/v1/company/{id}/theme
PUT  /api/v1/company/{id}/theme   (admin only)
GET  /api/v1/user/preferences/theme
PUT  /api/v1/user/preferences/theme
```

Response includes resolved token map for client injection. CDN-cached with company-version ETag.

---

## Implementation Rules

| Rule | Detail |
|------|--------|
| No hardcoded colors | ESLint/stylelint enforcement |
| Token additions | Require design-system.md update |
| SSR / first paint | Inline critical theme vars in `<head>` to prevent flash |
| Third-party embeds | Inherit surface and text tokens where possible |

---

## Module Compliance

Public-facing modules (Website, Ecommerce storefront) document branding touchpoints in `UI.md`. Admin modules inherit company theme automatically.

## Related Documents

| Document | Topic |
|----------|-------|
| [design-system.md](./design-system.md) | Token definitions |
| [dark-mode.md](./dark-mode.md) | Dark theme palette |
| [components.md](./components.md) | Component token usage |
