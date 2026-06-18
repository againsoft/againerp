import { NextResponse } from "next/server";
import {
  SMW_AI_ACTIONS,
  SMW_AI_CONTEXT,
  SMW_AI_INSIGHTS,
  SMW_AI_RECOMMENDATIONS,
} from "@/lib/mock-data/smw-ai-workspace";

export function GET() {
  return NextResponse.json({
    data: { context: SMW_AI_CONTEXT, insights: SMW_AI_INSIGHTS, recommendations: SMW_AI_RECOMMENDATIONS, actions: SMW_AI_ACTIONS },
  });
}
