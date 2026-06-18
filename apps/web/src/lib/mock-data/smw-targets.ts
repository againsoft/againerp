/**
 * Sales & Marketing — Target mock data · SCR-SMW-TGT-001
 */

import type { EnterpriseStatus } from "@/components/enterprise/types";
import { SMW_LEAD_OWNERS, SMW_LEAD_TERRITORIES } from "@/lib/mock-data/smw-leads";

export type TargetMetric = "revenue" | "deals_won" | "new_leads" | "activities_logged";
export type TargetScope = "rep" | "team" | "territory";
export type TargetPeriod = "month" | "quarter" | "year";
export type TargetStatus = "draft" | "active" | "achieved" | "missed" | "archived";

export type SmwTarget = {
  id: string;
  targetNumber: string;
  name: string;
  metric: TargetMetric;
  scope: TargetScope;
  scopeId: string;
  scopeName: string;
  period: TargetPeriod;
  periodLabel: string;
  startDate: string;
  endDate: string;
  targetValue: number;
  achievedValue: number;
  status: TargetStatus;
  ownerId: string;
  ownerName: string;
  notes?: string;
};

export const TARGET_METRIC_LABELS: Record<TargetMetric, string> = {
  revenue: "Revenue",
  deals_won: "Deals won",
  new_leads: "New leads",
  activities_logged: "Activities logged",
};

export const TARGET_SCOPE_LABELS: Record<TargetScope, string> = {
  rep: "Sales rep",
  team: "Team",
  territory: "Territory",
};

export const TARGET_PERIOD_LABELS: Record<TargetPeriod, string> = {
  month: "Month",
  quarter: "Quarter",
  year: "Year",
};

export const TARGET_STATUS_LABELS: Record<TargetStatus, string> = {
  draft: "Draft",
  active: "Active",
  achieved: "Achieved",
  missed: "Missed",
  archived: "Archived",
};

export const SMW_TARGET_TEAMS = [
  { id: "enterprise", name: "Enterprise sales" },
  { id: "midmarket", name: "Mid-market" },
  { id: "smb", name: "SMB / Inside sales" },
] as const;

export { SMW_LEAD_OWNERS as SMW_TARGET_OWNERS };

export const smwTargetsSeed: SmwTarget[] = [
  {
    id: "tgt-farhana-q2",
    targetNumber: "TGT-2026-0012",
    name: "Q2 revenue quota — Farhana Rahman",
    metric: "revenue",
    scope: "rep",
    scopeId: "farhana",
    scopeName: "Farhana Rahman",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 2400000,
    achievedValue: 1848000,
    status: "active",
    ownerId: "karim",
    ownerName: "Karim Hassan",
  },
  {
    id: "tgt-karim-q2",
    targetNumber: "TGT-2026-0013",
    name: "Q2 revenue quota — Karim Hassan",
    metric: "revenue",
    scope: "rep",
    scopeId: "karim",
    scopeName: "Karim Hassan",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 2250000,
    achievedValue: 2094000,
    status: "active",
    ownerId: "karim",
    ownerName: "Karim Hassan",
  },
  {
    id: "tgt-nadia-q2",
    targetNumber: "TGT-2026-0014",
    name: "Q2 revenue quota — Nadia Chowdhury",
    metric: "revenue",
    scope: "rep",
    scopeId: "nadia",
    scopeName: "Nadia Chowdhury",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 2100000,
    achievedValue: 1512000,
    status: "active",
    ownerId: "karim",
    ownerName: "Karim Hassan",
  },
  {
    id: "tgt-rafiq-q2",
    targetNumber: "TGT-2026-0015",
    name: "Q2 revenue quota — Rafiq Islam",
    metric: "revenue",
    scope: "rep",
    scopeId: "rafiq",
    scopeName: "Rafiq Islam",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 1950000,
    achievedValue: 1560000,
    status: "active",
    ownerId: "karim",
    ownerName: "Karim Hassan",
  },
  {
    id: "tgt-sadia-q2",
    targetNumber: "TGT-2026-0016",
    name: "Q2 revenue quota — Sadia Akter",
    metric: "revenue",
    scope: "rep",
    scopeId: "sadia",
    scopeName: "Sadia Akter",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 1800000,
    achievedValue: 1080000,
    status: "active",
    ownerId: "karim",
    ownerName: "Karim Hassan",
  },
  {
    id: "tgt-dhk-jun",
    targetNumber: "TGT-2026-0020",
    name: "Jun revenue — Dhaka Metro",
    metric: "revenue",
    scope: "territory",
    scopeId: "dhk",
    scopeName: "Dhaka Metro",
    period: "month",
    periodLabel: "Jun 2026",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    targetValue: 3200000,
    achievedValue: 2140000,
    status: "active",
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
  },
  {
    id: "tgt-enterprise-deals",
    targetNumber: "TGT-2026-0025",
    name: "Q2 deals won — Enterprise team",
    metric: "deals_won",
    scope: "team",
    scopeId: "enterprise",
    scopeName: "Enterprise sales",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 18,
    achievedValue: 12,
    status: "active",
    ownerId: "karim",
    ownerName: "Karim Hassan",
  },
  {
    id: "tgt-smb-leads",
    targetNumber: "TGT-2026-0030",
    name: "Jun new leads — SMB team",
    metric: "new_leads",
    scope: "team",
    scopeId: "smb",
    scopeName: "SMB / Inside sales",
    period: "month",
    periodLabel: "Jun 2026",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    targetValue: 120,
    achievedValue: 94,
    status: "active",
    ownerId: "sadia",
    ownerName: "Sadia Akter",
  },
  {
    id: "tgt-ctg-q2",
    targetNumber: "TGT-2026-0035",
    name: "Q2 revenue — Chittagong",
    metric: "revenue",
    scope: "territory",
    scopeId: "ctg",
    scopeName: "Chittagong",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 1500000,
    achievedValue: 1500000,
    status: "achieved",
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
  },
  {
    id: "tgt-activities-q2",
    targetNumber: "TGT-2026-0040",
    name: "Q2 activity volume — Mid-market",
    metric: "activities_logged",
    scope: "team",
    scopeId: "midmarket",
    scopeName: "Mid-market",
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetValue: 450,
    achievedValue: 312,
    status: "active",
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
  },
  {
    id: "tgt-export-draft",
    targetNumber: "TGT-2026-0045",
    name: "H2 revenue — Export / APAC",
    metric: "revenue",
    scope: "territory",
    scopeId: "export",
    scopeName: "Export / APAC",
    period: "year",
    periodLabel: "H2 2026",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    targetValue: 5000000,
    achievedValue: 0,
    status: "draft",
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    notes: "Pending exec approval before publish.",
  },
];

