"use client";

import type { Employee } from "@/lib/mock-data/hr-employees";
import {
  EMPLOYEE_STATUS_LABELS,
  employeeInitials,
  employeeStatusBadgeVariant,
  formatEmployeeDate,
} from "@/lib/mock-data/hr-employees";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Pencil } from "lucide-react";

type Props = {
  employees: Employee[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  className?: string;
};

export function EmployeeMobileCards({
  employees,
  selectedIds,
  onToggleSelect,
  onView,
  onEdit,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-2 md:hidden", className)}>
      {employees.map((employee) => {
        const selected = selectedIds.has(employee.id);
        return (
          <article
            key={employee.id}
            className={cn(
              "rounded-lg border border-input bg-card p-3",
              selected && "border-primary/40 bg-primary/5",
            )}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-input"
                checked={selected}
                onChange={() => onToggleSelect(employee.id)}
                aria-label={`Select ${employee.name}`}
              />
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                aria-hidden
              >
                {employeeInitials(employee.name)}
              </div>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  className="text-left font-medium text-primary hover:underline"
                  onClick={() => onView(employee)}
                >
                  {employee.name}
                </button>
                <p className="font-mono text-[10px] text-muted-foreground">{employee.employeeNumber}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={employeeStatusBadgeVariant(employee.status)}
                    className="text-[10px]"
                  >
                    {EMPLOYEE_STATUS_LABELS[employee.status]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{employee.department}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {employee.designation} · Joined {formatEmployeeDate(employee.joiningDate)}
                </p>
                <p className="text-[10px] text-muted-foreground">{employee.branch}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-2">
              <Button type="button" variant="outline" size="sm" className="h-8 flex-1" onClick={() => onView(employee)}>
                <Eye className="mr-1 h-3.5 w-3.5" aria-hidden />
                View
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8 flex-1" onClick={() => onEdit(employee)}>
                <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden />
                Edit
              </Button>
            </div>
          </article>
        );
      })}
      {employees.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No employees match your filters.</p>
      )}
    </div>
  );
}
