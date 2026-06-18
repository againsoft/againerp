/**
 * Sales & Marketing Dashboard mock data — SCR-SMW-DSH-001
 * @see docs/modules/sales-marketing/ui-design/02_DASHBOARD_UI_DESIGN.md
 */

import type {
  EnterpriseAiInsightCardData,
  EnterpriseKpiCardData,
  EnterpriseTimelineCardData,
} from "@/components/enterprise/types";

export type SmwDashboardPeriod = "month" | "quarter";
export type SmwDashboardViewAs = "manager" | "rep" | "executive";

export type SmwDashboardLeaderboardRow = {
  id: string;
  rep: string;
  quota: string;
  achieved: string;
  percent: number;
  href: string;
};

export type SmwDashboardPipelineStage = {
  stage: string;
  count: number;
  value: number;
  fill: string;
};

export type SmwDashboardQuickAction = {
  id: string;
  label: string;
  href: string;
  permission?: string;
};

export const SMW_DASHBOARD_AS_OF = "18 Jun 2026, 10:30 AM";

export const SMW_DASHBOARD_PERIODS = [
  { id: "month" as const, label: "This month" },
  { id: "quarter" as const, label: "This quarter" },
] as const;

export const SMW_DASHBOARD_TERRITORIES = [
  { id: "all", label: "All territories" },
  { id: "dhk", label: "Dhaka Metro" },
  { id: "ctg", label: "Chittagong" },
  { id: "syl", label: "Sylhet" },
  { id: "export", label: "Export / APAC" },
] as const;

export const SMW_DASHBOARD_VIEW_AS = [
  { id: "manager" as const, label: "Sales Manager" },
  { id: "rep" as const, label: "Sales Rep" },
  { id: "executive" as const, label: "Executive" },
] as const;

export const SMW_DASHBOARD_KPIS: EnterpriseKpiCardData[] = [
  {
    id: "WGT-SMW-KPI-001",
    label: "Open leads",
    value: "38",
    trend: "+6",
    trendDirection: "up",
    status: "neutral",
    hint: "vs last week",
    href: "/sales-marketing/leads?status=open",
  },
  {
    id: "WGT-SMW-KPI-002",
    label: "Qualified leads",
    value: "12",
    trend: "+3",
    trendDirection: "up",
    status: "good",
    hint: "ready for opp",
    href: "/sales-marketing/leads?status=qualified",
  },
  {
    id: "WGT-SMW-KPI-003",
    label: "Pipeline (weighted)",
    value: "৳4.82M",
    trend: "+12%",
    trendDirection: "up",
    status: "good",
    hint: "vs last month",
    href: "/sales-marketing/opportunities",
  },
  {
    id: "WGT-SMW-KPI-004",
    label: "Revenue MTD",
    value: "৳2.14M",
    trend: "72% of target",
    trendDirection: "neutral",
    status: "warning",
    hint: "month to date",
    href: "/sales-marketing/reports?report=revenue",
  },
  {
    id: "WGT-SMW-KPI-005",
    label: "Win rate (Q2)",
    value: "31%",
    trend: "+4 pts",
    trendDirection: "up",
    status: "good",
    hint: "vs Q1",
    href: "/sales-marketing/reports?report=performance",
  },
  {
    id: "WGT-SMW-KPI-006",
    label: "Campaign ROI",
    value: "412%",
    trend: "LinkedIn ABM",
    trendDirection: "up",
    status: "good",
    hint: "top channel",
    href: "/sales-marketing/campaigns",
  },
  {
    id: "WGT-SMW-KPI-007",
    label: "Target achievement",
    value: "72%",
    trend: "৳860K gap",
    trendDirection: "down",
    status: "warning",
    hint: "team quota",
    href: "/sales-marketing/targets",
  },
  {
    id: "WGT-SMW-KPI-008",
    label: "Commission pending",
    value: "৳42K",
    trend: "8 reps",
    trendDirection: "neutral",
    status: "neutral",
    hint: "awaiting close",
    href: "/sales-marketing/commission",
  },
];

export const SMW_DASHBOARD_LEAD_FUNNEL = [
  { stage: "Visitors", count: 1240, fill: "#c4b5fd" },
  { stage: "Leads", count: 380, fill: "#a78bfa" },
  { stage: "MQL", count: 142, fill: "#8b5cf6" },
  { stage: "SQL", count: 68, fill: "#7c3aed" },
  { stage: "Opportunity", count: 41, fill: "#6d28d9" },
  { stage: "Won", count: 18, fill: "#5b21b6" },
];

