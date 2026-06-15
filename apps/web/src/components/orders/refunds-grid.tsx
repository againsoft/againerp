"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { toast } from "sonner";
import { REFUND_STATUS_LABELS, type OrderRefund, type RefundStatus } from "@/lib/mock-data/order-modules";
import { useOrderModulesStore } from "@/lib/store/order-modules-store";
import { formatCurrency } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { OrderSubGridShell } from "@/components/orders/order-sub-grid-shell";

const FILTER_DEFS = [
  { key: "search", label: "Search", hint: "Refund ID, order #, customer", defaultVisible: true },
  { key: "status", label: "Refund Status", hint: "Pending / Approved / Completed", defaultVisible: true },
  { key: "method", label: "Method", hint: "bKash, Card, Nagad, COD", defaultVisible: false },
];
const COLUMN_META = [
  { key: "method", label: "Method", hint: "Refund method", defaultVisible: true },
  { key: "reason", label: "Reason", hint: "Refund reason", defaultVisible: true },
  { key: "approvedBy", label: "Approved By", hint: "Approver name", defaultVisible: true },
  { key: "createdAt", label: "Date", hint: "Request date", defaultVisible: true },
];
const DEFAULT_FILTERS = { search: "", status: "all", method: "all" };

type Props = { className?: string };

export function RefundsGrid({ className }: Props) {
  const router = useRouter();
  const refunds = useOrderModulesStore((s) => s.refunds);
  const updateRefundStatus = useOrderModulesStore((s) => s.updateRefundStatus);

  const StatusCell = useCallback(({ data }: ICellRendererParams<OrderRefund>) => {
    if (!data) return null;
    return (
      <Select className="h-7 min-w-[100px] border-0 bg-transparent text-[11px] shadow-none" value={data.status}
        onChange={(e) => { updateRefundStatus(data.id, e.target.value as RefundStatus); toast.success(`${data.refundId} updated`); }}
        onClick={(e) => e.stopPropagation()}>
        {Object.entries(REFUND_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Select>
    );
  }, [updateRefundStatus]);

  const columnDefs = useMemo<ColDef<OrderRefund>[]>(() => [
    { field: "refundId", headerName: "Refund ID", width: 100 },
    { field: "orderNumber", headerName: "Order #", width: 100, cellRenderer: (p: ICellRendererParams<OrderRefund>) => p.data ? (
      <button type="button" className="text-xs text-primary hover:underline" onClick={() => router.push(`/orders/${p.data!.orderId}`)}>{p.data.orderNumber}</button>
    ) : null },
    { field: "customerName", headerName: "Customer", width: 130 },
    { field: "amount", headerName: "Amount", width: 100, valueFormatter: (p) => formatCurrency(p.value ?? 0) },
    { colId: "method", field: "method", headerName: "Method", width: 80 },
    { colId: "reason", field: "reason", headerName: "Reason", width: 200, tooltipField: "reason" },
    { colId: "status", headerName: "Status", width: 120, cellRenderer: StatusCell },
    { colId: "approvedBy", field: "approvedBy", headerName: "Approved By", width: 110, valueFormatter: (p) => p.value ?? "—" },
    { colId: "createdAt", headerName: "Date", width: 92, valueGetter: (p) => p.data ? new Date(p.data.createdAt).toLocaleDateString() : "" },
    { colId: "activity", headerName: "Activity", width: 72, pinned: "right", sortable: false, cellRenderer: (p: ICellRendererParams<OrderRefund>) => p.data ? (
      <ActivityTriggerButton entity={{ type: "order", id: p.data.orderId, label: p.data.refundId, subtitle: p.data.orderNumber }} />
    ) : null },
  ], [StatusCell, router]);

  const methods = [...new Set(refunds.map((r) => r.method))];

  return (
    <OrderSubGridShell
      className={className}
      rowData={refunds}
      columnDefs={columnDefs}
      filterDefs={FILTER_DEFS}
      columnDefs_meta={COLUMN_META}
      defaultFilters={DEFAULT_FILTERS}
      filterFn={(r, f) => {
        const q = f.search.toLowerCase().trim();
        if (q && !r.refundId.toLowerCase().includes(q) && !r.orderNumber.toLowerCase().includes(q) && !r.customerName.toLowerCase().includes(q)) return false;
        if (f.status !== "all" && r.status !== f.status) return false;
        if (f.method !== "all" && r.method !== f.method) return false;
        return true;
      }}
      filterWidgets={(filters, setFilters, visible) => (
        <>
          {visible.search && <Input placeholder="Search refund, order…" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="max-w-[200px]" />}
          {visible.status && (
            <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-[140px]">
              <option value="all">All statuses</option>
              {Object.entries(REFUND_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          )}
          {visible.method && (
            <Select value={filters.method} onChange={(e) => setFilters({ ...filters, method: e.target.value })} className="w-[120px]">
              <option value="all">All methods</option>
              {methods.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          )}
        </>
      )}
    />
  );
}
