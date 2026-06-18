import { NextResponse } from "next/server";
import { smwCampaignsSeed } from "@/lib/mock-data/smw-campaigns";

export function GET() {
  return NextResponse.json({ data: smwCampaignsSeed, meta: { count: smwCampaignsSeed.length } });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `camp-${Date.now()}`,
          campaignNumber: `CMP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          status: "draft",
          spent: 0,
          leadsGenerated: 0,
          conversions: 0,
          roiPct: 0,
          ...body,
        },
      },
      { status: 201 },
    ),
  );
}
