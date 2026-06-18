import { NextResponse } from "next/server";
import { smwLeadsSeed } from "@/lib/mock-data/smw-leads";

export function GET() {
  const data = smwLeadsSeed.filter((l) => !l.archived);
  return NextResponse.json({
    data,
    meta: { count: data.length },
  });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `lead-${Date.now()}`,
          leadNumber: `LD-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          ...body,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      },
      { status: 201 },
    ),
  );
}
