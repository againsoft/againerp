import { create } from "zustand";
import { crmLeadsSeed, crmOpportunitiesSeed } from "@/lib/mock-data/crm";
import type { CrmLead, CrmLeadStatus, CrmPipelineStage, CrmOpportunity } from "@/lib/mock-data/crm/types";

type CrmState = {
  leads: CrmLead[];
  opportunities: CrmOpportunity[];
  updateLeadStatus: (id: string, status: CrmLeadStatus) => void;
  updateOpportunityStage: (id: string, stage: CrmPipelineStage) => void;
  assignLeadOwner: (ids: string[], ownerId: string, ownerName: string) => void;
};

export const useCrmStore = create<CrmState>((set) => ({
  leads: crmLeadsSeed,
  opportunities: crmOpportunitiesSeed,
  updateLeadStatus: (id, status) =>
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
  updateOpportunityStage: (id, stage) =>
    set((s) => ({
      opportunities: s.opportunities.map((o) => (o.id === id ? { ...o, stage } : o)),
    })),
  assignLeadOwner: (ids, ownerId, ownerName) =>
    set((s) => ({
      leads: s.leads.map((l) => (ids.includes(l.id) ? { ...l, ownerId, ownerName } : l)),
    })),
}));
