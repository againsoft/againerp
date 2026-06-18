import { NextResponse } from "next/server";
import { smwCommissionsSeed } from "@/lib/mock-data/smw-commissions";

export function GET() {
  return NextResponse.json({ data: smwCommissionsSeed, meta: { count: smwCommissionsSeed.length } });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `com-${Date.now()}`,
          commissionNumber: `COM-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          status: "pending",
          ...body,
        },
      },
      { status: 201 },
    ),
  );
}
