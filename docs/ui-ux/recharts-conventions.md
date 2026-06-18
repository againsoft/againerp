# Recharts Conventions (AgainERP Web)

> **Status:** Active  
> **Applies to:** `apps/web` — all dashboard charts using [Recharts](https://recharts.org/)

---

## Tooltip `formatter` typing

Recharts `Tooltip` passes **`ValueType | undefined`** to `formatter`, not a guaranteed `number`.

### Do not

```tsx
// ❌ Fails `next build` / Vercel TypeScript check
<Tooltip formatter={(v: number) => [`৳${v}M`, ""]} />
```

### Do

```tsx
// ✅ Inline — coerce inside the callback; leave `v` untyped
<Tooltip formatter={(v) => [`৳${Number(v ?? 0)}M`, ""]} />

// ✅ Preferred — shared helper (no inline typing mistakes)
import { chartTooltipBdtMillions } from "@/lib/charts/recharts-tooltip";

<Tooltip formatter={chartTooltipBdtMillions} />
```

### Shared helpers

| Helper | Output example |
|--------|----------------|
| `chartValueAsNumber(value)` | `12` |
| `chartTooltipBdtMillions(value)` | `["৳12M", ""]` |
| `chartTooltipBdtThousands(value)` | `["৳120K", ""]` |

Location: `apps/web/src/lib/charts/recharts-tooltip.ts`

---

## Chart container sizing

During static generation, Recharts may log `width(-1) and height(-1)` if the parent has no height. Always give chart wrappers an explicit min-height:

```tsx
<div className="h-52 w-full min-h-[208px]">
  <ResponsiveContainer width="100%" height="100%">
    …
  </ResponsiveContainer>
</div>
```

---

## Related

- [ADR-011: Next.js + TypeScript](../adr/ADR-011-nextjs-typescript.md)
- [PROJECT_COMMON_RULES.md](../PROJECT_COMMON_RULES.md) — UI & code conventions
