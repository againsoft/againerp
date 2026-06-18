# HR & Payroll — AI Assistant Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll (unified enterprise suite)  
> **Document Type:** Enterprise AI Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_PAYROLL_MASTER_ARCHITECTURE.md](./HR_PAYROLL_MASTER_ARCHITECTURE.md) · [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) · [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) · [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) · [HR_REPORTING_ARCHITECTURE.md](./HR_REPORTING_ARCHITECTURE.md)  
> **Governance:** [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md) · [AI_CONTEXT_ENGINE.md](../ai/AI_CONTEXT_ENGINE.md) · [AI_AUDIT_AND_APPROVAL.md](../ai/AI_AUDIT_AND_APPROVAL.md) · [ACTIVITY_CHATTER_ARCHITECTURE.md](../core/ACTIVITY_CHATTER_ARCHITECTURE.md) · [APPROVAL_ENGINE_ARCHITECTURE.md](../../core/engines/APPROVAL_ENGINE_ARCHITECTURE.md) · [NOTIFICATION_ENGINE_ARCHITECTURE.md](../../core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md)

**No prompt templates. No model training specs. No application code.**  
Defines **enterprise AI architecture** for AgainERP HR & Payroll — assistants, analysts, advisors, auditors, predictors, planners, and future autonomous agents. Foundation for AI assistant UI, analytics, recommendations, predictions, automation, and Chief AI Agent integration.

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **AI is platform service** | HR AI registers with AI OS — not a standalone LLM stack |
| **No direct DB access** | Tools → HR/Payroll Service APIs only |
| **User permission inheritance** | AI never exceeds acting user's RBAC |
| **Human in the loop** | Suggest → Review → Apply — no silent payroll writes |
| **Audit everything** | `ai_audit_logs` + `activity_ai_actions` |
| **Explainable** | Every insight: why, sources, confidence, actions |
| **Payroll is critical** | Auditor role — never auto-approve or auto-lock |

```text
User / Chief AI Agent
        │
        ▼
HR Workforce Agent (domain agent)
        │
        ├── Chat Layer ──────────► conversational queries
        ├── Analytics Layer ─────► read models + KPIs
        ├── Recommendation Layer ► ranked suggestions
        ├── Prediction Layer ────► batch scores (future)
        └── Automation Layer ────► proposals → approval (future)
        │
        ▼
Tool Engine (permission + risk check)
        │
        ▼
HR / Payroll Service APIs (/api/v1/hr/, /api/v1/payroll/, /api/v1/ess/)
        │
        ▼
Workflow / Approval (if write) → Activity + Notification
```

**Agent ID:** `workforce_agent` (HR & Payroll domain)  
**UI hub:** `/hr/ai` · **Global chat:** `Ctrl+J` (Chief Agent with HR delegation)  
**API base:** `/api/v1/ai/os/` + `/api/v1/hr/ai/`

---

# AI Vision

### Vision statement

> **Make every HR and payroll decision informed, compliant, and fast — with AI that advises through governed services and never bypasses human authority.**

### Role of AI inside HR & Payroll

AI operates as **seven complementary modes** — not a single chatbot:

| Mode | Role | Risk tier | Example |
|------|------|-----------|---------|
| **Assistant** | Answer questions, navigate data | Low | "Who is on leave today?" |
| **Analyst** | Pattern detection, trends | Low | Attendance heatmap narrative |
| **Advisor** | Recommendations with evidence | Medium | Training course for skill gap |
| **Auditor** | Validation, anomaly flags | Low–Medium | Duplicate payslip detection |
| **Predictor** | Forward-looking scores | Medium | Attrition risk ranking |
| **Planner** | Scenario and capacity plans | Medium | Headcount forecast |
| **Future autonomous agent** | Multi-step plans with human gates | High | Onboarding checklist orchestration |

### What HR AI is not

| Not | Why |
|-----|-----|
| Payroll calculator replacement | Deterministic engine owns math |
| Approval authority | Core Approval Engine — humans only |
| HRIS of record | OLTP tables owned by HR/Payroll services |
| Unaudited automation | Every action logged |

### Alignment with AI OS

Per [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md):

> **AI is a platform service. AI is not a module.**

HR & Payroll contributes **domain tools, context adapters, read models, and UI surfaces** — AI OS owns orchestration, providers, audit, and Chief Agent routing.

---

# AI Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Service boundary** | Tools map 1:1 to service methods |
| 2 | **Least privilege** | Context bundle filtered by RBAC + field permissions |
| 3 | **Fail closed** | Permission deny → explicit message, no guess |
| 4 | **Evidence-backed** | Insights link to KPIs, records, reports |
| 5 | **Separation of duties** | AI cannot approve payroll or leave |
| 6 | **Immutable payroll respect** | No tools on locked/posted payslips |
| 7 | **Tenant isolation** | `tenant_id` + `company_id` on all context |
| 8 | **Cost governance** | Token budgets per tenant; route to smaller models for simple queries |
| 9 | **Provider agnostic** | OpenAI, Claude, Gemini, local — via AI OS |
| 10 | **Module-off safe** | HR disabled → HR tools unregistered |

---

# Human In The Loop Strategy

### Default flow

