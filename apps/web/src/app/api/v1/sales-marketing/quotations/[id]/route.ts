import { NextResponse } from "next/server";
import { getQuotationById } from "@/lib/mock-data/smw-quotations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const quo = getQuotationById(id);
  if (!quo) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
  return NextResponse.json({ data: quo });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const quo = getQuotationById(id);
  if (!quo) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ data: { ...quo, ...body } });
}
