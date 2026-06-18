import { NextResponse } from "next/server";
import { smwTeamsSeed, smwTeamMembersSeed } from "@/lib/mock-data/smw-teams";

export function GET() {
  return NextResponse.json({
    data: { teams: smwTeamsSeed, members: smwTeamMembersSeed },
    meta: { teamCount: smwTeamsSeed.length, memberCount: smwTeamMembersSeed.length },
  });
}

export function POST(request: Request) {
  return request.json().then((body) =>
    NextResponse.json(
      {
        data: {
          id: `team-${Date.now()}`,
          teamNumber: `TEAM-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
          status: "active",
          memberIds: [],
          quotaAchieved: 0,
          ...body,
        },
      },
      { status: 201 },
    ),
  );
}
