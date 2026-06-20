"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Edit2, Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  getServiceCategoryName,
  SERVICE_BILLING_LABELS,
  SERVICE_ITEM_STATUS_LABELS,
  serviceCategoriesSeed,
  serviceItemsSeed,
  type ServiceBillingType,
  type ServiceItem,
  type ServiceItemStatus,
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
import { ServiceItemFormSheet } from "./service-item-form-sheet";
import { ServiceItemViewSheet } from "./service-item-view-sheet";
import { ServiceNav } from "./service-nav";

const PAGE_SIZE = 25;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

function statusVariant(v: ServiceItemStatus): "success" | "muted" {
  return v === "active" ? "success" : "muted";
}

function StatusPill({ value }: { value: ServiceItemStatus }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant={statusVariant(value)} className="text-[10px]">
        {SERVICE_ITEM_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function BillingPill({ value }: { value: ServiceBillingType }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant="secondary" className="text-[10px]">
        {SERVICE_BILLING_LABELS[value]}
      </Badge>
    </div>
  );
}

function ServiceMobileCards({
  items,
  onView,
}: {
  items: ServiceItem[];
  onView: (item: ServiceItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No services match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onView(item)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{item.code}</p>
              <p className="mt-0.5 truncate font-medium">{item.name}</p>
            </div>
            <Badge variant={statusVariant(item.status)} className="shrink-0 text-[10px]">
              {SERVICE_ITEM_STATUS_LABELS[item.status]}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-muted-foreground">
            <span>{getServiceCategoryName(item.categoryId)}</span>
            <span className="font-medium tabular-nums text-foreground">{formatBdt(item.salePrice)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function ServiceCatalog() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ServiceItem>>(null);

  const [items, setItems] = useState<ServiceItem[]>(() => [...serviceItemsSeed]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [billingFilter, setBillingFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const createOpen = params.get("create") === "1";
  const editId = params.get("edit");
  const viewId = params.get("view");

  const editItem = useMemo(
    () => (editId ? items.find((i) => i.id === editId) ?? null : null),
    [editId, items]
  );
  const viewItem = useMemo(
    () => (viewId ? items.find((i) => i.id === viewId) ?? null : null),
    [viewId, items]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/catalog?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const openView = useCallback(
    (item: ServiceItem) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", item.id); }),
    [pushParams]
  );
  const openEdit = useCallback(
    (item: ServiceItem) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", item.id); }),
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
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (categoryFilter !== "all" && item.categoryId !== categoryFilter) return false;
      if (billingFilter !== "all" && item.billingType !== billingFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        getServiceCategoryName(item.categoryId).toLowerCase().includes(q)
      );
    });
  }, [items, statusFilter, categoryFilter, billingFilter, search]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => { c[i.status] = (c[i.status] ?? 0) + 1; });
    return c;
  }, [items]);

  const activeCount = statusCounts.active ?? 0;

  const handleSave = useCallback(
    (item: ServiceItem, mode: "create" | "edit") => {
      setItems((prev) => {
        if (mode === "create") return [item, ...prev];
        return prev.map((i) => (i.id === item.id ? item : i));
      });
      closeForm();
      if (mode === "create") openView(item);
    },
    [closeForm, openView]
  );

  const existingCodes = useMemo(() => items.map((i) => i.code), [items]);

  const RowMenu = useCallback(
    ({ data }: { data: ServiceItem }) => (
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
    (p: ICellRendererParams<ServiceItem>) => {
      if (!p.data) return null;
      return (
        <div className="flex h-full items-center justify-center">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const CategoryCell = useCallback((p: ICellRendererParams<ServiceItem>) => {
    if (!p.data) return null;
    return <span className="text-xs">{getServiceCategoryName(p.data.categoryId)}</span>;
  }, []);

  const columnDefs = useMemo<ColDef<ServiceItem>[]>(
    () => [
      { field: "code", headerName: "Code", pinned: "left", width: 140, cellClass: "font-mono text-xs" },
      { field: "name", headerName: "Service name", flex: 1, minWidth: 180 },
      { headerName: "Category", width: 140, cellRenderer: CategoryCell },
      { field: "billingType", headerName: "Billing", width: 110, cellRenderer: BillingPill },
      {
        field: "salePrice",
        headerName: "Sale",
        width: 100,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      {
        field: "costPrice",
        headerName: "Cost",
        width: 100,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums text-muted-foreground",
      },
      { field: "durationMinutes", headerName: "Min", width: 70, valueFormatter: (p) => (p.value ? String(p.value) : "—") },
      { field: "status", headerName: "Status", width: 100, cellRenderer: StatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell, CategoryCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ServiceItem }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = rowData.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Catalog</p>
          <h1 className="page-title">
            Service Catalog
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({activeCount.toLocaleString()} active)
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
            + Add Service
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search code, name, category…"
          className="h-8 w-full max-w-xs text-xs"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-32 text-xs">
          {STATUS_TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} {statusCounts[t.id] !== undefined ? `(${statusCounts[t.id]})` : ""}
            </option>
          ))}
        </Select>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-8 w-40 text-xs">
          <option value="all">All categories</option>
          {serviceCategoriesSeed.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Select value={billingFilter} onChange={(e) => setBillingFilter(e.target.value)} className="h-8 w-36 text-xs">
          <option value="all">All billing types</option>
          {(Object.keys(SERVICE_BILLING_LABELS) as ServiceBillingType[]).map((t) => (
            <option key={t} value={t}>{SERVICE_BILLING_LABELS[t]}</option>
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
            {rowData.length !== items.length && ` (filtered from ${items.length})`}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <ServiceMobileCards items={rowData} onView={openView} />
      </div>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Add service"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ServiceItemViewSheet
        open={!!viewItem && !createOpen && !editItem}
        item={viewItem}
        onClose={closeView}
        onEdit={openEdit}
      />

      <ServiceItemFormSheet
        open={createOpen || !!editItem}
        onClose={closeForm}
        onSave={handleSave}
        editItem={editItem}
        existingCodes={existingCodes}
      />
    </div>
  );
}
