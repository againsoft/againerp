# POS Module

> **Status:** Draft · **Phase:** 5 · **Step:** 50

Point of sale — register sessions, in-store checkout, offline sync, using `commerce_orders` and `inventory_*`.

| Document | Description |
|----------|-------------|
| [**Architecture.md**](./Architecture.md) | Enterprise POS architecture |
| [MASTER_DATABASE_ARCHITECTURE.md](../../database/MASTER_DATABASE_ARCHITECTURE.md) | Table naming & ownership |
| [MASTER_DEVELOPMENT_SEQUENCE.md](../../MASTER_DEVELOPMENT_SEQUENCE.md) | Phase 5 step 50 |

## Scope

| Area | Capability |
|------|------------|
| Registers | Terminal configuration per branch |
| Sessions | Open/close cash drawer, reconciliation |
| Checkout | Fast sale flow, barcode scan |
| Offline | Queue sync when connectivity returns |

## API Base

`/api/v1/pos/`
