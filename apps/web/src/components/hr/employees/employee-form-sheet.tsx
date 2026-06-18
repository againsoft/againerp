"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Employee, EmployeeStatus } from "@/lib/mock-data/hr-employees";
import {
  EMPLOYEE_STATUS_LABELS,
  HR_BRANCHES,
  HR_DEPARTMENTS,
  HR_DESIGNATIONS,
} from "@/lib/mock-data/hr-employees";
import { useHrEmployeeStore } from "@/lib/store/hr-employee-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  employee: Employee | null;
  onSaved: (employee: Employee) => void;
};

function emptyEmployee(): Employee {
  return {
    id: `emp-${Date.now()}`,
    employeeNumber: `EMP-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    departmentId: "ops",
    department: "Operations",
    designationId: "off",
    designation: "Officer",
    branchId: "dhk",
    branch: "Dhaka HQ",
    status: "probation",
    joiningDate: new Date().toISOString().slice(0, 10),
    employmentType: "Permanent",
  };
}

export function EmployeeFormSheet({ open, onOpenChange, mode, employee, onSaved }: Props) {
  const upsertEmployee = useHrEmployeeStore((s) => s.upsertEmployee);
  const [form, setForm] = useState<Employee>(employee ?? emptyEmployee());

  useEffect(() => {
    setForm(employee ?? emptyEmployee());
  }, [employee, open, mode]);

  const save = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    const saved: Employee = {
      ...form,
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email || `${form.firstName.toLowerCase()}.${form.lastName.toLowerCase()}@urbanwear.bd`,
    };
    upsertEmployee(saved);
    toast.success(mode === "create" ? "Employee created" : "Employee updated");
    onSaved(saved);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg"
        aria-describedby={undefined}
      >
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">
              {mode === "create" ? "New employee" : `Edit · ${employee?.name}`}
            </h2>
            <p className="text-xs text-muted-foreground">SCR-HR-EMP-002 / SCR-HR-EMP-003</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="First name">
              <Input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Last name">
              <Input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Employee ID">
              <Input
                value={form.employeeNumber}
                onChange={(e) => setForm((f) => ({ ...f, employeeNumber: e.target.value }))}
                className="h-9 font-mono"
              />
            </Field>
            <Field label="Joining date">
              <Input
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Department">
              <Select
                value={form.departmentId}
                className="h-9 w-full"
                onChange={(e) => {
                  const dept = HR_DEPARTMENTS.find((d) => d.id === e.target.value);
                  setForm((f) => ({
                    ...f,
                    departmentId: e.target.value,
                    department: dept?.name ?? f.department,
                  }));
                }}
              >
                {HR_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Branch">
              <Select
                value={form.branchId}
                className="h-9 w-full"
                onChange={(e) => {
                  const branch = HR_BRANCHES.find((b) => b.id === e.target.value);
                  setForm((f) => ({
                    ...f,
                    branchId: e.target.value,
                    branch: branch?.name ?? f.branch,
                  }));
                }}
              >
                {HR_BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Designation">
              <Select
                value={form.designation}
                className="h-9 w-full"
                onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              >
                {HR_DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                className="h-9 w-full"
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as EmployeeStatus }))
                }
              >
                {Object.entries(EMPLOYEE_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Email" className="sm:col-span-2">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Phone" className="sm:col-span-2">
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="h-9"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={save}>
              {mode === "create" ? "Create employee" : "Save changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
