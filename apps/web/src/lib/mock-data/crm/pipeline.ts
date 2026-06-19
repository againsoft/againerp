import type { CrmOpportunity } from "./types";

export const crmOpportunitiesSeed: CrmOpportunity[] = [
  {
    id: "opp-001",
    name: "Metro Retail — Apparel",
    company: "Metro Retail Ltd",
    stage: "negotiation",
    value: 2_400_000,
    ownerName: "Karim Hassan",
    probability: 78,
    closeDate: "2026-06-30",
    leadId: "lead-001",
  },
  {
    id: "opp-002",
    name: "GreenMart — Seasonal",
    company: "GreenMart Superstores",
    stage: "proposal",
    value: 890_000,
    ownerName: "Sadia Akter",
    probability: 55,
    closeDate: "2026-07-15",
    leadId: "lead-002",
  },
  {
    id: "opp-003",
    name: "TechHub — IT Equipment",
    company: "TechHub Ltd",
    stage: "qualification",
    value: 650_000,
    ownerName: "Nadia Chowdhury",
    probability: 30,
    closeDate: "2026-08-01",
    leadId: "lead-003",
  },
  {
    id: "opp-004",
    name: "UrbanWear B2B",
    company: "UrbanWear Retail",
    stage: "won",
    value: 1_560_000,
    ownerName: "Farhana Rahman",
    probability: 100,
    closeDate: "2026-06-10",
    leadId: "lead-004",
  },
  {
    id: "opp-005",
    name: "MediCare — Supplies",
    company: "MediCare Supplies",
    stage: "proposal",
    value: 920_000,
    ownerName: "Farhana Rahman",
    probability: 62,
    closeDate: "2026-07-01",
    leadId: "lead-008",
  },
  {
    id: "opp-006",
    name: "BuildMart — Hardware",
    company: "BuildMart Hardware",
    stage: "qualification",
    value: 1_100_000,
    ownerName: "Nadia Chowdhury",
    probability: 40,
    closeDate: "2026-07-20",
    leadId: "lead-007",
  },
  {
    id: "opp-007",
    name: "FreshFoods — Pilot",
    company: "FreshFoods Co",
    stage: "lost",
    value: 320_000,
    ownerName: "Karim Hassan",
    probability: 0,
    closeDate: "2026-06-05",
    leadId: "lead-005",
  },
];

export function getCrmOpportunityById(id: string) {
  return crmOpportunitiesSeed.find((o) => o.id === id);
}

export function sumPipelineValue(opps: CrmOpportunity[]) {
  return opps.filter((o) => !["won", "lost"].includes(o.stage)).reduce((s, o) => s + o.value, 0);
}
