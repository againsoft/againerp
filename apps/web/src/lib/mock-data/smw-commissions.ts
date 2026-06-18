/**
 * Sales & Marketing — Commission mock data · SCR-SMW-COM-001
 */

import type { EnterpriseStatus } from "@/components/enterprise/types";
import { SMW_LEAD_OWNERS } from "@/lib/mock-data/smw-leads";

export type CommissionType = "standard" | "bonus" | "adjustment" | "clawback";
export type CommissionStatus = "pending" | "approved" | "paid" | "cancelled";

export type SmwCommission = {
  id: string;
  commissionNumber: string;
  repId: string;
  repName: string;
  dealName: string;
  opportunityId?: string;
  dealValue: number;
  commissionRate: number;
  commissionAmount: number;
  type: CommissionType;
  status: CommissionStatus;
  periodLabel: string;
  closedDate: string;
  payoutDate?: string;
  planName: string;
  notes?: string;
};

export const COMMISSION_TYPE_LABELS: Record<CommissionType, string> = {
  standard: "Standard",
  bonus: "Bonus",
  adjustment: "Adjustment",
  clawback: "Clawback",
};

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  cancelled: "Cancelled",
};

export const SMW_COMMISSION_PLANS = [
  { id: "enterprise-tier", name: "Enterprise tier — 8%" },
  { id: "midmarket-tier", name: "Mid-market — 6%" },
  { id: "smb-tier", name: "SMB — 4%" },
  { id: "accelerator", name: "Q2 accelerator — +2%" },
] as const;

export { SMW_LEAD_OWNERS as SMW_COMMISSION_REPS };

export const smwCommissionsSeed: SmwCommission[] = [
  {
    id: "com-001",
    commissionNumber: "COM-2026-0088",
    repId: "karim",
    repName: "Karim Hassan",
    dealName: "Nova Foods — Procurement suite",
    opportunityId: "opp-nova",
    dealValue: 680000,
    commissionRate: 8,
    commissionAmount: 54400,
    type: "standard",
    status: "pending",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-15",
    planName: "Enterprise tier — 8%",
  },
  {
    id: "com-002",
    commissionNumber: "COM-2026-0089",
    repId: "farhana",
    repName: "Farhana Rahman",
    dealName: "Pacific Textiles — WMS rollout",
    opportunityId: "opp-pacific",
    dealValue: 420000,
    commissionRate: 6,
    commissionAmount: 25200,
    type: "standard",
    status: "pending",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-12",
    planName: "Mid-market — 6%",
  },
  {
    id: "com-003",
    commissionNumber: "COM-2026-0090",
    repId: "nadia",
    repName: "Nadia Chowdhury",
    dealName: "Orion Steel — Full ERP",
    opportunityId: "opp-orion",
    dealValue: 920000,
    commissionRate: 8,
    commissionAmount: 73600,
    type: "standard",
    status: "approved",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-08",
    planName: "Enterprise tier — 8%",
  },
  {
    id: "com-004",
    commissionNumber: "COM-2026-0091",
    repId: "rafiq",
    repName: "Rafiq Islam",
    dealName: "Delta Construction — Phase 2",
    opportunityId: "opp-delta",
    dealValue: 350000,
    commissionRate: 6,
    commissionAmount: 21000,
    type: "standard",
    status: "pending",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-17",
    planName: "Mid-market — 6%",
  },
  {
    id: "com-005",
    commissionNumber: "COM-2026-0092",
    repId: "sadia",
    repName: "Sadia Akter",
    dealName: "Bright Auto Parts — CRM module",
    dealValue: 185000,
    commissionRate: 4,
    commissionAmount: 7400,
    type: "standard",
    status: "pending",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-14",
    planName: "SMB — 4%",
  },
  {
    id: "com-006",
    commissionNumber: "COM-2026-0093",
    repId: "karim",
    repName: "Karim Hassan",
    dealName: "Q2 quota accelerator",
    dealValue: 0,
    commissionRate: 0,
    commissionAmount: 15000,
    type: "bonus",
    status: "approved",
    periodLabel: "Q2 2026",
    closedDate: "2026-06-18",
    planName: "Q2 accelerator — +2%",
    notes: "Exceeded Q2 revenue target by 12%.",
  },
  {
    id: "com-007",
    commissionNumber: "COM-2026-0094",
    repId: "farhana",
    repName: "Farhana Rahman",
    dealName: "Metro Pharma — ERP (partial)",
    dealValue: 280000,
    commissionRate: 6,
    commissionAmount: 16800,
    type: "standard",
    status: "paid",
    periodLabel: "May 2026",
    closedDate: "2026-05-22",
    payoutDate: "2026-06-05",
    planName: "Mid-market — 6%",
  },
  {
    id: "com-008",
    commissionNumber: "COM-2026-0095",
    repId: "nadia",
    repName: "Nadia Chowdhury",
    dealName: "GreenTech — deal revision",
    dealValue: -80000,
    commissionRate: 6,
    commissionAmount: -4800,
    type: "clawback",
    status: "approved",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-10",
    planName: "Mid-market — 6%",
    notes: "Contract value reduced after scope change.",
  },
  {
    id: "com-009",
    commissionNumber: "COM-2026-0096",
    repId: "rafiq",
    repName: "Rafiq Islam",
    dealName: "Summit Logistics — Inventory",
    dealValue: 210000,
    commissionRate: 6,
    commissionAmount: 12600,
    type: "standard",
    status: "paid",
    periodLabel: "May 2026",
    closedDate: "2026-05-18",
    payoutDate: "2026-06-05",
    planName: "Mid-market — 6%",
  },
  {
    id: "com-010",
    commissionNumber: "COM-2026-0097",
    repId: "sadia",
    repName: "Sadia Akter",
    dealName: "Manual adjustment — referral bonus",
    dealValue: 0,
    commissionRate: 0,
    commissionAmount: 5000,
    type: "adjustment",
    status: "pending",
    periodLabel: "Jun 2026",
    closedDate: "2026-06-16",
    planName: "SMB — 4%",
    notes: "Partner referral credit approved by sales manager.",
  },
];

