# Security Testing

> **Status:** Draft  
> **Phase:** 10 — Production (Step 93)  
> **Parent:** [qa/README.md](./README.md)

---

## Purpose

Systematically verify AgainERP security controls before production launch and on ongoing release cycles. Complements [deployment/security-hardening.md](../deployment/security-hardening.md) with active testing procedures.

## Security Test Categories

| Category | Focus |
|----------|-------|
| Authentication | Login, MFA, session, password policy |
| Authorization | RBAC, record-level access, API scopes |
| Input validation | XSS, SQL injection, file upload |
| API security | Rate limits, auth tokens, CORS |
| Multi-tenant | Cross-company data isolation |
| Infrastructure | TLS, headers, exposed services |
| Dependency | Known CVEs in packages |

## OWASP Top 10 Coverage

| Risk | Test Approach |
|------|---------------|
| Broken access control | Attempt cross-tenant, privilege escalation |
| Cryptographic failures | Verify TLS, password hashing, secret storage |
| Injection | SQLi, command injection on all inputs |
| Insecure design | Threat model review per module |
| Security misconfiguration | Scan staging with hardening checklist |
| Vulnerable components | `composer audit`, image scan |
| Auth failures | Brute force, session fixation |
| Data integrity | CSRF on state-changing requests |
| Logging failures | Verify audit logs on sensitive actions |
| SSRF | External URL fetch features (webhooks, feeds) |

## Automated Scans

| Scan | Frequency | Tool |
|------|-----------|------|
| Dependency audit | Every PR | Composer audit |
| SAST | Every PR | PHPStan security rules, Semgrep |
| DAST | Weekly staging | OWASP ZAP baseline |
| Container scan | Every image build | Trivy, Snyk |
| SSL scan | Monthly | SSL Labs, testssl |

## Manual Penetration Testing

| Scope | Timing |
|-------|--------|
| Full application pentest | Before initial production launch |
| Focused retest | After Critical/High fixes |
| Annual pentest | Ongoing compliance |

Engage qualified third party for launch pentest. Internal team handles continuous checks.

## Multi-Tenant Test Cases

Critical for AgainERP SaaS model:

| Test | Expected |
|------|----------|
| User A queries User B's `company_id` | 403 or empty result |
| API with tampered `company_id` header | Rejected |
| Direct object reference (order ID) | Scoped to tenant |
| Export/report | Only tenant data |
| Search results | No cross-tenant leakage |

## API Security Tests

| Test | Method |
|------|--------|
| Unauthenticated access | All protected endpoints return 401 |
| Expired token | 401 |
| Rate limit | 429 after threshold |
| Mass assignment | Extra fields ignored/rejected |
| File upload | Reject executable, oversize |

## Authentication Tests

- Brute force lockout after N failures
- MFA bypass attempts fail
- Password reset token single-use and expiry
- Session invalidation on logout
- Concurrent session policy enforced

## Pre-Launch Security Checklist

- [ ] Pentest report reviewed; Critical/High resolved
- [ ] `composer audit` clean
- [ ] [security-hardening.md](../deployment/security-hardening.md) checklist complete
- [ ] Secrets not in repository (git history scan)
- [ ] Admin interfaces not publicly indexed
- [ ] Backup encryption verified

## Incident Test

Annual tabletop exercise: simulated breach response per [disaster-recovery.md](../deployment/disaster-recovery.md).

## Sign-Off

Security sign-off required from designated security lead or external auditor before production launch ([launch-checklist.md](./launch-checklist.md)).

## Related Documents

- [deployment/security-hardening.md](../deployment/security-hardening.md)
- [qa-standards.md](./qa-standards.md)
- [uat.md](./uat.md)

---

**Last Updated:** 2026-06-12
