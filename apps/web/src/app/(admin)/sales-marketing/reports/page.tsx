import { ReportWorkspace } from "@/components/sales-marketing/reports/report-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-RPT-001 — Reporting hub */
export default function SmwReportsPage() {
  return (
    <SmwListShell title="Reports" subtitle="Revenue analytics, funnel metrics, and exportable reports." hideHeader>
      <ReportWorkspace />
    </SmwListShell>
  );
}
