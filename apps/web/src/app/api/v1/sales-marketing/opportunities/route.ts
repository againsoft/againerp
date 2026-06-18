import { NextResponse } from "next/server";
import { smwOpportunitiesSeed } from "@/lib/mock-data/smw-opportunities";

export function GET() {
  return NextResponse.json({
    data: smwOpportunitiesSeed,
    meta: { count: smwOpportunitiesSeed.length },
  });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `opp-${Date.now()}`,
          opportunityNumber: `OPP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          ...body,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      },
      { status: 201 },
    ),
  );
}