```text
1. User asks question or requests action
2. HR Agent classifies intent (read | suggest | draft | propose_write)
3. Tools execute within permission scope
4. Response rendered with explainability block
5. If write proposed → user reviews → Apply → workflow/approval if required
6. Audit log + activity entry
```

### Interaction modes

| Mode | User action | AI action |
|------|-------------|-----------|
| **Query** | Ask | Read tools only — immediate answer |
| **Insight** | Open dashboard widget | Pre-computed batch insight |
| **Suggest** | Review ranking | Recommendation — no side effect |
| **Draft** | Edit + submit | Pre-fill form fields — user submits |
| **Propose** | Apply button | Creates draft record or workflow instance |
| **Automate (future)** | Approve automation rule | Scheduled — human approved rule only |

---

# AI Governance

| Area | Owner | Rule |
|------|-------|------|
| **Agent enablement** | Company Admin | `workforce_agent` on/off per company |
| **Tool registry** | Platform + HR module | Versioned tool manifest |
| **Model routing** | AI OS admin | Sensitive payroll → enterprise model + no training |
| **Token budget** | SaaS plan | HR AI metered per tenant |
| **Prompt registry** | AI OS (not HR doc) | HR supplies task metadata only |
| **Data retention** | Tenant policy | AI audit logs 7+ years for payroll-related |
| **Cross-border** | Tenant settings | PII residency flags on context export |

### Governance roles

| Role | Can |
|------|-----|
| **Employee** | ESS assistant — self data only |
| **Manager** | Team-scoped assistant |
| **HR Manager** | Full HR copilot (non-payroll-sensitive without key) |
| **Payroll Manager** | Payroll auditor + run insights |
| **Company Admin** | Enable/disable agents, view audit |
| **Platform Admin** | Model providers, global tool registry |

---

# AI Security

| Control | Detail |
|---------|--------|
| **Auth** | Same JWT/session as user — no elevated service token in chat |
| **RBAC** | `ai.access` + domain permissions per tool |
| **Field masking** | Salary, bank, tax ID stripped from context without `hr.sensitive.view` |
| **Record rules** | Branch/dept/self scope on all queries |
| **Prompt injection guard** | AI OS guard prompts — HR tools validate params |
| **Output filtering** | No other employees' PII in ESS responses |
| **Rate limits** | Per user — stricter on bulk export via AI |
| **Tenant boundary** | Cross-tenant context impossible at tool layer |

---

# AI Explainability

Every non-trivial AI output includes an **explainability block**:

| Field | Required | Example |
|-------|----------|---------|
| **Why** | Yes | "Absent 8 of last 10 Mondays" |
| **Data sources** | Yes | `hr_attendance`, period 2026-04-01–2026-06-01 |
| **Confidence** | Yes | `0.82` (0–1) or `high` / `medium` / `low` |
| **Reasoning summary** | Yes | 2–3 sentence narrative |
| **Recommended actions** | Optional | "Schedule conversation", "View report" |
| **Model version** | Yes | `workforce_agent@1.2.0`, `gpt-4o-2026-04` |
| **As of** | Yes | Timestamp of data snapshot |

**UI:** Expandable "How was this calculated?" on insights, widgets, and chat responses.

---

# AI Ethics

| Principle | HR application |
|-----------|----------------|
| **Fairness** | Promotion/attrition models audited for bias by department, tenure — not protected attributes |
| **Transparency** | Employees can see AI-used flags on their record (policy-dependent) |
| **Consent** | ESS AI features opt-in per tenant where required by law |
| **Human override** | Manager can dismiss AI recommendation — logged |
| **No punitive automation** | AI cannot auto-terminate, auto-deduct, auto-discipline |
| **Dignity** | Attrition risk — HR eyes only by default, not line managers |
| **Accuracy** | Payroll auditor flags are advisory — human confirms |

---

# AI Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     Chief AI Agent (AI OS)                               │
│              Intent → Plan → Delegate to domain agents                   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  Workforce Agent (HR & Payroll)                          │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ Chat     │ Workflow │Analytics │ Recommend│ Predict  │ Automate │  │
│  │ Layer    │ Layer    │ Layer    │ Layer    │ Layer    │ Layer    │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘  │
│       └──────────┴──────────┴──────────┴──────────┴──────────┘         │
│                              Tool Engine                                 │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  HR Services            Payroll Services         Core Engines
  (attendance, leave,     (runs, payslips,        (approval, workflow,
   employee, …)           loans, …)              activity, notification)
        │                       │
        └───────────┬───────────┘
                    ▼
           Analytics + AI Read Models
           (hr_ai_*, payroll_ai_*, hr_analytics_*)
