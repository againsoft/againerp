import { NextResponse } from "next/server";
import { smwQuotationsSeed } from "@/lib/mock-data/smw-quotations";

export function GET() {
  return NextResponse.json({
    data: smwQuotationsSeed,
    meta: { count: smwQuotationsSeed.length },
  });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `quo-${Date.now()}`,
          quotationNumber: `QUO-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          status: "draft",
          version: 1,
          ...body,
        },
      },
      { status: 201 },
    ),
  );
}
