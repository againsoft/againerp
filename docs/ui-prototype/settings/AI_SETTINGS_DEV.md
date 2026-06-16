# AI Settings — Developer Guide

> **Status:** Implemented (prototype)  
> **Route:** `/settings/ai`  
> **Related:** [EDITOR_AI_RULES.md](../catalog/products/EDITOR_AI_RULES.md)

---

## Purpose

Central place for **editor pre-prompts** (Preset button) and pointers to where AI appears in admin.

---

## Routes & navigation

| Location | Path |
|----------|------|
| AI Settings page | `/settings/ai` |
| Sidebar | System → Settings → AI |
| Business settings card | Settings → Business → **AI Settings** |
| AI OS | `/ai-os` (separate — agents/platform) |

---

## Data

| Item | File | Persist |
|------|------|---------|
| Prompt templates | `lib/store/ai-prompts-store.ts` | `againerp-ai-prompts` |
| Default seed | `lib/editor/editor-ai-prompts.ts` | `EDITOR_AI_PRE_PROMPTS` |

`getEditorPrePrompt(context)` reads from store via `useAiPromptsStore.getState()` in `ai-prompts-store.ts`.

**Contexts:** `product.description`, `product.short_description`, `category.description`, `brand.description`, `generic`

---

## Editor integration

| UI | File | AI mode |
|----|------|---------|
| Toolbar Chat | `wordpress-classic-editor.tsx` | Opens `EditorAiChatDrawer` |
| Toolbar Preset | `wordpress-classic-editor.tsx` | `streamEditorAiIntoEditor()` |
| Product form AI tab | `product-form.tsx` section `ai` | Mock quick actions (toast) |

Preset uses prompts from AI Settings. Chat uses drawer with optional insert.

---

## Files

| File | Role |
|------|------|
| `app/(admin)/settings/ai/page.tsx` | Page shell |
| `components/settings/ai-settings-workspace.tsx` | Prompt editor UI |
| `components/settings/business-settings-home.tsx` | AI Settings entry card |
| `lib/store/ai-prompts-store.ts` | Persist + `getEditorPrePrompt` |
| `lib/editor/editor-ai-prompts.ts` | Types + seed templates |
| `lib/editor/editor-ai-mock.ts` | Mock streaming (prototype) |

---

## Dev rules

1. **No circular imports:** `editor-ai-prompts.ts` must NOT import `ai-prompts-store`. Store imports prompts seed; `getEditorPrePrompt` lives in store file.
2. Changing a prompt in `/settings/ai` affects Preset on next click — no rebuild needed.
3. Mock AI only — replace `editor-ai-mock.ts` for production provider.

---

## Testing

1. Open `/settings/ai` → edit Product description system prompt → Save.
2. Catalog → Products → Edit → Description → click **Preset** (✨).
3. Streamed text should follow saved prompt.
