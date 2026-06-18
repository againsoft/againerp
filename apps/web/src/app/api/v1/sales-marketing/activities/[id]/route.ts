import { NextResponse } from "next/server";
import { getActivityById } from "@/lib/mock-data/smw-activities";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const activity = getActivityById(id);
  if (!activity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: activity });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const activity = getActivityById(id);
  if (!activity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ data: { ...activity, ...body } });
}
