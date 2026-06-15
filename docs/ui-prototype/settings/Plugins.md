# Plugins & Integrations

> **Status:** Ready (Prototype)  
> **Module:** Core Platform · Business Settings  
> **Route:** `/settings/plugins` · `/settings/plugins/[pluginId]`  
> **Architecture:** [SETTINGS_ARCHITECTURE.md](../../modules/core/SETTINGS_ARCHITECTURE.md)  
> **Code:** `lib/settings/plugins/`, `components/settings/plugins/`

---

## Purpose

External plugin marketplace inside Business Settings. Install integrations (Pathao, bKash, Steadfast, etc.) and configure API credentials, automation rules, and webhooks per plugin.

## UI Layout

**Plugin List — `/settings/plugins`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Plugins — search, filters (All / Installed / Available)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Shipping & Delivery                                                           │
│ [Pathao Courier]  [Steadfast Courier]                                         │
│                                                                               │
│ Payments                                                                      │
│ [bKash]  [SSLCommerz]                                                         │
│                                                                               │
│ Communication                                                                 │
│ [WhatsApp Business]                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pathao Config — `/settings/plugins/pathao`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Plugins    Pathao Courier [Active]    [Docs] [History] [Reset] [Uninstall]│
│ Plugin Status toggle                                                        │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ Configuration│ API Connection                                               │
│ · Connection │ Client ID, Client Secret, Store ID, Environment              │
│ · Pickup     │ Pickup address, phone, service type                          │
│ · Automation │ Auto shipment, tracking sync, COD, webhook URL               │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

## Plugin Registry

| Plugin | Category | Key Config |
|--------|----------|------------|
| Pathao Courier | Shipping | Client ID, Secret, Store ID, pickup, auto shipment, webhook |
| Steadfast Courier | Shipping | API Key, Secret, auto parcel |
| bKash | Payment | Username, App Key/Secret, checkout |
| SSLCommerz | Payment | Store ID, Password |
| WhatsApp Business | Communication | Phone ID, Access Token, notifications |

## Actions

| Action | Behavior |
|--------|----------|
| Install | Add plugin to store, enable by default |
| Configure | Open plugin config page |
| Enable/Disable | Toggle integration without uninstall |
| Save Configuration | Persist to `again-plugins-v1` + audit history |
| Uninstall | Remove plugin and config |

## Change History

| Date | Change |
|------|--------|
| 2026-06-13 | Plugins menu + Pathao integration UI prototype |
