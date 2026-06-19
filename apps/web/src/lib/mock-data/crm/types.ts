export type CrmLeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type CrmLeadSource = "website" | "referral" | "linkedin" | "trade_show" | "cold_call" | "email_campaign";

export type CrmLead = {
  id: string;
  leadNumber: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: CrmLeadSource;
  status: CrmLeadStatus;
  score: number;
  ownerId: string;
  ownerName: string;
  expectedValue: number;
  lastActivityAt: string;
  lastActivityRelative: string;
  tags: string[];
  createdAt: string;
  title?: string;
  notes?: string;
};

export type CrmLeadDetailTab =
  | "overview"
  | "activities"
  | "notes"
  | "emails"
  | "calls"
  | "meetings"
  | "attachments"
  | "history";

export type CrmContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  ownerName: string;
  lastActivityRelative: string;
  tags: string[];
};

export type CrmPipelineStage = "qualification" | "proposal" | "negotiation" | "won" | "lost";

export type CrmOpportunity = {
  id: string;
  name: string;
  company: string;
  stage: CrmPipelineStage;
  value: number;
  ownerName: string;
  probability: number;
  closeDate: string;
  leadId?: string;
};

export type CrmActivityType = "call" | "meeting" | "task" | "follow_up" | "email";
export type CrmActivityStatus = "open" | "scheduled" | "completed" | "overdue";

export type CrmActivity = {
  id: string;
  type: CrmActivityType;
  title: string;
  relatedTo: string;
  ownerName: string;
  dueDate: string;
  status: CrmActivityStatus;
  notes?: string;
};

export const CRM_LEAD_STATUSES: CrmLeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export const CRM_LEAD_STATUS_LABELS: Record<CrmLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  lost: "Lost",
};

export const CRM_LEAD_SOURCE_LABELS: Record<CrmLeadSource, string> = {
  website: "Website",
  referral: "Referral",
  linkedin: "LinkedIn",
  trade_show: "Trade show",
  cold_call: "Cold call",
  email_campaign: "Email campaign",
};

export const CRM_PIPELINE_STAGES: CrmPipelineStage[] = [
  "qualification",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

export const CRM_PIPELINE_STAGE_LABELS: Record<CrmPipelineStage, string> = {
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const CRM_LEAD_DETAIL_TABS: { id: CrmLeadDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "activities", label: "Activities" },
  { id: "notes", label: "Notes" },
  { id: "emails", label: "Emails" },
  { id: "calls", label: "Calls" },
  { id: "meetings", label: "Meetings" },
  { id: "attachments", label: "Attachments" },
  { id: "history", label: "History" },
];

export const CRM_OWNERS = [
  { id: "farhana", name: "Farhana Rahman" },
  { id: "karim", name: "Karim Hassan" },
  { id: "nadia", name: "Nadia Chowdhury" },
  { id: "sadia", name: "Sadia Akter" },
] as const;

export const CRM_SAVED_VIEWS = [
  { id: "all", label: "All leads" },
  { id: "hot", label: "Hot leads (80+)" },
  { id: "open", label: "Open leads" },
  { id: "my", label: "My leads" },
  { id: "stale", label: "No activity 7d+" },
] as const;

export function crmLeadInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatCrmCurrency(value: number) {
  if (value >= 1_000_000) return `৳ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `৳ ${(value / 1_000).toFixed(0)}K`;
  return `৳ ${value.toLocaleString()}`;
}

export function crmScoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-muted-foreground/50";
}

export function isCrmLeadDetailTab(v: string): v is CrmLeadDetailTab {
  return CRM_LEAD_DETAIL_TABS.some((t) => t.id === v);
}
