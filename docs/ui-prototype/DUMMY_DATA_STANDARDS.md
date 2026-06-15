# Dummy Data Standards

> **Parent:** [UI_PROTOTYPE_STRATEGY.md](../UI_PROTOTYPE_STRATEGY.md)

---

## Minimum Volumes

| Entity | Count | Fixture File |
|--------|-------|--------------|
| Products | 100+ | `data/products.json` |
| Customers | 100+ | `data/customers.json` |
| Orders | 500+ | `data/orders.json` |
| Categories | 50+ | `data/categories.json` |
| Brands | 30+ | `data/brands.json` |
| Reviews | 500+ | `data/reviews.json` |
| Activities | 1,000+ | `data/activities.json` |
| Notifications | 200+ | `data/notifications.json` |
| Inventory rows | 200+ | `data/stock.json` |
| Coupons | 20+ | `data/coupons.json` |

---

## Realism Rules

| Rule | Example |
|------|---------|
| **Locale** | Mix en + bn names where applicable |
| **Currency** | BDT primary, USD secondary |
| **SKUs** | `TSH-BLK-M`, `ELC-PHN-128` |
| **Dates** | Last 90 days distribution |
| **Statuses** | Realistic mix (70% active, 20% draft, 10% archived) |
| **Images** | Placeholder URLs or local `/prototype/assets/` |
| **No lorem-only** | Product names must be plausible |

---

## Product Example

```json
{
  "id": "prod_001",
  "name": "Premium Cotton T-Shirt",
  "sku": "TSH-BLK-M",
  "price": 899,
  "currency": "BDT",
  "status": "published",
  "stock": 142,
  "category": "Apparel",
  "brand": "UrbanWear",
  "image": "/prototype/assets/products/tshirt-black.jpg"
}
```

---

## Order Example

```json
{
  "id": "ord_1042",
  "number": "ORD-2026-01042",
  "customer": "Rahim Ahmed",
  "total": 2450,
  "status": "processing",
  "payment": "paid",
  "items": 3,
  "created_at": "2026-06-10T14:32:00+06:00"
}
```

---

## AI Mock Responses

File: `data/ai-responses.json`

Canned responses for: product description, SEO meta, sales summary, inventory forecast.

No live API calls in prototype phase.

---

## Mock API Convention

```
/mock/api/v1/{module}/{resource}
```

Returns fixture JSON. Supports `?page=` `?q=` for prototype pagination/search simulation.

---

## Refresh

Regenerate fixtures with script (future): `docs/scripts/generate-prototype-fixtures.py`
