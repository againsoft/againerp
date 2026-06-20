"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  SERVICE_SKILL_LABELS,
  SERVICE_TECHNICIAN_STATUS_LABELS,
  serviceTechniciansSeed,
  type ServiceTechnician,
  type ServiceTechnicianStatus,
} from "@/lib/mock-data/service";
import { useIsDark } from "@/lib/use-is-dark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceNav } from "./service-nav";
import { ServiceTechnicianFormSheet } from "./service-technician-form-sheet";
import { ServiceTechnicianViewSheet } from "./service-technician-view-sheet";

const PAGE_SIZE = 25;

function statusVariant(v: ServiceTechnicianStatus): "success" | "warning" | "muted" {
  if (v === "active") return "success";
  if (v === "on_leave") return "warning";
  return "muted";
}

function StatusPill({ value }: { value: ServiceTechnicianStatus }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant={statusVariant(value)} className="text-[10px]">
        {SERVICE_TECHNICIAN_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function UtilizationCell({ value }: { value: number }) {
  const color =
    value >= 80 ? "text-emerald-600 dark:text-emerald-400" :
    value >= 50 ? "text-amber-600 dark:text-amber-400" :
    "text-muted-foreground";
  return (
    <div className="flex h-full items-center">
      <span className={cn("text-xs font-medium tabular-nums", color)}>{value}%</span>
    </div>
  );
}

function SkillsCell({ skills }: { skills: string[] }) {
  return (
    <div className="flex h-full flex-wrap items-center gap-1 py-1">
      {skills.slice(0, 3).map((s) => (
        <Badge key={s} variant="outline" className="text-[9px]">
          {SERVICE_SKILL_LABELS[s] ?? s}
        </Badge>
      ))}
      {skills.length > 3 && (
        <span className="text-[10px] text-muted-foreground">+{skills.length - 3}</span>
      )}
    </div>
  );
}

function TechMobileCards({
  technicians,
  onView,
}: {
  technicians: ServiceTechnician[];
  onView: (tech: ServiceTechnician) => void;
}) {
  if (technicians.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No technicians match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {technicians.map((tech) => (
        <button
          key={tech.id}
          type="button"
          onClick={() => onView(tech)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{tech.name}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{tech.defaultTerritory}</p>
            </div>
            <Badge variant={statusVariant(tech.status)} className="shrink-0 text-[10px]">
              {SERVICE_TECHNICIAN_STATUS_LABELS[tech.status]}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between gap-2 text-muted-foreground">
            <span>{tech.jobsActive} active · {tech.jobsCompletedMtd} MTD</span>
            <span className="font-medium tabular-nums text-foreground">{tech.utilizationPct}%</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function ServiceTechnicians() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ServiceTechnician>>(null);

  const [technicians, setTechnicians] = useState<ServiceTechnician[]>(() => [...serviceTechniciansSeed]);
  const [statusFilter, setStatusFilter] = useState<ServiceTechnicianStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const editId = params.get("edit");
  const viewId = params.get("view");

  const editTech = useMemo(
    () => (editId ? technicians.find((t) => t.id === editId) ?? null : null),
    [editId, technicians]
  );
  const viewTech = useMemo(
    () => (viewId ? technicians.find((t) => t.id === viewId) ?? null : null),
    [viewId, technicians]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/technicians?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const openView = useCallback(
    (tech: ServiceTechnician) => pushParams((p) => { p.delete("edit"); p.set("view", tech.id); }),
    [pushParams]
  );
  const openEdit = useCallback(
    (tech: ServiceTechnician) => pushParams((p) => { p.delete("view"); p.set("edit", tech.id); }),
    [pushParams]
  );
  const closeForm = useCallback(
    () => pushParams((p) => p.delete("edit")),
    [pushParams]
  );
  const closeView = useCallback(
    () => pushParams((p) => p.delete("view")),
    [pushParams]
  );

  const rowData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return technicians.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.defaultTerritory.toLowerCase().includes(q) ||
        t.skills.some((s) => s.includes(q) || (SERVICE_SKILL_LABELS[s]?.toLowerCase().includes(q) ?? false))
      );
    });
  }, [technicians, statusFilter, search]);

  const activeCount = technicians.filter((t) => t.status === "active").length;
  const avgUtilization = Math.round(
    technicians.filter((t) => t.status === "active").reduce((s, t) => s + t.utilizationPct, 0) /
      Math.max(activeCount, 1)
  );

  const handleSave = useCallback(
    (tech: ServiceTechnician) => {
      setTechnicians((prev) => prev.map((t) => (t.id === tech.id ? tech : t)));
      closeForm();
    },
    [closeForm]
  );

  const RowMenu = useCallback(
    ({ data }: { data: ServiceTechnician }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openView(data)}>
            <Eye className="mr-2 h-3.5 w-3.5" /> View profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openEdit(data)}>
            <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [openView, openEdit]
  );

  const ActionCell = useCallback(
    (p: ICellRendererParams<ServiceTechnician>) => {
      if (!p.data) return null;
      return (
        <div className="flex h-full items-center justify-center">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const SkillsRenderer = useCallback(
    (p: ICellRendererParams<ServiceTechnician>) => {
      if (!p.data) return null;
      return <SkillsCell skills={p.data.skills} />;
    },
    []
  );

  const UtilizationRenderer = useCallback(
    (p: ICellRendererParams<ServiceTechnician>) => {
      if (p.data == null) return null;
      return <UtilizationCell value={p.data.utilizationPct} />;
    },
    []
  );

  const columnDefs = useMemo<ColDef<ServiceTechnician>[]>(
    () => [
      { field: "name", headerName: "Technician", pinned: "left", width: 140 },
      { field: "employeeId", headerName: "Employee ID", width: 100, cellClass: "font-mono text-xs" },
      { field: "defaultTerritory", headerName: "Territory", width: 130 },
      { headerName: "Skills", flex: 1, minWidth: 160, cellRenderer: SkillsRenderer },
      { field: "jobsActive", headerName: "Active", width: 72, cellClass: "tabular-nums text-center" },
      { field: "jobsCompletedMtd", headerName: "Done MTD", width: 88, cellClass: "tabular-nums text-center" },
      { field: "utilizationPct", headerName: "Utilization", width: 95, cellRenderer: UtilizationRenderer },
      {
        field: "revenueMtd",
        headerName: "Revenue MTD",
        width: 110,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "tabular-nums text-right",
      },
      { field: "status", headerName: "Status", width: 95, cellRenderer: StatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell, SkillsRenderer, UtilizationRenderer]
  );

  const onRowClicked = useCallback(
    (e: { data?: ServiceTechnician }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = rowData.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Technicians</p>
          <h1 className="page-title">
            Technicians
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({activeCount} active)
            </span>
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("Link HR employee (prototype)")}>
            Link from HR
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started (mock)")}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">Active technicians</p>
          <p className="text-lg font-semibold tabular-nums">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">Avg utilization</p>
          <p className="text-lg font-semibold tabular-nums">{avgUtilization}%</p>
        </div>
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">Jobs active</p>
          <p className="text-lg font-semibold tabular-nums">
            {technicians.reduce((s, t) => s + t.jobsActive, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">Revenue MTD</p>
          <p className="text-lg font-semibold tabular-nums">
            {formatBdt(technicians.reduce((s, t) => s + t.revenueMtd, 0))}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, territory, skill…"
          className="h-8 w-full max-w-xs text-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ServiceTechnicianStatus | "all")}
          className="h-8 w-32 text-xs"
        >
          <option value="all">All statuses</option>
          {(Object.keys(SERVICE_TECHNICIAN_STATUS_LABELS) as ServiceTechnicianStatus[]).map((s) => (
            <option key={s} value={s}>{SERVICE_TECHNICIAN_STATUS_LABELS[s]}</option>
          ))}
        </Select>
      </div>

      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        <div
          className={cn(
            "ag-theme-quartz control-border h-0 min-h-0 flex-1 overflow-hidden rounded-md border border-input bg-card",
            isDark && "ag-theme-quartz-dark"
          )}
        >
          <AgGridReact
            ref={gridRef}
            theme="legacy"
            rowData={rowData}
            columnDefs={columnDefs}
            onRowClicked={onRowClicked}
            suppressRowClickSelection
            rowSelection="single"
            suppressCellFocus
            animateRows
            pagination
            paginationPageSize={PAGE_SIZE}
            onPaginationChanged={(e) => setPage(e.api.paginationGetCurrentPage())}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: false,
              suppressHeaderMenuButton: true,
              minWidth: 72,
            }}
            getRowId={(p) => p.data.id}
          />
        </div>
        {rowData.length > 0 && (
          <p className="shrink-0 pt-1 text-xs text-muted-foreground">
            Showing {pageStart}–{pageEnd} of {rowData.length}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <TechMobileCards technicians={rowData} onView={openView} />
      </div>

      <ServiceTechnicianViewSheet
        open={!!viewTech && !editTech}
        technician={viewTech}
        onClose={closeView}
        onEdit={openEdit}
      />

      <ServiceTechnicianFormSheet
        open={!!editTech}
        onClose={closeForm}
        onSave={handleSave}
        editTechnician={editTech}
      />
    </div>
  );
}
