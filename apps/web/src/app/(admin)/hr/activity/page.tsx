import { GlobalActivityTimeline } from "@/components/timeline/global-activity-timeline";
import { HrListShell } from "@/components/hr/hr-page-shell";

/** Global Activity Timeline hub — NAV-HR-ACT-001 · CMP-TML-LAYOUT-001 */
export default function HrActivityPage() {
  return (
    <HrListShell
      title="Activity Timeline"
      subtitle="Cross-module activity feed, attendance events, and audit exports."
      hideHeader
    >
      <GlobalActivityTimeline />
    </HrListShell>
  );
}
