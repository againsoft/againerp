# Testing Strategy

> **Status:** Draft  
> **Phase:** 10 — Production (Step 90)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Define AgainERP's comprehensive testing approach across unit, integration, end-to-end, and non-functional testing. Ensures quality before phase gates and production releases.

## Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  Few — critical user journeys
       ┌┴─────────┴┐
       │ Integration│  API, DB, module boundaries
      ┌┴────────────┴┐
      │  Unit Tests   │  Many — services, models, rules
      └───────────────┘
```

Target ratio: ~70% unit, 20% integration, 10% E2E.

## Test Types

| Type | Scope | Tools | When |
|------|-------|-------|------|
| Unit | Single class/function | PHPUnit, Pest | Every PR |
| Integration | API + database | PHPUnit + test DB | Every PR |
| Feature | HTTP request full stack | FastAPI TestClient / pytest | Every PR |
| E2E | Browser user flows | Playwright / Dusk | Nightly, pre-release |
| Contract | API schema stability | OpenAPI validation | Module releases |
| Regression | Bug fix verification | Automated + manual | Per fix |

## Environment Strategy

| Environment | Data | Purpose |
|-------------|------|---------|
| Local | Seeders, factories | Developer testing |
| CI | Ephemeral Docker Compose | Automated pipeline |
| Staging | Anonymized production copy | Integration, UAT |
| Production | Live | Smoke tests only post-deploy |

Never run destructive tests against production.

## Module Testing Scope

Each module (`docs/modules/{name}/`) requires:

| Artifact | Minimum |
|----------|---------|
| Unit tests | Business rules, calculations |
| API tests | All documented endpoints |
| Permission tests | ACL per role matrix |
| Workflow tests | State transitions |

Priority order follows [MASTER_DEVELOPMENT_SEQUENCE.md](../MASTER_DEVELOPMENT_SEQUENCE.md).

## Critical User Journeys (E2E)

| Journey | Modules |
|---------|---------|
| Admin login → dashboard | Core |
| Create product → publish | Ecommerce, Catalog |
| Browse → checkout → pay | Ecommerce, Sales, Accounting |
| Receive stock → fulfill order | Inventory, Logistics |
| AI generate description → approve | AI, Ecommerce |
| Vendor onboard → list product | Marketplace |

## Test Data Management

- Factories for all module entities
- Seeders for demo and staging environments
- PII never in committed fixtures — use Faker
- Reset database between integration test classes

## Coverage Targets

| Layer | Target (initial) |
|-------|------------------|
| Core services | 80% |
| Module business logic | 70% |
| API controllers | 60% |
| UI/E2E | Critical paths only |

Coverage reported in CI; declining trend blocks merge.

## CI Integration

See [deployment/cicd.md](../deployment/cicd.md):

- All tests run on PR
- Failed tests block merge
- Nightly full E2E suite on `develop`

## Defect Management

| Severity | Response |
|----------|----------|
| Critical | Block release; hotfix |
| High | Fix before release |
| Medium | Next sprint |
| Low | Backlog |

Link defects to module and test gap analysis.

## Related Documents

- [qa-standards.md](./qa-standards.md)
- [load-testing.md](./load-testing.md)
- [security-testing.md](./security-testing.md)
- [uat.md](./uat.md)

---

**Last Updated:** 2026-06-12