export const SMW_DASHBOARD_PIPELINE_BY_STAGE = [
  { stage: "Prospect", new: 8, existing: 4 },
  { stage: "Qualified", new: 6, existing: 5 },
  { stage: "Proposal", new: 4, existing: 7 },
  { stage: "Negotiation", new: 2, existing: 5 },
  { stage: "Closed Won", new: 3, existing: 2 },
];

export const SMW_DASHBOARD_PIPELINE_SUMMARY: SmwDashboardPipelineStage[] = [
  { stage: "Prospect", count: 12, value: 820000, fill: "#ddd6fe" },
  { stage: "Qualified", count: 11, value: 1450000, fill: "#c4b5fd" },
  { stage: "Proposal", count: 11, value: 1980000, fill: "#a78bfa" },
  { stage: "Negotiation", count: 7, value: 1120000, fill: "#8b5cf6" },
  { stage: "Closed Won", count: 5, value: 450000, fill: "#7c3aed" },
];

export const SMW_DASHBOARD_REVENUE_TREND = [
  { month: "Jan", revenue: 1.42, target: 1.6, forecast: 1.55 },
  { month: "Feb", revenue: 1.58, target: 1.65, forecast: 1.62 },
  { month: "Mar", revenue: 1.71, target: 1.7, forecast: 1.68 },
  { month: "Apr", revenue: 1.65, target: 1.75, forecast: 1.72 },
  { month: "May", revenue: 1.89, target: 1.8, forecast: 1.85 },
  { month: "Jun", revenue: 2.14, target: 2.0, forecast: 2.05 },
];

export const SMW_DASHBOARD_AI_INSIGHTS: EnterpriseAiInsightCardData[] = [
  {
    id: "AI-SMW-001",
    title: "3 deals at risk of slipping this month",
    summary:
      "Acme Retail, Nova Foods, and GreenTech POs have no activity in 14+ days. Combined weighted value ৳680K.",
    severity: "warning",
    confidence: "high",
    href: "/sales-marketing/opportunities?filter=at-risk",
    actions: [{ id: "a1", label: "Review deals", href: "/sales-marketing/opportunities?filter=at-risk" }],
  },
  {
    id: "AI-SMW-002",
    title: "Hot leads without follow-up",
    summary: "7 MQLs scored 80+ have no logged call or email in the last 48 hours.",
    severity: "critical",
    confidence: "high",
    href: "/sales-marketing/leads?status=hot&no-activity=1",
    actions: [{ id: "a2", label: "Assign tasks", href: "/sales-marketing/activities?create=1" }],
  },
  {
    id: "AI-SMW-003",
    title: "LinkedIn ABM outperforming email",
    summary: "ABM cohort shows 3.2× conversion vs email nurture. Consider shifting 15% budget.",
    severity: "info",
    confidence: "medium",
    href: "/sales-marketing/campaigns?channel=linkedin",
    actions: [{ id: "a3", label: "View campaign", href: "/sales-marketing/campaigns" }],
  },
  {
    id: "AI-SMW-004",
    title: "Quotation win rate improving",
    summary: "Quote-to-close improved from 22% to 29% after template refresh on 1 Jun.",
    severity: "info",
    confidence: "medium",
    href: "/sales-marketing/reports?report=quotations",
  },
];

export const SMW_DASHBOARD_LEADERBOARD: SmwDashboardLeaderboardRow[] = [
  {
    id: "rep-1",
    rep: "Farhana Rahman",
    quota: "৳800K",
    achieved: "৳612K",
    percent: 77,
    href: "/sales-marketing/teams?rep=farhana",
  },
  {
    id: "rep-2",
    rep: "Karim Hassan",
    quota: "৳750K",
    achieved: "৳698K",
    percent: 93,
    href: "/sales-marketing/teams?rep=karim",
  },
  {
    id: "rep-3",
    rep: "Nadia Chowdhury",
    quota: "৳700K",
    achieved: "৳504K",
    percent: 72,
    href: "/sales-marketing/teams?rep=nadia",
  },
  {
    id: "rep-4",
    rep: "Rafiq Islam",
    quota: "৳650K",
    achieved: "৳520K",
    percent: 80,
    href: "/sales-marketing/teams?rep=rafiq",
  },
  {
    id: "rep-5",
    rep: "Sadia Akter",
    quota: "৳600K",
    achieved: "৳438K",
    percent: 73,
    href: "/sales-marketing/teams?rep=sadia",
  },
];

