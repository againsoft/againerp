import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPartnerById } from "@/lib/mock-data/business-partners";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const partner = getPartnerById(id);
  if (!partner) {
    return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  }
  return NextResponse.json({ data: partner });
}

