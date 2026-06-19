# AI Powered PC Builder Assistant

> **Status:** Implemented (prototype) — **default storefront mode**  
> **Storefront:** `/builder/pc-builder` — AI panel first  
> **Design blueprint:** [PC_BUILDER_UX_BLUEPRINT.md](../../04-uiux/prototype/product-configurator/PC_BUILDER_UX_BLUEPRINT.md)  
> **API (future):** `POST /api/v1/configurator/ai/pc-build`

---

## UX vision (AgainERP — better than clone)

| Principle | Implementation |
|-----------|----------------|
| **AI-first entry** | Default mode `ai_chat`; Recommended badge |
| **Bangla + English** | Example prompts in both languages |
| **Explain every build** | `explanation` + compatibility messages |
| **Human fine-tune** | Apply → Manual mode (filter, multi-add) |
| **Live intelligence** | `builder-live-insights.tsx` on manual builder |
| **Admin parity** | Same `compatibility-rules.ts` as storefront |

### Customer journey (dummy data demo)

```
1. Open /builder/pc-builder
2. AI mode (default) — type: "১ লাখ টাকায় গেমিং PC বানাও"
3. Review parts + explanation + upgrades
4. Apply to configurator
5. Switch Manual — add 2nd SSD, use Filtering
6. Share ?selections=... or Add to cart
```

---

## Objective

Allow customers to describe a PC in natural language and receive a **compatible**, **explained** build with upgrades and alternatives.

**Examples:**
- "Build a gaming PC under 100000 BDT"
- "Build a workstation for video editing"
- "Build a streaming PC"

---

## Architecture

```
User prompt (natural language)
        ↓
┌───────────────────┐
│  Intent Parser    │  budget · purpose · performance tier
└─────────┬─────────┘
          ↓
┌───────────────────┐
│  Requirements     │  budget weights per step, min RAM/PSU
└─────────┬─────────┘
          ↓
┌───────────────────┐
│  Build Planner    │  select products step-by-step
│  + attr pre-filter│  socket · RAM type matching
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Compatibility     │  IF/THEN/ELSE rule engine
│ Engine            │  incompatible → retry/swap
└─────────┬─────────┘
          ↓
┌───────────────────┐
│  Response         │  explanation · upgrades · alternatives
└───────────────────┘
```

### Production LLM path

```
SYSTEM: PC_BUILDER_AI_SYSTEM_PROMPT
USER:   buildPcBuilderUserPrompt(prompt, catalogSummary)
        ↓
LLM → structured JSON (purpose, budget, tier)
        ↓
Merge with rule-based parseBuildIntent() fallback
        ↓
SELECTION_PROMPT + compatible catalog per step
        ↓
Compatibility engine verify → response
```

---

## Requirements mapping

| # | Requirement | Implementation |
|---|-------------|----------------|
| 1 | Convert intent to requirements | `intent-parser.ts` / `PcBuilderAiService.parse_intent()` |
| 2 | Determine budget, purpose, performance | Regex + keyword patterns → `ParsedBuildIntent` |
| 3 | Select compatible products | `build-planner.ts` + `filterCompatibleProducts()` |
| 4 | Generate explanation | `generateExplanation()` purpose-aware copy |
| 5 | Suggest upgrades | `buildUpgrades()` — next tier per step within budget |
| 6 | Suggest alternatives | `buildAlternatives()` — same-step swaps |
| 7 | Use compatibility engine | `evaluateBuildCompatibility()` on final selection |

---

## Prompt design

### System prompt (`PC_BUILDER_AI_SYSTEM_PROMPT`)

Instructs the LLM to:
- Parse purpose, budget (BDT), performance tier
- Never suggest incompatible parts
- Output strict JSON schema

### User prompt (`buildPcBuilderUserPrompt`)

Includes user message + optional catalog summary for RAG context.

### Selection prompt (`PC_BUILDER_SELECTION_PROMPT`)

Constrained picking rules:
- Budget cap enforcement
- Socket / RAM type / PSU wattage rules
- Purpose-specific allocation (gaming → 35% GPU, editing → CPU+RAM)

---

## Purpose → budget weights

| Purpose | CPU | GPU | RAM | Notes |
|---------|-----|-----|-----|-------|
| Gaming | 22% | 32% | 8% | GPU priority |
| Video editing | 28% | 18% | 14% | 32GB RAM min |
| Streaming | 26% | 22% | 12% | Balanced encode |
| Office | 25% | 5% | 12% | Skip GPU |
| General | 24% | 20% | 10% | Balanced |

---

## Frontend files

| File | Role |
|------|------|
| `lib/builder/ai/types.ts` | Intent, requirements, result types |
| `lib/builder/ai/prompts.ts` | LLM prompt templates |
| `lib/builder/ai/intent-parser.ts` | NL → structured intent |
| `lib/builder/ai/build-planner.ts` | Product selection + compat |
| `lib/builder/ai/pc-builder-ai-service.ts` | Service orchestrator |
| `components/storefront/builder/pc-builder-ai-assistant.tsx` | Storefront UI |
| `components/storefront/builder/builder-how-it-works.tsx` | 4-step explainer |
| `components/storefront/builder/builder-live-insights.tsx` | Manual mode AI tips |
| `components/storefront/builder/builder-mode-selector.tsx` | AI recommended default |

---

## Backend files

| File | Role |
|------|------|
| `schemas/pc_builder_ai.py` | Request/response contracts |
| `services/pc_builder_ai_service.py` | Python planner (mirrors TS) |
| `routes/pc_builder_ai.py` | `POST /ai/pc-build` |

---

## API

```http
POST /api/v1/configurator/ai/pc-build
```

**Request:**
```json
{
  "prompt": "Build a gaming PC under 100000 BDT",
  "include_monitor": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intent": {
      "purpose": "gaming",
      "budget_bdt": 100000,
      "performance_tier": "mid_range"
    },
    "selections": [
      { "step_id": "cpu", "product_id": "pcb_cpu_i5", "product_name": "Intel Core i5-14600K", "price": 28900 }
    ],
    "total_price": 98500,
    "remaining_budget": 1500,
    "compatibility_status": "compatible",
    "explanation": "Built a gaming configuration within ৳100,000...",
    "upgrades": [{ "step_id": "gpu", "upgrade_product_name": "RTX 4070", "price_delta": 20400, "benefit": "More VRAM" }],
    "alternatives": [{ "step_id": "cpu", "product_name": "AMD Ryzen 7 7800X3D", "tradeoff": "AM5 platform alternative" }],
    "confidence": 0.88
  }
}
```

---

## UX flow

1. Customer opens `/builder/pc-builder`
2. Types prompt or clicks example chip
3. AI returns explanation + part list + compat status
4. **Apply this build** → populates wizard via `applyAiBuild()`
5. Customer can tweak in step-by-step wizard or add to cart

---

## Related docs

- [PC Builder Wizard](./PC_BUILDER_WIZARD.md)
- [Compatibility Engine](./COMPATIBILITY_ENGINE.md)
