import { NextResponse } from "next/server";
import { getTeamById } from "@/lib/mock-data/smw-teams";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const team = getTeamById(id);
  if (!team) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: team });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const team = getTeamById(id);
  if (!team) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ data: { ...team, ...body } });
}
