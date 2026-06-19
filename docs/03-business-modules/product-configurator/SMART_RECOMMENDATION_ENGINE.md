# Smart Recommendation Engine

> **Status:** Implemented (prototype + API)  
> **Storefront:** PC Builder sidebar — `BuilderRecommendationsPanel`  
> **API:** `POST /api/v1/configurator/recommendations/smart`  
> **Permission:** `configurator.recommend`

---

## Objective

Automatically recommend products as customers build a PC — related parts, upgrades, value swaps, PSU sizing, cooling, upgrade paths, and budget optimization.

---

## Architecture

```
Current build selections
        ↓
┌───────────────────────────────────────────────┐
│           Smart Recommendation Engine          │
├───────────────┬───────────────────────────────┤
│ Related       │ Missing required steps          │
│ Performance   │ Higher-tier compatible swaps    │
│ Value         │ Cheaper compatible alternatives│
│ PSU calc      │ TDP sum + 20% headroom          │
│ Cooling calc  │ TDP → tower / AIO tier          │
│ Upgrade path  │ Ordered impact roadmap          │
│ Budget opt    │ Over/under budget suggestions   │
└───────────────┴───────────────────────────────┘
        ↓
Compatibility filter on every product pick
        ↓
Prioritized SmartRecommendation[] response
```

All product suggestions pass through `filterCompatibleProducts()` + attribute pre-filter (socket, RAM type).

---

## Recommendation kinds

| Kind | Trigger | Action |
|------|---------|--------|
| `related_component` | Missing CPU, mobo, RAM, etc. | Add compatible pick |
| `better_performance` | Selected component has higher-tier compatible option | Swap |
| `better_value` | Cheaper compatible option saves ≥৳500 | Swap |
| `psu_wattage` | CPU+GPU TDP + 80W base | Info or swap PSU |
| `cooling` | CPU TDP > 95W | Add tower/AIO cooler |
| `upgrade_path` | Multiple performance upgrades | Ordered roadmap |
| `budget_optimization` | Over/under budget cap | Swap or spend ideas |

---

## PSU wattage formula

```
estimatedDraw = CPU.TDP + GPU.TDP + 80W (platform)
recommendedMin  = draw × 1.10
recommendedIdeal = draw × 1.20
```

Compare against selected PSU `wattage` attribute. Suggest next compatible PSU from catalog if inadequate.

---

## Cooling tiers

| CPU TDP | Tier | Recommendation |
|---------|------|----------------|
| ≤ 95W | `stock_ok` | Stock cooler sufficient |
| 96–125W | `tower_recommended` | Air tower (e.g. DeepCool AK400) |
| > 125W | `aio_recommended` | 240mm AIO (e.g. Corsair H100i) |

---

## Upgrade path ordering

Purpose-aware priority:

- **Gaming:** GPU → CPU → RAM → SSD
- **Workstation:** CPU → RAM → SSD → GPU
- **General:** CPU → GPU → RAM

Each step includes `priceDelta`, `impact`, and `cumulativeDelta`.

---

## Budget optimization

**Over budget:** Apply `better_value` swaps in ascending savings until under cap.

**Under budget:** Suggest `better_performance` upgrades that fit remaining headroom.

---

## Frontend files

| File | Role |
|------|------|
| `lib/builder/recommendations/types.ts` | Types + kind labels |
| `lib/builder/recommendations/engine.ts` | Main orchestrator |
| `lib/builder/recommendations/psu-calculator.ts` | PSU sizing |
| `lib/builder/recommendations/cooling-calculator.ts` | Cooling tiers |
| `lib/mock-data/pc-builder-coolers.ts` | Cooler catalog |
| `components/storefront/builder/builder-recommendations-panel.tsx` | Storefront UI |

---

## Backend files

| File | Role |
|------|------|
| `schemas/smart_recommendations.py` | Request/response contracts |
| `services/smart_recommendation_service.py` | Python engine (mirrors TS) |
| `routes/recommendations.py` | `POST /recommendations/smart` |

---

## API

```http
POST /api/v1/configurator/recommendations/smart
```

**Request:**
```json
{
  "selections": [
    { "step_id": "cpu", "product_id": "pcb_cpu_i5", "price": 28900, "attributes": { "tdp": 125 } },
    { "step_id": "gpu", "product_id": "pcb_gpu_4060", "price": 38500, "attributes": { "tdp": 115 } }
  ],
  "budget_bdt": 100000,
  "purpose": "gaming"
}
```

**Response:**
```json
{
  "recommendations": [
    { "kind": "related_component", "title": "Add motherboard", "action": "add" },
    { "kind": "psu_wattage", "title": "PSU sizing", "description": "Draw 320W — ideal 384W" }
  ],
  "psu": { "estimated_draw_w": 320, "recommended_ideal_w": 384, "adequate": false },
  "cooling": { "cpu_tdp": 125, "needs_aftermarket": true, "tier": "tower_recommended" },
  "upgrade_path": [{ "order": 1, "step_id": "gpu", "to_product_name": "RTX 4070", "price_delta": 20400 }]
}
```

---

## Related docs

- [PC Builder Wizard](./PC_BUILDER_WIZARD.md)
- [Compatibility Engine](./COMPATIBILITY_ENGINE.md)
- [AI PC Builder Assistant](./AI_PC_BUILDER_ASSISTANT.md)
