/**
 * Sales & Marketing — Opportunity mock data · SCR-SMW-OPP-001
 * @see docs/modules/sales-marketing/ui-design/04_OPPORTUNITY_PIPELINE_UI_DESIGN.md
 */

import type { EnterpriseRiskLevel } from "@/components/enterprise/types";

export type OpportunityStage =
  | "new"
  | "qualification"
  | "needs_analysis"
  | "proposal"
  | "negotiation"
  | "final_review"
  | "won"
  | "lost";

export type SmwOpportunity = {
  id: string;
  opportunityNumber: string;
  title: string;
  accountName: string;
  stage: OpportunityStage;
  amount: number;
  probability: number;
  ownerId: string;
  ownerName: string;
  territoryId: string;
  territoryName: string;
  expectedCloseDate: string;
  tags: string[];
  riskLevel?: EnterpriseRiskLevel;
  atRisk?: boolean;
  createdAt: string;
  lastActivityRelative: string;
  leadId?: string;
  notes?: string;
};

export type OpportunityProfileTab =
  | "overview"
  | "products"
  | "quotations"
  | "activity"
  | "documents";

export const OPPORTUNITY_STAGES: {
  id: OpportunityStage;
  label: string;
  probability: number;
}[] = [
  { id: "new", label: "New", probability: 5 },
  { id: "qualification", label: "Qualification", probability: 20 },
  { id: "needs_analysis", label: "Needs Analysis", probability: 35 },
  { id: "proposal", label: "Proposal", probability: 50 },
  { id: "negotiation", label: "Negotiation", probability: 70 },
  { id: "final_review", label: "Final Review", probability: 85 },
  { id: "won", label: "Won", probability: 100 },
  { id: "lost", label: "Lost", probability: 0 },
];

export const STAGE_LABELS: Record<OpportunityStage, string> = Object.fromEntries(
  OPPORTUNITY_STAGES.map((s) => [s.id, s.label]),
) as Record<OpportunityStage, string>;

export const SMW_OPP_OWNERS = [
  { id: "farhana", name: "Farhana Rahman" },
  { id: "karim", name: "Karim Hassan" },
  { id: "nadia", name: "Nadia Chowdhury" },
  { id: "rafiq", name: "Rafiq Islam" },
  { id: "sadia", name: "Sadia Akter" },
  { id: "nusrat", name: "Nusrat Jahan" },
] as const;

export const SMW_OPP_TERRITORIES = [
  { id: "all", name: "All territories" },
  { id: "dhk", name: "Dhaka Metro" },
  { id: "ctg", name: "Chittagong" },
  { id: "syl", name: "Sylhet" },
  { id: "export", name: "Export / APAC" },
] as const;

export const smwOpportunitiesSeed: SmwOpportunity[] = [
  {
    id: "opp-771",
    opportunityNumber: "OPP-2026-0088",
    title: "SS26 Collection rollout",
    accountName: "GreenMart Retail",
    stage: "negotiation",
    amount: 560000,
    probability: 70,
    ownerId: "nusrat",
    ownerName: "Nusrat Jahan",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-06-25",
    tags: ["seasonal", "retail"],
    atRisk: true,
    riskLevel: "high",
    createdAt: "2026-05-10",
    lastActivityRelative: "3d ago",
  },
  {
    id: "opp-882",
    opportunityNumber: "OPP-2026-0074",
    title: "ERP + inventory module",
    accountName: "GreenTech Solutions",
    stage: "proposal",
    amount: 420000,
    probability: 50,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-07-15",
    tags: ["enterprise"],
    leadId: "lead-001",
    createdAt: "2026-06-02",
    lastActivityRelative: "2h ago",
  },
  {
    id: "opp-901",
    opportunityNumber: "OPP-2026-0091",
    title: "Multi-store POS upgrade",
    accountName: "Acme Retail Group",
    stage: "final_review",
    amount: 680000,
    probability: 85,
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    territoryId: "export",
    territoryName: "Export / APAC",
    expectedCloseDate: "2026-06-30",
    tags: ["retail"],
    createdAt: "2026-04-22",
    lastActivityRelative: "Yesterday",
  },
  {
    id: "opp-812",
    opportunityNumber: "OPP-2026-0062",
    title: "Warehouse WMS phase 1",
    accountName: "Nova Foods Ltd",
    stage: "needs_analysis",
    amount: 280000,
    probability: 35,
    ownerId: "karim",
    ownerName: "Karim Hassan",
    territoryId: "ctg",
    territoryName: "Chittagong",
    expectedCloseDate: "2026-08-01",
    tags: ["fmcg"],
    createdAt: "2026-05-28",
    lastActivityRelative: "Yesterday",
  },
  {
    id: "opp-745",
    opportunityNumber: "OPP-2026-0055",
    title: "Distribution CRM bundle",
    accountName: "Metro Distributors",
    stage: "qualification",
    amount: 95000,
    probability: 20,
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-09-10",
    tags: ["smb"],
    leadId: "lead-003",
    createdAt: "2026-06-16",
    lastActivityRelative: "2d ago",
  },
  {
    id: "opp-698",
    opportunityNumber: "OPP-2026-0048",
    title: "Pharma compliance suite",
    accountName: "Brightline Pharma",
    stage: "won",
    amount: 520000,
    probability: 100,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-06-12",
    tags: ["pharma"],
    leadId: "lead-008",
    createdAt: "2026-04-10",
    lastActivityRelative: "6d ago",
  },
  {
    id: "opp-655",
    opportunityNumber: "OPP-2026-0041",
    title: "Textile production planning",
    accountName: "Horizon Textiles",
    stage: "proposal",
    amount: 340000,
    probability: 50,
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-07-20",
    tags: ["manufacturing"],
    createdAt: "2026-06-05",
    lastActivityRelative: "2d ago",
  },
  {
    id: "opp-620",
    opportunityNumber: "OPP-2026-0033",
    title: "Cold chain logistics",
    accountName: "Coastal Fisheries",
    stage: "new",
    amount: 180000,
    probability: 5,
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    territoryId: "ctg",
    territoryName: "Chittagong",
    expectedCloseDate: "2026-10-05",
    tags: ["seafood"],
    createdAt: "2026-06-14",
    lastActivityRelative: "Yesterday",
  },
  {
    id: "opp-601",
    opportunityNumber: "OPP-2026-0029",
    title: "Construction ERP pilot",
    accountName: "SmartBuild Construction",
    stage: "negotiation",
    amount: 290000,
    probability: 70,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    territoryId: "syl",
    territoryName: "Sylhet",
    expectedCloseDate: "2026-06-28",
    tags: ["construction"],
    createdAt: "2026-05-22",
    lastActivityRelative: "1h ago",
  },
  {
    id: "opp-580",
    opportunityNumber: "OPP-2026-0021",
    title: "Tea export tracking",
    accountName: "Sylhet Tea Exports",
    stage: "lost",
    amount: 120000,
    probability: 0,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    territoryId: "syl",
    territoryName: "Sylhet",
    expectedCloseDate: "2026-05-30",
    tags: ["export"],
    createdAt: "2026-06-01",
    lastActivityRelative: "2w ago",
    notes: "Lost to competitor on price",
  },
  {
    id: "opp-550",
    opportunityNumber: "OPP-2026-0018",
    title: "SaaS starter bundle",
    accountName: "CloudNine SaaS",
    stage: "new",
    amount: 75000,
    probability: 5,
    ownerId: "karim",
    ownerName: "Karim Hassan",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-08-15",
    tags: ["startup"],
    createdAt: "2026-06-08",
    lastActivityRelative: "8d ago",
    atRisk: true,
    riskLevel: "medium",
  },
  {
    id: "opp-520",
    opportunityNumber: "OPP-2026-0012",
    title: "Fashion omnichannel",
    accountName: "UrbanWear BD",
    stage: "qualification",
    amount: 150000,
    probability: 20,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedCloseDate: "2026-07-01",
    tags: ["fashion"],
    leadId: "lead-006",
    createdAt: "2026-06-17",
    lastActivityRelative: "4h ago",
  },
];