export function getTargetById(id: string): SmwTarget | undefined {
  return smwTargetsSeed.find((t) => t.id === id);
}

export function targetAchievementPct(target: SmwTarget): number {
  if (target.targetValue <= 0) return 0;
  return Math.min(100, Math.round((target.achievedValue / target.targetValue) * 100));
}

export function targetGap(target: SmwTarget): number {
  return Math.max(0, target.targetValue - target.achievedValue);
}

export function formatTargetValue(metric: TargetMetric, value: number): string {
  if (metric === "revenue") return formatTargetCurrency(value);
  return String(value);
}

export function formatTargetCurrency(value: number): string {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000)}K`;
  return `৳${value.toLocaleString()}`;
}

export function targetStatusToEnterprise(status: TargetStatus): EnterpriseStatus {
  const map: Record<TargetStatus, EnterpriseStatus> = {
    draft: "draft",
    active: "active",
    achieved: "approved",
    missed: "rejected",
    archived: "archived",
  };
  return map[status];
}

export function achievementHealth(pct: number): "on_track" | "at_risk" | "achieved" {
  if (pct >= 100) return "achieved";
  if (pct >= 70) return "on_track";
  return "at_risk";
}

export function computeTargetMetrics(targets: SmwTarget[]) {
  const active = targets.filter((t) => t.status === "active");
  const achieved = targets.filter((t) => t.status === "achieved");
  const revenueTargets = active.filter((t) => t.metric === "revenue");
  const totalTarget = revenueTargets.reduce((s, t) => s + t.targetValue, 0);
  const totalAchieved = revenueTargets.reduce((s, t) => s + t.achievedValue, 0);
  const avgPct =
    active.length > 0
      ? Math.round(active.reduce((s, t) => s + targetAchievementPct(t), 0) / active.length)
      : 0;
  const atRisk = active.filter((t) => achievementHealth(targetAchievementPct(t)) === "at_risk").length;
  return {
    activeCount: active.length,
    achievedCount: achieved.length,
    avgAchievementPct: avgPct,
    atRiskCount: atRisk,
    revenueGap: Math.max(0, totalTarget - totalAchieved),
  };
}

export function emptyTarget(): SmwTarget {
  const owner = SMW_LEAD_OWNERS[0]!;
  const rep = SMW_LEAD_OWNERS[1]!;
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `tgt-${Date.now()}`,
    targetNumber: `TGT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    name: "",
    metric: "revenue",
    scope: "rep",
    scopeId: rep.id,
    scopeName: rep.name,
    period: "quarter",
    periodLabel: "Q2 2026",
    startDate: today,
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    targetValue: 0,
    achievedValue: 0,
    status: "draft",
    ownerId: owner.id,
    ownerName: owner.name,
  };
}

export function scopeOptions(scope: TargetScope) {
  switch (scope) {
    case "rep":
      return SMW_LEAD_OWNERS.map((o) => ({ id: o.id, name: o.name }));
    case "team":
      return SMW_TARGET_TEAMS.map((t) => ({ id: t.id, name: t.name }));
    case "territory":
      return SMW_LEAD_TERRITORIES.map((t) => ({ id: t.id, name: t.name }));
  }
}
