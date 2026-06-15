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
| Generate | Empty field → "Generate with AI" |
| Improve | Select text → AI → Improve |
| Shorten / Expand | Selection menu |
| Translate | Selection → target language |
| SEO optimize | Product/blog description |

Output streams into editor — user confirms before replace.

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
