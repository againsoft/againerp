/**
 * Sales & Marketing — Reports mock data · SCR-SMW-RPT-001
 */

import {
  SMW_DASHBOARD_LEAD_FUNNEL,
  SMW_DASHBOARD_PIPELINE_BY_STAGE,
  SMW_DASHBOARD_PIPELINE_SUMMARY,
  SMW_DASHBOARD_REVENUE_TREND,
  formatSmwCurrency,
} from "@/lib/mock-data/smw-dashboard";

export type SmwReportId =
  | "revenue"
  | "performance"
  | "pipeline"
  | "funnel"
  | "quotations"
  | "campaigns";

export type SmwReportCategory = "revenue" | "pipeline" | "marketing" | "operations";

export type SmwReportDefinition = {
  id: SmwReportId;
  title: string;
  description: string;
  category: SmwReportCategory;
  lastRun: string;
  schedule?: string;
  format: ("pdf" | "xlsx" | "csv")[];
  featured?: boolean;
};

export const SMW_REPORT_CATEGORY_LABELS: Record<SmwReportCategory, string> = {
  revenue: "Revenue",
  pipeline: "Pipeline",
  marketing: "Marketing",
  operations: "Operations",
};

export const smwReportCatalog: SmwReportDefinition[] = [
  {
    id: "revenue",
    title: "Revenue & forecast",
    description: "MTD revenue, target variance, and 6-month trend vs forecast.",
    category: "revenue",
    lastRun: "18 Jun 2026, 10:00",
    schedule: "Daily 08:00",
    format: ["pdf", "xlsx"],
    featured: true,
  },
  {
    id: "performance",
    title: "Sales performance",
    description: "Win rate, cycle length, quota attainment by rep and team.",
    category: "revenue",
    lastRun: "17 Jun 2026, 18:30",
    schedule: "Weekly Mon",
    format: ["pdf", "xlsx"],
    featured: true,
  },
  {
    id: "pipeline",
    title: "Pipeline by stage",
    description: "Open opportunities, weighted value, and stage velocity.",
    category: "pipeline",
    lastRun: "18 Jun 2026, 09:15",
    format: ["pdf", "xlsx", "csv"],
    featured: true,
  },
  {
    id: "funnel",
    title: "Lead conversion funnel",
    description: "Visitor-to-won funnel with conversion rates by stage.",
    category: "pipeline",
    lastRun: "16 Jun 2026, 14:00",
    format: ["pdf", "csv"],
  },
  {
    id: "quotations",
    title: "Quotation analytics",
    description: "Quote volume, win rate, average deal size, and expiry risk.",
    category: "operations",
    lastRun: "18 Jun 2026, 08:45",
    format: ["pdf", "xlsx"],
  },
  {
    id: "campaigns",
    title: "Campaign ROI",
    description: "Spend, leads, conversions, and ROI by channel and campaign.",
    category: "marketing",
    lastRun: "15 Jun 2026, 11:20",
    schedule: "Weekly Fri",
    format: ["pdf", "xlsx"],
  },
];

export const SMW_REPORT_PERIODS = [
  { id: "month", label: "This month" },
  { id: "quarter", label: "This quarter" },
  { id: "year", label: "Year to date" },
] as const;

export type SmwReportPeriod = (typeof SMW_REPORT_PERIODS)[number]["id"];

export function getReportById(id: string): SmwReportDefinition | undefined {
  return smwReportCatalog.find((r) => r.id === id);
}

export function isValidReportId(id: string): id is SmwReportId {
  return smwReportCatalog.some((r) => r.id === id);
}

export const SMW_REPORT_REVENUE_KPIS = [
  { label: "Revenue MTD", value: "৳2.14M", delta: "+12% vs LM" },
  { label: "Target achievement", value: "72%", delta: "৳860K gap" },
  { label: "Forecast (Jun)", value: "৳2.05M", delta: "AI confidence high" },
  { label: "Closed won (Jun)", value: "18 deals", delta: "+3 vs May" },
];

