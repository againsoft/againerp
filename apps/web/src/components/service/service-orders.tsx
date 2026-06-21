"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Edit2, Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  getOrderSlaLabel,
  SERVICE_ORDER_BILLING_LABELS,
  SERVICE_ORDER_STATUS_LABELS,
  SERVICE_PRIORITY_LABELS,
  serviceOrdersSeed,
  type ServiceOrder,
  type ServiceOrderPriority,
  type ServiceOrderStatus,
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
import { ServiceOrderFormSheet } from "./service-order-form-sheet";
import { ServiceOrderViewSheet } from "./service-order-view-sheet";
import { ServiceNav } from "./service-nav";

const PAGE_SIZE = 25;

const STATUS_TABS: { id: ServiceOrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "assigned", label: "Assigned" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "draft", label: "Draft" },
];

function orderStatusVariant(v: ServiceOrderStatus): "success" | "warning" | "muted" | "secondary" {
  if (v === "completed") return "success";
  if (v === "in_progress" || v === "assigned") return "warning";
  if (v === "cancelled" || v === "draft") return "muted";
  return "secondary";
}

function priorityVariant(v: ServiceOrderPriority): "warning" | "secondary" | "muted" {
  if (v === "critical" || v === "high") return "warning";
  if (v === "medium") return "secondary";
  return "muted";
}

function slaVariant(label: ReturnType<typeof getOrderSlaLabel>): "success" | "warning" | "muted" {
  if (label === "On track") return "success";
  if (label === "At risk" || label === "Breached") return "warning";
  return "muted";
}