```

### Sub-agents (logical specialization)

| Sub-agent ID | Focus | Parent |
|--------------|-------|--------|
| `workforce_agent` | Orchestrator | AI OS registry |
| `workforce_recruitment_agent` | Hiring pipeline | Delegated |
| `workforce_payroll_auditor_agent` | Pay validation | Delegated |
| `workforce_ess_agent` | Employee self-service | Delegated |

All sub-agents share Tool Engine and audit pipeline — not separate LLM stacks.

---

# AI Layers

| Layer | Purpose | Inputs | Outputs |
|-------|---------|--------|---------|
| **Chat layer** | NL Q&A, commands | User message, session context | Text + structured cards |
| **Workflow layer** | Propose state transitions | Entity + intent | Workflow proposal → approval |
| **Analytics layer** | KPIs, trends, narratives | `hr_analytics_*`, reports | Charts + summary |
| **Recommendation layer** | Ranked suggestions | Scores + rules | Ranked list + actions |
| **Prediction layer** | ML scores | Feature store / batch jobs | Risk scores, forecasts |
| **Automation layer** | Scheduled proposals | Rules + events | Draft records, alerts |
| **Future agent layer** | Multi-step goals | Chief Agent plans | Subtask results merged |

---

# HR AI Assistant

**Audience:** HR Manager, HR Executive · **Surface:** `/hr/ai`, global chat with HR context

### Conversational capabilities (examples)

| User query | Intent | Tools | Architecture |
|------------|--------|-------|--------------|
| Show all absent employees today | `attendance.list` | `hr.tool.attendance_daily` | Query today's register with `status=absent`; record rules apply |
| Show employees on leave | `leave.list` | `hr.tool.leave_today` | Filter approved leave overlapping today |
| Show pending approvals | `approval.list` | `core.tool.approvals_pending` | Filter `module=hr,payroll` |
| Show employees with expiring documents | `document.expiry` | `hr.tool.document_expiry` | Query `expiry_date` within window |
| Show employees without attendance | `attendance.gap` | `hr.tool.attendance_missing` | Anti-join employees vs today's attendance |
| Show employees eligible for confirmation | `employee.probation` | `hr.tool.probation_due` | `probation_end_date` <= threshold |
| Show employees due for appraisal | `performance.due` | `hr.tool.reviews_due` | Active cycle + pending review status |

### Response shape

```text
Chat answer
├── Summary sentence
├── Data table / card list (deep links to ?view={id})
├── Explainability block
└── Suggested follow-ups ("Export as report", "Notify managers")
```

---

# Natural Language Operations

| NL command | Parsed intent | Service path | Permission |
|------------|---------------|--------------|------------|
| Generate attendance report for May | `report.run` | `GET /hr/reports/attendance-daily?month=2026-05` | `hr.report.attendance.view` |
| Show payroll summary for June | `analytics.payroll` | `GET /payroll/analytics/cost?period=2026-06` | `payroll.report.view` |
| List employees in Sales department | `employee.list` | `GET /hr/employees?department=sales` | `hr.employee.view` |
| Find employees with low attendance | `analytics.attendance_rank` | Analytics layer — bottom quartile | `hr.report.attendance.view` |
| Show employees with completed probation | `employee.probation_complete` | Filter `confirmation_date` set | `hr.employee.view` |
| Identify employees due for promotion | `recommendation.promotion` | Recommendation layer | `hr.promotion.recommend` + `ai.access` |

### NL architecture

```text
User utterance
  → Chief Agent OR Workforce Agent
  → Intent classifier (structured JSON)
  → Parameter extractor (dates, dept names → IDs)
  → Permission pre-check
  → Tool execution
  → NLG response formatter (grounded in tool result — no hallucinated rows)
