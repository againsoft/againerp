import { ActivityWorkspace } from "@/components/sales-marketing/activities/activity-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-ACT-001 — Activity center */
export default function SmwActivitiesPage() {
  return (
    <SmwListShell title="Activities" subtitle="Calls, meetings, tasks, and follow-ups across the revenue team." hideHeader>
      <ActivityWorkspace />
    </SmwListShell>
  );
}