function StatusPill({ value }: { value: ServiceOrderStatus }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant={orderStatusVariant(value)} className="text-[10px]">
        {SERVICE_ORDER_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function PriorityPill({ value }: { value: ServiceOrderPriority }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant={priorityVariant(value)} className="text-[10px]">
        {SERVICE_PRIORITY_LABELS[value]}
      </Badge>
    </div>
  );
}

function SlaPill({ orderId }: { orderId: string }) {
  const label = getOrderSlaLabel(orderId);
  return (
    <div className="flex h-full items-center">
      <Badge variant={slaVariant(label)} className="text-[10px]">
        {label}
      </Badge>
    </div>
  );
}

function OrderMobileCards({
  orders,
  onView,
}: {
  orders: ServiceOrder[];
  onView: (order: ServiceOrder) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No orders match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {orders.map((order) => {
        const sla = getOrderSlaLabel(order.id);
        return (
          <button
            key={order.id}
            type="button"
            onClick={() => onView(order)}
            className={cn(
              "rounded-lg border bg-card p-3 text-left text-xs hover:bg-muted/50",
              order.priority === "critical" && "border-destructive/40",
              order.priority === "high" && "border-amber-500/30"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-muted-foreground">{order.number}</p>
                <p className="mt-0.5 truncate font-medium">{order.serviceName}</p>
              </div>
              <Badge variant={orderStatusVariant(order.status)} className="shrink-0 text-[10px]">
                {SERVICE_ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-muted-foreground">
              <span className="truncate">{order.customer}</span>
              <Badge variant={priorityVariant(order.priority)} className="text-[9px]">
                {SERVICE_PRIORITY_LABELS[order.priority]}
              </Badge>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span>{order.scheduleDate}{order.scheduleTime ? ` · ${order.scheduleTime}` : ""}</span>
              <span className="font-medium tabular-nums text-foreground">{formatBdt(order.totalAmount)}</span>
            </div>
            {sla !== "—" && (
              <div className="mt-1.5">
                <Badge variant={slaVariant(sla)} className="text-[9px]">SLA: {sla}</Badge>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function nextOrderNumber(orders: ServiceOrder[]): string {
  const nums = orders
    .map((o) => {
      const m = o.number.match(/SOV\/2026\/(\d+)/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `SOV/2026/${String(next).padStart(4, "0")}`;
}

export function ServiceOrders() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ServiceOrder>>(null);

  const [orders, setOrders] = useState<ServiceOrder[]>(() => [...serviceOrdersSeed]);
  const [statusFilter, setStatusFilter] = useState<ServiceOrderStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ServiceOrderPriority | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const createOpen = params.get("create") === "1";
  const editId = params.get("edit");
  const viewId = params.get("view");

  const editOrder = useMemo(
    () => (editId ? orders.find((o) => o.id === editId) ?? null : null),
    [editId, orders]
  );
  const viewOrder = useMemo(
    () => (viewId ? orders.find((o) => o.id === viewId) ?? null : null),
    [viewId, orders]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/orders?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const openView = useCallback(
    (order: ServiceOrder) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", order.id); }),
    [pushParams]
  );
  const openEdit = useCallback(
    (order: ServiceOrder) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", order.id); }),
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

  const rowData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (priorityFilter !== "all" && order.priority !== priorityFilter) return false;
      if (!q) return true;
      return (
        order.number.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.serviceName.toLowerCase().includes(q) ||
        (order.assetName?.toLowerCase().includes(q) ?? false) ||
        (order.technician?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [orders, statusFilter, priorityFilter, search]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => { c[o.status] = (c[o.status] ?? 0) + 1; });
    return c;
  }, [orders]);

  const atRiskCount = useMemo(
    () => orders.filter((o) => getOrderSlaLabel(o.id) === "At risk" || getOrderSlaLabel(o.id) === "Breached").length,
    [orders]
  );

  const handleSave = useCallback(
    (order: ServiceOrder, mode: "create" | "edit") => {
      setOrders((prev) => {
        if (mode === "create") return [order, ...prev];
        return prev.map((o) => (o.id === order.id ? order : o));
      });
      closeForm();
      if (mode === "create") openView(order);
    },
    [closeForm, openView]
  );

  const suggestedNumber = useMemo(() => nextOrderNumber(orders), [orders]);

  const RowMenu = useCallback(
    ({ data }: { data: ServiceOrder }) => (
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
          <DropdownMenuItem onClick={() => openEdit(data)}>
            <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [openView, openEdit]
  );

  const ActionCell = useCallback(
    (p: ICellRendererParams<ServiceOrder>) => {
      if (!p.data) return null;
      return (
        <div className="flex h-full items-center justify-center">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const SlaCell = useCallback(
    (p: ICellRendererParams<ServiceOrder>) => {
      if (!p.data) return null;
      return <SlaPill orderId={p.data.id} />;
    },
    []
  );

  const columnDefs = useMemo<ColDef<ServiceOrder>[]>(
    () => [
      { field: "number", headerName: "Order #", pinned: "left", width: 130, cellClass: "font-mono text-xs" },
      { field: "customer", headerName: "Customer", width: 160 },
      { field: "assetName", headerName: "Asset", width: 150, valueFormatter: (p) => p.value ?? "—" },
      { field: "serviceName", headerName: "Service", flex: 1, minWidth: 140 },
      { field: "priority", headerName: "Priority", width: 90, cellRenderer: PriorityPill },
      {
        headerName: "Schedule",
        width: 120,
        valueGetter: (p) => {
          const d = p.data?.scheduleDate;
          const t = p.data?.scheduleTime;
          return d ? `${d}${t ? ` ${t}` : ""}` : "—";
        },
      },
      { field: "technician", headerName: "Technician", width: 120, valueFormatter: (p) => p.value ?? "—" },
      { field: "status", headerName: "Status", width: 110, cellRenderer: StatusPill },
      { headerName: "SLA", width: 90, cellRenderer: SlaCell },
      {
        field: "billingStatus",
        headerName: "Billing",
        width: 90,
        valueFormatter: (p) => SERVICE_ORDER_BILLING_LABELS[p.value as ServiceOrder["billingStatus"]],
      },
      {
        field: "totalAmount",
        headerName: "Amount",
        width: 100,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "tabular-nums text-right",
      },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell, SlaCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ServiceOrder }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = rowData.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Orders</p>
          <h1 className="page-title">
            Service Orders
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({orders.length.toLocaleString()} total)
            </span>
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("Import — prototype")}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started (mock)")}>
            Export
          </Button>
          <Button size="sm" onClick={openCreate}>
            + New Order
          </Button>
        </div>
      </div>

      {atRiskCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          {atRiskCount} order{atRiskCount > 1 ? "s" : ""} at SLA risk or breached — review dispatch queue.
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, customer, service, asset…"
          className="h-8 w-full max-w-xs text-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ServiceOrderStatus | "all")}
          className="h-8 w-40 text-xs"
        >
          {STATUS_TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} {statusCounts[t.id] !== undefined ? `(${statusCounts[t.id]})` : ""}
            </option>
          ))}
        </Select>
        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as ServiceOrderPriority | "all")}
          className="h-8 w-32 text-xs"
        >
          <option value="all">All priorities</option>
          {(Object.keys(SERVICE_PRIORITY_LABELS) as ServiceOrderPriority[]).map((p) => (
            <option key={p} value={p}>{SERVICE_PRIORITY_LABELS[p]}</option>
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
            {rowData.length !== orders.length && ` (filtered from ${orders.length})`}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <OrderMobileCards orders={rowData} onView={openView} />
      </div>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="New service order"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ServiceOrderViewSheet
        open={!!viewOrder && !createOpen && !editOrder}
        order={viewOrder}
        onClose={closeView}
        onEdit={openEdit}
      />

      <ServiceOrderFormSheet
        open={createOpen || !!editOrder}
        onClose={closeForm}
        onSave={handleSave}
        editOrder={editOrder}
        nextNumber={suggestedNumber}
      />
    </div>
  );
}
