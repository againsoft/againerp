# HR & Payroll — AI Assistant UI Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** HR & Payroll — AI Experience (reference implementation for all AgainERP modules)  
> **Document Type:** AI Assistant UI / Wireframe Architecture Blueprint  
> **Phase:** Documentation First · Planning Only  
> **Parent:** [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) · [HR_UI_UX_BLUEPRINT.md](../HR_UI_UX_BLUEPRINT.md) · [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) · [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) · [uiux/ESS_PORTAL_UI_ARCHITECTURE.md](./ESS_PORTAL_UI_ARCHITECTURE.md) · [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) · [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md)  
> **Governance:** [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [ai-assistant-ui.md](../../../04-uiux/standards/ai-assistant-ui.md) · [UI_UX_DESIGN_STANDARDS.md](../../../04-uiux/standards/UI_UX_DESIGN_STANDARDS.md) · [PROJECT_COMMON_RULES.md](../../../00-foundation/PROJECT_COMMON_RULES.md)

**No visual mockups. No component code.**  
Defines **complete AI Assistant User Experience Architecture** for AgainERP HR & Payroll — and establishes the **canonical AI UX framework** all future modules should adopt. Foundation for AI copilot, workspace, insights, recommendations, analytics, auditors, and future autonomous agents.

**Backend reference:** [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) (tools, agents, governance)  
**Platform reference:** [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) (Chief Agent, providers, audit)

**Agent ID:** `workforce_agent` · **Sub-agents:** `workforce_ess_agent` · `workforce_payroll_auditor_agent` · `workforce_recruitment_agent`  
**UI hub:** `/hr/ai` · **Global panel:** `Ctrl+J` / `Ctrl+I` · **API:** `/api/v1/hr/ai/` + `/api/v1/ai/os/`

---

## Executive Summary

| Principle | UI rule |
|-----------|---------|
| **Embedded, not bolted on** | AI surfaces on every HR screen — not a separate product |
| **Chief Agent first** | Global panel delegates to `workforce_agent` |
| **Human in the loop** | Suggest → Review → Apply — no silent writes |
| **Explain everything** | Why · How · Sources · Confidence on every output |
| **Permission inheritance** | UI never shows data or actions user cannot perform |
| **Payroll = auditor mode** | Flags only — never auto-lock/approve/post |
| **Module template** | `AI-UX-*` patterns reusable by CRM, Inventory, etc. |

**Screen namespace:** `SCR-AI-HR-*` · **Widgets:** `WGT-AI-INS-*` · **Components:** `CMP-AI-*`

---

# AI Experience Philosophy

### Core belief

> **AI in AgainERP is a governed copilot — it makes every workforce decision faster to reach, easier to defend, and impossible to hide from audit.**

ESS is the employee's daily workspace; AI in ESS is a **personal assistant**. HR admin AI is an **operations copilot**. Executive AI is a **strategic analyst**. Same platform patterns — different scope and risk tier.

| User | AI posture | Primary surface |
|------|------------|-----------------|
| **Employee** | Personal assistant — self data | ESS AI panel |
| **Manager** | Team advisor — no peer salary | ESS + sidebar |
| **HR Executive** | Workforce copilot | Full workspace `/hr/ai` |
| **Payroll Manager** | Auditor + analyst | Payroll AI + workbench |
| **Executive** | Strategic briefings | Executive dashboard Zone G |

### AI is platform service, not HR feature

Per [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md):

```text
User → Chief AI Agent → workforce_agent → Tools → HR/Payroll APIs → Engines
```

HR owns **domain UI surfaces, context adapters, and widget placement**. AI OS owns orchestration, providers, audit, and delegation.

### Reference implementation mandate

This document is the **first full-domain AI UX spec**. Future modules adopt:

| Pattern ID | Reuse |
|------------|-------|
| `AI-UX-ENTRY-*` | Entry points (panel, palette, widgets) |
| `AI-UX-WORKSPACE-*` | Full-screen workspace zones |
| `AI-UX-CARD-INSIGHT` | Insight card anatomy |
| `AI-UX-CARD-RECOMMEND` | Recommendation card anatomy |
| `AI-UX-EXPLAIN-*` | Explainability block |
| `AI-UX-ACTION-*` | Proposed action preview |

---

# Human + AI Collaboration Strategy

### Collaboration modes

| Mode | User role | AI role | UI pattern |
|------|-----------|---------|------------|
| **Query** | Asks question | Retrieves + narrates | Chat response + citations |
| **Insight** | Opens dashboard | Pre-computed batch | Insight card |
| **Suggest** | Reviews ranking | Recommends | Recommendation card |
| **Draft** | Edits + submits | Pre-fills form | Draft preview → user submit |
| **Propose** | Clicks Apply | Creates draft record | Proposal card + diff |
| **Audit** | Confirms flags | Detects anomalies | Auditor issue list |
| **Automate (future)** | Approves rule | Runs on schedule | Automation center |

### Default interaction flow

```text
1. User invokes AI (entry point + context bundle)
2. Intent classified: read | suggest | draft | propose_write
3. Tools execute within RBAC
4. Response rendered with explainability block
5. If write proposed → preview → Apply → workflow/approval if required
6. activity_ai_actions + ai_audit_logs
```

### Human authority boundaries (UI enforcement)

| AI cannot | UI behavior |
|-----------|-------------|
| Approve leave/payroll | No Approve button on AI cards |
| Lock payroll | Auditor flags only |
| Terminate employee | Suggest workflow — user initiates |
| Auto-enroll training | Navigate to enroll — user confirms |
| Export bulk PII | Same export gate as manual |

---

# AI Workspace Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Context follows user** | Module · record · period in header |
| 2 | **Progressive depth** | Sidebar → workspace → detail drill |
| 3 | **Persistent history** | Session + saved queries |
| 4 | **Multi-panel clarity** | Chat left/center · insights right |
| 5 | **Action separation** | Actions panel distinct from chat |
| 6 | **Keyboard first** | `Ctrl+J` panel · `Ctrl+K` commands |
| 7 | **Mobile parity** | Full-screen workspace on phone |
| 8 | **Cost transparency** | Token estimate on heavy tasks |
| 9 | **Cancel anytime** | Stop generation button |
| 10 | **Graceful degradation** | "AI unavailable" — manual paths remain |

### Workspace hierarchy

```text
L1 — Global AI Panel (overlay)           SCR-AI-HR-008
L2 — Contextual AI strip (record/screen) Zone F / drawer tab
L3 — Module AI hub (/hr/ai)              SCR-AI-HR-001
L4 — Category centers (/hr/ai/*)         SCR-AI-HR-002–007
L5 — Full AI Workspace (enterprise)      AI-UX-WORKSPACE-001
```

---

# Explainable AI Principles

Every non-trivial AI output includes an **explainability block** (`CMP-AI-EXPLAIN-001`):

| Field | Required | UI placement |
|-------|----------|--------------|
| **Why** | Yes | Headline under title |
| **How** | Yes | Expandable "How was this calculated?" |
| **Data sources** | Yes | Linked list · report IDs · table names |
| **Confidence** | Yes | Badge: high / medium / low or 0–1 |
| **Recommended actions** | Optional | CTA buttons |
| **Model version** | Yes | Footer metadata |
| **As of** | Yes | Data snapshot timestamp |

### Confidence UI thresholds

| Level | Range | Treatment |
|-------|-------|-----------|
| **High** | ≥ 0.85 | Solid badge · Apply enabled if policy allows |
| **Medium** | 0.60–0.84 | "Review recommended" · Apply requires confirm |
| **Low** | < 0.60 | "Advisory only" · no auto-apply |

---

# AI Trust & Transparency Principles

| Principle | UI manifestation |
|-----------|-------------------|
| **No hidden automation** | Automation center shows all AI-triggered rules |
| **Dismissal is valid** | Dismiss logged — not failure |
| **Attrition dignity** | Risk scores HR-only by default |
| **Payroll immutability** | Locked run — read-only AI tools |
| **Bias awareness** | Model disclaimer on promotion/attrition |
| **Opt-out** | Tenant can disable AI per company |
| **Audit drill-down** | Every insight links to `/hr/ai/history` |
| **Feedback loop** | Helpful / Not helpful on every card |

---

# AI Experience Framework

Define **seven AI roles** — composable modes, not separate products.

| Role | Purpose | Risk tier | HR example | UI surface |
|------|---------|-----------|------------|------------|
| **Assistant** | Answer questions, navigate | Low | "Who is on leave today?" | Chat panel |
| **Analyst** | Patterns, trends, narratives | Low | Attendance heatmap story | Analytics center |
| **Advisor** | Recommendations with evidence | Medium | Training for skill gap | Recommendation center |
| **Auditor** | Validation, anomaly flags | Low–Medium | Duplicate payslip | Payroll workbench |
| **Planner** | Scenarios, capacity | Medium | Headcount forecast | Executive workspace |
| **Predictor** | Forward scores | Medium | Attrition risk ranking | Prediction center |
| **Future Agent** | Multi-step plans + gates | High | Onboarding orchestration | Task queue (AI OS) |

**Role indicator:** Chip on response header · `Assistant` · `Auditor` · etc.

---

# AI Entry Points

Design **all AI access points** — consistent across AgainERP.

| Entry point | Location | Screen / ID | Permission | Context passed |
|-------------|----------|-------------|------------|----------------|
| **Global AI button** | Top bar ✨ · FAB (mobile) | `SCR-AI-HR-008` | `ai.chat` | Route · record · company |
| **Sidebar AI menu** | HR sidebar `NAV-HR-AI-000` | `/hr/ai` | `ai.access` | Module=HR |
| **Dashboard AI widgets** | Zone G all dashboards | `WGT-AI-INS-*` | `ai.access` + domain | Dashboard template |
| **Employee profile AI panel** | Zone F · AI Actions tab | Profile drawer | `ai.access` + entity | `employee_id` |
| **Attendance AI panel** | Attendance dashboard Zone G | `SCR-HR-ATT-DSH` | `ai.access` + `hr.attendance.view` | Period · branch |
| **Leave AI panel** | Leave dashboard Zone G | `SCR-HR-LEV-DSH` | `ai.access` + `hr.leave.view` | Period |
| **Payroll AI panel** | Payroll dashboard + workbench | `SCR-PAY-RUN-003` step 7 | `ai.access` + `payroll.run.view` | `run_id` |
| **ESS AI panel** | ESS dashboard Zone F · More | ESS shell | `ai.chat` + `ess.*` | Self scope only |
| **Command palette** | `Ctrl+K` → "Ask AI" | Palette overlay | `ai.chat` | Current screen |
| **Record chatter** | "Ask about this record" | Inline | `ai.chat` | Entity ref |
| **Field AI toolbar** | Inline on forms | `CMP-AI-FIELD-001` | Domain edit perm | Field + entity |

### Entry point wireframe — global button behavior

```text
[✨] click / Ctrl+J
  → Opens right panel (desktop 400px) or full-screen (mobile)
  → Context chip: "HR · Employees · Jane Akter"
  → Suggested prompts based on screen
  → Chief Agent routes to workforce_agent when HR intent detected
```

---

# AI Workspace Architecture

*Critical section* — enterprise AI experience (`AI-UX-WORKSPACE-001`).

### Panel layout (full workspace)

```text
┌──────────┬────────────────────────────────────┬─────────────────┐
│ LEFT NAV │ CONVERSATION AREA                  │ RIGHT RAIL      │
│          │                                    │ (tabs)          │
│ Hub      │ Chat history                       │ [Insights]      │
│ Insights │ Questions / responses              │ [Recommend]     │
│ Recommend│ References · suggested actions       │ [Actions]       │
│ Analytics│                                    │ [History]       │
│ Auditor  │                                    │                 │
│ Predict  │                                    │                 │
│ Automate │                                    │                 │
│ Reports  │                                    │                 │
│ History  │                                    │                 │
│ Settings │                                    │                 │
├──────────┴────────────────────────────────────┴─────────────────┤
│ INPUT: [Ask anything…]  [🎤] [📎] [Send]                        │
└─────────────────────────────────────────────────────────────────┘
```

### Area definitions

| Area | Purpose | Content |
|------|---------|---------|
| **Left navigation** | Mode switching | Hub · category centers · history |
| **Conversation area** | Primary chat | Thread · citations · action chips |
| **Insight area** | Batch + live insights | `WGT-AI-INS-*` cards |
| **Recommendation area** | Ranked suggestions | Promotion · training · policy |
| **Action area** | Proposed operations | Generate report · draft · workflow |
| **History area** | Past queries + outcomes | Searchable log |

**Route:** `/hr/ai` (hub) · `/hr/ai/workspace` (future full layout) · **Screen:** `SCR-AI-HR-001`

---

# AI Sidebar Panel

**Quick access AI** — `SCR-AI-HR-008` · `CMP-AI-PANEL-001`

Default for daily use — does not require full workspace navigation.

```text
┌─────────────────────────────────────┐
│ ✨ Workforce Assistant      [─][×] │
├─────────────────────────────────────┤
│ Context: Payroll · Run PR-2026-06   │
├─────────────────────────────────────┤
│ [Conversation thread]               │
│  User: Show absent employees        │
│  AI: 12 absent today [table cards]  │
│       Sources: hr_attendance [1]    │
├─────────────────────────────────────┤
│ Suggested prompts:                  │
│  · Show pending approvals           │
│  · Generate attendance report       │
│  · Payroll summary                  │
│  · Promotion recommendations        │
├─────────────────────────────────────┤
│ [Ask anything…]            [Send]   │
└─────────────────────────────────────┘
```

### Example prompts by context

| Context | Prompt chips |
|---------|--------------|
| **HR dashboard** | Absent today · Pending leave · Headcount summary |
| **Employee profile** | Promotion readiness · Risk indicators · Employee summary |
| **Payroll run** | Audit payroll · Show anomalies · Cost analysis |
| **ESS** | My leave balance · Latest payslip · My training |
| **Manager** | Who is absent · Pending team leave · Training gaps |

| Viewport | Panel |
|----------|-------|
| Desktop | Right drawer 400px · overlays utility zone |
| Tablet | 50% width sheet |
| Mobile | Full-screen sheet · back to app |

---

# AI Full Screen Workspace

**Enterprise AI experience** — `AI-UX-WORKSPACE-001` · Route: `/hr/ai/workspace` (future) or expanded `/hr/ai`

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — CONTEXT HEADER                                                     │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ ZONE B — CONVERSATION AREA (~55%)            │ ZONE C — INSIGHTS (~45%)     │
│                                              │ (tab: Recommendations)       │
├──────────────────────────────────────────────┼──────────────────────────────┤
│                                              │ ZONE D — RECOMMENDATIONS     │
│                                              │ (or stacked tab)             │
├──────────────────────────────────────────────┴──────────────────────────────┤
│ ZONE E — ACTIONS PANEL (collapsible footer)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE F — HISTORY PANEL (drawer or bottom tab)                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ZONE A — Context Header

| Chip | Example |
|------|---------|
| **Current module** | HR & Payroll |
| **Current employee** | Jane Akter · EMP-0042 (when on profile) |
| **Current payroll** | PR-2026-06-001 (when on run) |
| **Current department** | Engineering |
| **Current branch** | Dhaka HQ |
| **Scope badge** | Self · Team · Company |

**Actions:** Clear context · Pin context · Switch agent mode (Assistant / Auditor)

---

## ZONE B — Conversation Area

| Element | Spec |
|---------|------|
| **Chat history** | Scrollable · session persisted |
| **Questions** | User bubbles · markdown |
| **Responses** | AI bubbles · structured cards embedded |
| **References** | `[1]` citation links → record/report |
| **Suggested actions** | Inline chips below response |

**Streaming:** Typing indicator · cancel button · error retry

---

## ZONE C — Insights Panel

| Category | Route | Screen |
|----------|-------|--------|
| Attendance insights | `/hr/ai/attendance` | `SCR-AI-HR-003` |
| Payroll insights | `/hr/ai/payroll` | `SCR-AI-HR-004` |
| Performance insights | `/hr/ai/performance` | `SCR-AI-HR-005` |
| Training insights | Embedded in training AI | — |
| Compliance insights | Compliance assistant | `WGT-AI-INS-006` |

---

## ZONE D — Recommendations Panel

| Type | Screen |
|------|--------|
| Promotion suggestions | `SCR-AI-HR-007` |
| Training suggestions | Widget + center |
| Policy suggestions | RAG-based |
| Cost optimization | Payroll AI |
| Workforce planning | Executive planner |

---

## ZONE E — Actions Panel

| Action type | Example | Gate |
|-------------|---------|------|
| **Generate report** | Monthly HR report | `hr.report.*` |
| **Create draft** | Salary revision draft | `ai.tool.apply` + domain |
| **Prepare summary** | Executive brief | `ai.insights.executive` |
| **Analyze data** | Attendance deep dive | `ai.tool.execute` |
| **Create recommendation** | Promotion proposal | HR workflow |
| **Launch workflow** | Onboarding checklist | User confirm |

Each action shows preview before execution.

---

## ZONE F — History Panel

| Section | Content |
|---------|---------|
| **Previous queries** | Searchable chat log |
| **Saved insights** | Bookmarked cards |
| **Generated reports** | Links to report runs |
| **AI recommendations** | Applied / dismissed status |

**Route:** `/hr/ai/history` · **Screen:** `SCR-AI-HR-009`

---

# AI Command Center

*Most important feature* — natural language command surface.

**Entry:** Command palette `Ctrl+K` → AI commands · Chat input with `/` prefix · voice (future)

### Example commands

| Command | Intent | Tool / route |
|---------|--------|--------------|
| Show employees absent today | Query | `hr.tool.team_attendance_summary` |
| Show pending leave requests | Query | `core.tool.approvals_pending` |
| Generate payroll summary | Analyze | `GET /payroll/analytics/cost` |
| Find employees due for promotion | Recommend | `hr.tool.promotion_readiness` |
| Show attendance anomalies | Audit | `hr.tool.attendance_patterns` |
| Generate monthly HR report | Action | Report generator |

### Command UX elements

| Element | Behavior |
|---------|----------|
| **Natural language commands** | Free text + intent classification |
| **Command suggestions** | Chips based on role + screen |
| **Command history** | Last 20 commands · searchable |
| **Recent commands** | Dropdown in input |

```text
┌─────────────────────────────────────────────────────────┐
│ ⌘K  Ask AI or run a command…                            │
├─────────────────────────────────────────────────────────┤
│ Recent                                                  │
│  → Show absent employees today                          │
│  → Pending payroll approvals                            │
├─────────────────────────────────────────────────────────┤
│ Suggested                                               │
│  → Generate attendance report                           │
│  → Audit current payroll run                            │
└─────────────────────────────────────────────────────────┘
```

---

# Contextual AI Experience

AI adapts to **screen context** — same panel, different tools and prompts.

### Employee Profile AI

**Surface:** Zone F · AI Actions tab · `?view={id}`

| Capability | Example prompt |
|------------|----------------|
| Promotion readiness | "Show promotion readiness for this employee" |
| Risk indicators | "Show risk indicators" (permission-gated) |
| Employee summary | "Generate employee summary" |
| Skill gaps | "What training is recommended?" |

**Context bundle:** `employee_id` · department · tenure · masked compensation flag

---

### Attendance AI

**Surface:** Attendance dashboard Zone G · `/hr/ai/attendance`

| Capability | Example |
|------------|---------|
| Show attendance issues | Flagged employees list |
| Detect late patterns | Day-of-week narrative |
| Analyze attendance risks | Ranked watch list |
| Device/sync issues | Ops narrative (HR admin) |

**Widget:** `WGT-AI-INS-001`

---

### Leave AI

**Surface:** Leave dashboard Zone G

| Capability | Example |
|------------|---------|
| Coverage gaps | Dept absence forecast |
| Utilization | Under/over utilizers |
| Pattern risks | Bridge holiday clusters (HR only) |
| Apply suggestions | ESS: best dates (advisory) |

**Widget:** `WGT-AI-INS-006` (leave risks)

---

### Payroll AI

**Surface:** Payroll dashboard · workbench step 7 · `/hr/ai/payroll`

| Capability | Example |
|------------|---------|
| Audit payroll | `workforce_payroll_auditor_agent` |
| Show anomalies | Z-score flags |
| Cost analysis | Period vs prior narrative |
| Compliance checks | Pre-lock checklist |

**Widget:** `WGT-AI-INS-002` · **Rule:** auditor mode — never auto-lock

---

### Performance AI

**Surface:** `/hr/ai/performance` · performance dashboard Zone G

| Capability | Example |
|------------|---------|
| Goal achievement | At-risk goals |
| Review cycle status | Completion % |
| Promotion readiness | Team ranking (HR) |
| Skill gaps | Heatmap narrative |

**Screen:** `SCR-AI-HR-005`

---

### Training AI

**Surface:** Training dashboard · employee profile tab

| Capability | Example |
|------------|---------|
| Mandatory gaps | Non-compliant list |
| Course recommendations | Per employee |
| Department participation | Completion % |

**Widget:** `WGT-AI-INS-005`

---

# AI Insight Center

**Route:** `/hr/ai/insights` · **Screen:** `SCR-AI-HR-002`

### Insight categories

| Category | Widget | Audience |
|----------|--------|----------|
| Attendance insights | `WGT-AI-INS-001` | HR Manager |
| Leave insights | `WGT-AI-INS-006` | HR Manager |
| Payroll insights | `WGT-AI-INS-002` | Payroll Manager |
| Performance insights | `SCR-AI-HR-005` | HR Manager |
| Training insights | `WGT-AI-INS-005` | HR, Training |
| Attrition insights | `WGT-AI-INS-003` | HR Executive |
| Compliance insights | `WGT-AI-INS-006` | Compliance |
| Workforce analytics | `WGT-AI-INS-007` | Executive |

### Insight card layout (`CMP-AI-CARD-INSIGHT-001`)

```text
┌─────────────────────────────────────────────────────────┐
│ [icon] Attendance anomaly in Engineering    [High] [0.87]│
│ 8 employees with Monday absence pattern                  │
│ Impact: Coverage risk next week                          │
├─────────────────────────────────────────────────────────┤
│ Why: Absent 8 of last 10 Mondays vs dept avg 2           │
│ Sources: hr_attendance · 3 records [View]                │
├─────────────────────────────────────────────────────────┤
│ [Review] [Dismiss] [Open report] [Ask follow-up]         │
└─────────────────────────────────────────────────────────┘
```

| Field | Required |
|-------|----------|
| Title | Yes |
| Summary (2 lines) | Yes |
| **Confidence score** | Yes |
| **Severity** | critical · high · medium · low |
| **Impact** | One-line business impact |
| **Suggested actions** | 1–3 CTAs |
| Explainability expand | Yes |

---

# AI Recommendation Center

**Route:** `/hr/ai/promotions` + filtered `/hr/ai/insights?type=recommendation`

### Recommendation types

| Type | Screen / report |
|------|-----------------|
| Promotion recommendations | `SCR-AI-HR-007` |
| Salary revision recommendations | Payroll + profile AI |
| Training recommendations | `WGT-AI-INS-005` |
| Hiring recommendations | Recruitment agent |
| Policy recommendations | Compliance assistant |

### Recommendation card (`CMP-AI-CARD-RECOMMEND-001`)

```text
┌─────────────────────────────────────────────────────────┐
│ 📈 Promotion Recommendation              [Pending] [0.79] │
│ Jane Akter — Senior Engineer readiness                   │
├─────────────────────────────────────────────────────────┤
│ Reasoning: Exceeds goals 2 cycles; skill matrix 92%    │
│ Evidence: [Review 2025-Q4] [Goals 94%] [Tenure 3.2y]   │
├─────────────────────────────────────────────────────────┤
│ [Dismiss] [View profile] [Start promotion workflow]      │
└─────────────────────────────────────────────────────────┘
```

| Field | Required |
|-------|----------|
| **Reasoning** | Yes |
| **Evidence** | Linked records |
| **Confidence** | Yes |
| **Actions** | Navigate · workflow · dismiss |

**Storage status pills:** `pending` · `applied` · `dismissed`

---

# AI Analytics Center

**Route:** `/hr/ai` analytics tab · embedded charts in workspace

| Analysis | Visualization |
|----------|---------------|
| Workforce analytics | Headcount trend line |
| Attendance analytics | Heatmap · dept × day |
| Payroll analytics | Cost stacked bar |
| Performance analytics | Rating distribution |
| Training analytics | Completion funnel |

### Visualization types

| Type | Use |
|------|-----|
| **Line charts** | Trends · forecasts |
| **Bar charts** | Dept comparisons |
| **Heatmaps** | Attendance · skills |
| **Trend cards** | KPI + delta |
| **Predictions** | Band chart with confidence interval |

**Rule:** Charts from tool results — LLM narrates, does not invent numbers.

---

# AI Auditor Experience

*Critical for payroll and compliance* — `workforce_payroll_auditor_agent`

### Auditor modes

| Auditor | Surface | Agent |
|---------|---------|-------|
| **Payroll auditor** | Run workbench · `/hr/ai/payroll` | `workforce_payroll_auditor_agent` |
| **Attendance auditor** | Attendance dashboard | `hr.tool.attendance_patterns` |
| **Compliance auditor** | Compliance center | `hr.tool.compliance_assistant` |
| **Document auditor** | Document upload | `hr.tool.document_expiry_scan` |

### Auditor results layout

```text
┌─────────────────────────────────────────────────────────┐
│ 🔍 Payroll Audit — PR-2026-06-001          [Run audit]  │
├─────────────────────────────────────────────────────────┤
│ CRITICAL (2) · HIGH (5) · MEDIUM (3) · PASSED (412)     │
├─────────────────────────────────────────────────────────┤
│ [!] Duplicate component line — EMP-0042 · TAX           │
│     Risk: Critical · Records: 1 · [View payslip]        │
│ [!] Net pay variance >20% — EMP-0088                    │
│     Risk: High · [View employee] [Mark reviewed]        │
├─────────────────────────────────────────────────────────┤
│ Recommendations: Review 7 employees before approval      │
└─────────────────────────────────────────────────────────┘
```

| Column | Content |
|--------|---------|
| **Detected issues** | Issue title + category |
| **Risk level** | critical · high · medium · low |
| **Affected records** | Count + drill links |
| **Recommendations** | Narrative + next steps |

**Forbidden UI:** Auto-fix · Auto-approve · Auto-lock buttons

---

# AI Prediction Center

**Route:** `/hr/ai/attrition` + prediction widgets · **Phase:** P2–P3

| Prediction | Screen | Report |
|------------|--------|--------|
| Attrition prediction | `SCR-AI-HR-006` | `RPT-AI-HR-001` |
| Promotion prediction | `SCR-AI-HR-007` | `RPT-AI-HR-002` |
| Performance prediction | Performance AI | — |
| Attendance risk prediction | Attendance AI | `RPT-AI-HR-003` |
| Training needs prediction | Training AI | `RPT-AI-HR-005` |

### Prediction card anatomy

| Field | Content |
|-------|---------|
| Score | 0–1 or percentile |
| Confidence band | Visual range |
| Top features | Explainability (non-protected) |
| Disclaimer | Model version · not deterministic |
| Action | "Schedule conversation" — not auto-terminate |

**Governance:** Attrition scores hidden from line managers by default.

---

# AI Automation Center

**Route:** `/hr/settings/automation` (future) · AI OS Settings → Automations

Per [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md).

### Suggested automations (UI)

| Suggestion | Trigger | Human approval |
|------------|---------|----------------|
| Post-calculate anomaly scan | `payroll.run.calculated` | None — flags only |
| Document classify on upload | `hr.document.uploaded` | Confirm if confidence < 0.85 |
| Compliance alert on expiry | `date.due` | None — notification |
| Daily attendance insight batch | Schedule 06:00 | Pre-enabled by admin |

### Automation card

```text
┌─────────────────────────────────────────────────────────┐
│ 🤖 Suggested Automation                    [Review]      │
│ Run payroll anomaly scan after each calculation          │
│ Risk: Low · Approval: None (advisory only)               │
│ [Enable] [Customize] [Dismiss]                           │
└─────────────────────────────────────────────────────────┘
```

**Rule:** All write automations require explicit human approval in rule setup.

---

# AI Report Generator

**Entry:** Chat action · workspace Actions panel · command palette

### Generatable reports

| Report | Permission |
|--------|------------|
| Attendance reports | `hr.report.attendance.view` |
| Payroll reports | `payroll.report.view` |
| Performance reports | `hr.report.performance.view` |
| Executive reports | `ai.insights.executive` |
| Compliance reports | `hr.report.compliance.view` |

### Output formats

| Format | UI |
|--------|-----|
| **PDF** | Generate + download + activity log |
| **Excel** | XLSX download |
| **Dashboard** | Pin chart to dashboard (future) |
| **Presentation** | Slide outline markdown (future) |

**Flow:** Prompt → parameter confirm sheet → generate progress → result card with download

---

# AI Action Experience

Proposed actions require **preview panel** (`CMP-AI-ACTION-PREVIEW-001`).

### Example actions

| Action | Output |
|--------|--------|
| Generate employee summary | PDF / markdown brief |
| Prepare promotion review | Draft review doc |
| Generate payroll analysis | Narrative + chart |
| Prepare executive brief | Executive summary |
| Draft employee letter | Editable letter draft |

### Action preview must show

| Field | Required |
|-------|----------|
| **Reason** | Why AI suggests this |
| **Data sources** | APIs · reports used |
| **Expected impact** | Business effect |
| **Approval requirements** | None · manager · HR · finance |

**Apply flow:** Preview → Confirm → Execute → Activity log → workflow if needed

---

# AI Explainability UX

*Critical section* — `CMP-AI-EXPLAIN-001` on every non-trivial output.

### Expandable block

```text
┌─────────────────────────────────────────────────────────┐
│ How was this calculated?                            [▼]  │
├─────────────────────────────────────────────────────────┤
│ Why: Absent 8 of last 10 Mondays                         │
│ How: Pattern detection on hr_attendance daily status     │
│ Data sources:                                            │
│   · hr_attendance (2026-04-01 – 2026-06-01)             │
│   · hr_analytics_attendance_daily                        │
│ Confidence: 0.87 (high)                                  │
│ Model: workforce_agent@1.2.0 · gpt-4o · as_of 2026-06-17 │
│ Recommended actions:                                     │
│   · View attendance report                               │
│   · Schedule 1:1 with manager                          │
└─────────────────────────────────────────────────────────┘
```

### Surfaces requiring explainability

| Surface | Required |
|---------|----------|
| Chat responses (non-trivial) | Yes |
| Insight cards | Yes |
| Recommendation cards | Yes |
| Auditor issues | Yes |
| Predictions | Yes + disclaimer |
| Report narratives | Footer block |
| Dashboard Zone G widgets | Summary + expand |

---

# AI Feedback Experience

`CMP-AI-FEEDBACK-001` — on every insight, recommendation, and chat turn.

| Control | Action |
|---------|--------|
| **Helpful** | Thumb up · improves ranking (platform) |
| **Not helpful** | Thumb down · optional reason |
| **Needs review** | Flags for HR admin / AI audit |
| **Feedback notes** | Free text · logged to `ai_audit_logs` |

**Dismiss vs reject:** Dismiss = hide for user · Reject = negative signal for model ops

---

# AI History Center

**Route:** `/hr/ai/history` · **Screen:** `SCR-AI-HR-009` · **Permission:** `ai.audit.view`

### Filterable tabs

| Tab | Content |
|-----|---------|
| **Queries** | Chat history |
| **Insights** | Generated insights |
| **Recommendations** | Suggested / applied / dismissed |
| **Reports** | AI-generated reports |
| **Actions** | Apply / draft events |
| **Approvals** | AI proposals in approval queue |

**Row fields:** Timestamp · user · agent · intent · outcome · link to detail

**Employee self:** Own ESS AI history only (subset)

---

# AI Notifications

Delivered via [Notification Engine](../../../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md).

| Notification | Trigger | Recipient |
|--------------|---------|-----------|
| Attendance risk alerts | Daily batch · threshold | HR Manager |
| Payroll risk alerts | `ai.payroll.anomaly_detected` | Payroll Manager |
| Compliance alerts | Compliance scan | HR Compliance |
| Promotion opportunities | Weekly batch | HR Manager |
| Training opportunities | Skill gap batch | Manager · employee |
| AI task complete | `ai.task.completed` | Requesting user |
| AI approval needed | High-risk proposal | Approver |

**UI:** Bell · dashboard Zone F · AI panel badge · optional email digest

---

# Manager AI Experience

**Agent scope:** Team · `department_subtree` or direct reports

| Surface | Content |
|---------|---------|
| **Team insights** | Present/absent · on leave |
| **Leave risks** | Coverage warnings |
| **Performance risks** | Pending reviews · at-risk goals |
| **Training needs** | Mandatory gaps in team |
| **Approval recommendations** | Delegate suggestions |

**ESS entry:** Manager AI on `/ess/team` · ESS AI panel with team tools

**Restricted:** No attrition scores · no peer salary · no company-wide payroll

---

# HR AI Experience

**Agent:** `workforce_agent` full tool manifest

| Surface | Content |
|---------|---------|
| **Employee insights** | Search · 360 summaries |
| **Compliance insights** | Compliance assistant |
| **Workforce analytics** | Headcount · growth |
| **Recruitment analytics** | Delegates to `workforce_recruitment_agent` |

**Primary workspace:** `/hr/ai` · sidebar `NAV-HR-AI-000`

---

# Executive AI Experience

**Permission:** `ai.insights.executive` · executive dashboard Zone G

| Surface | Content |
|---------|---------|
| **Strategic insights** | Monthly narrative brief |
| **Workforce forecasts** | Headcount projection |
| **Payroll forecasts** | Cost projection |
| **Attrition forecasts** | Company-level risk |
| **Growth recommendations** | Hiring · structure |

**Delivery:** Executive dashboard widgets · scheduled PDF brief · `/hr/executive` AI strip

**PII rule:** Aggregated only — no individual names in executive brief default template

---

# Mobile AI Experience

| Surface | Mobile behavior |
|---------|-----------------|
| **AI chat** | Full-screen sheet |
| **AI insights** | Single card + "See all" |
| **AI actions** | Bottom sticky CTA |
| **Voice commands** | Mic on input bar (future) |
| **Quick suggestions** | Horizontal prompt chips |

### ESS mobile AI

- Dashboard Zone F collapsed card  
- FAB or header ✨  
- Bottom sheet panel  
- Self-scoped tools only  

### Manager mobile

- Approvals + team queries in ESS AI  
- Swipe-friendly recommendation dismiss  

---

# Voice AI Strategy

**Future ready** — P3+ native app / PWA.

| Capability | UX |
|------------|-----|
| **Voice commands** | Hold mic · "Show my leave balance" |
| **Voice search** | Command palette voice mode |
| **Voice actions** | Confirm sheet after transcription |
| **Voice summaries** | Read-aloud executive brief |

**Governance:** Voice transcripts logged · sensitive queries require unlock · offline = disabled

---

# AI Security Experience

| Control | UI manifestation |
|---------|-------------------|
| **Role-based AI access** | Hide ✨ if no `ai.chat` |
| **Sensitive data protection** | Mask salary · bank in chat |
| **Payroll restrictions** | Auditor read-only on locked runs |
| **Approval restrictions** | No approve CTAs on AI cards |
| **Audit visibility** | History center for admins |

### Permission keys (UI gates)

| Key | Gates |
|-----|-------|
| `ai.access` | HR AI hub |
| `ai.chat` | Global panel |
| `ai.tool.execute` | Tool calls |
| `ai.tool.apply` | Apply proposals |
| `ai.audit.view` | History center |
| `ai.insights.executive` | Executive predictions |

**Dual gate:** `ai.tool.execute` AND domain permission (e.g. `hr.attendance.view`)

---

# AI First Design Principles

| Principle | HR implementation |
|-----------|-------------------|
| **Context awareness** | Context chips in panel header |
| **Minimal friction** | Prompt chips · command palette |
| **Explainability** | Mandatory expand block |
| **Human control** | Apply · Dismiss · never silent write |
| **Actionability** | Every insight has CTA |

### Dashboard integration

Per [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md):

- **Zone G** on all admin dashboards  
- Daily AI briefing banner  
- "Open in AI hub" footer link  
- Payroll: auditor mode only  

---

# Chief AI Agent Compatibility

Per [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) §2 Chief AI Agent.

### Delegation map

```text
Chief AI Agent (global Ctrl+J)
        │
        ├── workforce_agent (HR & Payroll orchestrator)
        │     ├── workforce_ess_agent
        │     ├── workforce_payroll_auditor_agent
        │     └── workforce_recruitment_agent
        │
        └── Cross-module agents (future handoff)
              ├── accounting_agent (payroll journal questions)
              ├── project_agent (timesheet → attendance)
              └── executive_agent (board-level brief)
```

### Compatibility rules

| Rule | Detail |
|------|--------|
| **Chief never writes HR directly** | Delegates to `workforce_agent` |
| **Context handoff** | `employee_id` · `company_id` in delegation packet |
| **Unified audit** | All paths → `ai_audit_logs` |
| **Single panel UX** | User sees one assistant — agent switch invisible |
| **Cross-module queries** | "Show payroll cost and project hours" → multi-agent plan |

### HR agent registry (UI labels)

| Agent ID | UI name |
|----------|---------|
| `workforce_agent` | Workforce Assistant |
| `workforce_ess_agent` | My Assistant (ESS) |
| `workforce_payroll_auditor_agent` | Payroll Auditor |
| `workforce_recruitment_agent` | Recruitment Assistant |
| `workforce_performance_agent` | Performance Coach (future) |
| `workforce_executive_agent` | Executive Advisor (future) |

---

# Component Registry (cross-module)

| Component ID | Purpose |
|--------------|---------|
| `CMP-AI-PANEL-001` | Sidebar / overlay panel |
| `CMP-AI-EXPLAIN-001` | Explainability block |
| `CMP-AI-CARD-INSIGHT-001` | Insight card |
| `CMP-AI-CARD-RECOMMEND-001` | Recommendation card |
| `CMP-AI-CARD-AUDIT-001` | Auditor issue row |
| `CMP-AI-ACTION-PREVIEW-001` | Action preview sheet |
| `CMP-AI-FEEDBACK-001` | Feedback controls |
| `CMP-AI-FIELD-001` | Inline field AI toolbar |
| `CMP-AI-CONTEXT-001` | Context chip strip |

---

# Screen & Route Index

| ID | Screen | Route | Permission |
|----|--------|-------|------------|
| SCR-AI-HR-001 | AI Dashboard / Hub | `/hr/ai` | `ai.access` |
| SCR-AI-HR-002 | AI Insights | `/hr/ai/insights` | `ai.access` |
| SCR-AI-HR-003 | Attendance Insights | `/hr/ai/attendance` | `ai.access` + `hr.attendance.view` |
| SCR-AI-HR-004 | Payroll Insights | `/hr/ai/payroll` | `ai.access` + `payroll.run.view` |
| SCR-AI-HR-005 | Performance Insights | `/hr/ai/performance` | `ai.access` + `hr.performance.manage` |
| SCR-AI-HR-006 | Attrition Risk | `/hr/ai/attrition` | `ai.access` + `hr.report.employee.view` |
| SCR-AI-HR-007 | Promotion Suggestions | `/hr/ai/promotions` | `ai.access` + `hr.promotion.recommend` |
| SCR-AI-HR-008 | AI Chat Panel | Global `Ctrl+J` | `ai.chat` |
| SCR-AI-HR-009 | AI Actions History | `/hr/ai/history` | `ai.audit.view` |
| SCR-AI-RPT-001 | Attrition Risk Report | `/hr/reports/ai-attrition` | `ai.access` |

### Widget index

| ID | Title |
|----|-------|
| WGT-AI-INS-001 | Attendance insights |
| WGT-AI-INS-002 | Payroll insights |
| WGT-AI-INS-003 | Attrition risk |
| WGT-AI-INS-004 | Promotion opportunities |
| WGT-AI-INS-005 | Training recommendations |
| WGT-AI-INS-006 | Compliance / leave risks |
| WGT-AI-INS-007 | Workforce analytics |

---

# Cross-Reference Index

| Document | Use |
|----------|-----|
| [HR_AI_ASSISTANT_ARCHITECTURE.md](../HR_AI_ASSISTANT_ARCHITECTURE.md) | Tools, agents, backend |
| [AI_OS_ARCHITECTURE.md](../../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | Chief Agent, platform UI |
| [ai-assistant-ui.md](../../../04-uiux/standards/ai-assistant-ui.md) | Global panel patterns |
| [uiux/HR_DASHBOARD_UI_ARCHITECTURE.md](./HR_DASHBOARD_UI_ARCHITECTURE.md) | Zone G widgets |
| [uiux/EMPLOYEE_PROFILE_UI_ARCHITECTURE.md](./EMPLOYEE_PROFILE_UI_ARCHITECTURE.md) | Profile AI zones |
| [uiux/ESS_PORTAL_UI_ARCHITECTURE.md](./ESS_PORTAL_UI_ARCHITECTURE.md) | ESS AI panel |
| [uiux/PAYROLL_UI_ARCHITECTURE.md](./PAYROLL_UI_ARCHITECTURE.md) | Payroll auditor UI |
| [HR_ACTIVITY_LOG_ARCHITECTURE.md](../HR_ACTIVITY_LOG_ARCHITECTURE.md) | `ai_insight` · `ai_suggested` events |
| [HR_AUTOMATION_ENGINE_ARCHITECTURE.md](../HR_AUTOMATION_ENGINE_ARCHITECTURE.md) | AI-assisted automation |

---

## Document Control

| Field | Value |
|-------|-------|
| **Module** | HR & Payroll — AI UX (AgainERP reference) |
| **Owner** | Product / Architecture |
| **Status** | Draft (Planning) |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-17 |
| **Reusable patterns** | `AI-UX-*` · `CMP-AI-*` |
| **Primary hub** | `/hr/ai` |

---

**AgainERP HR AI Assistant UI Architecture** — enterprise AI experience foundation for copilot, workspace, insights, recommendations, analytics, auditors, and Chief Agent integration. **Template for all AgainERP module AI UX.**
