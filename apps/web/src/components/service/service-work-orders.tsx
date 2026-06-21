"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { CheckCircle2, Eye, LogIn, MoreHorizontal, Package, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  nextWorkOrderNumber,
  SERVICE_PRIORITY_LABELS,
  SERVICE_TECHNICIANS,
  SERVICE_WORK_ORDER_STATUS_LABELS,
  serviceWorkOrdersSeed,
  type ServiceWorkOrder,
  type ServiceWorkOrderStatus,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceWorkOrderFormSheet } from "./service-work-order-form-sheet";
import { ServiceWorkOrderViewSheet } from "./service-work-order-view-sheet";
import { ServiceNav } from "./service-nav";

const PAGE_SIZE = 25;

const STATUS_TABS: { id: ServiceWorkOrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scheduled", label: "Scheduled" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "cancelled", label: "Cancelled" },
];

function woStatusVariant(v: ServiceWorkOrderStatus): "success" | "warning" | "muted" | "secondary" {
  if (v === "done") return "success";
  if (v === "in_progress") return "warning";
  if (v === "cancelled") return "muted";
  return "secondary";
}

function priorityVariant(v: ServiceWorkOrder["priority"]): "warning" | "secondary" | "muted" {
  if (v === "critical" || v === "high") return "warning";
  if (v === "medium") return "secondary";
  return "muted";
}