export const SMW_REPORT_PERFORMANCE_KPIS = [
  { label: "Win rate (Q2)", value: "31%", delta: "+4 pts vs Q1" },
  { label: "Avg sales cycle", value: "42 days", delta: "−5 days" },
  { label: "Quota attainment", value: "78%", delta: "team avg" },
  { label: "Top performer", value: "Karim Hassan", delta: "93% quota" },
];

export const SMW_REPORT_QUOTATION_KPIS = [
  { label: "Quotes sent (Jun)", value: "34", delta: "+8 vs May" },
  { label: "Quote-to-close", value: "29%", delta: "+7 pts" },
  { label: "Avg quote value", value: "৳385K", delta: "enterprise skew" },
  { label: "Expiring (7d)", value: "6", delta: "needs follow-up" },
];

export const SMW_REPORT_CAMPAIGN_KPIS = [
  { label: "Total spend MTD", value: "৳498K", delta: "68% of budget" },
  { label: "Leads generated", value: "142", delta: "+22% vs LM" },
  { label: "Blended ROI", value: "412%", delta: "LinkedIn ABM top" },
  { label: "Active campaigns", value: "4", delta: "2 paused" },
];

export const SMW_REPORT_WIN_RATE_TREND = [
  { month: "Jan", winRate: 24, target: 28 },
  { month: "Feb", winRate: 26, target: 28 },
  { month: "Mar", winRate: 27, target: 28 },
  { month: "Apr", winRate: 29, target: 30 },
  { month: "May", winRate: 28, target: 30 },
  { month: "Jun", winRate: 31, target: 30 },
];

export const SMW_REPORT_REP_PERFORMANCE = [
  { rep: "Karim", won: 8, lost: 3, quota: 93 },
  { rep: "Farhana", won: 6, lost: 4, quota: 77 },
  { rep: "Rafiq", won: 5, lost: 2, quota: 80 },
  { rep: "Nadia", won: 4, lost: 5, quota: 72 },
  { rep: "Sadia", won: 3, lost: 4, quota: 73 },
];

export const SMW_REPORT_QUOTATION_TREND = [
  { month: "Jan", sent: 22, won: 5 },
  { month: "Feb", sent: 26, won: 6 },
  { month: "Mar", sent: 28, won: 7 },
  { month: "Apr", sent: 30, won: 8 },
  { month: "May", sent: 26, won: 6 },
  { month: "Jun", sent: 34, won: 10 },
];

export const SMW_REPORT_CAMPAIGN_ROI = [
  { channel: "LinkedIn ABM", spend: 198, leads: 48, roi: 520 },
  { channel: "Email", spend: 85, leads: 62, roi: 280 },
  { channel: "Paid search", spend: 120, leads: 35, roi: 190 },
  { channel: "Webinar", spend: 45, leads: 28, roi: 340 },
  { channel: "Trade show", spend: 50, leads: 22, roi: 150 },
];

export {
  SMW_DASHBOARD_REVENUE_TREND as SMW_REPORT_REVENUE_TREND,
  SMW_DASHBOARD_PIPELINE_SUMMARY as SMW_REPORT_PIPELINE_SUMMARY,
  SMW_DASHBOARD_PIPELINE_BY_STAGE as SMW_REPORT_PIPELINE_BY_STAGE,
  SMW_DASHBOARD_LEAD_FUNNEL as SMW_REPORT_FUNNEL_DATA,
  formatSmwCurrency,
};

export function computeReportCatalogMetrics(reports: SmwReportDefinition[]) {
  return {
    totalReports: reports.length,
    featuredCount: reports.filter((r) => r.featured).length,
    scheduledCount: reports.filter((r) => r.schedule).length,
    categories: new Set(reports.map((r) => r.category)).size,
  };
}
