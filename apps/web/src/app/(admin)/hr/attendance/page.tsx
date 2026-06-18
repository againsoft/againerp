import { AttendanceDashboard } from "@/components/hr/attendance/attendance-dashboard";
import { HrListShell } from "@/components/hr/hr-page-shell";

/** SCR-HR-ATT-001 · SCR-HR-DSH-002 — Attendance Dashboard */
export default function AttendancePage() {
  return (
    <HrListShell
      title="Attendance"
      subtitle="Daily operations, corrections, and device health."
      hideHeader
    >
      <AttendanceDashboard />
    </HrListShell>
  );
}
