import { NextResponse } from "next/server";
import { partnerTiersSeed } from "@/lib/mock-data/business-partner-tiers";

export function GET() {
  return NextResponse.json({
    data: partnerTiersSeed,
    meta: { count: partnerTiersSeed.length },
  });
}

