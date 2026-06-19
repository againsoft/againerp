# Domain Manager — Domain

> **Module:** Website · **Screen:** Domain Manager · **Route:** `/website/domain` · **Status:** Draft

## Purpose
Add, verify, and manage custom domains and SSL certificates for the company website.

## Layout
List page + right Sheet drawer for domain details and verification.

## Table Columns
`Domain` · `Status` · `SSL` · `Primary` · `Verified At` · `Actions`

## Status Badges
| Status | Color | Meaning |
|--------|-------|---------|
| `pending` | Yellow | Added — waiting DNS verification |
| `verified` | Blue | DNS verified — SSL provisioning |
| `active` | Green | Live — SSL issued |
| `error` | Red | DNS check failed |

## Sheet — Add Domain Fields
- Domain name (e.g. `example.com`)
- Set as primary domain (toggle)

## Verification Flow (in Sheet)
1. Add domain
2. System shows DNS TXT record to add
3. User adds record to their DNS provider
4. Click "Verify Now" → system checks DNS
5. On success → SSL provisioning starts automatically

## Actions
- **Set as Primary** — routes main traffic to this domain
- **Re-verify** — retry DNS check
- **Remove** — delete domain
- **View SSL details** → certificate expiry, issuer

## DNS Instructions Panel
Shows copy-paste TXT record:
```
Type: TXT
Name: _againerp-verify
Value: verify-{token}
TTL: 3600
```
