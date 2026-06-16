# Admin Compatibility UX — User-Friendly Guide

> **Audience:** Admin / catalog manager (non-developer)  
> **Screen:** `/catalog/product-configurator/rules`  
> **Prototype:** `apps/web` — mock data only

---

## ১. লক্ষ্য

Compatibility rule setup যেন **Excel formula নয়** — বরং:

- **সহজ বাংলা/English ব্যাখ্যা**
- **Ready-made template** দিয়ে শুরু
- **Scenario card** দিয়ে এক ক্লিকে test
- Storefront-এ **তৎক্ষণাৎ** ফলাফল

---

## ২. Admin screen layout

```
┌─────────────────────────────────────────────────────────────┐
│  Quick Start — common rules (visual cards)                  │
├─────────────────────────────────────────────────────────────┤
│  Scenario Tester — ✅ Perfect | ❌ Socket | ⚠️ RAM          │
├─────────────────────────────────────────────────────────────┤
│  Rule list — plain language + IF block + priority           │
│  [Search] [Builder filter] [Create rule]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ৩. Quick Start templates (design)

| Template | Plain meaning | IF (simplified) | THEN | ELSE |
|----------|---------------|-----------------|------|------|
| Socket Match | CPU আর Motherboard এক socket-এ বসবে | CPU.socket = Mobo.socket | ✅ compatible | ❌ incompatible |
| RAM Type | Motherboard যে RAM সাপোর্ট করে | Mobo.ram_type = RAM.type | ✅ compatible | ❌ incompatible |
| High TDP Warning | বেশি TDP CPU — cooling চেক করুন | CPU.tdp > 125W | ⚠️ warning | ✅ ok |
| DDR5 Speed | ধীর DDR5 — performance সীমিত | DDR5 & speed < 4800 | ⚠️ warning | ✅ ok |

**Prototype:** Cards are visual guides; full edit in rule form sheet.

---

## ৪. Scenario tester — কীভাবে ব্যবহার করবেন

### Step 1 — Scenario বেছে নিন

| Card | কী simulate করে | Expected result |
|------|-----------------|-----------------|
| ✅ Perfect Intel Build | i5 + Z790 + DDR5 match | compatible |
| ❌ Socket Mismatch | LGA1700 CPU + AM5 board | incompatible |
| ⚠️ RAM Type Mismatch | DDR4 board + DDR5 RAM | incompatible |

### Step 2 — Evaluate

- প্রতিটি rule আলাদা line-এ pass/fail
- Message: *"CPU socket does not match motherboard socket"*

### Step 3 — Storefront verify

একই rule `compatibility-rules.ts` থেকে PC Builder banner-এ দেখাবে।

---

## ৫. Rule create — admin mental model

```
১. কোন builder?     → PC Builder
২. কোন field match?  → CPU socket ↔ Motherboard socket
৩. Match হলে?       → compatible + friendly message
৪. Match না হলে?    → incompatible + কী fix করতে হবে
৫. Priority?         → ১ = আগে check
৬. Scenario test     → mismatch card চালান
৭. Publish (active)  → storefront live
```

---

## ৬. Mock data files

| File | Content |
|------|---------|
| `compatibility-rules.ts` | 4 seed rules |
| `compatibility-scenarios.ts` | 3 test scenarios |
| `configurator-attributes.ts` | Field definitions (socket, ram_type…) |

---

## ৭. Future (development phase)

| Feature | Benefit |
|---------|---------|
| AI: "Add rule: AM5 CPU needs DDR5" | Natural language → rule draft |
| Impact count | "৪২ motherboard hidden if CPU selected" |
| Rule simulator with real SKU names | Admin picks actual products |
| Version history | Who changed socket rule when |

---

## ৮. Related

- [COMPATIBILITY_ENGINE.md](../../modules/product-configurator/COMPATIBILITY_ENGINE.md) — technical spec
- [PC_BUILDER_UX_BLUEPRINT.md](./PC_BUILDER_UX_BLUEPRINT.md) — full storefront + admin flow
