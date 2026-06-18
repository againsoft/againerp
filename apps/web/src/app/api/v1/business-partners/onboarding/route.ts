import { NextResponse } from "next/server";
import { onboardingApplicationsSeed } from "@/lib/mock-data/business-partner-onboarding";

export function GET() {
  return NextResponse.json({
    data: onboardingApplicationsSeed,
    meta: { count: onboardingApplicationsSeed.length },
  });
}