export function getOpportunityById(id: string): SmwOpportunity | undefined {
  return smwOpportunitiesSeed.find((o) => o.id === id);
}

export function getStageProbability(stage: OpportunityStage): number {
  return OPPORTUNITY_STAGES.find((s) => s.id === stage)?.probability ?? 0;
}

export function formatOppCurrency(value: number): string {
  if (value <= 0) return "—";
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000)}K`;
  return `৳${value.toLocaleString()}`;
}

export function weightedAmount(opp: SmwOpportunity): number {
  return Math.round(opp.amount * (opp.probability / 100));
}

export function computeForecastMetrics(opportunities: SmwOpportunity[]) {
  const open = opportunities.filter((o) => o.stage !== "won" && o.stage !== "lost");
  const weighted = open.reduce((s, o) => s + weightedAmount(o), 0);
  const commit = open
    .filter((o) => o.probability >= 70)
    .reduce((s, o) => s + weightedAmount(o), 0);
  const bestCase = open.reduce((s, o) => s + o.amount, 0);
  const aiAdjusted = Math.round(weighted * 0.92);
  return { weighted, commit, bestCase, aiAdjusted, count: open.length };
}

export function computeColumnStats(opportunities: SmwOpportunity[], stage: OpportunityStage) {
  const items = opportunities.filter((o) => o.stage === stage);
  const sum = items.reduce((s, o) => s + o.amount, 0);
  const weighted = items.reduce((s, o) => s + weightedAmount(o), 0);
  return { count: items.length, sum, weighted };
}

export function forecastByMonth(opportunities: SmwOpportunity[]) {
  const open = opportunities.filter((o) => o.stage !== "won" && o.stage !== "lost");
  const buckets = new Map<string, { weighted: number; count: number }>();
  for (const o of open) {
    const month = o.expectedCloseDate.slice(0, 7);
    const prev = buckets.get(month) ?? { weighted: 0, count: 0 };
    buckets.set(month, {
      weighted: prev.weighted + weightedAmount(o),
      count: prev.count + 1,
    });
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: formatMonthLabel(month),
      weighted: Math.round(data.weighted / 1000),
      count: data.count,
    }));
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

export function isOpportunityProfileTab(value: string | null): value is OpportunityProfileTab {
  return (
    value === "overview" ||
    value === "products" ||
    value === "quotations" ||
    value === "activity" ||
    value === "documents"
  );
}

export function emptyOpportunity(): SmwOpportunity {
  const owner = SMW_OPP_OWNERS[0]!;
  const territory = SMW_OPP_TERRITORIES[1]!;
  return {
    id: `opp-${Date.now()}`,
    opportunityNumber: `OPP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    title: "",
    accountName: "",
    stage: "new",
    amount: 0,
    probability: 5,
    ownerId: owner.id,
    ownerName: owner.name,
    territoryId: territory.id,
    territoryName: territory.name,
    expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    tags: [],
    createdAt: new Date().toISOString().slice(0, 10),
    lastActivityRelative: "Just now",
  };
}

export function oppInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
