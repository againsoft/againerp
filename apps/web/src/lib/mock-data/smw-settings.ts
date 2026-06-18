/**
 * Sales & Marketing — Module settings · SCR-SMW-SET-001
 */

import { LEAD_SOURCE_LABELS, type LeadSource } from "@/lib/mock-data/smw-leads";
import { OPPORTUNITY_STAGES, type OpportunityStage } from "@/lib/mock-data/smw-opportunities";

export type SmwSettingsSection = "general" | "pipeline" | "leads" | "quotations";

export type SmwSettings = {
  leadNumberPrefix: string;
  nextLeadSequence: number;
  opportunityNumberPrefix: string;
  nextOpportunitySequence: number;
  quotationNumberPrefix: string;
  nextQuotationSequence: number;
  defaultQuoteValidityDays: number;
  defaultQuotationTemplate: string;
  fiscalYearStartMonth: number;
  defaultTerritoryId: string;
  autoAssignInboundLeads: boolean;
  requireManagerApprovalAbove: number;
  enableAiCopilot: boolean;
  enableAiDealScoring: boolean;
  enableCommissionAutoCalc: boolean;
  defaultCommissionRate: number;
  enabledLeadSources: LeadSource[];
  stageProbabilities: Record<OpportunityStage, number>;
};

export const SMW_SETTINGS_SECTIONS: { id: SmwSettingsSection; label: string; description: string }[] = [
  { id: "general", label: "General", description: "Module defaults and feature toggles" },
  { id: "pipeline", label: "Pipeline", description: "Opportunity stages and win probabilities" },
  { id: "leads", label: "Leads", description: "Sources, numbering, and assignment" },
  { id: "quotations", label: "Quotations", description: "Templates, validity, and numbering" },
];

export const SMW_QUOTATION_TEMPLATES = [
  { id: "standard", name: "Standard ERP proposal" },
  { id: "enterprise", name: "Enterprise bundle" },
  { id: "smb", name: "SMB quick quote" },
  { id: "services", name: "Professional services" },
] as const;

export const SMW_FISCAL_MONTHS = [
  { value: 1, label: "January" },
  { value: 4, label: "April" },
  { value: 7, label: "July" },
  { value: 10, label: "October" },
] as const;

export const defaultSmwSettings = (): SmwSettings => ({
  leadNumberPrefix: "LD-",
  nextLeadSequence: 400,
  opportunityNumberPrefix: "OPP-",
  nextOpportunitySequence: 900,
  quotationNumberPrefix: "QT-",
  nextQuotationSequence: 200,
  defaultQuoteValidityDays: 30,
  defaultQuotationTemplate: "standard",
  fiscalYearStartMonth: 7,
  defaultTerritoryId: "dhk",
  autoAssignInboundLeads: true,
  requireManagerApprovalAbove: 15,
  enableAiCopilot: true,
  enableAiDealScoring: true,
  enableCommissionAutoCalc: true,
  defaultCommissionRate: 6,
  enabledLeadSources: Object.keys(LEAD_SOURCE_LABELS) as LeadSource[],
  stageProbabilities: Object.fromEntries(
    OPPORTUNITY_STAGES.map((s) => [s.id, s.probability]),
  ) as Record<OpportunityStage, number>,
});

export const smwSettingsSeed: SmwSettings = defaultSmwSettings();
