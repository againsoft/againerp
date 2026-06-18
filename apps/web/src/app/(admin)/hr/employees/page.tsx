import { EmployeeDirectory } from "@/components/hr/employees/employee-directory";
import { HrListShell } from "@/components/hr/hr-page-shell";

/** SCR-HR-EMP-001 — Employee Directory */
export default function EmployeesPage() {
  return (
    <HrListShell
      title="Employee Directory"
      subtitle="Find and manage workforce records — search, filter, and open profile drawers (?create, ?view, ?edit)."
    >
      <EmployeeDirectory />
    </HrListShell>
  );
}