```

**Rule:** Tabular data always from tool results — LLM narrates, does not invent employee names.

---

# AI Employee Assistant

**Audience:** Employee · **Surface:** ESS app, `/ess` + ESS-scoped chat · **Agent:** `workforce_ess_agent`

| Capability | Scope | Tools | Restrictions |
|------------|-------|-------|--------------|
| **Attendance queries** | Self only | `ess.tool.my_attendance` | `ess.attendance.view` |
| **Leave queries** | Self only | `ess.tool.my_leave_balance`, `my_leave_history` | `ess.leave.apply` |
| **Payslip queries** | Self only | `ess.tool.my_payslips` | `ess.payslip.view` — summary only in chat |
| **Policy queries** | Company policies RAG | `hr.tool.policy_rag` | Non-sensitive policy docs |
| **Document queries** | Self docs | `ess.tool.my_documents` | `ess.document.upload` |
| **Training queries** | Self enrollment | `ess.tool.my_training` | `ess.training.enroll` |
| **Performance queries** | Self review status | `ess.tool.my_performance` | `ess.performance.self_review` |
| **HR FAQ** | Handbook RAG | `hr.tool.faq_rag` | General HR FAQ knowledge base |

**No access:** Colleague salary, manager-only attrition, company-wide payroll.

---

# AI Manager Assistant

**Audience:** Department Manager, Team Leader · **Scope:** `department_subtree` or direct reports

| Capability | Tools | Output |
|------------|-------|--------|
| **Team attendance insights** | `hr.tool.team_attendance_summary` | Present/absent/late today |
| **Leave insights** | `hr.tool.team_leave_calendar` | Who's out this week |
| **Performance insights** | `hr.tool.team_performance_snapshot` | Avg rating, pending reviews |
| **Training insights** | `hr.tool.team_training_status` | Completion % |
| **Promotion recommendations** | `hr.tool.suggest_promotion` (team only) | Ranked list — HR confirms |
| **Workload analysis** | `hr.tool.team_overtime_hours` | OT trend |
| **Team risk analysis** | `hr.tool.team_attendance_risk` | Absence pattern flags |

**Restricted:** Attrition model scores hidden from managers by default (HR Executive only).

---

# AI HR Assistant

**Audience:** HR team · **Co-pilot for operations**

| Capability | Tools | Integration |
|------------|-------|-------------|
| **Employee search** | `hr.tool.employee_search` | Global search + filters |
| **Attendance analysis** | `hr.tool.attendance_analytics` | Dashboard + report APIs |
| **Leave analysis** | `hr.tool.leave_analytics` | Utilization, trends |
| **Recruitment assistance** | Delegates to recruitment sub-agent | Pipeline, requisitions |
| **Performance assistance** | `hr.tool.performance_cycle_status` | Cycle completion |
| **Training assistance** | `hr.tool.training_gaps` | Mandatory completion gaps |
| **Compliance assistance** | `hr.tool.compliance_checklist` | Document, training, attendance compliance |

---

# AI Recruitment Assistant

**Sub-agent:** `workforce_recruitment_agent`

| Capability | Phase | Tools | Human gate |
|------------|-------|-------|------------|
| **Resume screening** | P2 | `hr.tool.screen_resume` | Recruiter confirms shortlist |
| **Candidate ranking** | P2 | `hr.tool.rank_candidates` | Advisory scores |
| **Candidate matching** | P2 | `hr.tool.match_candidate_to_job` | Skills + experience fit |
| **Interview recommendations** | P1 | `hr.tool.suggest_interviewers` | HR schedules |
| **Job description suggestions** | P1 | `hr.tool.draft_job_description` | Draft — HR publishes |
| **Hiring pipeline analysis** | P1 | `hr.tool.recruitment_funnel` | Read-only analytics |
| **Interview summary** | P3 | `hr.tool.summarize_interview_notes` | From feedback records |

**Ethics:** No automated rejection — ranking is advisory; human makes hire/reject decisions.

---

# AI Attendance Analyst

| Capability | Data sources | Output |
|------------|--------------|--------|
| **Attendance pattern analysis** | `hr_attendance`, `hr_analytics_attendance_daily` | Trend narrative + chart |
| **Late pattern detection** | Daily records, shift assignments | Recurring late days heatmap |
| **Absence pattern detection** | Absence streaks, day-of-week | Risk flags per employee |
| **Attendance risk detection** | Composite score | Ranked watch list |
| **Attendance compliance monitoring** | Policy rules vs actuals | Violation count |
| **WFH analysis** | `hr_wfh_records` | WFH frequency by dept |
| **Outdoor duty analysis** | `hr_outdoor_duty_records` | OD vs plan |

**Tools:** `hr.tool.attendance_patterns`, `hr.tool.late_analysis`, `hr.tool.absence_analysis`  
**Read APIs:** `GET /api/v1/hr/ai/insights/attendance`  
**Widget:** `WGT-AI-INS-001` per [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md)

---

# AI Leave Analyst

| Capability | Data sources | Output |
|------------|--------------|--------|
| **Leave pattern analysis** | `hr_leave_requests`, balances | Seasonal patterns |
| **Leave abuse detection** | Bridge holidays, Monday/Friday clusters | Risk score (P3) |
| **Leave forecasting** | Historical + headcount plan | Projected absence days |
| **Leave utilization analysis** | Balance vs entitled | Under/over utilizers |
| **Department leave risk** | Dept aggregation | Coverage gap warnings |

**Tools:** `hr.tool.leave_patterns`, `hr.tool.leave_forecast`, `hr.tool.leave_utilization`  
**Notification:** High-risk patterns → `ai.hr.leave_pattern` to HR Manager only

---

# AI Payroll Auditor

*Critical section — advisory only; never modifies payroll.*

| Capability | Detection method | Severity |
|------------|------------------|----------|
| **Payroll validation** | Pre-lock rule engine + AI narrative | Blockers vs warnings |
| **Anomaly detection** | Component z-score vs historical | High |
| **Duplicate payments detection** | Same employee+component duplicate in run | Critical |
| **Payroll risk analysis** | Composite run risk score | Medium–High |
| **Salary outlier detection** | vs grade median, prior period | Medium |
| **Deduction verification** | Expected vs actual loan/statutory | High |
| **Tax verification** | Tax rule vs calculated | Critical |
| **Overtime verification** | Approved OT vs payslip OT line | High |
| **Loan recovery verification** | Schedule vs deducted | High |

### Auditor architecture

```text
Payroll run calculated
  → payroll.tool.validate_run (deterministic rules)
  → workforce_payroll_auditor_agent (narrative + edge cases)
  → Insight record: payroll_ai_cost_snapshots
  → UI: exceptions panel on run workbench + WGT-AI-INS-002
  → Events: ai.payroll.anomaly_detected (notification if critical)
