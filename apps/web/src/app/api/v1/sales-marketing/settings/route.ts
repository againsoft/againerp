import { NextResponse } from "next/server";
import { smwSettingsSeed } from "@/lib/mock-data/smw-settings";

export function GET() {
  return NextResponse.json({ data: smwSettingsSeed });
}

export function PATCH(request: Request) {
  return request.json().then((body) =>
    NextResponse.json({ data: { ...smwSettingsSeed, ...body } }),
  );
}
