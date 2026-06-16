# Rich Text Editor Standards

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §11

---

## Purpose

Long-form content must use a **modern block editor** — never a plain `<textarea>`.

---

## Editor Choice

| Priority | Editor | Use |
|----------|--------|-----|
| **Primary** | **TipTap** (ProseMirror) | Products, blogs, pages, emails |
| Alternative | Editor.js | If block-json storage preferred |

---

## Required Features

| Feature | Spec |
|---------|------|
| Images | Upload + media library picker |
| Videos | Embed URL + upload |
| Tables | Insert/edit table |
| Code blocks | Syntax highlighted |
| Embeds | YouTube, iframe |
| AI writing | "Improve", "Expand", "Translate" toolbar |
| Templates | Insert predefined blocks |
| Drag & drop | Reorder blocks |
| Reusable blocks | Save block to library |

---

## Toolbar

```
[B] [I] [U] [H1▾] [•] [1.] ["] [🔗] [🖼] [📊] [</>] [✨ AI]
```

Floating toolbar on text selection. Slash command `/` for block insert (Notion-style).

---

## AI Integration

| Action | Trigger |
|--------|---------|
| Generate | **Preset** icon — streams Settings pre-prompt directly into editor |
| Custom instruct | **Chat** drawer — discuss, refine, then **Insert into editor** |
| Improve | Chat: "improve tone" / preset from Settings |
| Shorten / Expand | Chat prompt keywords |
| Translate | Chat: "translate to Bengali" |
| SEO optimize | Settings prompt template per context |

**Detail:** [EDITOR_AI_RULES.md](../ui-prototype/catalog/products/EDITOR_AI_RULES.md) — two toolbar icons, Settings prompt mapping, apply + audit rules.

Output from **Chat** appears in the drawer — user inserts when final. **Preset** types live into the editor.

---

## Storage

- Store HTML + JSON document (TipTap JSON) for round-trip editing
- Sanitize HTML on save (XSS prevention)
- Images stored via Core media — never base64 in DB

---

## Applies To

Product descriptions · Blog posts · Builder text widgets · Email templates · Knowledge articles · SEO content blocks

---

## Accessibility

Toolbar keyboard accessible. Alt text required on inserted images (prompt if missing).

---

## Mobile

Simplified toolbar. Full-screen editor sheet. Image upload via camera/gallery.
