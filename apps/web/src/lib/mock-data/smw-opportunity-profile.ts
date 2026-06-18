import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";

export type OpportunityProfileActivity = {
  id: string;
  type: string;
  title: string;
  meta: string;
  time: string;
};

export type OpportunityProfileQuotation = {
  id: string;
  number: string;
  amount: string;
  status: string;
  href: string;
};

export type OpportunityProfileProduct = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type OpportunityProfileData = {
  products: OpportunityProfileProduct[];
  quotations: OpportunityProfileQuotation[];
  activities: OpportunityProfileActivity[];
};

export function getOpportunityProfile(opp: SmwOpportunity): OpportunityProfileData {
  return {
    products: [
      { id: "p1", name: "ERP Core License", qty: 1, unitPrice: Math.round(opp.amount * 0.5) },
      { id: "p2", name: "Implementation services", qty: 1, unitPrice: Math.round(opp.amount * 0.35) },
      { id: "p3", name: "Annual support", qty: 1, unitPrice: Math.round(opp.amount * 0.15) },
    ],
    quotations: [
      {
        id: "q-184",
        number: "Q-2026-184",
        amount: `৳${Math.round(opp.amount / 1000)}K`,
        status: opp.stage === "proposal" ? "Sent" : "Draft",
        href: `/sales-marketing/quotations?view=q-184`,
      },
    ],
    activities: [
      {
        id: "a1",
        type: "meeting",
        title: "Discovery workshop",
        meta: `${opp.accountName} stakeholders`,
        time: opp.lastActivityRelative,
      },
      {
        id: "a2",
        type: "email",
        title: "Proposal follow-up",
        meta: opp.ownerName,
        time: "3d ago",
      },
      {
        id: "a3",
        type: "stage",
        title: `Moved to ${opp.stage.replace(/_/g, " ")}`,
        meta: "Pipeline update",
        time: opp.createdAt,
      },
    ],
  };
}
