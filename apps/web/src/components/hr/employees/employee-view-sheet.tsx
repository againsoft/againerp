"use client";

import type { Employee } from "@/lib/mock-data/hr-employees";
import type { EmployeeProfileTab } from "@/lib/mock-data/hr-employee-profile";
import { EmployeeDetailContent } from "@/components/hr/employees/employee-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  initialTab?: EmployeeProfileTab;
  onTabChange?: (tab: EmployeeProfileTab) => void;
  onEdit?: (employee: Employee) => void;
};

export function EmployeeViewSheet({
  open,
  onOpenChange,
  employee,
  initialTab,
  onTabChange,
  onEdit,
}: Props) {
  if (!employee) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Employee profile · {employee.name}</p>
        <EmployeeDetailContent
          employee={employee}
          inDialog
          initialTab={initialTab}
          onTabChange={onTabChange}
          onClose={() => onOpenChange(false)}
          onEdit={onEdit}
        />
      </SheetContent>
    </Sheet>
  );
}
