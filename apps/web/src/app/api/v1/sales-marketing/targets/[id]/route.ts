import { NextResponse } from "next/server";
import { getTargetById } from "@/lib/mock-data/smw-targets";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const target = getTargetById(id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: target });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const target = getTargetById(id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ data: { ...target, ...body } });
}
