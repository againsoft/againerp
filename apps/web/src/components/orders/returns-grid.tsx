"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { toast } from "sonner";
import { RETURN_STATUS_LABELS, type OrderReturn, type ReturnStatus } from "@/lib/mock-data/order-modules";
import { useOrderModulesStore } from "@/lib/store/order-modules-store";
import { formatCurrency } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { OrderSubGridShell } from "@/components/orders/order-sub-grid-shell";

const FILTER_DEFS = [
  { key: "search", label: "Search", hint: "RMA ID, order #, customer, product", defaultVisible: true },
  { key: "status", label: "Return Status", hint: "Requested → Review → Approved → …", defaultVisible: true },
];
const COLUMN_META = [
  { key: "sku", label: "SKU", hint: "Product SKU", defaultVisible: true },
  { key: "quantity", label: "Qty", hint: "Return quantity", defaultVisible: false },
  { key: "reason", label: "Reason", hint: "Return reason", defaultVisible: true },
  { key: "assignedStaff", label: "Assigned", hint: "Staff handling return", defaultVisible: true },
  { key: "createdAt", label: "Date", hint: "Request date", defaultVisible: true },
];
const DEFAULT_FILTERS = { search: "", status: "all" };

type Props = { className?: string };

export function ReturnsGrid({ className }: Props) {
  const router = useRouter();
  const returns = useOrderModulesStore((s) => s.returns);
  const updateReturnStatus = useOrderModulesStore((s) => s.updateReturnStatus);

  const StatusCell = useCallback(
    ({ data }: ICellRendererParams<OrderReturn>) => {
      if (!data) return null;
      return (
        <Select className="h-7 min-w-[110px] border-0 bg-transparent text-[11px] shadow-none" value={data.status}
          onChange={(e) => { updateReturnStatus(data.id, e.target.value as ReturnStatus); toast.success(`${data.returnId} updated`); }}
          onClick={(e) => e.stopPropagation()}>
          {Object.entries(RETURN_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      );
    },
    [updateReturnStatus],
  );

  const columnDefs = useMemo<ColDef<OrderReturn>[]>(() => [
    { field: "returnId", headerName: "Return ID", width: 100, pinned: "left" },
    { field: "orderNumber", headerName: "Order #", width: 100, cellRenderer: (p: ICellRendererParams<OrderReturn>) => p.data ? (
      <button type="button" className="text-xs text-primary hover:underline" onClick={() => router.push(`/orders/${p.data!.orderId}`)}>{p.data.orderNumber}</button>
    ) : null },
    { field: "customerName", headerName: "Customer", width: 130 },
    { field: "productName", headerName: "Product", width: 180 },
    { colId: "sku", field: "sku", headerName: "SKU", width: 90 },
    { colId: "quantity", field: "quantity", headerName: "Qty", width: 60 },
    { field: "amount", headerName: "Amount", width: 90, valueFormatter: (p) => formatCurrency(p.value ?? 0) },
    { colId: "reason", field: "reason", headerName: "Reason", width: 200, tooltipField: "reason" },
    { colId: "status", headerName: "Status", width: 130, cellRenderer: StatusCell },
    { colId: "assignedStaff", field: "assignedStaff", headerName: "Assigned", width: 110 },
    { colId: "createdAt", headerName: "Date", width: 92, valueGetter: (p) => p.data ? new Date(p.data.createdAt).toLocaleDateString() : "" },
    { colId: "activity", headerName: "Activity", width: 72, pinned: "right", sortable: false, cellRenderer: (p: ICellRendererParams<OrderReturn>) => p.data ? (
      <ActivityTriggerButton entity={{ type: "order", id: p.data.orderId, label: p.data.returnId, subtitle: p.data.orderNumber }} />
    ) : null },
  ], [StatusCell, router]);

  return (
    <OrderSubGridShell
      className={className}
      rowData={returns}
      columnDefs={columnDefs}
      filterDefs={FILTER_DEFS}
      columnDefs_meta={COLUMN_META}
      defaultFilters={DEFAULT_FILTERS}
      filterFn={(r, f) => {
        const q = f.search.toLowerCase().trim();
        if (q && !r.returnId.toLowerCase().includes(q) && !r.orderNumber.toLowerCase().includes(q) && !r.customerName.toLowerCase().includes(q) && !r.productName.toLowerCase().includes(q)) return false;
        if (f.status !== "all" && r.status !== f.status) return false;
        return true;
      }}
      filterWidgets={(filters, setFilters, visible) => (
        <>
          {visible.search && <Input placeholder="Search RMA, order, customer…" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="max-w-[220px]" />}
          {visible.status && (
            <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-[148px]">
              <option value="all">All statuses</option>
              {Object.entries(RETURN_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          )}
        </>
      )}
      createLabel="+ New Return"
      onCreate={() => toast.info("Create return — prototype")}
    />
  );
}
