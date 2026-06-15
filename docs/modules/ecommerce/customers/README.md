# Customers Module

> **Status:** Draft · **Version:** 1.0

Commerce customer layer on Core contacts — groups, wallet, points, wishlists, saved carts, and history.

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Complete Customers architecture |
| [core/entities/contacts.md](../../../core/entities/contacts.md) | Customer identity (no duplicate table) |
| [orders/ARCHITECTURE.md](../orders/ARCHITECTURE.md) | Order history by contact |

## UI Location

Admin menus under `Menus/Customers/`: Customers, Groups, Wallet, Reward Points, Wishlists

## Table Namespace

Core `contacts` + `commerce_*` for wallet, groups, wishlists, saved carts
