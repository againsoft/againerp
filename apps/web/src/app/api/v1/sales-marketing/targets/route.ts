import { NextResponse } from "next/server";
import { smwTargetsSeed } from "@/lib/mock-data/smw-targets";

export function GET() {
  return NextResponse.json({ data: smwTargetsSeed, meta: { count: smwTargetsSeed.length } });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `tgt-${Date.now()}`,
          targetNumber: `TGT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          status: "draft",
          achievedValue: 0,
          ...body,
        },
      },
      { status: 201 },
    ),
  );
}