export function getCommissionById(id: string): SmwCommission | undefined {
  return smwCommissionsSeed.find((c) => c.id === id);
}

export function formatCommissionCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}৳${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}৳${Math.round(abs / 1_000)}K`;
  return `${sign}৳${abs.toLocaleString()}`;
}

export function commissionStatusToEnterprise(status: CommissionStatus): EnterpriseStatus {
  const map: Record<CommissionStatus, EnterpriseStatus> = {
    pending: "pending",
    approved: "active",
    paid: "approved",
    cancelled: "rejected",
  };
  return map[status];
}

export function computeCommissionMetrics(commissions: SmwCommission[]) {
  const pending = commissions.filter((c) => c.status === "pending");
  const approved = commissions.filter((c) => c.status === "approved");
  const paid = commissions.filter((c) => c.status === "paid");
  const pendingAmount = pending.reduce((s, c) => s + c.commissionAmount, 0);
  const approvedAmount = approved.reduce((s, c) => s + c.commissionAmount, 0);
  const paidMtd = paid.reduce((s, c) => s + c.commissionAmount, 0);
  const pendingReps = new Set(pending.map((c) => c.repId)).size;
  return {
    pendingCount: pending.length,
    pendingAmount,
    approvedCount: approved.length,
    approvedAmount,
    paidMtd,
    pendingReps,
  };
}

export function emptyCommission(): SmwCommission {
  const rep = SMW_LEAD_OWNERS[0]!;
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `com-${Date.now()}`,
    commissionNumber: `COM-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    repId: rep.id,
    repName: rep.name,
    dealName: "",
    dealValue: 0,
    commissionRate: 6,
    commissionAmount: 0,
    type: "standard",
    status: "pending",
    periodLabel: "Jun 2026",
    closedDate: today,
    planName: SMW_COMMISSION_PLANS[1]!.name,
  };
}

export function calcCommissionAmount(dealValue: number, rate: number): number {
  if (dealValue <= 0 || rate <= 0) return 0;
  return Math.round(dealValue * (rate / 100));
}
