import { NextResponse } from "next/server";
import { getCampaignById } from "@/lib/mock-data/smw-campaigns";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  return NextResponse.json({ data: campaign });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ data: { ...campaign, ...body } });
}
