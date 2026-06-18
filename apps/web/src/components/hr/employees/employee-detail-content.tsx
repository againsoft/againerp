"use client";

import type { Employee } from "@/lib/mock-data/hr-employees";
import type { EmployeeProfileTab } from "@/lib/mock-data/hr-employee-profile";
import { EmployeeProfileWorkspace } from "@/components/hr/employees/profile/employee-profile-workspace";

type Props = {
  employee: Employee;
  inDialog?: boolean;
  initialTab?: EmployeeProfileTab;
  onTabChange?: (tab: EmployeeProfileTab) => void;
  onClose?: () => void;
  onEdit?: (employee: Employee) => void;
};

/** SCR-HR-EMP-004 — Employee 360° profile workspace */
export function EmployeeDetailContent({
  employee,
  inDialog,
  initialTab,
  onTabChange,
  onClose,
  onEdit,
}: Props) {
  return (
    <EmployeeProfileWorkspace
      employee={employee}
      inDialog={inDialog}
      initialTab={initialTab}
      onTabChange={onTabChange}
      onClose={onClose}
      onEdit={onEdit}
    />
  );
}
