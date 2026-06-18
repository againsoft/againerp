/**
 * Sales & Marketing — Lead mock data · SCR-SMW-LDS-001
 * @see docs/modules/sales-marketing/ui-design/03_LEAD_MANAGEMENT_UI_DESIGN.md
 */

import type { EnterpriseStatus } from "@/components/enterprise/types";

export type LeadStatus = "new" | "contacted" | "qualified" | "unqualified" | "converted";
export type LeadSource =
  | "website"
  | "referral"
  | "linkedin"
  | "trade_show"
  | "cold_call"
  | "email_campaign";

export type SmwLead = {
  id: string;
  leadNumber: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  ownerId: string;
  ownerName: string;
  territoryId: string;
  territoryName: string;
  expectedValue: number;
  lastActivityAt: string;
  lastActivityRelative: string;
  tags: string[];
  createdAt: string;
  archived?: boolean;
  notes?: string;
  title?: string;
};

export type LeadProfileTab = "overview" | "activity" | "documents" | "history";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  unqualified: "Unqualified",
  converted: "Converted",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  linkedin: "LinkedIn",
  trade_show: "Trade show",
  cold_call: "Cold call",
  email_campaign: "Email campaign",
};

export const SMW_LEAD_OWNERS = [
  { id: "farhana", name: "Farhana Rahman" },
  { id: "karim", name: "Karim Hassan" },
  { id: "nadia", name: "Nadia Chowdhury" },
  { id: "rafiq", name: "Rafiq Islam" },
  { id: "sadia", name: "Sadia Akter" },
] as const;

export const SMW_LEAD_TERRITORIES = [
  { id: "dhk", name: "Dhaka Metro" },
  { id: "ctg", name: "Chittagong" },
  { id: "syl", name: "Sylhet" },
  { id: "export", name: "Export / APAC" },
] as const;

export type SmwLeadSavedView = {
  id: string;
  label: string;
  status?: string;
  minScore?: number;
  ownerId?: string;
  stale?: boolean;
};

export const SMW_LEAD_SAVED_VIEWS: SmwLeadSavedView[] = [
  { id: "all", label: "All leads", status: "" },
  { id: "hot", label: "Hot leads (80+)", status: "", minScore: 80 },
  { id: "open", label: "Open pipeline", status: "open" },
  { id: "my", label: "My leads", ownerId: "karim" },
  { id: "stale", label: "No activity 7d+", stale: true },
];