```

**Permissions:** `payroll.run.view` + `ai.access` + `payroll.report.view` for full detail  
**Forbidden:** Auto-lock, auto-approve, auto-adjust payslip lines

---

# AI Performance Coach

| Capability | Data sources | Output |
|------------|--------------|--------|
| **Performance trends** | `hr_performance_reviews`, cycles | Rating trend by dept |
| **Goal achievement analysis** | `hr_goals` | % complete, at-risk goals |
| **Skill gap analysis** | Skills vs job position KRAs | Gap heatmap |
| **Promotion readiness** | Performance + tenure + skills | Readiness score |
| **Training recommendations** | Skill gaps → programs | Course list |
| **Career path suggestions** | Ladder + performance | Advisory paths |

**Tools:** `hr.tool.performance_trends`, `hr.tool.skill_gap`, `hr.tool.promotion_readiness`  
**Screen:** `SCR-AI-HR-005`, `SCR-AI-HR-007`

---

# AI Training Advisor

| Capability | Tools | Output |
|------------|-------|--------|
| **Training recommendations** | `hr.tool.recommend_training` | Per employee/program |
| **Skill development plans** | `hr.tool.development_plan` | Multi-session plan draft |
| **Certification recommendations** | `hr.tool.cert_expiry_recommend` | Renew + upskill |
| **Learning path generation** | `hr.tool.learning_path` | Ordered program sequence |
| **Department training analysis** | `hr.tool.dept_training_participation` | Participation % |

**Apply path:** Suggestion → user enrolls via standard training API — no auto-enroll without approval.

---

# AI Asset Assistant

| Capability | Tools | Output |
|------------|-------|--------|
| **Asset utilization analysis** | `hr.tool.asset_utilization` | % in use vs idle |
| **Asset risk detection** | Overdue return, damage pattern | Flag list |
| **Asset replacement recommendations** | Age + warranty + damage | Replace priority |
| **Asset lifecycle forecasting** | Depreciation stage | Retirement timeline |

---

# AI Document Assistant

| Capability | Tools | Output |
|------------|-------|--------|
| **Document classification** | `hr.tool.classify_document` | Suggested doc type on upload |
| **Expiry detection** | `hr.tool.document_expiry_scan` | Already in compliance job — AI enriches |
| **Compliance tracking** | `hr.tool.document_compliance` | % mandatory docs verified |
| **Renewal recommendations** | `hr.tool.renewal_queue` | Prioritized renewal list |
| **Document search** | `hr.tool.document_search` | Semantic search on metadata + OCR text |

**Automation (future):** Auto-classify on upload — human confirms type if confidence < 0.85.

---

# AI Workforce Analytics

| Capability | Data sources | Audience |
|------------|--------------|----------|
| **Headcount analysis** | `hr_analytics_workforce_daily` | HR, Executive |
| **Department analysis** | Dept grain aggregates | HR, Dept heads |
| **Payroll cost analysis** | `payroll_analytics_cost_monthly` | Payroll, CFO |
| **Workforce growth analysis** | Joiners vs exits trend | Executive |
| **Skill distribution analysis** | `hr_employee_skills` | HR, Training |
| **Capacity planning** | Headcount plan vs actual + forecast | CHRO, HR Director |

**Tool:** `hr.tool.workforce_analytics` · **Report:** `RPT-HR-EXE-*` per [HR_REPORTING_ARCHITECTURE.md](./HR_REPORTING_ARCHITECTURE.md)

---

# AI Prediction Engine

**Phase:** P2–P3 batch scoring + on-demand read — models trained offline, served via read models.

| Prediction | Features (conceptual) | Output entity | Refresh |
|------------|----------------------|---------------|---------|
| **Attrition prediction** | Tenure, attendance, leave, review, promotion history | `hr_ai_attrition_signals` | Daily |
| **Promotion prediction** | Performance, skills, tenure, goals | `hr_ai_promotion_scores` | Per cycle |
| **Performance prediction** | Historical ratings, attendance, training | `hr_ai_performance_signals` | Per cycle |
| **Attendance risk prediction** | Absence streaks, late patterns | `hr_ai_attendance_insights` | Daily |
| **Leave risk prediction** | Bridge patterns, utilization | `hr_ai_leave_signals` | Weekly |
| **Training needs prediction** | Skill gap vs role | `hr_ai_training_needs` | Monthly |
| **Workforce demand prediction** | Growth plan, attrition forecast, seasonality | `hr_ai_workforce_forecast` | Monthly |

```text
OLTP + analytics → Feature pipeline (batch) → Model inference → ai_* read tables → Tools read only
```

**No auto-action** on predictions — always surfaced as insights with confidence.

---

# AI Recommendation Engine

| Recommendation type | Algorithm (conceptual) | Apply mechanism |
|----------------------|------------------------|-----------------|
| **Promotion suggestions** | Weighted score: performance, tenure, skills | HR opens promotion workflow |
| **Salary revision suggestions** | Compa-ratio + market band (future) | Draft revision → approval |
| **Training suggestions** | Skill gap → program match | Enroll action |
| **Hiring suggestions** | Headcount gap vs plan | Create requisition draft |
| **Team structure suggestions** | Span of control analysis | Org chart proposal — HR edits |
| **Shift optimization suggestions** | Coverage vs demand | Shift assignment draft |

**Storage:** `hr_ai_recommendations` (proposal_id, type, entity_refs, score, status: pending|applied|dismissed)

---

# AI Compliance Assistant

| Domain | Checks | Output |
|--------|--------|--------|
| **Attendance compliance** | Muster roll completeness, policy violations | Compliance score |
| **Payroll compliance** | Statutory components, lock checklist | Pre-lock report |
| **Document compliance** | Mandatory docs per employment type | Missing doc list |
| **Training compliance** | Mandatory program completion | Non-compliant employees |
| **Policy compliance** | RAG over policy vs practices | Gap narrative |
| **Audit preparation** | Bundle activity + approvals + exports | Audit pack manifest |

**Tool:** `hr.tool.compliance_assistant` · **Report:** `RPT-HR-CMP-*`, `RPT-HR-RPT-040`

---

# AI Insight Generation

### Cadence architecture

| Cadence | Generator | Recipients | Delivery |
|---------|-----------|------------|----------|
| **Daily insights** | Scheduled job 06:00 tenant TZ | HR Manager, Payroll | In-app digest + optional email |
| **Weekly insights** | Monday AM | HR Director, managers | Email digest |
| **Monthly insights** | 1st of month | Executive, CHRO | PDF + dashboard |
| **Executive insights** | Monthly + on-demand | C-suite | `/hr/executive` widgets |
| **Department insights** | Weekly | Dept managers | Scoped to dept |
| **Company insights** | Monthly | Company Admin | Workforce summary |

### Insight record schema (conceptual)

| Field | Description |
|-------|-------------|
| `insight_id` | UUID |
| `cadence` | daily, weekly, monthly |
| `scope` | company, department, executive |
| `category` | attendance, payroll, attrition, … |
| `title` | Short headline |
| `body` | Narrative |
| `evidence_refs[]` | KPI IDs, report keys |
| `confidence` | 0–1 |
| `generated_at` | Timestamp |

---

# AI Dashboard Widgets

Per [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) — widgets consume AI read APIs.

| Widget ID | Title | Data source | Roles |
|-----------|-------|-------------|-------|
| WGT-AI-INS-001 | Attendance insights | `hr_ai_attendance_insights` | HR Manager |
| WGT-AI-INS-002 | Payroll insights | `payroll_ai_cost_snapshots` | Payroll Manager |
| WGT-AI-INS-003 | Attrition risk | `hr_ai_attrition_signals` | HR Executive |
| WGT-AI-INS-004 | Promotion opportunities | `hr_ai_promotion_scores` | HR Manager |
| WGT-AI-INS-005 | Training recommendations | `hr_ai_training_needs` | HR, Training |
| WGT-AI-INS-006 | Compliance risks | Compliance assistant output | HR, Compliance |
| WGT-AI-INS-007 | Workforce analytics | `hr_ai_workforce_metrics` | Executive |

**Refresh:** Batch daily + manual "Refresh insights" button (rate limited).

---

# AI Automation Opportunities

| Automation | Phase | Trigger | Action | Human approval |
|------------|-------|---------|--------|----------------|
| **Auto attendance validation** | P3 | Daily finalize prep | Flag anomalies only | HR reviews flags |
| **Auto leave categorization** | P3 | Leave request draft | Suggest leave type | Employee confirms |
| **Auto document classification** | P2 | Document upload | Suggest type | HR confirms if low confidence |
| **Auto training assignment** | P3 | Skill gap detected | Propose enrollment | Manager approves |
| **Auto compliance alerts** | P1 | Expiry, mandatory training | Notification only | None — alert only |
| **Auto report generation** | P2 | Schedule | Report + email | Pre-approved schedule |

**Rule:** No automation may **approve**, **lock payroll**, or **terminate** without explicit human action per [AI_AUDIT_AND_APPROVAL.md](../ai/AI_AUDIT_AND_APPROVAL.md).

---

# Human In The Loop Controls

| Category | Allowed | Not allowed |
|----------|---------|-------------|
| **View** | All data user can read via APIs | Cross-scope PII |
| **Suggest** | Rankings, flags, narratives, drafts | Binding decisions |
| **Draft** | Job descriptions, emails, revision proposals | Submitted records without user click |
| **Propose write** | Create draft leave, draft revision | Skip workflow |
| **Approve** | — | **All approvals blocked** |
| **Finalize** | — | **Payroll lock, post, terminate, bank export** |

### Approval boundaries

| Action | Required human |
|--------|----------------|
| Leave approve/reject | Manager / HR in Approval Engine |
| Payroll run approve/lock | Payroll Manager |
| Salary revision effective | HR + Payroll approval chain |
| Termination | HR + workflow |
| Promotion | HR / management |
| Loan disbursement | Payroll + approval |
| AI "Apply" on high-risk proposal | User click + normal workflow |

---

# AI Data Sources

| Source class | Entities / APIs | Access |
|--------------|-----------------|--------|
| **Employees** | `hr_employees`, sub-entities, Core contacts | Service API + field filter |
| **Attendance** | Daily records, logs, corrections | Analytics + OLTP read |
| **Leave** | Requests, balances, policies | Service API |
| **Payroll** | Runs, payslips, lines, structures | Service API — masked fields |
| **Performance** | Reviews, goals, KPIs | Service API |
| **Training** | Programs, participants, certs | Service API |
| **Assets** | Inventory, assignments | Service API |
| **Documents** | Metadata, OCR text — not raw files to model if restricted | Media API + policy |
| **Activity logs** | Core activity API | Audit context |
| **Reports** | Report API results | Same as user report permission |
| **Analytics** | `hr_analytics_*`, `payroll_analytics_*` | Preferred for aggregates |
| **AI read models** | `hr_ai_*`, `payroll_ai_*` | Batch scores |

**Forbidden sources:** Direct SQL, cross-tenant data, other companies' rows, posted payslip mutation APIs as write tools.

---

# AI Security Model

| Control | Implementation |
|---------|----------------|
| **Role based AI access** | `ai.access` + role tool manifest |
| **Sensitive payroll restrictions** | Tools require `payroll.report.view` or `hr.sensitive.view`; amounts aggregated for managers |
| **Sensitive HR restrictions** | Bank, disciplinary — no ESS tools |
| **Audit logging** | `ai_audit_logs` every query/response |
| **AI action tracking** | `activity_ai_actions` on Apply |
| **Session binding** | AI context uses same `user_id` — no impersonation |
| **Export via AI** | Same export permissions + audit as manual export |

### Permission keys (HR context)

| Key | Purpose |
|-----|---------|
| `ai.access` | Use HR AI features |
| `ai.chat` | Global chat with HR tools |
| `ai.tool.execute` | Execute read/suggest tools |
| `ai.tool.apply` | Apply draft proposals |
| `ai.audit.view` | AI history screen |
| `ai.insights.executive` | Executive-level predictions |

Per [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) — dual gate: `ai.tool.execute` AND domain permission.

---

# AI Explainability (detail)

### UI components

| Component | Location |
|-----------|----------|
| **Insight card** | Dashboard widgets, `/hr/ai/insights` |
| **Chat citation** | Inline `[1]` links to records/reports |
| **Apply preview** | Diff before proposal commit |
| **Audit detail** | `/hr/ai/history` — full reasoning stored |

### Confidence thresholds

| Level | Range | UI treatment |
|-------|-------|--------------|
| High | ≥ 0.85 | Solid badge |
| Medium | 0.60–0.84 | "Review recommended" |
| Low | < 0.60 | "Advisory only" + hide auto-apply |

---

# AI Audit Architecture

| Event | Logged fields | Storage |
|-------|---------------|---------|
| **AI query** | prompt (redacted), user, company, tools called | `ai_audit_logs` |
| **AI response** | response text, tokens, latency, model | `ai_audit_logs` |
| **AI recommendation** | recommendation_id, type, score, evidence | `ai_audit_logs` + `hr_ai_recommendations` |
| **User action** | apply, dismiss, feedback | `activity_ai_actions` |
| **Approval outcome** | if proposal entered workflow | `activity_approvals` |
| **Feedback** | thumbs up/down, correction | `ai_feedback` |

### Audit queries (admin)

`GET /api/v1/ai/os/audit?module=hr&date_from=...`  
**Screen:** `SCR-AI-HR-009` · `/hr/ai/history`

---

# Future Chief AI Agent Integration

Per [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md) § Chief AI Agent.

### Delegation examples

| User goal (cross-module) | Chief Agent plan |
|--------------------------|------------------|
| "Why did workforce cost rise vs revenue?" | Workforce Agent (payroll cost) + Finance Agent (revenue) |
| "Prepare board pack" | Workforce + Analytics agents → HR reports |
| "Onboard new hire from accepted offer" | Workforce Agent (hire) + IT notification |
| "Can we afford 10 engineers in Q3?" | Workforce forecast + Finance budget |
| "Summarize HR compliance status" | Workforce compliance assistant |

### Cross-module AI matrix

| Module | HR AI integration |
|--------|-------------------|
| **Accounting AI** | Payroll journal anomalies, cost vs GL |
| **CRM AI** | Hire → CRM contact sync confirmation |
| **Inventory AI** | Asset vs stock reconciliation |
| **Manufacturing AI** | OT hours vs production output |
| **Executive AI** | Workforce KPIs in executive briefing |
| **Chief AI Agent** | Routes `workforce_*` intents to Workforce Agent |

### Registration with AI OS

| Registry item | Value |
|---------------|-------|
| `agent_id` | `workforce_agent` |
| `tools[]` | `hr.tool.*`, `payroll.tool.*`, `ess.tool.*` |
| `context_adapter` | `HrPayrollContextAdapter` |
| `knowledge_namespaces` | `hr_policies`, `hr_faq`, `employment_handbook` |
| `enabled_flag` | Per company in Settings → AI → Agents |

---

# Tool Registry (HR & Payroll)

Conceptual tool catalog — maps to [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) services.

| Tool ID | Risk | Service | Permission |
|---------|------|---------|------------|
| `hr.tool.employee_search` | Low | HrEmployeeService.search | `hr.employee.view` |
| `hr.tool.attendance_daily` | Low | AttendanceService.dailyRegister | `hr.attendance.view` |
| `hr.tool.leave_today` | Low | LeaveService.onLeaveToday | `hr.leave.view` |
| `hr.tool.document_expiry` | Low | DocumentService.expiring | `hr.document.view` |
| `hr.tool.probation_due` | Low | EmployeeService.probationDue | `hr.employee.view` |
| `hr.tool.attendance_analytics` | Low | AnalyticsService.attendance | `hr.report.attendance.view` |
| `hr.tool.leave_analytics` | Low | AnalyticsService.leave | `hr.report.leave.view` |
| `payroll.tool.validate_run` | Low | PayrollRunService.validate | `payroll.run.view` |
| `payroll.tool.anomaly_scan` | Low | PayrollAuditService.anomalies | `payroll.report.view` |
| `hr.tool.suggest_promotion` | Medium | RecommendationService.promotion | `hr.promotion.recommend` |
| `payroll.tool.draft_salary_revision` | High | SalaryService.proposeRevision | `payroll.salary_revision.manage` |
| `hr.tool.draft_job_description` | Medium | RecruitmentService.draftJD | `hr.requisition.manage` |
| `hr.tool.attrition_insights` | Medium | AiReadService.attrition | `hr.report.employee.view` |
| `ess.tool.my_payslips` | Low | EssService.payslips | `ess.payslip.view` |

**Risk tiers** per [AI_AUDIT_AND_APPROVAL.md](../ai/AI_AUDIT_AND_APPROVAL.md): Low = read; Medium = draft/suggest; High/Critical = workflow + approval.

---

# Context Adapter Architecture

**Class (conceptual):** `HrPayrollContextAdapter` implements AI OS context interface.

| Context slice | Source |
|---------------|--------|
| `session` | Auth middleware — company, branch, roles, employee_id |
| `record` | Current route — e.g. `hr_employee`, `payroll_run` |
| `related` | Smart aggregates — team size, open leave count |
| `analytics` | KPI cache for current dashboard |
| `permissions` | Effective capability flags |
| `rag_chunks` | Policy FAQ, handbook — company scoped |

**Trim order when over token budget:** RAG chunks → related → analytics → record snapshot (never drop permissions).

---

# UI Surfaces

| Screen ID | Route | Purpose |
|-----------|-------|---------|
| SCR-AI-HR-001 | `/hr/ai` | AI hub dashboard |
| SCR-AI-HR-002 | `/hr/ai/insights` | Insight library |
| SCR-AI-HR-003 | `/hr/ai/attendance` | Attendance analyst |
| SCR-AI-HR-004 | `/hr/ai/payroll` | Payroll auditor |
| SCR-AI-HR-005 | `/hr/ai/performance` | Performance coach |
| SCR-AI-HR-006 | `/hr/ai/attrition` | Attrition prediction |
| SCR-AI-HR-007 | `/hr/ai/promotions` | Promotion suggestions |
| SCR-AI-HR-008 | Global `Ctrl+J` | Chief Agent chat |
| SCR-AI-HR-009 | `/hr/ai/history` | AI audit history |

Embedded: AI insight widgets on `/hr`, `/payroll`, `/hr/executive` dashboards.

---

# API Architecture (AI)

| Method | Path (conceptual) | Purpose |
|--------|-------------------|---------|
| POST | `/api/v1/ai/os/chat` | Chief Agent — may delegate HR |
| POST | `/api/v1/ai/os/agents/workforce/chat` | Direct workforce agent |
| GET | `/api/v1/hr/ai/insights` | List insights |
| GET | `/api/v1/hr/ai/insights/{category}` | Category insights |
| GET | `/api/v1/hr/ai/recommendations` | Pending recommendations |
| POST | `/api/v1/hr/ai/recommendations/{id}/apply` | Apply with audit |
| POST | `/api/v1/hr/ai/recommendations/{id}/dismiss` | Dismiss with feedback |
| GET | `/api/v1/hr/ai/history` | User AI history |
| GET | `/api/v1/ai/os/audit` | Admin audit (filter module=hr) |

---

# Phase Roadmap

| Phase | Capabilities |
|-------|--------------|
| **P1** | Chat assistant (read), compliance alerts, dashboard insight widgets, NL report triggers |
| **P2** | Payroll auditor, attrition/promotion scores, recruitment drafting, document classify suggest |
| **P3** | Leave abuse forecast, workforce demand, interview summary, shift optimization, guarded automation |
| **P4** | Autonomous multi-step agent (onboarding orchestration) with human checkpoints |

---

# Cross-Reference Index

| Document | Relationship |
|----------|--------------|
| [AI_OS_ARCHITECTURE.md](../ai/AI_OS_ARCHITECTURE.md) | Platform AI kernel, Chief Agent |
| [AI_CONTEXT_ENGINE.md](../ai/AI_CONTEXT_ENGINE.md) | Context bundle assembly |
| [AI_AUDIT_AND_APPROVAL.md](../ai/AI_AUDIT_AND_APPROVAL.md) | Risk tiers, audit schema |
| [HR_API_ARCHITECTURE.md](./HR_API_ARCHITECTURE.md) | Tool → service mapping |
| [HR_PERMISSION_MATRIX.md](./HR_PERMISSION_MATRIX.md) | AI permission dual-gate |
| [HR_DASHBOARD_ARCHITECTURE.md](./HR_DASHBOARD_ARCHITECTURE.md) | AI widgets |
| [HR_REPORTING_ARCHITECTURE.md](./HR_REPORTING_ARCHITECTURE.md) | AI reports |
| [HR_DATABASE_ERD_PLANNING.md](./HR_DATABASE_ERD_PLANNING.md) | AI read model entities |
| [HR_NOTIFICATION_ARCHITECTURE.md](./HR_NOTIFICATION_ARCHITECTURE.md) | `ai.hr.*` notifications |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll |
| **Owner** | Platform / HR domain + AI OS |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Agent ID** | `workforce_agent` |

---

**AgainERP HR & Payroll AI Assistant Architecture** — governed, explainable, human-in-the-loop intelligence. No prompts. No code.
