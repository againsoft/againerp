"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Pencil, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  JOURNAL_STATUS_LABELS,
  journalEntriesSeed,
  type JournalEntry,
  type JournalStatus,
} from "@/lib/mock-data/finance";
import { useIsDark } from "@/lib/use-is-dark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FinanceKpiRow, FinanceStatusTabs } from "./finance-kpi-tabs";
import { FinancePeriodBanner } from "./finance-period-banner";
import { JournalEntryFormSheet, JournalLinesTable } from "./journal-entry-form-sheet";
import { JournalEntryMobileCards } from "./journal-entry-mobile-cards";

const PAGE_SIZE = 25;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "posted", label: "Posted" },
  { id: "reversed", label: "Reversed" },
];

function buildUrl(params: URLSearchParams) {
  const q = params.toString();
  return q ? `/finance/journals?${q}` : "/finance/journals";
}

function statusVariant(s: JournalStatus): "success" | "warning" | "muted" {
  if (s === "posted") return "success";
  if (s === "draft") return "warning";
  return "muted";
}

function StatusPill({ value }: { value: JournalStatus }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={statusVariant(value)} className="text-[10px]">
        {JOURNAL_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function TypePill({ value }: { value: string }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant="secondary" className="font-mono text-[10px]">{value}</Badge>
    </div>
  );
}

function JeViewSheet({
  entry,
  open,
  onClose,
  onPost,
  onReverse,
  onEdit,
}: {
  entry: JournalEntry | null;
  open: boolean;
  onClose: () => void;
  onPost: (id: string) => void;
  onReverse: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
}) {
  if (!entry) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="border-b border-border pb-4">
            <p className="font-mono text-xs text-muted-foreground">{entry.number}</p>
            <h2 className="font-semibold mt-1">{entry.description}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">{entry.type}</Badge>
              <Badge variant={statusVariant(entry.status)} className="text-[10px]">{JOURNAL_STATUS_LABELS[entry.status]}</Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div><span className="text-muted-foreground">Date</span><p className="font-medium">{entry.date}</p></div>
            <div><span className="text-muted-foreground">Reference</span><p className="font-medium font-mono">{entry.reference}</p></div>
            <div><span className="text-muted-foreground">Source</span><p className="font-medium">{entry.source}</p></div>
            <div><span className="text-muted-foreground">Total</span><p className="font-medium">{formatBdt(entry.debitTotal)}</p></div>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium mb-2">Journal Lines</h3>
            <JournalLinesTable lines={entry.lines} />
          </div>
          {entry.status === "posted" && (
            <p className="mt-3 text-[10px] text-muted-foreground">
              Posted entries are immutable — use Reverse to create a correcting entry.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.status === "draft" && (
              <>
                <Button size="sm" onClick={() => { onPost(entry.id); onClose(); }}>Post</Button>
                <Button variant="outline" size="sm" onClick={() => { onEdit(entry); }}>Edit</Button>
              </>
            )}
            {entry.status === "posted" && (
              <Button variant="outline" size="sm" onClick={() => { onReverse(entry.id); onClose(); }}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reverse
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function JournalEntries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gridRef = useRef<AgGridReact<JournalEntry>>(null);
  const isDark = useIsDark();

  const [entries, setEntries] = useState<JournalEntry[]>(() => [...journalEntriesSeed]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const viewEntry = useMemo(
    () => (viewId ? entries.find((e) => e.id === viewId) ?? null : null),
    [viewId, entries]
  );
  const editEntry = useMemo(
    () => (editId ? entries.find((e) => e.id === editId && e.status === "draft") ?? null : null),
    [editId, entries]
  );
  const formOpen = createOpen || !!editEntry;
  const viewOpen = !!viewEntry && !formOpen;

  const nextNumber = useMemo(() => {
    const max = entries.reduce((m, e) => {
      const n = parseInt(e.number.split("/").pop() ?? "0", 10);
      return n > m ? n : m;
    }, 0);
    return `JE/2026/${String(max + 1).padStart(4, "0")}`;
  }, [entries]);

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      router.push(buildUrl(p), { scroll: false });
    },
    [router, searchParams]
  );

  const openCreate = () =>
    pushParams((p) => {
      p.delete("edit");
      p.delete("view");
      p.set("create", "1");
    });

  const openView = (entry: JournalEntry) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.set("view", entry.id);
    });

  const openEdit = (entry: JournalEntry) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("view");
      p.set("edit", entry.id);
    });

  const closeForm = () =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
    });

  const closeView = () =>
    pushParams((p) => {
      p.delete("view");
    });

  useEffect(() => {
    if (editId && !editEntry) {
      toast.error("Draft entry not found");
      closeForm();
    }
  }, [editId, editEntry]);

  useEffect(() => {
    if (viewId && !viewEntry && !formOpen) {
      toast.error("Journal entry not found");
      closeView();
    }
  }, [viewId, viewEntry, formOpen]);

  const rowData = useMemo(
    () =>
      entries.filter((j) => {
        if (statusFilter !== "all" && j.status !== statusFilter) return false;
        if (typeFilter !== "all" && j.type !== typeFilter) return false;
        if (search && !j.number.toLowerCase().includes(search.toLowerCase()) && !j.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [entries, statusFilter, typeFilter, search]
  );

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: entries.length };
    entries.forEach((e) => { c[e.status] = (c[e.status] ?? 0) + 1; });
    return c;
  }, [entries]);

  const draftCount = entries.filter((e) => e.status === "draft").length;
  const postedMtd = entries.filter((e) => e.status === "posted").reduce((s, e) => s + e.debitTotal, 0);

  const pageStart = rowData.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  const RowMenu = useCallback(
    ({ data }: { data: JournalEntry }) => (
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
          {data.status === "draft" && (
            <DropdownMenuItem onClick={() => openEdit(data)}>
              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [openView, openEdit]
  );

  const ActionCell = useCallback(
    (p: ICellRendererParams<JournalEntry>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const columnDefs = useMemo<ColDef<JournalEntry>[]>(
    () => [
      { field: "number", headerName: "Entry #", pinned: "left", width: 130, cellClass: "font-mono text-xs" },
      { field: "type", headerName: "Type", width: 72, cellRenderer: TypePill },
      { field: "date", headerName: "Date", width: 100 },
      { field: "reference", headerName: "Reference", width: 110, cellClass: "font-mono text-xs" },
      { field: "description", headerName: "Description", flex: 1, minWidth: 160 },
      { field: "debitTotal", headerName: "Debit", width: 100, valueFormatter: (p) => formatBdt(p.value ?? 0), cellClass: "text-right tabular-nums" },
      { field: "creditTotal", headerName: "Credit", width: 100, valueFormatter: (p) => formatBdt(p.value ?? 0), cellClass: "text-right tabular-nums" },
      { field: "status", headerName: "Status", width: 96, cellRenderer: StatusPill },
      { field: "source", headerName: "Source", width: 88 },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: JournalEntry }) => {
      if (e.data) openView(e.data);
    },
    [openView]
  );

  const handleSave = (entry: JournalEntry) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === entry.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [entry, ...prev];
    });
    closeForm();
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.set("view", entry.id);
    });
  };

  const handlePost = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "posted" as const } : e)));
    toast.success("Journal posted");
  };

  const handleReverse = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "reversed" as const } : e)));
    toast.warning("Journal reversed");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <FinanceKpiRow
        kpis={[
          { label: "Entries This Month", value: String(entries.length), sub: "All journal types" },
          { label: "Draft", value: String(draftCount), sub: "Awaiting post", alert: draftCount > 0 },
          { label: "Posted Volume MTD", value: formatBdt(postedMtd), sub: "Debit total posted" },
          { label: "Reversed", value: String(statusCounts.reversed ?? 0), sub: "Correcting entries" },
        ]}
      />

      <FinanceStatusTabs tabs={STATUS_TABS} active={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Input placeholder="Search entries…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-48 text-xs" />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-8 w-28 text-xs">
          <option value="all">All types</option>
          <option value="SAL">SAL</option>
          <option value="PUR">PUR</option>
          <option value="BNK">BNK</option>
          <option value="MISC">MISC</option>
          <option value="INV">INV</option>
          <option value="PAY">PAY</option>
        </Select>
        <Button size="sm" className="ml-auto hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> New Entry
        </Button>
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
            {rowData.length !== entries.length && ` (filtered from ${entries.length})`}
          </p>
        )}
      </div>

      <div className="md:hidden min-h-0 flex-1 overflow-y-auto">
        <JournalEntryMobileCards entries={rowData} onView={openView} onEdit={openEdit} />
      </div>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="New journal entry"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <JeViewSheet
        entry={viewEntry}
        open={viewOpen}
        onClose={closeView}
        onPost={handlePost}
        onReverse={handleReverse}
        onEdit={openEdit}
      />

      <JournalEntryFormSheet
        open={formOpen}
        onClose={closeForm}
        onSave={handleSave}
        nextNumber={nextNumber}
        editEntry={editEntry}
      />
    </div>
  );
}