function StatusPill({ value }: { value: ServiceWorkOrderStatus }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant={woStatusVariant(value)} className="text-[10px]">
        {SERVICE_WORK_ORDER_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function CheckInPill({ wo }: { wo: ServiceWorkOrder }) {
  const label = wo.actualStart ? "Checked in" : "Not checked in";
  return (
    <div className="flex h-full items-center">
      <Badge variant={wo.actualStart ? "success" : "muted"} className="text-[10px]">
        {label}
      </Badge>
    </div>
  );
}

function WorkOrderMobileCards({
  workOrders,
  onView,
  onCheckIn,
}: {
  workOrders: ServiceWorkOrder[];
  onView: (wo: ServiceWorkOrder) => void;
  onCheckIn: (wo: ServiceWorkOrder) => void;
}) {
  if (workOrders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No work orders match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 pb-24">
      {workOrders.map((wo) => (
        <div
          key={wo.id}
          className={cn(
            "rounded-lg border bg-card p-3 text-xs",
            wo.status === "in_progress" && "border-amber-500/30"
          )}
        >
          <button type="button" onClick={() => onView(wo)} className="w-full text-left">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-muted-foreground">{wo.number}</p>
                <p className="mt-0.5 truncate font-medium">{wo.serviceName}</p>
              </div>
              <Badge variant={woStatusVariant(wo.status)} className="shrink-0 text-[10px]">
                {SERVICE_WORK_ORDER_STATUS_LABELS[wo.status]}
              </Badge>
            </div>
            <div className="mt-2 text-muted-foreground">
              <p className="truncate">{wo.customer}</p>
              <p className="mt-0.5">{wo.technician} · {wo.scheduledStart}</p>
            </div>
          </button>
          {wo.status !== "done" && wo.status !== "cancelled" && (
            <div className="mt-3 flex gap-2">
              {!wo.actualStart && (
                <Button
                  size="sm"
                  className="h-11 min-h-[44px] flex-1 gap-1.5"
                  onClick={() => onCheckIn(wo)}
                >
                  <LogIn className="h-4 w-4" />
                  Check In
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-11 min-h-[44px] flex-1"
                onClick={() => onView(wo)}
              >
                Open Job
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ServiceWorkOrders() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ServiceWorkOrder>>(null);

  const [workOrders, setWorkOrders] = useState<ServiceWorkOrder[]>(() => [...serviceWorkOrdersSeed]);
  const [statusFilter, setStatusFilter] = useState<ServiceWorkOrderStatus | "all">("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const createOpen = params.get("create") === "1";
  const editId = params.get("edit");
  const viewId = params.get("view");

  const editWo = useMemo(
    () => (editId ? workOrders.find((w) => w.id === editId) ?? null : null),
    [editId, workOrders]
  );
  const viewWo = useMemo(
    () => (viewId ? workOrders.find((w) => w.id === viewId) ?? null : null),
    [viewId, workOrders]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/work-orders?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const openView = useCallback(
    (wo: ServiceWorkOrder) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", wo.id); }),
    [pushParams]
  );
  const openEdit = useCallback(
    (wo: ServiceWorkOrder) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", wo.id); }),
    [pushParams]
  );
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.delete("edit"); p.set("create", "1"); }),
    [pushParams]
  );
  const closeForm = useCallback(
    () => pushParams((p) => { p.delete("create"); p.delete("edit"); }),
    [pushParams]
  );
  const closeView = useCallback(
    () => pushParams((p) => p.delete("view")),
    [pushParams]
  );

  const handleCheckIn = useCallback((wo: ServiceWorkOrder) => {
    setWorkOrders((prev) =>
      prev.map((w) =>
        w.id === wo.id
          ? {
              ...w,
              status: "in_progress" as const,
              actualStart: new Date().toISOString().slice(0, 16).replace("T", " "),
              checkInLat: 23.8103,
              checkInLng: 90.4125,
            }
          : w
      )
    );
    toast.success(`Checked in — ${wo.number}`);
  }, []);

  const handleComplete = useCallback((wo: ServiceWorkOrder) => {
    setWorkOrders((prev) =>
      prev.map((w) =>
        w.id === wo.id
          ? {
              ...w,
              status: "done" as const,
              actualEnd: new Date().toISOString().slice(0, 16).replace("T", " "),
              checkOutLat: w.checkInLat,
              checkOutLng: w.checkInLng,
            }
          : w
      )
    );
    toast.success(`Work order ${wo.number} completed`);
  }, []);

  const handleSave = useCallback(
    (wo: ServiceWorkOrder, mode: "create" | "edit") => {
      setWorkOrders((prev) => {
        if (mode === "create") return [wo, ...prev];
        return prev.map((w) => (w.id === wo.id ? wo : w));
      });
      closeForm();
      if (mode === "create") openView(wo);
    },
    [closeForm, openView]
  );

  const rowData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workOrders.filter((wo) => {
      if (statusFilter !== "all" && wo.status !== statusFilter) return false;
      if (technicianFilter !== "all" && wo.technician !== technicianFilter) return false;
      if (!q) return true;
      return (
        wo.number.toLowerCase().includes(q) ||
        wo.serviceOrderNumber.toLowerCase().includes(q) ||
        wo.customer.toLowerCase().includes(q) ||
        wo.serviceName.toLowerCase().includes(q) ||
        wo.technician.toLowerCase().includes(q)
      );
    });
  }, [workOrders, statusFilter, technicianFilter, search]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: workOrders.length };
    workOrders.forEach((w) => { c[w.status] = (c[w.status] ?? 0) + 1; });
    return c;
  }, [workOrders]);

  const activeCount = (statusCounts.in_progress ?? 0) + (statusCounts.scheduled ?? 0);
  const suggestedNumber = useMemo(() => nextWorkOrderNumber(workOrders), [workOrders]);

  const RowMenu = useCallback(
    ({ data }: { data: ServiceWorkOrder }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openView(data)}>
            <Eye className="mr-2 h-3.5 w-3.5" /> View
          </DropdownMenuItem>
          {data.status !== "done" && data.status !== "cancelled" && !data.actualStart && (
            <DropdownMenuItem onClick={() => handleCheckIn(data)}>
              <LogIn className="mr-2 h-3.5 w-3.5" /> Check-in
            </DropdownMenuItem>
          )}
          {data.status !== "done" && data.status !== "cancelled" && (
            <>
              <DropdownMenuItem onClick={() => toast.info("Add parts from inventory (prototype)")}>
                <Package className="mr-2 h-3.5 w-3.5" /> Add parts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleComplete(data)}>
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Complete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [openView, handleCheckIn, handleComplete]
  );

  const ActionCell = useCallback(
    (p: ICellRendererParams<ServiceWorkOrder>) => {
      if (!p.data) return null;
      return (
        <div className="flex h-full items-center justify-center">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const CheckInCell = useCallback(
    (p: ICellRendererParams<ServiceWorkOrder>) => {
      if (!p.data) return null;
      return <CheckInPill wo={p.data} />;
    },
    []
  );

  const columnDefs = useMemo<ColDef<ServiceWorkOrder>[]>(
    () => [
      { field: "number", headerName: "WO #", pinned: "left", width: 120, cellClass: "font-mono text-xs" },
      { field: "serviceOrderNumber", headerName: "Order #", width: 130, cellClass: "font-mono text-xs" },
      { field: "customer", headerName: "Customer", width: 150 },
      { field: "serviceName", headerName: "Service", flex: 1, minWidth: 140 },
      { field: "technician", headerName: "Technician", width: 120 },
      { field: "scheduledStart", headerName: "Scheduled", width: 130 },
      { field: "status", headerName: "Status", width: 110, cellRenderer: StatusPill },
      { headerName: "Check-in", width: 110, cellRenderer: CheckInCell },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell, CheckInCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ServiceWorkOrder }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = rowData.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Work Orders</p>
          <h1 className="page-title">
            Work Orders
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({activeCount} active)
            </span>
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("My jobs filter (prototype)")}>
            My Jobs
          </Button>
          <Button size="sm" onClick={openCreate}>
            + Create WO
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search WO #, order, customer, technician…"
          className="h-8 w-full max-w-xs text-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ServiceWorkOrderStatus | "all")}
          className="h-8 w-36 text-xs"
        >
          {STATUS_TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} {statusCounts[t.id] !== undefined ? `(${statusCounts[t.id]})` : ""}
            </option>
          ))}
        </Select>
        <Select value={technicianFilter} onChange={(e) => setTechnicianFilter(e.target.value)} className="h-8 w-40 text-xs">
          <option value="all">All technicians</option>
          {SERVICE_TECHNICIANS.map((t) => (
            <option key={t} value={t}>{t}</option>
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
            theme="legacy"
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
            {rowData.length !== workOrders.length && ` (filtered from ${workOrders.length})`}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <WorkOrderMobileCards workOrders={rowData} onView={openView} onCheckIn={handleCheckIn} />
      </div>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Create work order"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ServiceWorkOrderViewSheet
        open={!!viewWo && !createOpen && !editWo}
        workOrder={viewWo}
        onClose={closeView}
        onEdit={openEdit}
        onCheckIn={handleCheckIn}
        onComplete={handleComplete}
        onUpdate={(updated) => setWorkOrders((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))}
      />

      <ServiceWorkOrderFormSheet
        open={createOpen || !!editWo}
        onClose={closeForm}
        onSave={handleSave}
        editWorkOrder={editWo}
        nextNumber={suggestedNumber}
      />
    </div>
  );
}
