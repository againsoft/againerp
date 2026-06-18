import { NextResponse } from "next/server";
import {
  onTimeTrendChart,
  partnerPerformanceRows,
  performanceSummaryKpis,
  revenueByChannelChart,
  spendByVendorChart,
} from "@/lib/mock-data/business-partner-performance";

export function GET() {
  return NextResponse.json({
    data: {
      kpis: performanceSummaryKpis,
      rows: partnerPerformanceRows,
      charts: {
        spendByVendor: spendByVendorChart,
        revenueByChannel: revenueByChannelChart,
        onTimeTrend: onTimeTrendChart,
      },
    },
  });
}

