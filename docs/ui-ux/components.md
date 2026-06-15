# Components

> **Status:** Draft  
> **Standards:** [design-system.md](./design-system.md) · [mobile-first.md](./mobile-first.md)

## Purpose

Catalog reusable UI components for AgainERP admin and back-office screens. All components use design tokens, support keyboard access, and adapt per breakpoint.

---

## Buttons

| Variant | Usage | Mobile Notes |
|---------|-------|--------------|
| Primary | Main page action (Save, Create) | Full-width when sole action |
| Secondary | Cancel, Back, less prominent | Side-by-side pair: 50/50 split |
| Danger | Delete, irreversible actions | Confirm dialog required |
| Ghost | Toolbar, table row actions | Icon + label or icon-only with tooltip |
| Link | Inline navigation within content | Min 44px tap height |

**Sizes:** `sm` (32px), `md` (40px, default), `lg` (48px mobile primary CTAs).

**States:** default, hover, focus, active, disabled, loading (spinner replaces label, width preserved).

**Rules:**
- One primary button per view section
- Destructive actions never styled as primary
- Loading state disables click and shows spinner

---

## Inputs

| Type | Component | Validation Display |
|------|-----------|-------------------|
| Text | Single-line input | Inline error below field |
| Textarea | Multi-line, auto-grow | Character count when limited |
| Number | Steppers optional on desktop | Numeric keyboard on mobile |
| Select | Native on mobile, custom on desktop | See [forms.md](./forms.md) |
| Date / DateTime | Picker popover | Locale-aware format |
| Toggle | Switch for boolean | Label left, switch right |
| Checkbox / Radio | Group with fieldset legend | Error at group level |
| File upload | Drag-drop + browse | Progress bar, size/type errors |

**Shared specs:** `--radius-md` border, `--space-3` padding, `--text-base` on mobile. Placeholder uses `--color-text-muted`. Required fields marked with asterisk + `aria-required`.

---

## Badges & Tags

| Type | Example | Color Token |
|------|---------|-------------|
| Status | Draft, Confirmed, Cancelled | Semantic (success, warning, danger) |
| Count | Notification count on nav | `--color-primary` |
| Tag | Category, filter chip | `--color-secondary` background |
| Removable tag | Applied filters | X button, 44px touch target |

Badges in tables: max 2 visible; overflow as `+N` popover.

---

## Cards

**Structure:** Header (title + actions) · Body · Footer (optional).

| Context | Layout |
|---------|--------|
| Dashboard widget | Metric + sparkline + link |
| Mobile table row | Stacked label/value pairs |
| List item | Avatar + title + meta + chevron |
| Empty state | Illustration + message + CTA |

Padding: `--space-4` mobile, `--space-6` desktop. Border: 1px `--color-border` or `--shadow-sm`.

---

## Modals & Sheets

| Viewport | Pattern |
|----------|---------|
| Mobile (< 768px) | Full-screen bottom sheet, swipe-to-dismiss |
| Tablet+ | Centered dialog, max-width 560px (forms) or 720px (complex) |

**Anatomy:** Overlay (click outside closes unless destructive) · Header (title + close) · Body (scrollable) · Footer (actions, primary right).

**Focus trap:** Tab cycles within modal; restore focus on close. `Escape` closes non-destructive modals.

**Confirm dialogs:** Separate component — icon, message, Cancel + Confirm (danger variant for delete).

---

## Toasts

| Property | Value |
|----------|-------|
| Position | **Bottom-right** (desktop + mobile prototype) |
| Size | Compact — `text-xs` title, `8px` padding, small icon |
| Duration | 4s default; errors persist until dismissed |
| Max visible | 3 stacked |
| Types | success, error, warning, info |
| Library | Sonner — `apps/web/src/components/providers/app-providers.tsx` |

**Content:** Icon + message + optional action link. Accessible via `role="status"` or `role="alert"` for errors.

Do not use toasts for form validation — use inline errors per [forms.md](./forms.md).

---

## Avatars

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 24px | Table rows, compact lists |
| `sm` | 32px | Comments, activity feed |
| `md` | 40px | User menu, assignee pickers |
| `lg` | 64px | Profile headers |

**Fallback:** Initials on `--color-primary-subtle` background. Image lazy-loaded with skeleton.

**Groups:** Overlap stack max 4; `+N` for overflow.

---

## Dropdowns & Menus

| Type | Trigger | Content |
|------|---------|---------|
| Select | Input-style field | Searchable list for > 8 items |
| Action menu | Icon button (⋮) | Edit, Duplicate, Delete |
| User menu | Avatar in top bar | Profile, Settings, Logout |
| Context menu | Long-press mobile / right-click desktop | Row actions |

**Behavior:** Close on outside click, `Escape`, or selection. Keyboard: arrows navigate, Enter selects. Mobile action menus use bottom sheet variant.

**Searchable selects:** Debounced filter, highlight match, empty state message.

---

## Component States (Global)

Every interactive component supports:

| State | Visual |
|-------|--------|
| Default | Token colors |
| Hover | Subtle background shift |
| Focus | `--color-primary` ring, 2px offset |
| Disabled | 50% opacity, no pointer events |
| Loading | Skeleton or spinner |
| Error | `--color-danger` border + message |

---

## Module Compliance

Screen docs (`Menus/*.md`) list components in **Page Layout** and **Actions** sections by name from this catalog. New components require design-system update before use.

## Related Documents

| Document | Topic |
|----------|-------|
| [design-system.md](./design-system.md) | Tokens |
| [forms.md](./forms.md) | Form field patterns |
| [tables.md](./tables.md) | Table-specific UI |
| [navigation.md](./navigation.md) | Nav components |
