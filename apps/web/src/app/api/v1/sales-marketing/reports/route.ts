import { NextResponse } from "next/server";
import { smwReportCatalog } from "@/lib/mock-data/smw-reports";

export function GET() {
  return NextResponse.json({ data: smwReportCatalog, meta: { count: smwReportCatalog.length } });
}