export const smwLeadsSeed: SmwLead[] = [
  {
    id: "lead-001",
    leadNumber: "LD-2026-0381",
    name: "Ahmed Karim",
    company: "GreenTech Solutions",
    email: "ahmed.k@greentech.bd",
    phone: "+880 1712 445566",
    source: "linkedin",
    status: "qualified",
    score: 86,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedValue: 420000,
    lastActivityAt: "2026-06-18T08:30:00",
    lastActivityRelative: "2h ago",
    tags: ["enterprise", "erp"],
    createdAt: "2026-06-02",
    title: "IT Director",
  },
  {
    id: "lead-002",
    leadNumber: "LD-2026-0374",
    name: "Sultana Begum",
    company: "Nova Foods Ltd",
    email: "sultana@novafoods.com",
    phone: "+880 1811 223344",
    source: "referral",
    status: "contacted",
    score: 72,
    ownerId: "karim",
    ownerName: "Karim Hassan",
    territoryId: "ctg",
    territoryName: "Chittagong",
    expectedValue: 280000,
    lastActivityAt: "2026-06-17T14:20:00",
    lastActivityRelative: "Yesterday",
    tags: ["fmcg"],
    createdAt: "2026-05-28",
    title: "Procurement Head",
  },
  {
    id: "lead-003",
    leadNumber: "LD-2026-0362",
    name: "Tanvir Hossain",
    company: "Metro Distributors",
    email: "tanvir@metrodist.bd",
    phone: "+880 1912 998877",
    source: "website",
    status: "new",
    score: 58,
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedValue: 95000,
    lastActivityAt: "2026-06-16T10:00:00",
    lastActivityRelative: "2d ago",
    tags: ["smb"],
    createdAt: "2026-06-16",
  },
  {
    id: "lead-004",
    leadNumber: "LD-2026-0355",
    name: "Priya Sharma",
    company: "Acme Retail Group",
    email: "priya.sharma@acmeretail.in",
    phone: "+91 98765 43210",
    source: "trade_show",
    status: "qualified",
    score: 91,
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    territoryId: "export",
    territoryName: "Export / APAC",
    expectedValue: 680000,
    lastActivityAt: "2026-06-15T09:15:00",
    lastActivityRelative: "3d ago",
    tags: ["retail", "multi-store"],
    createdAt: "2026-05-20",
    title: "VP Operations",
  },
  {
    id: "lead-005",
    leadNumber: "LD-2026-0348",
    name: "Jamal Uddin",
    company: "Sylhet Tea Exports",
    email: "jamal@ste.bd",
    phone: "+880 1711 556677",
    source: "cold_call",
    status: "contacted",
    score: 45,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    territoryId: "syl",
    territoryName: "Sylhet",
    expectedValue: 120000,
    lastActivityAt: "2026-06-14T16:40:00",
    lastActivityRelative: "4d ago",
    tags: ["export"],
    createdAt: "2026-06-10",
  },
  {
    id: "lead-006",
    leadNumber: "LD-2026-0331",
    name: "Mehreen Alam",
    company: "UrbanWear BD",
    email: "mehreen@urbanwear.bd",
    phone: "+880 1612 334455",
    source: "email_campaign",
    status: "new",
    score: 82,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedValue: 150000,
    lastActivityAt: "2026-06-18T06:00:00",
    lastActivityRelative: "4h ago",
    tags: ["fashion", "hot"],
    createdAt: "2026-06-17",
    notes: "Downloaded pricing guide — high intent",
  },
  {
    id: "lead-007",
    leadNumber: "LD-2026-0319",
    name: "Rashid Khan",
    company: "Delta Logistics",
    email: "rashid@deltalog.com",
    phone: "+880 1819 112233",
    source: "website",
    status: "unqualified",
    score: 22,
    ownerId: "karim",
    ownerName: "Karim Hassan",
    territoryId: "ctg",
    territoryName: "Chittagong",
    expectedValue: 0,
    lastActivityAt: "2026-06-01T11:00:00",
    lastActivityRelative: "2w ago",
    tags: [],
    createdAt: "2026-05-15",
    notes: "Budget too low for enterprise tier",
  },
  {
    id: "lead-008",
    leadNumber: "LD-2026-0302",
    name: "Nusrat Jahan",
    company: "Brightline Pharma",
    email: "nusrat@brightlinepharma.com",
    phone: "+880 1713 778899",
    source: "referral",
    status: "converted",
    score: 95,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedValue: 520000,
    lastActivityAt: "2026-06-12T15:30:00",
    lastActivityRelative: "6d ago",
    tags: ["pharma", "won"],
    createdAt: "2026-04-10",
  },
  {
    id: "lead-009",
    leadNumber: "LD-2026-0295",
    name: "Imran Chowdhury",
    company: "Coastal Fisheries",
    email: "imran@coastfish.bd",
    phone: "+880 1911 445566",
    source: "linkedin",
    status: "new",
    score: 64,
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    territoryId: "ctg",
    territoryName: "Chittagong",
    expectedValue: 180000,
    lastActivityAt: "2026-06-17T08:00:00",
    lastActivityRelative: "Yesterday",
    tags: ["seafood"],
    createdAt: "2026-06-14",
  },
  {
    id: "lead-010",
    leadNumber: "LD-2026-0288",
    name: "Laila Rahman",
    company: "Horizon Textiles",
    email: "laila@horizontext.com",
    phone: "+880 1611 887766",
    source: "trade_show",
    status: "contacted",
    score: 77,
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedValue: 340000,
    lastActivityAt: "2026-06-16T13:20:00",
    lastActivityRelative: "2d ago",
    tags: ["manufacturing"],
    createdAt: "2026-06-05",
  },
  {
    id: "lead-011",
    leadNumber: "LD-2026-0271",
    name: "Arif Mahmud",
    company: "SmartBuild Construction",
    email: "arif@smartbuild.bd",
    phone: "+880 1714 556677",
    source: "website",
    status: "qualified",
    score: 88,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    territoryId: "syl",
    territoryName: "Sylhet",
    expectedValue: 290000,
    lastActivityAt: "2026-06-18T09:00:00",
    lastActivityRelative: "1h ago",
    tags: ["construction"],
    createdAt: "2026-05-22",
  },
  {
    id: "lead-012",
    leadNumber: "LD-2026-0264",
    name: "Zara Islam",
    company: "CloudNine SaaS",
    email: "zara@cloudnine.io",
    phone: "+880 1812 334455",
    source: "email_campaign",
    status: "new",
    score: 55,
    ownerId: "karim",
    ownerName: "Karim Hassan",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    expectedValue: 75000,
    lastActivityAt: "2026-06-10T10:00:00",
    lastActivityRelative: "8d ago",
    tags: ["startup"],
    createdAt: "2026-06-08",
  },
];

export function getLeadById(id: string): SmwLead | undefined {
  return smwLeadsSeed.find((l) => l.id === id);
}

export function leadInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function leadStatusToEnterprise(status: LeadStatus): EnterpriseStatus {
  const map: Record<LeadStatus, EnterpriseStatus> = {
    new: "pending",
    contacted: "pending",
    qualified: "active",
    unqualified: "rejected",
    converted: "approved",
  };
  return map[status];
}

export function formatLeadCurrency(value: number): string {
  if (value <= 0) return "—";
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000)}K`;
  return `৳${value.toLocaleString()}`;
}

export function leadScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  if (score >= 40) return "bg-orange-400";
  return "bg-muted-foreground/40";
}

export function countLeadsByStatus(leads: SmwLead[]): Record<LeadStatus | "all" | "open", number> {
  const active = leads.filter((l) => !l.archived);
  const counts = {
    all: active.length,
    open: active.filter((l) => l.status !== "converted" && l.status !== "unqualified").length,
    new: 0,
    contacted: 0,
    qualified: 0,
    unqualified: 0,
    converted: 0,
  } as Record<LeadStatus | "all" | "open", number>;
  for (const l of active) {
    counts[l.status] += 1;
  }
  return counts;
}

export function isLeadProfileTab(value: string | null): value is LeadProfileTab {
  return value === "overview" || value === "activity" || value === "documents" || value === "history";
}

export function emptyLead(): SmwLead {
  const owner = SMW_LEAD_OWNERS[0]!;
  const territory = SMW_LEAD_TERRITORIES[0]!;
  return {
    id: `lead-${Date.now()}`,
    leadNumber: `LD-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "website",
    status: "new",
    score: 50,
    ownerId: owner.id,
    ownerName: owner.name,
    territoryId: territory.id,
    territoryName: territory.name,
    expectedValue: 0,
    lastActivityAt: new Date().toISOString(),
    lastActivityRelative: "Just now",
    tags: [],
    createdAt: new Date().toISOString().slice(0, 10),
  };
}
