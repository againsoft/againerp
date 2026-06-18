import { NextResponse } from "next/server";
import { getOpportunityById, getStageProbability } from "@/lib/mock-data/smw-opportunities";
import type { OpportunityStage } from "@/lib/mock-data/smw-opportunities";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const opp = getOpportunityById(id);
  if (!opp) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  return NextResponse.json({ data: opp });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const opp = getOpportunityById(id);
  if (!opp) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  const body = await request.json();
  const stage = body.stage as OpportunityStage | undefined;
  const updated = {
    ...opp,
    ...body,
    ...(stage ? { probability: getStageProbability(stage) } : {}),
  };
  return NextResponse.json({ data: updated });
}
