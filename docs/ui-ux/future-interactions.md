# Future Interaction Architecture

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §20  
> **AI-First:** [modules/ai/AI_FIRST_ARCHITECTURE.md](../modules/ai/AI_FIRST_ARCHITECTURE.md)  
> **Backend:** [modules/ai/ARCHITECTURE.md](../modules/ai/ARCHITECTURE.md)

---

## Purpose

UI hooks for future features — **no shell redesign** when enabling.

---

## Future Features

| Feature | UI Hook | API / Data |
|---------|---------|------------|
| **AI Chatbot** | Floating assistant → full chat mode | `ai_conversations` |
| **AI Copilot** | Inline ghost text in fields | `ai_suggestions` stream |
| **Voice commands** | Mic icon in search palette | `voice_search` flag |
| **Visual search** | Image upload in search | `ai_image_search` |
| **Image search** | "Find similar" on product image | Embeddings index |
| **Product recommendations** | Widget slot on product/dashboard | `ai_recommendations` |
| **Predictive search** | Query suggestions ranked by ML | `search_query_log` + model |
| **AI customer support** | Helpdesk + AI panel handoff | `helpdesk_ai_sessions` |
| **AI analytics** | Dashboard AI insight widgets | `analytics_ai_*` |

---

## Extension Points

| Slot | Location |
|------|----------|
| `SearchProvider` | Command palette — register AI/voice providers |
| `FieldCopilot` | Form fields — inline suggestion overlay |
| `WidgetRegistry` | Dashboard — `ai.insight` widget type |
| `ChatterAI` | Record chatter — "Summarize thread" |
| `GalleryAI` | Product — "Generate lifestyle image" |
| `NotificationAI` | Alert type `ai.alert` |

---

## Feature Flags

```yaml
feature_flags:
  ai.chatbot: false
  ai.copilot: false
  ai.voice_search: false
  ai.visual_search: false
```

UI components render when flag enabled — no layout change, only visibility.

---

## Voice Search Ready

Search input includes dormant mic icon. When enabled:

- Press/hold to record
- Transcribe → populate search query
- Same results pipeline as text search

---

## No Redesign Rule

New interaction modes extend:

- AI Assistant panel (wider modes)
- Command palette (new action types)
- Widget system (new widget types)
- Chatter composer (new message types)

Never add a second navigation shell or parallel admin UI.
