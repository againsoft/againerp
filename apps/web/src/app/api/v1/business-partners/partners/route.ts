import { NextResponse } from "next/server";
import { businessPartnersSeed } from "@/lib/mock-data/business-partners";

export function GET() {
  return NextResponse.json({
    data: businessPartnersSeed,
    meta: { count: businessPartnersSeed.length },
  });
}