export const SMW_DASHBOARD_ACTIVITIES: EnterpriseTimelineCardData[] = [
  {
    id: "act-1",
    title: "Quotation Q-2026-184 sent",
    description: "Nova Foods — ৳420K enterprise bundle, valid 30 days",
    user: "Karim Hassan",
    module: "Quotations",
    timestamp: "18 Jun 2026, 09:45",
    relativeTime: "45m ago",
    href: "/sales-marketing/quotations?view=q-184",
  },
  {
    id: "act-2",
    title: "Lead converted to opportunity",
    description: "GreenTech Solutions — ERP + inventory module",
    user: "Farhana Rahman",
    module: "Leads",
    timestamp: "18 Jun 2026, 08:30",
    relativeTime: "2h ago",
    href: "/sales-marketing/opportunities?view=opp-882",
    unread: true,
  },
  {
    id: "act-3",
    title: "Campaign budget adjusted",
    description: "LinkedIn ABM Q2 — +৳50K reallocation approved",
    user: "Nadia Chowdhury",
    module: "Campaigns",
    timestamp: "17 Jun 2026, 16:20",
    relativeTime: "Yesterday",
    href: "/sales-marketing/campaigns?view=camp-abm-q2",
  },
  {
    id: "act-4",
    title: "Deal stage moved to Negotiation",
    description: "Acme Retail — weighted ৳280K",
    user: "Rafiq Islam",
    module: "Opportunities",
    timestamp: "17 Jun 2026, 11:05",
    relativeTime: "Yesterday",
    href: "/sales-marketing/opportunities?view=opp-771",
  },
  {
    id: "act-5",
    title: "Follow-up call logged",
    description: "Metro Distributors — pricing objection noted",
    user: "Sadia Akter",
    module: "Activities",
    timestamp: "16 Jun 2026, 14:40",
    relativeTime: "2d ago",
    href: "/sales-marketing/activities?view=act-992",
  },
];

export const SMW_DASHBOARD_QUICK_ACTIONS: SmwDashboardQuickAction[] = [
  { id: "qa-1", label: "New lead", href: "/sales-marketing/leads?create=1" },
  { id: "qa-2", label: "New opportunity", href: "/sales-marketing/opportunities?create=1" },
  { id: "qa-3", label: "Create quotation", href: "/sales-marketing/quotations?create=1" },
  { id: "qa-4", label: "Log activity", href: "/sales-marketing/activities?create=1" },
  { id: "qa-5", label: "Open AI copilot", href: "/sales-marketing/ai" },
];

export function formatSmwCurrency(value: number): string {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000)}K`;
  return `৳${value}`;
}

export function getSmwDashboardKpis(viewAs: SmwDashboardViewAs): EnterpriseKpiCardData[] {
  if (viewAs === "rep") {
    return SMW_DASHBOARD_KPIS.map((kpi) => {
      if (kpi.id === "WGT-SMW-KPI-001") return { ...kpi, value: "9", trend: "+2", hint: "my pipeline" };
      if (kpi.id === "WGT-SMW-KPI-003") return { ...kpi, value: "৳820K", trend: "+8%", hint: "my weighted" };
      if (kpi.id === "WGT-SMW-KPI-004") return { ...kpi, value: "৳698K", trend: "93% quota", status: "good" };
      if (kpi.id === "WGT-SMW-KPI-007") return { ...kpi, value: "93%", trend: "on track", status: "good" };
      return kpi;
    });
  }
  if (viewAs === "executive") {
    return SMW_DASHBOARD_KPIS.filter(
      (k) =>
        k.id !== "WGT-SMW-KPI-001" &&
        k.id !== "WGT-SMW-KPI-002" &&
        k.id !== "WGT-SMW-KPI-008",
    ).map((kpi) => {
      if (kpi.id === "WGT-SMW-KPI-004") return { ...kpi, label: "Revenue YTD", value: "৳12.4M" };
      return kpi;
    });
  }
  return SMW_DASHBOARD_KPIS;
}

export function getSmwLeaderboard(viewAs: SmwDashboardViewAs): SmwDashboardLeaderboardRow[] {
  if (viewAs === "executive") {
    return SMW_DASHBOARD_LEADERBOARD.map((row, index) => ({
      ...row,
      rep: `Rep ${index + 1}`,
    }));
  }
  if (viewAs === "rep") {
    return SMW_DASHBOARD_LEADERBOARD.slice(0, 3);
  }
  return SMW_DASHBOARD_LEADERBOARD;
}
