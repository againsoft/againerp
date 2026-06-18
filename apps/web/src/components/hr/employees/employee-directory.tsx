"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PaginationState, RowSelectionState, SortingState, VisibilityState } from "@tanstack/react-table";
import {
  Download,
  Filter,
  Plus,
  SlidersHorizontal,
  UserCog,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EmployeeFormSheet } from "@/components/hr/employees/employee-form-sheet";
import { EmployeeMobileCards } from "@/components/hr/employees/employee-mobile-cards";
import {
  EmployeeTable,
  getSelectedEmployees,
  type EmployeeTableColumnId,
} from "@/components/hr/employees/employee-table";
import { EmployeeViewSheet } from "@/components/hr/employees/employee-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  countEmployeesByStatus,
  getEmployeeById,
  hrEmployeesSeed,
  HR_BRANCHES,
  HR_DEPARTMENTS,
  HR_DESIGNATIONS,
  type Employee,
  type EmployeeStatus,
} from "@/lib/mock-data/hr-employees";
import {
  isEmployeeProfileTab,
  type EmployeeProfileTab,
} from "@/lib/mock-data/hr-employee-profile";
import { useHrEmployeeStore } from "@/lib/store/hr-employee-store";
import { cn } from "@/lib/utils";

const PAGE_SIZE_DEFAULT = 25;

const COLUMN_LABELS: Record<EmployeeTableColumnId, string> = {
  photo: "Photo",
  employeeNumber: "Employee ID",
  name: "Name",
  department: "Department",
  designation: "Designation",
  status: "Status",
  joiningDate: "Joining Date",
};

const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  photo: true,
  employeeNumber: true,
  name: true,
  department: true,
  designation: true,
  status: true,
  joiningDate: true,
};

const STATUS_TABS: { value: EmployeeStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "probation", label: "Probation" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
  { value: "archived", label: "Archived" },
];

type AdvancedFilters = {
  designation: string;
  manager: string;
  joiningFrom: string;
  joiningTo: string;
};

