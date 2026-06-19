# Rich Text Editor — AI Rules

> **Status:** Implemented (web prototype)  
> **App path:** `apps/web`  
> **Parent:** [rich-text-editor.md](../../../standards/rich-text-editor.md) · [AI_FIRST_ARCHITECTURE.md](../../../../06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md)

---

## Goal

Every `WordPressClassicEditor` instance exposes **two AI entry points** on the editor toolbar (right side):

| Icon | Mode | Behaviour |
|------|------|-----------|
| **MessageSquare — Chat** | Drawer (right) | Opens a **discussion drawer**. User chats with AI, refines the draft, then clicks **Insert into editor**. |
| **Sparkles — Preset** | Direct write | Runs the Settings pre-prompt and **streams text directly into the editor** (typing effect → final HTML). No drawer. |

Output from **Chat** is previewed in the drawer thread. User confirms with **Insert into editor** — content is cleaned before `onChange`.

**Preset** writes live in the editor footer shows `AI preset writing into editor…` while streaming.

---

## UI layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Add Media]          [ Visual | Code ]  [ Chat | Preset ]        │
├──────────────────────────────────────────────────────────────────┤
│ toolbar…                                                         │
├──────────────────────────────────────────────────────────────────┤
│ Editor — Preset streams typing here                              │
├──────────────────────────────────────────────────────────────────┤
│ word / character count (or “AI preset writing…”)                 │
└──────────────────────────────────────────────────────────────────┘

Chat drawer (separate, slides from right):
┌─────────────────────┐
│ AI chat             │
│ thread + preview    │
│ [Send] [Insert]     │
└─────────────────────┘
```

---

## Context mapping

Editor receives `aiContext` + `aiVariables` props. These resolve to a versioned pre-prompt in `editor-ai-prompts.ts` (prototype) → `ai_prompts` table (production).

| `aiContext` | Used on | Settings path | Template variables |
|-------------|---------|---------------|-------------------|
| `product.description` | Product form → Description | Settings → AI → Prompts → Product description | `product_name`, `category`, `brand` |
| `product.short_description` | Product form → Short description | Settings → AI → Prompts → Product short description | `product_name`, `category`, `brand` |
| `category.description` | Category form → Description | Settings → AI → Prompts → Category description | `category_name` |
| `brand.description` | Brand form → Description | Settings → AI → Prompts → Brand description | `brand_name` |
| `generic` | Fallback | Settings → AI → Prompts → Generic rich text | `current_content` |

---

## AI rules (prototype + production contract)

### 1. Prompt source

| Mode | Prompt assembly |
|------|-----------------|
| **Preset (Sparkles)** | `systemPrompt` + merged `userPromptTemplate` from Settings. Variables filled from `aiVariables` + `current_content`. |
| **Chat (MessageSquare)** | User free-text only. Optional: append `current_content` server-side for context. |

### 2. Settings ownership

- Pre-prompts are **not hard-coded in the UI** long-term.
- Prototype: editable in **`/settings/ai`** → persisted in `ai-prompts-store` (`againerp-ai-prompts`). Defaults from `editor-ai-prompts.ts`.
- See [AI_SETTINGS_DEV.md](../../settings/AI_SETTINGS_DEV.md).
- Production: `GET /api/v1/ai/prompts?context={aiContext}` → active version from `ai_prompts`.

### 3. Apply behaviour

| Rule | Detail |
|------|--------|
| User confirms | Never auto-replace editor — **Apply to editor** required |
| HTML sanitize | Run `cleanEditorHtml()` on AI output before `onChange` |
| Link normalize | Run `normalizeEditorHtmlLinks()` via existing `emitChange` |
| Media | AI must not embed base64 images — use `data-media-id` refs only (production) |

### 4. Permissions (production)

| Permission | Allows |
|------------|--------|
| `ai.assistant.use` | Open chat panel |
| `ai.generate.draft` | Run preset + apply to draft fields |
| `ai.prompts.view` | See which Settings prompt is active |
| `ai.prompts.manage` | Edit prompts in Settings |

Low-risk draft fields (description, short description) may auto-apply in Phase 2 — **Phase 1 prototype always requires Apply**.

### 5. Audit (production)

Every AI run logs to `ai_audit_logs`:

- `context` (`product.description`, etc.)
- `prompt_version_id`
- `user_prompt` (chat) or `template_id` (preset)
- `response_hash`
- `applied: true/false`

### 6. Mock behaviour (prototype)

`runEditorAiMock()` simulates latency (~700ms) and returns HTML snippets. No live LLM. Chat understands keywords: `translate`, `shorten`, `expand`.

---

## Code map

| File | Role |
|------|------|
| `components/products/wordpress-classic-editor.tsx` | Toolbar icons, panel mount, apply |
| `components/products/editor-ai-chat-drawer.tsx` | Chat drawer UI |
| `lib/editor/editor-ai-prompts.ts` | Pre-prompt types + seed templates |
| `lib/store/ai-prompts-store.ts` | Persist + `getEditorPrePrompt()` |
| `components/settings/ai-settings-workspace.tsx` | `/settings/ai` prompt editor |
| `lib/editor/editor-ai-mock.ts` | Prototype AI responses |
| `lib/editor/editor-clean-html.ts` | Sanitize applied output |

---

## Production API (planned)

```
POST /api/v1/ai/editor/generate
{
  "context": "product.description",
  "mode": "preset" | "chat",
  "prompt": "optional user prompt for chat mode",
  "variables": { "product_name": "...", "category": "..." },
  "current_content": "<p>…</p>"
}
→ { "html": "...", "prompt_version_id": "uuid", "audit_id": "uuid" }
```

---

## Change history

| Date | Change |
|------|--------|
| 2026-06-15 | Editor AI chat + preset icons, side panel, prompt registry, MD rules |
| 2026-06-15 | AI Settings page (`/settings/ai`) + `ai-prompts-store` — prompts editable in admin |
