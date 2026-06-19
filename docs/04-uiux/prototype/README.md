# UI Prototype Documentation

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Active — **UI/UX Prototype Mode**  
> **Canonical:** [UI_PROTOTYPE_MODE.md](../strategy/UI_PROTOTYPE_MODE.md)  
> **Strategy:** [UI_PROTOTYPE_STRATEGY.md](../strategy/UI_PROTOTYPE_STRATEGY.md)

**Frontend only.** Next.js + dummy data. No backend · no APIs · no database · no live AI.

---


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Rules

| Rule | Detail |
|------|--------|
| Clickable | Every menu, modal, drawer works |
| Tri-file docs | `{Page}.md` + `{Page}Review.md` + `{Page}Changes.md` |
| Realistic data | 100+ products, 500+ orders, 200+ notifications |
| No empty screens | AG Grid + charts always populated |

---

## Shell & Scope

| Document | Purpose |
|----------|---------|
| [PROTOTYPE_SHELL.md](./PROTOTYPE_SHELL.md) | Header, sidebar, workspace, AI panel |
| [MODULE_SCOPE.md](./MODULE_SCOPE.md) | All modules & screens |
| [DUMMY_DATA_STANDARDS.md](./DUMMY_DATA_STANDARDS.md) | Fixture volumes |
| [REVIEW_CYCLE.md](./REVIEW_CYCLE.md) | 6-step per-screen workflow |
| [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) | Gate before backend |

---

## Templates

| Template | File |
|----------|------|
| Page spec | [_PAGE_PROTOTYPE_TEMPLATE.md](./_PAGE_PROTOTYPE_TEMPLATE.md) |
| Review | [_PAGE_REVIEW_TEMPLATE.md](./_PAGE_REVIEW_TEMPLATE.md) |
| Changes | [_PAGE_CHANGES_TEMPLATE.md](./_PAGE_CHANGES_TEMPLATE.md) |

---

## Folder Index

| Folder | Screens |
|--------|---------|
| [dashboard/](./dashboard/) | 8+ |
| [catalog/](./catalog/) | 21+ |
| [storefront/](./storefront/) | 23 routes (AgainShop `/shop/*`) |
| [customers/](./customers/) | 9 |
| [orders/](./orders/) | 9 |
| [inventory/](./inventory/) | 8 |
| [purchase/](./purchase/) | Suppliers prototype + vendor mapping |
| [marketing/](./marketing/) | 16 |
| [content/](./content/) | 10 |
| [media/](./media/) | 9 |
| [seo/](./seo/) | 12 |
| [builder/](./builder/) | 14 |
| [plugins/](./09-integrations/plugins/) | Bank EMI (financing) |
| [reports/](./reports/) | 14 |
| [system/](./system/) | 24 |
| [ai-os/](./ai-os/) | 15 |
| [platform/](./07-saas/) | 8 |
| [data/](./data/) | JSON fixtures |

Cross-reference: [MENU_STRUCTURE.md](../../03-business-modules/ecommerce/MENU_STRUCTURE.md) (167 menus)

---

## Scripts

```bash
# Page spec stubs
python3 docs/scripts/generate-ui-prototype-pages.py

# Review + Changes stubs for every page
python3 docs/scripts/generate-ui-prototype-tri-files.py
```

---

## Exemplar

| Page | Spec |
|------|------|
| Product List | [catalog/products/ProductList.md](./catalog/products/ProductList.md) |
| Storefront (AgainShop) | [storefront/IMPLEMENTED_DESIGN.md](./storefront/IMPLEMENTED_DESIGN.md) |

---

**Last Updated:** 2026-06-13
