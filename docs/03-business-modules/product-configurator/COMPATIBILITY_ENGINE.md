# Build Compatibility Engine

> **Status:** Implemented (prototype + API foundation)  
> **Admin:** `/configurator/compatibility`  
> **API:** `POST /api/v1/configurator/compatibility/evaluate`  
> **Depends on:** [Component Attribute Engine](./COMPONENT_ATTRIBUTE_ENGINE.md)

---

## Purpose

Automatically determine whether selected configurator components are **compatible**, raise a **warning**, or are **incompatible** — using attribute values from the Component Attribute Engine.

| Example rule | Logic |
|--------------|-------|
| CPU ↔ Motherboard | `CPU.socket equals Motherboard.socket` |
| Motherboard ↔ RAM | `Motherboard.ram_type equals RAM.type` |
| High TDP warning | `IF CPU.tdp greater_than 125 THEN warning ELSE compatible` |

---

## Rule model — IF / THEN / ELSE

Each compatibility rule stores a JSON body:

```json
{
  "conditions": [
    {
      "id": "c1",
      "left": { "profileId": "cap_cpu", "fieldCode": "socket" },
      "operator": "equals",
      "right": { "profileId": "cap_mobo", "fieldCode": "socket" }
    }
  ],
  "then": { "status": "compatible", "message": "Sockets match." },
  "else": { "status": "incompatible", "message": "Socket mismatch." }
}
```

- **IF:** All conditions are AND-ed. Empty conditions always match (THEN branch).
- **THEN:** Outcome when all conditions pass.
- **ELSE:** Outcome when any condition fails.

### Supported operators

| Operator | Behaviour |
|----------|-----------|
| `equals` | String equality |
| `not_equals` | String inequality |
| `contains` | Case-insensitive substring |
| `greater_than` | Numeric comparison |
| `less_than` | Numeric comparison |

### Result statuses

| Status | Meaning |
|--------|---------|
| `compatible` | No blocking issue |
| `warning` | Proceed with caution |
| `incompatible` | Block or flag build |

**Merge rule:** Worst status wins across all active rules — `incompatible` > `warning` > `compatible`.

---

## Architecture

```
Component Attribute Values (per product)
        ↓
Build Context (profileId + attributes map per slot)
        ↓
Compatibility Rules (IF/THEN/ELSE, priority order)
        ↓
Rule Evaluator Service
        ↓
Compatibility Cache (TTL 5 min)
        ↓
API: compatible | warning | incompatible
```

### Evaluation flow

1. Load active rules for configurator profile, sorted by `priority`.
2. For each rule, evaluate every IF condition against build context.
3. Pick THEN or ELSE outcome per rule.
4. Merge all rule statuses into a single build status.
5. Cache result keyed by profile + stable-serialized component attributes.

---

## Code map

### Frontend (admin UI + client evaluator)

| File | Role |
|------|------|
| `lib/compatibility/types.ts` | Operators, IF/THEN/ELSE types, status merge |
| `lib/compatibility/rule-evaluator.ts` | `evaluateCondition`, `evaluateCompatibilityRules` |
| `lib/compatibility/compatibility-cache.ts` | In-memory TTL cache |
| `lib/mock-data/compatibility-rules.ts` | Seed rules (socket, RAM, TDP, DDR5) |
| `lib/store/compatibility-rule-store.ts` | Zustand persist + evaluate + cache invalidation |
| `components/configurator/compatibility-rules-list.tsx` | Rule list + workflow banner |
| `components/configurator/compatibility-rule-form-sheet.tsx` | Visual IF/THEN/ELSE builder |
| `components/configurator/compatibility-evaluator-panel.tsx` | Live build tester |

### Backend

| File | Role |
|------|------|
| `schemas/compatibility.py` | Request/response contracts |
| `services/compatibility_evaluator_service.py` | Python rule evaluator (mirrors TS) |
| `services/compatibility_cache.py` | Process-level TTL cache |
| `routes/compatibility.py` | `POST /evaluate`, cache invalidation |

Rules persist in existing `configurator_rules` with `rule_type = "compatibility"` and `rule_definition` JSONB holding the IF/THEN/ELSE body.

---

## API

### Evaluate build

```http
POST /api/v1/configurator/compatibility/evaluate
```

**Request:**

```json
{
  "profile_uuid": "optional-uuid-for-db-rules",
  "configurator_profile_id": "cfg_pc",
  "bypass_cache": false,
  "components": [
    {
      "component_profile_id": "cap_cpu",
      "attributes": { "socket": "lga_1700", "tdp": 125 }
    },
    {
      "component_profile_id": "cap_mobo",
      "attributes": { "socket": "lga_1700", "ram_type": "ddr5" }
    },
    {
      "component_profile_id": "cap_ram",
      "attributes": { "type": "ddr5", "speed": 5600 }
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "compatible",
    "cached": false,
    "evaluated_at": "2026-06-15T12:00:00+00:00",
    "results": [
      {
        "rule_id": "cr_socket_match",
        "rule_name": "CPU ↔ Motherboard Socket Match",
        "matched": true,
        "status": "compatible",
        "message": "CPU socket matches motherboard socket.",
        "branch": "then"
      }
    ]
  }
}
```

### Invalidate cache

```http
POST /api/v1/configurator/compatibility/cache/invalidate?configurator_profile_id=cfg_pc
```

---

## Seed rules (prototype)

| Rule | IF | THEN | ELSE |
|------|----|------|------|
| Socket match | CPU.socket = Mobo.socket | compatible | incompatible |
| RAM type | Mobo.ram_type = RAM.type | compatible | incompatible |
| TDP warning | CPU.tdp > 125 | warning | compatible |
| DDR5 speed | RAM.type = ddr5 AND speed < 4800 | warning | compatible |

---

## Production notes

- Replace in-memory cache with **Redis** keyed by `company_id:profile_id:build_hash`.
- Resolve `profileId` / `fieldCode` to DB attribute profile UUIDs when persisting rules.
- Wire storefront configurator to call `/compatibility/evaluate` on each component change (debounced).
- Add rule versioning and audit log for admin changes.

---

## Related docs

- [Component Attribute Engine](./COMPONENT_ATTRIBUTE_ENGINE.md)
- [Product Configurator README](../../03-business-modules/product-configurator/README.md)
