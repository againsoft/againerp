/**
 * Sales & Marketing — Campaign mock data · SCR-SMW-CMP-001
 */

import type { EnterpriseStatus } from "@/components/enterprise/types";

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type CampaignChannel =
  | "email"
  | "linkedin"
  | "linkedin_abm"
  | "paid_search"
  | "trade_show"
  | "webinar"
  | "content";

export type SmwCampaign = {
  id: string;
  campaignNumber: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  budget: number;
  spent: number;
  leadsGenerated: number;
  conversions: number;
  roiPct: number;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  territoryId?: string;
  territoryName?: string;
  tags: string[];
  description?: string;
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

export const CAMPAIGN_CHANNEL_LABELS: Record<CampaignChannel, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  linkedin_abm: "LinkedIn ABM",
  paid_search: "Paid search",
  trade_show: "Trade show",
  webinar: "Webinar",
  content: "Content",
};

export const SMW_CAMPAIGN_OWNERS = [
  { id: "farhana", name: "Farhana Rahman" },
  { id: "karim", name: "Karim Hassan" },
  { id: "nadia", name: "Nadia Chowdhury" },
  { id: "rafiq", name: "Rafiq Islam" },
  { id: "sadia", name: "Sadia Akter" },
] as const;

export const smwCampaignsSeed: SmwCampaign[] = [
  {
    id: "camp-abm-q2",
    campaignNumber: "CMP-2026-0042",
    name: "LinkedIn ABM Q2 — Mid-market ERP",
    channel: "linkedin_abm",
    status: "active",
    budget: 350000,
    spent: 198000,
    leadsGenerated: 84,
    conversions: 11,
    roiPct: 412,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    tags: ["abm", "enterprise"],
    description: "Account-based LinkedIn program targeting FMCG and retail COOs",
  },
  {
    id: "camp-email-nurture",
    campaignNumber: "CMP-2026-0038",
    name: "Email nurture — Product configurator",
    channel: "email",
    status: "active",
    budget: 45000,
    spent: 28000,
    leadsGenerated: 156,
    conversions: 18,
    roiPct: 185,
    ownerId: "karim",
    ownerName: "Karim Hassan",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    tags: ["nurture", "smb"],
  },
  {
    id: "camp-trade-retail",
    campaignNumber: "CMP-2026-0031",
    name: "Retail Tech Summit 2026",
    channel: "trade_show",
    status: "completed",
    budget: 520000,
    spent: 498000,
    leadsGenerated: 62,
    conversions: 9,
    roiPct: 220,
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    startDate: "2026-03-10",
    endDate: "2026-03-12",
    territoryId: "export",
    territoryName: "Export / APAC",
    tags: ["event", "retail"],
  },
  {
    id: "camp-paid-search",
    campaignNumber: "CMP-2026-0027",
    name: "Google Search — ERP Bangladesh",
    channel: "paid_search",
    status: "paused",
    budget: 120000,
    spent: 87000,
    leadsGenerated: 41,
    conversions: 4,
    roiPct: 95,
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    tags: ["ppc"],
  },
  {
    id: "camp-webinar-hr",
    campaignNumber: "CMP-2026-0022",
    name: "Webinar — HR + Sales alignment",
    channel: "webinar",
    status: "scheduled",
    budget: 35000,
    spent: 8000,
    leadsGenerated: 0,
    conversions: 0,
    roiPct: 0,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    startDate: "2026-07-05",
    endDate: "2026-07-05",
    tags: ["webinar"],
    description: "Co-marketing with HR module — registration opens 15 Jun",
  },
  {
    id: "camp-content-seo",
    campaignNumber: "CMP-2026-0018",
    name: "Content hub — Manufacturing ERP guides",
    channel: "content",
    status: "active",
    budget: 80000,
    spent: 42000,
    leadsGenerated: 29,
    conversions: 5,
    roiPct: 310,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    tags: ["content", "manufacturing"],
  },
  {
    id: "camp-draft-q3",
    campaignNumber: "CMP-2026-0012",
    name: "Q3 pharma vertical push",
    channel: "email",
    status: "draft",
    budget: 200000,
    spent: 0,
    leadsGenerated: 0,
    conversions: 0,
    roiPct: 0,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    tags: ["pharma", "draft"],
  },
];

export function getCampaignById(id: string): SmwCampaign | undefined {
  return smwCampaignsSeed.find((c) => c.id === id || c.campaignNumber === id);
}

export function formatCampaignCurrency(value: number): string {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000)}K`;
  return `৳${value.toLocaleString()}`;
}

export function campaignStatusToEnterprise(status: CampaignStatus): EnterpriseStatus {
  const map: Record<CampaignStatus, EnterpriseStatus> = {
    draft: "draft",
    scheduled: "pending",
    active: "active",
    paused: "pending",
    completed: "approved",
    archived: "archived",
  };
  return map[status];
}

export function computeCampaignMetrics(campaigns: SmwCampaign[]) {
  const active = campaigns.filter((c) => c.status === "active");
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leadsGenerated, 0);
  const avgRoi =
    campaigns.filter((c) => c.roiPct > 0).length > 0
      ? Math.round(
          campaigns.filter((c) => c.roiPct > 0).reduce((s, c) => s + c.roiPct, 0) /
            campaigns.filter((c) => c.roiPct > 0).length,
        )
      : 0;
  return { activeCount: active.length, totalBudget, totalSpent, totalLeads, avgRoi };
}

export function emptyCampaign(): SmwCampaign {
  const owner = SMW_CAMPAIGN_OWNERS[0]!;
  return {
    id: `camp-${Date.now()}`,
    campaignNumber: `CMP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    name: "",
    channel: "email",
    status: "draft",
    budget: 0,
    spent: 0,
    leadsGenerated: 0,
    conversions: 0,
    roiPct: 0,
    ownerId: owner.id,
    ownerName: owner.name,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    tags: [],
  };
}

export function budgetUtilization(campaign: SmwCampaign): number {
  if (campaign.budget <= 0) return 0;
  return Math.min(100, Math.round((campaign.spent / campaign.budget) * 100));
}
