import { businessPartnersSeed } from "./business-partners";
import type { PartnerRole } from "./business-partners";

export type PartnerPerformanceRow = {
  id: string;
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  role: PartnerRole;
  period: string;
  spendTotal: number;
  revenueTotal: number;
  onTimeDeliveryPct: number;
  rejectRatePct: number;
  openPoCount: number;
  openSoCount: number;
};

export const performanceSummaryKpis = {
  totalSpendYtd: 0,
  totalRevenueYtd: 0,
  avgOnTimePct: 0,
  partnersActive: 0,
  onCreditHold: 0,
};

function buildPerformanceRows(): PartnerPerformanceRow[] {
  const rows: PartnerPerformanceRow[] = [];
  let idx = 0;
  for (const p of businessPartnersSeed) {
    if (p.status !== "active" && p.status !== "on_hold") continue;
    const role = p.primaryRole;
    rows.push({
      id: `perf_${idx++}`,
      partnerId: p.id,
      partnerCode: p.partnerCode,
      partnerName: p.name,
      role,
      period: "2026-06",
      spendTotal: p.spendYtd,
      revenueTotal: p.revenueYtd,
      onTimeDeliveryPct: role === "vendor" ? 88 + (p.rating * 2) : 0,
      rejectRatePct: role === "vendor" ? Math.max(0.5, 5 - p.rating) : 0,
      openPoCount: p.openPos,
      openSoCount: p.openSos,
    });
  }
  return rows.sort((a, b) => b.spendTotal + b.revenueTotal - (a.spendTotal + a.revenueTotal));
}

export const partnerPerformanceRows = buildPerformanceRows();

performanceSummaryKpis.totalSpendYtd = partnerPerformanceRows.reduce((s, r) => s + r.spendTotal, 0);
performanceSummaryKpis.totalRevenueYtd = partnerPerformanceRows.reduce((s, r) => s + r.revenueTotal, 0);
const vendorRows = partnerPerformanceRows.filter((r) => r.onTimeDeliveryPct > 0);
performanceSummaryKpis.avgOnTimePct =
  vendorRows.length > 0
    ? Math.round(vendorRows.reduce((s, r) => s + r.onTimeDeliveryPct, 0) / vendorRows.length)
    : 0;
performanceSummaryKpis.partnersActive = businessPartnersSeed.filter((p) => p.status === "active").length;
performanceSummaryKpis.onCreditHold = businessPartnersSeed.filter((p) => p.creditHold).length;

export const spendByVendorChart = partnerPerformanceRows
  .filter((r) => r.spendTotal > 0)
  .slice(0, 6)
  .map((r) => ({ name: r.partnerName.split(" ")[0], spend: r.spendTotal }));

export const revenueByChannelChart = partnerPerformanceRows
  .filter((r) => r.revenueTotal > 0)
  .slice(0, 6)
  .map((r) => ({ name: r.partnerName.split(" ")[0], revenue: r.revenueTotal }));

export const onTimeTrendChart = [
  { month: "Jan", otd: 86 },
  { month: "Feb", otd: 88 },
  { month: "Mar", otd: 87 },
  { month: "Apr", otd: 91 },
  { month: "May", otd: 89 },
  { month: "Jun", otd: performanceSummaryKpis.avgOnTimePct || 90 },
];
