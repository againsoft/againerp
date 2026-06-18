import { HrPageShell } from "@/components/hr/hr-page-shell";
import { HrDashboard } from "@/components/hr/dashboard/hr-dashboard";

/** SCR-HR-DSH-001 — HR Manager Dashboard */
export default function HrDashboardPage() {
  return (
    <HrPageShell hideHeader>
      <HrDashboard />
    </HrPageShell>
  );
}
