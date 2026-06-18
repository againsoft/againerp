import { PayrollDashboard } from "@/components/payroll/payroll-dashboard";
import { HrListShell } from "@/components/hr/hr-page-shell";

/** SCR-PAY-DSH-001 — Payroll Dashboard */
export default function PayrollDashboardPage() {
  return (
    <HrListShell
      title="Payroll"
      subtitle="Pay periods, runs, payslips, and compliance."
      hideHeader
    >
      <PayrollDashboard />
    </HrListShell>
  );
}
