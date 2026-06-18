import { NextResponse } from "next/server";
import { smwActivitiesSeed } from "@/lib/mock-data/smw-activities";

export function GET() {
  return NextResponse.json({ data: smwActivitiesSeed, meta: { count: smwActivitiesSeed.length } });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `act-${Date.now()}`,
          activityNumber: `ACT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          status: "open",
          createdAt: new Date().toISOString(),
          ...body,
        },
      },
      { status: 201 },
    ),
  );
}
