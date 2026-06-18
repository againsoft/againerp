/**
 * HR AI Workspace mock data — SCR-AI-HR-001 · AI-UX-WORKSPACE-001
 * @see docs/modules/hr-payroll/uiux/HR_AI_ASSISTANT_UI_ARCHITECTURE.md
 */

export type AiWorkspaceMode = "chat" | "insights" | "recommendations" | "predictions" | "actions" | "history";

export type AiWorkspaceContext = {
  module: string;
  department: string;
  employee: string;
  employeeId: string;
  branch: string;
  scope: "company" | "department" | "team" | "employee";
  payrollRun?: string;
};

export type AiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: { id: string; label: string; href: string }[];
  suggestedActions?: { id: string; label: string; href?: string }[];
  structured?: { type: "metric"; items: { label: string; value: string }[] };
};

export type AiInsightCard = {
  id: string;
  category: "attendance" | "leave" | "payroll" | "performance";
  title: string;
  summary: string;
  severity: "info" | "warning" | "critical";
  confidence: "high" | "medium" | "low";
  href: string;
};

export type AiRecommendation = {
  id: string;
  type: "promotion" | "training" | "policy";
  title: string;
  summary: string;
  subject?: string;
  priority: "high" | "medium" | "low";
  href: string;
};

export type AiPrediction = {
  id: string;
  title: string;
  summary: string;
  horizon: string;
  trend: "up" | "down" | "stable";
  confidence: "high" | "medium" | "low";
  metric?: string;
};

export type AiWorkspaceAction = {
  id: string;
  label: string;
  description: string;
  icon: "report" | "summary" | "attendance" | "payroll" | "letter";
  permission?: string;
};

export type AiHistoryItem = {
  id: string;
  type: "query" | "report" | "recommendation";
  title: string;
  meta: string;
  timestamp: string;
  status?: "applied" | "dismissed" | "completed";
};

export const AI_WORKSPACE_CONTEXT: AiWorkspaceContext = {
  module: "HR & Payroll",
  department: "Technology",
  employee: "Karim Hassan",
  employeeId: "emp-003",
  branch: "Dhaka HQ",
  scope: "company",
  payrollRun: "PR-2026-06",
};

export const AI_WORKSPACE_MODES: { id: AiWorkspaceMode; label: string }[] = [
  { id: "chat", label: "AI Chat" },
  { id: "insights", label: "AI Insights" },
  { id: "recommendations", label: "Recommendations" },
  { id: "predictions", label: "AI Predictions" },
  { id: "actions", label: "AI Actions" },
  { id: "history", label: "History" },
];

export const AI_CHAT_HISTORY: AiChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Show me attendance anomalies for Operations this week.",
    timestamp: "09:02 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "Operations shows 18% more late arrivals between 08:45–09:15 compared to the 30-day average. Chittagong warehouse contributes 62% of the spike. Three employees have repeated Monday sick leave patterns.",
    timestamp: "09:02 AM",
    citations: [
      { id: "c1", label: "Attendance dashboard", href: "/hr/attendance" },
      { id: "c2", label: "ACT-008 AI insight", href: "/hr/activity?activity=act-008" },
    ],
    suggestedActions: [
      { id: "a1", label: "Open attendance report", href: "/hr/reports/attendance" },
      { id: "a2", label: "View Operations dept", href: "/hr/organization/departments" },
      { id: "a3", label: "Generate summary", href: "/hr/ai?mode=actions" },
    ],
    structured: {
      type: "metric",
      items: [
        { label: "Late arrivals", value: "+18%" },
        { label: "Affected employees", value: "12" },
        { label: "Risk level", value: "Medium" },
      ],
    },
  },
  {
    id: "msg-3",
    role: "user",
    content: "What is the status of June payroll run PR-2026-06?",
    timestamp: "09:08 AM",
  },
  {
    id: "msg-4",
    role: "assistant",
    content:
      "PR-2026-06 is calculated for 1,248 employees with net pay ৳48.62M. Status: Pending approval. 12 validation exceptions remain (3 missing bank details, 7 tax slab mismatches). Pay date is 25 Jun — lock recommended by 24 Jun.",
    timestamp: "09:08 AM",
    citations: [
      { id: "c3", label: "PR-2026-06", href: "/payroll/runs?view=PR-2026-06" },
      { id: "c4", label: "APR-2026-00482", href: "/inbox/approvals?view=apr-001" },
    ],
    suggestedActions: [
      { id: "a4", label: "Open payroll auditor", href: "/payroll" },
      { id: "a5", label: "View approval queue", href: "/inbox/approvals?module=payroll" },
    ],
  },
];