const DEFAULT_ADVANCED: AdvancedFilters = {
  designation: "all",
  manager: "all",
  joiningFrom: "",
  joiningTo: "",
};

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/hr/employees?${query}` : "/hr/employees";
}

function EmployeeDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeEmployees = useHrEmployeeStore((s) => s.employees);
  const updateStatus = useHrEmployeeStore((s) => s.updateStatus);
  const employees = storeEmployees.length > 0 ? storeEmployees : hrEmployeesSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const tabParam = searchParams.get("tab");
  const profileTab: EmployeeProfileTab = isEmployeeProfileTab(tabParam) ? tabParam : "overview";
  const statusParam = searchParams.get("status");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [branch, setBranch] = useState("all");
  const [statusTab, setStatusTab] = useState<EmployeeStatus | "all">(
    statusParam === "archived" ? "archived" : "all",
  );
  const [advanced, setAdvanced] = useState<AdvancedFilters>(DEFAULT_ADVANCED);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [columnSheetOpen, setColumnSheetOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY);
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });

  const resolveEmployee = (id: string | null) => {
    if (!id) return null;
    return employees.find((e) => e.id === id) ?? getEmployeeById(id) ?? null;
  };

  const editEmployee = useMemo(() => resolveEmployee(editId), [editId, employees]);
  const viewEmployee = useMemo(() => resolveEmployee(viewId), [viewId, employees]);

  const managers = useMemo(
    () =>
      [...new Set(employees.map((e) => e.managerName).filter(Boolean))].sort() as string[],
    [employees],
  );

  const counts = useMemo(() => countEmployeesByStatus(employees), [employees]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();
    return employees.filter((e) => {
      if (statusTab !== "all" && e.status !== statusTab) return false;
      if (department !== "all" && e.departmentId !== department) return false;
      if (branch !== "all" && e.branchId !== branch) return false;
      if (advanced.designation !== "all" && e.designation !== advanced.designation) return false;
      if (advanced.manager !== "all" && e.managerName !== advanced.manager) return false;
      if (advanced.joiningFrom && e.joiningDate < advanced.joiningFrom) return false;
      if (advanced.joiningTo && e.joiningDate > advanced.joiningTo) return false;
      if (
        q &&
        !e.name.toLowerCase().includes(q) &&
        !e.employeeNumber.toLowerCase().includes(q) &&
        !e.email.toLowerCase().includes(q) &&
        !e.department.toLowerCase().includes(q) &&
        !e.designation.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [employees, search, department, branch, statusTab, advanced]);

  const selectedEmployees = useMemo(
    () => getSelectedEmployees(filteredRows, rowSelection),
    [filteredRows, rowSelection],
  );

  const advancedCount = [
    advanced.designation !== "all",
    advanced.manager !== "all",
    advanced.joiningFrom !== "",
    advanced.joiningTo !== "",
  ].filter(Boolean).length;

  const activeFilterCount =
    advancedCount +
    (search ? 1 : 0) +
    (department !== "all" ? 1 : 0) +
    (branch !== "all" ? 1 : 0) +
    (statusTab !== "all" ? 1 : 0);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  const openCreate = () => {
    pushParams((params) => {
      params.delete("edit");
      params.delete("view");
      params.set("create", "1");
    });
  };

  const handleEdit = (employee: Employee) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", employee.id);
    });
  };

  const handleView = (employee: Employee) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", employee.id);
    });
  };

  const closeForm = () => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
      params.delete("tab");
    });
  };

  const handleProfileTabChange = (tab: EmployeeProfileTab) => {
    pushParams((params) => {
      if (tab === "overview") params.delete("tab");
      else params.set("tab", tab);
    });
  };

  const handleSaved = (employee: Employee) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", employee.id);
    });
  };

  const resetFilters = () => {
    setSearch("");
    setDepartment("all");
    setBranch("all");
    setStatusTab("all");
    setAdvanced(DEFAULT_ADVANCED);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const handleExport = (scope: "all" | "selected") => {
    const count = scope === "selected" ? selectedEmployees.length : filteredRows.length;
    toast.success(`Export started · ${count} employees (CSV)`);
  };

  const toggleMobileSelect = (id: string) => {
    setRowSelection((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, department, branch, statusTab, advanced]);

  useEffect(() => {
    if (editId && !editEmployee) {
      toast.error("Employee not found");
      closeForm();
    }
  }, [editId, editEmployee]);

  useEffect(() => {
    if (viewId && !viewEmployee && !editId && !createOpen) {
      toast.error("Employee not found");
      closeView();
    }
  }, [viewId, viewEmployee, editId, createOpen]);

  return (
    <>
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-0.5 overflow-x-auto rounded-lg border border-input bg-muted/30 p-1">
        {STATUS_TABS.map((tab) => {
          const count = tab.value === "all" ? counts.all : (counts[tab.value] ?? 0);
          const active = statusTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusTab(tab.value)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              )}
            >
              {tab.label}
              <span className={cn("ml-1.5 tabular-nums", active ? "text-foreground" : "text-muted-foreground/70")}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search name, ID, email, department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 max-w-[240px] text-xs"
          aria-label="Search employees"
        />
        <Select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="h-8 w-[150px] text-xs"
          aria-label="Department filter"
        >
          <option value="all">All departments</option>
          {HR_DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
        <Select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="h-8 w-[130px] text-xs"
          aria-label="Branch filter"
        >
          <option value="all">All branches</option>
          {HR_BRANCHES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>

        {activeFilterCount > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
            Clear
          </Button>
        )}

        <div className="ml-auto flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setAdvancedOpen(true)}
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Advanced
            {advancedCount > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                {advancedCount}
              </span>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setColumnSheetOpen(true)}
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Columns
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => handleExport("all")}>
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Export
          </Button>
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Add Employee
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filteredRows.length} employee{filteredRows.length === 1 ? "" : "s"}
        {activeFilterCount > 0 ? " · filtered" : ""}
      </p>

      {/* Bulk bar */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="text-xs font-medium">{selectedEmployees.length} selected</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => handleExport("selected")}
          >
            <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
            Export
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => {
              selectedEmployees.forEach((e) => updateStatus(e.id, "on_leave"));
              toast.success(`Marked ${selectedEmployees.length} as on leave`);
              setRowSelection({});
            }}
          >
            Set on leave
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => toast.info("Assign manager — prototype")}
          >
            <UserCog className="mr-1 h-3.5 w-3.5" aria-hidden />
            Assign manager
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-7 w-7 p-0"
            onClick={() => setRowSelection({})}
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      )}

      <EmployeeMobileCards
        employees={filteredRows.slice(
          pagination.pageIndex * pagination.pageSize,
          (pagination.pageIndex + 1) * pagination.pageSize,
        )}
        selectedIds={new Set(Object.keys(rowSelection).filter((k) => rowSelection[k]))}
        onToggleSelect={toggleMobileSelect}
        onView={handleView}
        onEdit={handleEdit}
      />

      <EmployeeTable
        className="min-h-0 flex-1"
        data={filteredRows}
        columnVisibility={columnVisibility}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={pagination}
        onPaginationChange={setPagination}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Advanced filters sheet */}
      <Sheet open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <SheetContent side="right" className="w-full max-w-sm">
          <h2 className="text-lg font-semibold">Advanced filters</h2>
          <p className="mt-1 text-xs text-muted-foreground">Refine the employee directory.</p>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Designation</span>
              <Select
                value={advanced.designation}
                className="h-9 w-full"
                onChange={(e) => setAdvanced((a) => ({ ...a, designation: e.target.value }))}
              >
                <option value="all">All designations</option>
                {HR_DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Manager</span>
              <Select
                value={advanced.manager}
                className="h-9 w-full"
                onChange={(e) => setAdvanced((a) => ({ ...a, manager: e.target.value }))}
              >
                <option value="all">All managers</option>
                {managers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Joined from</span>
                <Input
                  type="date"
                  value={advanced.joiningFrom}
                  onChange={(e) => setAdvanced((a) => ({ ...a, joiningFrom: e.target.value }))}
                  className="h-9"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium">Joined to</span>
                <Input
                  type="date"
                  value={advanced.joiningTo}
                  onChange={(e) => setAdvanced((a) => ({ ...a, joiningTo: e.target.value }))}
                  className="h-9"
                />
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setAdvanced(DEFAULT_ADVANCED)}
              >
                Reset
              </Button>
              <Button type="button" className="flex-1" onClick={() => setAdvancedOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Column visibility sheet */}
      <Sheet open={columnSheetOpen} onOpenChange={setColumnSheetOpen}>
        <SheetContent side="right" className="w-full max-w-sm">
          <h2 className="text-lg font-semibold">Columns</h2>
          <p className="mt-1 text-xs text-muted-foreground">Choose visible table columns.</p>
          <ul className="mt-4 space-y-2">
            {(Object.keys(COLUMN_LABELS) as EmployeeTableColumnId[]).map((key) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={columnVisibility[key] !== false}
                    onChange={(e) =>
                      setColumnVisibility((v) => ({ ...v, [key]: e.target.checked }))
                    }
                  />
                  <span className="text-sm">{COLUMN_LABELS[key]}</span>
                </label>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setColumnVisibility(DEFAULT_COLUMN_VISIBILITY)}
          >
            Reset columns
          </Button>
        </SheetContent>
      </Sheet>

      <EmployeeViewSheet
        open={!!viewEmployee && !createOpen && !editEmployee}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        employee={viewEmployee}
        initialTab={profileTab}
        onTabChange={handleProfileTabChange}
        onEdit={handleEdit}
      />

      <EmployeeFormSheet
        open={createOpen || !!editEmployee}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        employee={editEmployee}
        onSaved={handleSaved}
      />
    </>
  );
}

export function EmployeeDirectory() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Loading employee directory…</p>}
    >
      <EmployeeDirectoryContent />
    </Suspense>
  );
}
