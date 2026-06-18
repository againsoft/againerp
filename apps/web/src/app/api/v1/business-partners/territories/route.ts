import { NextResponse } from "next/server";
import { partnerTerritoriesSeed } from "@/lib/mock-data/business-partner-territories";

export function GET() {
  return NextResponse.json({
    data: partnerTerritoriesSeed,
    meta: { count: partnerTerritoriesSeed.length },
  });
}

