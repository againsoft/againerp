import { NextResponse } from "next/server";
import { getCommissionById } from "@/lib/mock-data/smw-commissions";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const commission = getCommissionById(id);
  if (!commission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: commission });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const commission = getCommissionById(id);
  if (!commission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ data: { ...commission, ...body } });
}
