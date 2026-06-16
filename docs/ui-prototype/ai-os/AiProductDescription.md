# AI Product Description

> **Status:** Implemented (editor integration — prototype)  
> **Prototype Phase:** 1 — UI Only  
> **Module:** Ecommerce · AI  
> **Menu Location:** Ecommerce → AI → AI Product Description  
> **Editor rules:** [EDITOR_AI_RULES.md](./EDITOR_AI_RULES.md)

---

## Purpose

Generate and refine **product descriptions** inside the product editor using AI — without leaving the form.

## In-editor AI (built)

Product **Description** uses `WordPressClassicEditor` with AI chat + preset.

**Short description** uses `RichTextEditor` — same workable engine as Description (`WordPressClassicEditor`), default `minRows={3}`, preset context `product.short_description`.

| Icon | Action |
|------|--------|
| MessageSquare | Custom prompt chat drawer |
| Sparkles | Run Settings pre-prompt into editor (`product.description`) |

Variables passed on **Description**: `product_name`, `category`, `brand`.

## Settings pre-prompts

| Context | Settings path | Editor |
|---------|---------------|--------|
| Full description | Settings → AI → Prompts → Product description | WordPressClassicEditor |
| Short description | Settings → AI → Prompts → Product short description | RichTextEditor (compact) |

Prototype registry: `apps/web/src/lib/editor/editor-ai-prompts.ts`

## User flow

```
1. User edits product → General section
2. Clicks Sparkles → preset runs → preview in right panel
   OR clicks MessageSquare → types prompt → Send
3. Reviews AI HTML in panel
4. Apply to editor → content sanitized + saved to form state
```

## AI Features (prototype)

| Feature | Status |
|---------|--------|
| Preset generate | Mock HTML |
| Custom chat prompt | Mock response |
| Apply to editor | Implemented |
| Audit log | Planned (production) |
| Live LLM | Not connected |

## Related

- [EDITOR_AI_RULES.md](./EDITOR_AI_RULES.md)
- [IMPLEMENTED_DESIGN.md](./IMPLEMENTED_DESIGN.md)
- [AI_FIRST_ARCHITECTURE.md](../../modules/ai/AI_FIRST_ARCHITECTURE.md)

## Change History

| Date | Change |
|------|--------|
| 2026-06-15 | Documented in-editor AI icons + Settings prompt flow |
| 2026-06-12 | Stub generated |