export const AI_SUGGESTED_PROMPTS = [
  "Who is absent today?",
  "Pending leave approvals",
  "Payroll cost vs last month",
  "Promotion readiness — Technology",
  "Generate monthly HR brief",
];

export const AI_INSIGHTS: AiInsightCard[] = [
  {
    id: "ins-att-1",
    category: "attendance",
    title: "Late arrival cluster — Operations",
    summary: "18% above 30-day average between 08:45–09:15. Correlates with Chittagong shift coverage gaps.",
    severity: "warning",
    confidence: "high",
    href: "/hr/attendance",
  },
  {
    id: "ins-att-2",
    category: "attendance",
    title: "Device sync — Sylhet offline",
    summary: "BIO-SYL-01 offline 3h may cause missing punches for 24 employees.",
    severity: "critical",
    confidence: "high",
    href: "/hr/attendance",
  },
  {
    id: "ins-lev-1",
    category: "leave",
    title: "Leave overlap — Sales team",
    summary: "6 annual leave requests overlap 20 Jun. Team coverage drops below 70%.",
    severity: "warning",
    confidence: "medium",
    href: "/hr/leave",
  },
  {
    id: "ins-lev-2",
    category: "leave",
    title: "Unused leave accumulation",
    summary: "42 employees exceed policy threshold for unused annual leave before year-end.",
    severity: "info",
    confidence: "high",
    href: "/hr/leave/balances",
  },
  {
    id: "ins-pay-1",
    category: "payroll",
    title: "Net pay variance +2.4% vs May",
    summary: "Driven by overtime in Operations (+18%) and Eid bonus accrual.",
    severity: "info",
    confidence: "high",
    href: "/payroll",
  },
  {
    id: "ins-pay-2",
    category: "payroll",
    title: "12 payroll exceptions unresolved",
    summary: "Resolve before lock — missing bank details and tax slab mismatches flagged.",
    severity: "critical",
    confidence: "high",
    href: "/payroll/runs?view=PR-2026-06&tab=validation",
  },
  {
    id: "ins-perf-1",
    category: "performance",
    title: "Q2 review cycle opens in 7 days",
    summary: "248 employees in Technology and Operations require manager self-review completion.",
    severity: "info",
    confidence: "high",
    href: "/hr/performance",
  },
  {
    id: "ins-perf-2",
    category: "performance",
    title: "Goal at-risk — Backend squad",
    summary: "Sprint carry-over goal below 50% progress for 4 team members.",
    severity: "warning",
    confidence: "medium",
    href: "/hr/employees?view=emp-003&tab=performance",
  },
];

export const AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: "rec-prom-1",
    type: "promotion",
    title: "Promotion readiness — Shahid Alam",
    summary: "Exceeds performance threshold (4.4/5) for 2 cycles. Tenure 4.2 years. Recommend Senior Engineer track.",
    subject: "EMP-0014",
    priority: "high",
    href: "/hr/employees?view=emp-014&tab=performance",
  },
  {
    id: "rec-prom-2",
    type: "promotion",
    title: "Grade uplift review — Fatima Rahman",
    summary: "Salary revision SR-2026-0042 pending. AI suggests aligning with HR Officer band midpoint.",
    subject: "EMP-0002",
    priority: "medium",
    href: "/inbox/approvals?view=apr-005",
  },
  {
    id: "rec-trn-1",
    type: "training",
    title: "Mandatory security training — 38 overdue",
    summary: "Information Security refresher due 21 Jun. Operations and Logistics highest gap.",
    priority: "high",
    href: "/hr/training",
  },
  {
    id: "rec-trn-2",
    type: "training",
    title: "Leadership pipeline — 6 candidates",
    summary: "High performers in Operations identified for Q3 management essentials program.",
    priority: "medium",
    href: "/hr/training",
  },
  {
    id: "rec-pol-1",
    type: "policy",
    title: "WFH policy capacity review",
    summary: "Dhaka HQ WFH utilization at 92% of approved capacity. Consider staggered approval rules.",
    priority: "medium",
    href: "/hr/settings/leave",
  },
  {
    id: "rec-pol-2",
    type: "policy",
    title: "Overtime pre-approval threshold",
    summary: "Operations overtime +18% MoM. Policy suggests mandatory pre-approval above 10h/week.",
    priority: "low",
    href: "/hr/settings/attendance",
  },
];

