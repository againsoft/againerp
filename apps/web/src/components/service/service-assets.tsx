"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Edit2, Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  SERVICE_ASSET_CATEGORY_LABELS,
  SERVICE_ASSET_STATUS_LABELS,
  serviceAssetsSeed,
  type ServiceAsset,
  type ServiceAssetCategory,
  type ServiceAssetStatus,
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
import { ServiceAssetFormSheet } from "./service-asset-form-sheet";
import { ServiceAssetViewSheet } from "./service-asset-view-sheet";
import { ServiceNav } from "./service-nav";

const PAGE_SIZE = 25;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "in_repair", label: "In Repair" },
  { id: "retired", label: "Retired" },
];

function statusVariant(v: ServiceAssetStatus): "success" | "warning" | "muted" {
  if (v === "active") return "success";
  if (v === "in_repair") return "warning";
  return "muted";
}

function StatusPill({ value }: { value: ServiceAssetStatus }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant={statusVariant(value)} className="text-[10px]">
        {SERVICE_ASSET_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function CategoryPill({ value }: { value: ServiceAssetCategory }) {
  return (
    <div className="flex h-full items-center">
      <Badge variant="outline" className="text-[10px]">
        {SERVICE_ASSET_CATEGORY_LABELS[value]}
      </Badge>
    </div>
  );
}

function AssetMobileCards({
  assets,
  onView,
}: {
  assets: ServiceAsset[];
  onView: (asset: ServiceAsset) => void;
}) {
  if (assets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No assets match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {assets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          onClick={() => onView(asset)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{asset.assetTag}</p>
              <p className="mt-0.5 truncate font-medium">{asset.name}</p>
            </div>
            <Badge variant={statusVariant(asset.status)} className="shrink-0 text-[10px]">
              {SERVICE_ASSET_STATUS_LABELS[asset.status]}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between gap-2 text-muted-foreground">
            <span className="truncate">{asset.customer}</span>
            <span className="shrink-0">{SERVICE_ASSET_CATEGORY_LABELS[asset.category]}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function nextAssetTag(assets: ServiceAsset[]): string {
  const nums = assets
    .map((a) => {
      const m = a.assetTag.match(/AST\/2026\/(\d+)/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `AST/2026/${String(next).padStart(4, "0")}`;
}

export function ServiceAssets() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ServiceAsset>>(null);

  const [assets, setAssets] = useState<ServiceAsset[]>(() => [...serviceAssetsSeed]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const createOpen = params.get("create") === "1";
  const editId = params.get("edit");
  const viewId = params.get("view");

  const editAsset = useMemo(
    () => (editId ? assets.find((a) => a.id === editId) ?? null : null),
    [editId, assets]
  );
  const viewAsset = useMemo(
    () => (viewId ? assets.find((a) => a.id === viewId) ?? null : null),
    [viewId, assets]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/assets?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const openView = useCallback(
    (asset: ServiceAsset) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", asset.id); }),
    [pushParams]
  );
  const openEdit = useCallback(
    (asset: ServiceAsset) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", asset.id); }),
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
    return assets.filter((asset) => {
      if (statusFilter !== "all" && asset.status !== statusFilter) return false;
      if (categoryFilter !== "all" && asset.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        asset.assetTag.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.customer.toLowerCase().includes(q) ||
        (asset.serialNumber?.toLowerCase().includes(q) ?? false) ||
        asset.brand.toLowerCase().includes(q)
      );
    });
  }, [assets, statusFilter, categoryFilter, search]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: assets.length };
    assets.forEach((a) => { c[a.status] = (c[a.status] ?? 0) + 1; });
    return c;
  }, [assets]);

  const inRepairCount = statusCounts.in_repair ?? 0;

  const handleSave = useCallback(
    (asset: ServiceAsset, mode: "create" | "edit") => {
      setAssets((prev) => {
        if (mode === "create") return [asset, ...prev];
        return prev.map((a) => (a.id === asset.id ? asset : a));
      });
      closeForm();
      if (mode === "create") openView(asset);
    },
    [closeForm, openView]
  );

  const existingTags = useMemo(() => assets.map((a) => a.assetTag), [assets]);
  const suggestedTag = useMemo(() => nextAssetTag(assets), [assets]);

  const RowMenu = useCallback(
    ({ data }: { data: ServiceAsset }) => (
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
    (p: ICellRendererParams<ServiceAsset>) => {
      if (!p.data) return null;
      return (
        <div className="flex h-full items-center justify-center">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const columnDefs = useMemo<ColDef<ServiceAsset>[]>(
    () => [
      { field: "assetTag", headerName: "Asset ID", pinned: "left", width: 130, cellClass: "font-mono text-xs" },
      { field: "name", headerName: "Asset name", flex: 1, minWidth: 160 },
      { field: "customer", headerName: "Customer", width: 160 },
      { field: "category", headerName: "Category", width: 110, cellRenderer: CategoryPill },
      { field: "brand", headerName: "Brand", width: 90 },
      { field: "model", headerName: "Model", width: 100 },
      { field: "serialNumber", headerName: "Serial", width: 120, valueFormatter: (p) => p.value ?? "—", cellClass: "font-mono text-[10px]" },
      { field: "warrantyEndDate", headerName: "Warranty", width: 100, valueFormatter: (p) => p.value ?? "—" },
      { field: "location", headerName: "Location", width: 140 },
      { field: "status", headerName: "Status", width: 100, cellRenderer: StatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ServiceAsset }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = rowData.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Assets</p>
          <h1 className="page-title">
            Customer Assets
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({assets.length.toLocaleString()} registered)
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
            + Register Asset
          </Button>
        </div>
      </div>

      {inRepairCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          {inRepairCount} asset{inRepairCount > 1 ? "s" : ""} currently in repair — check service orders for updates.
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tag, name, customer, serial…"
          className="h-8 w-full max-w-xs text-xs"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-36 text-xs">
          {STATUS_TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} {statusCounts[t.id] !== undefined ? `(${statusCounts[t.id]})` : ""}
            </option>
          ))}
        </Select>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-8 w-36 text-xs">
          <option value="all">All categories</option>
          {(Object.keys(SERVICE_ASSET_CATEGORY_LABELS) as ServiceAssetCategory[]).map((c) => (
            <option key={c} value={c}>{SERVICE_ASSET_CATEGORY_LABELS[c]}</option>
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
            {rowData.length !== assets.length && ` (filtered from ${assets.length})`}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <AssetMobileCards assets={rowData} onView={openView} />
      </div>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Register asset"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ServiceAssetViewSheet
        open={!!viewAsset && !createOpen && !editAsset}
        asset={viewAsset}
        onClose={closeView}
        onEdit={openEdit}
      />

      <ServiceAssetFormSheet
        open={createOpen || !!editAsset}
        onClose={closeForm}
        onSave={handleSave}
        editAsset={editAsset}
        existingTags={existingTags}
        nextTag={suggestedTag}
      />
    </div>
  );
}
