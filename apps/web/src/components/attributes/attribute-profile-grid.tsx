"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams, RowDragEndEvent } from "ag-grid-community";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Copy,
  Filter,
  GripVertical,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  attributeProfilesSeed,
  countProfileStats,
  type AttributeProfile,
} from "@/lib/mock-data/attribute-profiles";
import { useAttributeProfileStore } from "@/lib/store/attribute-profile-store";
import { cn } from "@/lib/utils";
import { useIsDark } from "@/lib/use-is-dark";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AttributeProfileFormDialog } from "@/components/attributes/attribute-profile-form-dialog";

const PAGE_SIZE = 25;

type ProfileRow = AttributeProfile & { groupCount: number; attributeCount: number };

function reorderIds(items: { id: string; sortOrder: number }[], draggedId: string, overId: string) {
  if (draggedId === overId) return null;
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const ids = sorted.map((i) => i.id);
  const from = ids.indexOf(draggedId);
  const to = ids.indexOf(overId);
  if (from < 0 || to < 0) return null;
  const next = [...ids];
  next.splice(from, 1);
  next.splice(to, 0, draggedId);
  return next;
}

type Props = {
  className?: string;
  addTrigger?: number;
};

export function AttributeProfileGrid({ className, addTrigger = 0 }: Props) {
  const router = useRouter();
  const isDark = useIsDark();
  const profiles = useAttributeProfileStore((s) => s.profiles);
  const groups = useAttributeProfileStore((s) => s.groups);
  const attributes = useAttributeProfileStore((s) => s.attributes);
  const upsertProfile = useAttributeProfileStore((s) => s.upsertProfile);
  const patchProfile = useAttributeProfileStore((s) => s.patchProfile);
  const deleteProfiles = useAttributeProfileStore((s) => s.deleteProfiles);
  const duplicateProfile = useAttributeProfileStore((s) => s.duplicateProfile);
  const reorderProfiles = useAttributeProfileStore((s) => s.reorderProfiles);
  const setProfiles = useAttributeProfileStore((s) => s.setProfiles);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState({ search: true, status: false });
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editProfile, setEditProfile] = useState<AttributeProfile | null>(null);
  const [selected, setSelected] = useState<ProfileRow[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<ProfileRow[]>([]);
  const [page, setPage] = useState(0);

  const rows = useMemo<ProfileRow[]>(() => {
    return [...profiles]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((p) => {
        const stats = countProfileStats(p.id, groups, attributes);
        return { ...p, ...stats };
      })
      .filter((p) => {
        const q = search.toLowerCase().trim();
        if (q && !p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
        if (status === "on" && !p.active) return false;
        if (status === "off" && p.active) return false;
        return true;
      });
  }, [profiles, groups, attributes, search, status]);

  const openCreate = useCallback(() => {
    setFormMode("create");
    setEditProfile(null);
    setFormOpen(true);
  }, []);

  useEffect(() => {
    if (addTrigger > 0) openCreate();
  }, [addTrigger, openCreate]);

  const StatusCell = useCallback(({ data }: ICellRendererParams<ProfileRow>) => {
    if (!data) return null;
    return (
      <button
        type="button"
        className={cn(
          "rounded px-1.5 py-0.5 text-[10px] font-medium",
          data.active
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
            : "bg-muted text-muted-foreground",
        )}
        onClick={(e) => {
          e.stopPropagation();
          patchProfile(data.id, { active: !data.active });
        }}
      >
        {data.active ? "On" : "Off"}
      </button>
    );
  }, [patchProfile]);

  const RowActions = useCallback(
    ({ data }: ICellRendererParams<ProfileRow>) => {
      if (!data) return null;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/catalog/specifications/profiles/${data.id}`)}>
              <Layers className="mr-2 h-3.5 w-3.5" /> Open builder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFormMode("edit");
                setEditProfile(data);
                setFormOpen(true);
              }}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const newId = duplicateProfile(data.id);
                if (newId) {
                  toast.success("Profile duplicated");
                  router.push(`/catalog/specifications/profiles/${newId}`);
                }
              }}
            >
              <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setDeleteTargets([data]);
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [router, duplicateProfile],
  );

  const columnDefs = useMemo<ColDef<ProfileRow>[]>(
    () => [
      { headerCheckboxSelection: true, checkboxSelection: true, width: 44, pinned: "left", resizable: false, suppressMovable: true },
      {
        rowDrag: true,
        width: 36,
        pinned: "left",
        resizable: false,
        suppressMovable: true,
        headerComponent: () => <GripVertical className="mx-auto h-3.5 w-3.5 text-muted-foreground" />,
      },
      {
        colId: "icon",
        width: 52,
        resizable: false,
        suppressMovable: true,
        sortable: false,
        cellRenderer: (p: ICellRendererParams<ProfileRow>) =>
          p.data?.iconUrl ? (
            <img src={p.data.iconUrl} alt="" className="h-7 w-7 rounded object-cover" />
          ) : (
            <span className="inline-block h-7 w-7 rounded bg-muted" />
          ),
      },
      {
        field: "name",
        headerName: "Profile",
        width: 200,
        cellRenderer: (p: ICellRendererParams<ProfileRow>) =>
          p.data ? (
            <button
              type="button"
              className="truncate text-left text-primary"
              onClick={() => router.push(`/catalog/specifications/profiles/${p.data!.id}`)}
            >
              {p.data.name}
            </button>
          ) : null,
      },
      { field: "code", headerName: "Code", width: 140 },
      { field: "groupCount", headerName: "Groups", width: 88 },
      { field: "attributeCount", headerName: "Fields", width: 88 },
      { field: "productCount", headerName: "Products", width: 88 },
      {
        colId: "categories",
        headerName: "Categories",
        width: 160,
        valueGetter: (p) => p.data?.categoryLabels.join(", ") ?? "",
      },
      { colId: "status", field: "active", headerName: "Status", width: 80, cellRenderer: StatusCell },
      { field: "updatedAt", headerName: "Updated", width: 100 },
      { width: 48, pinned: "right", cellRenderer: RowActions, sortable: false, resizable: false },
    ],
    [RowActions, StatusCell, router],
  );

  const onRowDragEnd = useCallback(
    (e: RowDragEndEvent<ProfileRow>) => {
      const dragged = e.node.data;
      const over = e.overNode?.data;
      if (!dragged || !over) return;
      const ids = reorderIds(profiles, dragged.id, over.id);
      if (ids) reorderProfiles(ids);
    },
    [profiles, reorderProfiles],
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rows.length);

  return (
    <div className={cn("flex min-h-0 flex-col gap-3", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {visibleFilters.search && (
          <Input
            placeholder="Search profile, code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[220px]"
          />
        )}
        {visibleFilters.status && (
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-[120px]">
            <option value="all">All status</option>
            <option value="on">Active</option>
            <option value="off">Inactive</option>
          </Select>
        )}
        <Button variant="outline" size="sm" onClick={() => { setProfiles(attributeProfilesSeed); toast.success("Reset profiles"); }}>
          Reset order
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => setFilterSheetOpen(true)}>
          <Filter className="mr-1.5 h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="text-xs font-medium">{selected.length} selected</span>
          <Button size="sm" onClick={() => { selected.forEach((p) => patchProfile(p.id, { active: true })); setSelected([]); toast.success("Activated"); }}>
            Turn on
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { selected.forEach((p) => patchProfile(p.id, { active: false })); setSelected([]); }}>
            Turn off
          </Button>
          <Button variant="destructive" size="sm" onClick={() => { setDeleteTargets(selected); setDeleteOpen(true); }}>
            Delete
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto h-7 w-7 p-0" onClick={() => setSelected([])}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        {rows.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-input bg-card p-8">
            <p className="text-sm text-muted-foreground">No attribute profiles found</p>
          </div>
        ) : (
          <div className={cn("ag-theme-quartz control-border h-0 min-h-0 flex-1 overflow-hidden rounded-md bg-card [&_.ag-root-wrapper]:h-full", isDark && "ag-theme-quartz-dark")}>
            <AgGridReact
              theme="legacy"
              rowData={rows}
              columnDefs={columnDefs}
              defaultColDef={{ resizable: true, minWidth: 72 }}
              rowDragEntireRow
              rowSelection="multiple"
              suppressRowClickSelection
              onRowDragEnd={onRowDragEnd}
              onSelectionChanged={(e) => setSelected(e.api.getSelectedRows())}
              pagination
              paginationPageSize={PAGE_SIZE}
              onPaginationChanged={(e) => setPage(e.api.paginationGetCurrentPage())}
              getRowId={(p) => p.data.id}
              rowClassRules={{ "opacity-45": (p) => !!p.data && !p.data.active }}
            />
          </div>
        )}
        {rows.length > 0 && (
          <p className="shrink-0 pt-1 text-xs text-muted-foreground">
            Showing {pageStart}–{pageEnd} of {rows.length} · click profile name to open builder
          </p>
        )}
      </div>

      <div className="space-y-2 md:hidden">
        {rows.slice(0, 20).map((p) => (
          <button
            key={p.id}
            type="button"
            className="flex w-full gap-3 rounded-lg border border-input bg-card p-3 text-left"
            onClick={() => router.push(`/catalog/specifications/profiles/${p.id}`)}
          >
            {p.iconUrl ? <img src={p.iconUrl} alt="" className="h-10 w-10 rounded object-cover" /> : <span className="h-10 w-10 rounded bg-muted" />}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.groupCount} groups · {p.attributeCount} fields</p>
              <Badge variant={p.active ? "success" : "muted"} className="mt-1">{p.active ? "Active" : "Inactive"}</Badge>
            </div>
          </button>
        ))}
      </div>

      <AttributeProfileFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        profile={editProfile}
        onSave={(data) => {
          if (formMode === "create") upsertProfile(data);
          else if (editProfile) upsertProfile({ id: editProfile.id, ...data });
        }}
      />

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="right" className="w-full max-w-sm">
          <h2 className="text-base font-semibold">Filters</h2>
          <div className="mt-4 space-y-2">
            {(["search", "status"] as const).map((key) => (
              <label key={key} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={visibleFilters[key]}
                  onChange={(e) => setVisibleFilters((v) => ({ ...v, [key]: e.target.checked }))}
                />
                {key === "search" ? "Search" : "Status"}
              </label>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(400px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-input bg-background p-6 shadow-xl">
            <Dialog.Title className="font-semibold">Delete profiles?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              {deleteTargets.length === 1
                ? `"${deleteTargets[0]?.name}" and all groups/attributes will be deleted.`
                : `${deleteTargets.length} profiles will be deleted.`}
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deleteProfiles(deleteTargets.map((t) => t.id));
                  setDeleteOpen(false);
                  setSelected([]);
                  toast.success("Deleted");
                }}
              >
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
