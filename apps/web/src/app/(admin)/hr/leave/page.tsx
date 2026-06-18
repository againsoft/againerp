import { LeaveDashboard } from "@/components/hr/leave/leave-dashboard";
import { HrListShell } from "@/components/hr/hr-page-shell";

/** SCR-HR-LEV-001 · SCR-HR-DSH-003 — Leave Dashboard */
export default function LeavePage() {
  return (
    <HrListShell
      title="Leave"
      subtitle="Requests, balances, calendar, and approval queues."
      hideHeader
    >
      <LeaveDashboard />
    </HrListShell>
  );
}
