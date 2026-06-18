import { NextResponse } from "next/server";
import { getLeadById } from "@/lib/mock-data/smw-leads";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ data: lead });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  const body = await request.json();
  return NextResponse.json({ data: { ...lead, ...body } });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ data: { id, archived: true } });
}