export const AI_PREDICTIONS: AiPrediction[] = [
  {
    id: "pred-1",
    title: "Attrition risk — Logistics",
    summary: "Elevated flight risk for 5 employees based on attendance, leave, and engagement signals.",
    horizon: "90 days",
    trend: "up",
    confidence: "medium",
    metric: "5 employees",
  },
  {
    id: "pred-2",
    title: "Leave demand — July",
    summary: "Forecast 22% above June due to post-Eid travel and school holidays.",
    horizon: "30 days",
    trend: "up",
    confidence: "high",
    metric: "+22%",
  },
  {
    id: "pred-3",
    title: "Payroll cost — Q3",
    summary: "Projected gross payroll ৳148M if current hiring plan proceeds (+4.1% vs Q2).",
    horizon: "Q3 2026",
    trend: "up",
    confidence: "medium",
    metric: "৳148M",
  },
  {
    id: "pred-4",
    title: "Headcount — Technology",
    summary: "Stable retention expected. 2 open reqs likely filled by Aug 2026.",
    horizon: "6 months",
    trend: "stable",
    confidence: "low",
    metric: "172 → 178",
  },
  {
    id: "pred-5",
    title: "Attendance rate — Operations",
    summary: "Predicted improvement to 91% if Chittagong shift reminders deployed.",
    horizon: "30 days",
    trend: "up",
    confidence: "medium",
    metric: "89% → 91%",
  },
];

export const AI_WORKSPACE_ACTIONS: AiWorkspaceAction[] = [
  {
    id: "act-1",
    label: "Generate Report",
    description: "Monthly HR workforce report with attendance, leave, and headcount KPIs.",
    icon: "report",
  },
  {
    id: "act-2",
    label: "Generate Summary",
    description: "Executive briefing for leadership — key risks and approvals due.",
    icon: "summary",
  },
  {
    id: "act-3",
    label: "Analyze Attendance",
    description: "Deep dive on anomalies, late patterns, and device health by branch.",
    icon: "attendance",
  },
  {
    id: "act-4",
    label: "Analyze Payroll",
    description: "Cost variance, exception scan, and compliance checklist for active run.",
    icon: "payroll",
  },
  {
    id: "act-5",
    label: "Draft Employee Letter",
    description: "Generate promotion, warning, or confirmation letter draft for review.",
    icon: "letter",
  },
];

export const AI_HISTORY: AiHistoryItem[] = [
  {
    id: "hist-1",
    type: "query",
    title: "Attendance anomalies — Operations",
    meta: "Chat · 17 Jun 09:02",
    timestamp: "Today",
  },
  {
    id: "hist-2",
    type: "query",
    title: "June payroll run status",
    meta: "Chat · 17 Jun 09:08",
    timestamp: "Today",
  },
  {
    id: "hist-3",
    type: "report",
    title: "Monthly HR Report — May 2026",
    meta: "Generated · PDF · 2.1 MB",
    timestamp: "16 Jun",
    status: "completed",
  },
  {
    id: "hist-4",
    type: "recommendation",
    title: "Promotion readiness — Shahid Alam",
    meta: "Recommendation · Applied to review queue",
    timestamp: "15 Jun",
    status: "applied",
  },
  {
    id: "hist-5",
    type: "report",
    title: "Attendance deep dive — Chittagong",
    meta: "Generated · CSV",
    timestamp: "14 Jun",
    status: "completed",
  },
  {
    id: "hist-6",
    type: "recommendation",
    title: "WFH policy capacity review",
    meta: "Dismissed · Policy team notified",
    timestamp: "12 Jun",
    status: "dismissed",
  },
];

export const AI_INSIGHT_CATEGORY_LABELS: Record<AiInsightCard["category"], string> = {
  attendance: "Attendance",
  leave: "Leave",
  payroll: "Payroll",
  performance: "Performance",
};
