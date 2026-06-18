/**
 * Lead 360 profile mock data
 */

import type { SmwLead } from "@/lib/mock-data/smw-leads";

export type LeadProfileActivity = {
  id: string;
  type: string;
  title: string;
  meta: string;
  time: string;
};

export type LeadProfileHistory = {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
  time: string;
};

export type LeadProfileData = {
  relatedOpportunityId?: string;
  relatedOpportunityName?: string;
  activities: LeadProfileActivity[];
  history: LeadProfileHistory[];
  aiInsights: { id: string; title: string; summary: string }[];
};

export function getLeadProfile(lead: SmwLead): LeadProfileData {
  return {
    relatedOpportunityId: lead.status === "converted" ? "opp-882" : undefined,
    relatedOpportunityName: lead.status === "converted" ? `${lead.company} — ERP rollout` : undefined,
    activities: [
      {
        id: "a1",
        type: "call",
        title: "Discovery call completed",
        meta: `Discussed ${lead.company} inventory pain points`,
        time: lead.lastActivityRelative,
      },
      {
        id: "a2",
        type: "email",
        title: "Pricing guide sent",
        meta: lead.email,
        time: "3d ago",
      },
      {
        id: "a3",
        type: "note",
        title: "Lead created",
        meta: `Source: ${lead.source}`,
        time: lead.createdAt,
      },
    ],
    history: [
      {
        id: "h1",
        field: "Status",
        oldValue: "New",
        newValue: LEAD_STATUS_LABEL(lead.status),
        user: lead.ownerName,
        time: lead.lastActivityAt.slice(0, 10),
      },
      {
        id: "h2",
        field: "Score",
        oldValue: String(Math.max(0, lead.score - 12)),
        newValue: String(lead.score),
        user: "System",
        time: lead.createdAt,
      },
    ],
    aiInsights: [
      {
        id: "ai1",
        title: lead.score >= 80 ? "High-intent lead" : "Follow-up recommended",
        summary:
          lead.score >= 80
            ? `${lead.name} matches ICP for mid-market ERP. Suggest demo within 48h.`
            : `No activity in ${lead.lastActivityRelative}. Schedule a check-in call.`,
      },
    ],
  };
}

function LEAD_STATUS_LABEL(status: SmwLead["status"]): string {
  const labels: Record<SmwLead["status"], string> = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    unqualified: "Unqualified",
    converted: "Converted",
  };
  return labels[status];
}
