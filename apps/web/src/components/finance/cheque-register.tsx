"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ArrowDownLeft, ArrowUpRight, Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  CHEQUE_DIRECTION_LABELS,
  CHEQUE_STATUS_LABELS,
  computeChequeKpis,
  formatBdt,
  type ChequeDirection,
  type ChequeInstrument,
  type ChequeStatus,
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
import { ChequeFormSheet } from "./cheque-form-sheet";
import { ChequePdcCalendar } from "./cheque-pdc-calendar";
import { useFinanceChequeStore } from "@/lib/store/finance-cheque-store";

const PAGE_SIZE = 25;

const VIEW_TABS = [
  { id: "register", label: "Register" },
  { id: "calendar", label: "PDC Calendar" },
];

const DIRECTION_TABS = [
  { id: "all", label: "All" },
  { id: "received", label: "Received" },
  { id: "issued", label: "Issued" },
];

function chequeStatusVariant(s: ChequeStatus): "success" | "warning" | "muted" | "secondary" {
  if (s === "cleared") return "success";
  if (s === "deposited") return "secondary";
  if (s === "issued") return "warning";
  if (s === "bounced") return "muted";
  return "muted";
}

function ChequeStatusPill({ value }: { value: ChequeStatus }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={chequeStatusVariant(value)} className="text-[10px]">
        {CHEQUE_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function DirectionPill({ value }: { value: ChequeDirection }) {
  const isReceived = value === "received";
  return (
    <div className="flex items-center h-full gap-1">
      {isReceived ? (
        <ArrowDownLeft className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <ArrowUpRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
      )}
      <Badge variant={isReceived ? "success" : "secondary"} className="text-[10px]">
        {CHEQUE_DIRECTION_LABELS[value]}
      </Badge>
    </div>
  );
}

function daysUntilMaturity(maturityDate: string): string {
  const today = new Date("2026-06-19");
  const mat = new Date(maturityDate);
  const diff = Math.ceil((mat.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Due today";
  if (diff <= 7) return `${diff}d left`;
  return mat.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function ChequeMobileCards({
  cheques,
  onView,
}: {
  cheques: ChequeInstrument[];
  onView: (c: ChequeInstrument) => void;
}) {
  if (cheques.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No cheques match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {cheques.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onView(c)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">#{c.chequeNumber}</p>
              <p className="mt-0.5 font-medium truncate">{c.party}</p>
            </div>
            <ChequeStatusPill value={c.status} />
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>{CHEQUE_DIRECTION_LABELS[c.direction]} · {daysUntilMaturity(c.maturityDate)}</span>
            <span className="font-medium text-foreground tabular-nums">{formatBdt(c.amount)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChequeDetailSheet({
  cheque,
  open,
  onClose,
  onUpdateStatus,
}: {
  cheque: ChequeInstrument | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ChequeStatus) => void;
}) {
  if (!cheque) return null;

  const isReceived = cheque.direction === "received";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="shrink-0 border-b border-border pb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-muted-foreground">Cheque #{cheque.chequeNumber}</p>
                <h2 className="mt-1 font-semibold">{cheque.party}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <DirectionPill value={cheque.direction} />
                  <ChequeStatusPill value={cheque.status} />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 text-xs">
                Close
              </Button>
            </div>
          </div>

          <div className="mt-4 shrink-0 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Amount</span>
              <p className="font-semibold tabular-nums">{formatBdt(cheque.amount)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bank</span>
              <p className="font-medium">{cheque.bank}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Issue Date</span>
              <p className="font-medium">{cheque.issueDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Maturity</span>
              <p className="font-medium">{cheque.maturityDate}</p>
              <p className="text-[10px] text-muted-foreground">{daysUntilMaturity(cheque.maturityDate)}</p>
            </div>
          </div>

          <div className="mt-4 shrink-0 rounded-lg border border-input bg-muted/30 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Linked Document</span>
              <span className="font-mono font-medium">{cheque.linkedDoc}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Document Type</span>
              <span>{cheque.linkedDocType}</span>
            </div>
            {cheque.notes && (
              <p className="mt-2 border-t border-border pt-2 text-muted-foreground">{cheque.notes}</p>
            )}
          </div>

          <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-border pt-3">
            {cheque.status === "issued" && (
              <Button
                size="sm"
                onClick={() => {
                  onUpdateStatus(cheque.id, "deposited");
                  toast.success(isReceived ? "Cheque deposited to bank" : "Cheque presented for payment");
                  onClose();
                }}
              >
                {isReceived ? "Deposit to Bank" : "Present for Payment"}
              </Button>
            )}
            {cheque.status === "deposited" && (
              <Button
                size="sm"
                onClick={() => {
                  onUpdateStatus(cheque.id, "cleared");
                  toast.success("Cheque cleared");
                  onClose();
                }}
              >
                Mark Cleared
              </Button>
            )}
            {(cheque.status === "issued" || cheque.status === "deposited") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onUpdateStatus(cheque.id, "bounced");
                  toast.error("Cheque marked as bounced");
                  onClose();
                }}
              >
                Mark Bounced
              </Button>
            )}
            {cheque.status === "bounced" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onUpdateStatus(cheque.id, "issued");
                  toast.info("Cheque re-presented (prototype)");
                  onClose();
                }}
              >
                Re-present
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ChequeRegister() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ChequeInstrument>>(null);
  const cheques = useFinanceChequeStore((s) => s.cheques);
  const addCheques = useFinanceChequeStore((s) => s.addCheques);
  const updateChequeStatus = useFinanceChequeStore((s) => s.updateChequeStatus);
  const [directionFilter, setDirectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const viewId = params.get("view");
  const activeView = params.get("tab") === "calendar" ? "calendar" : "register";
  const viewCheque = useMemo(
    () => (viewId ? (cheques.find((c) => c.id === viewId) ?? null) : null),
    [viewId, cheques]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`?${p.toString()}`);
    },
    [router, params]
  );

  const openView = useCallback(
    (c: ChequeInstrument) => pushParams((p) => { p.delete("create"); p.set("view", c.id); }),
    [pushParams]
  );
  const closeView = useCallback(() => pushParams((p) => p.delete("view")), [pushParams]);
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.set("create", "1"); }),
    [pushParams]
  );
  const closeCreate = useCallback(
    () => pushParams((p) => p.delete("create")),
    [pushParams]
  );
  const setActiveView = useCallback(
    (tab: string) => pushParams((p) => { p.set("tab", tab); }),
    [pushParams]
  );

  const handleRegisterSave = useCallback(
    (created: ChequeInstrument[]) => {
      addCheques(created);
      closeCreate();
      if (created[0]) {
        pushParams((p) => {
          p.delete("create");
          p.set("view", created[0].id);
        });
      }
    },
    [addCheques, closeCreate, pushParams]
  );

  const kpis = useMemo(() => computeChequeKpis(cheques), [cheques]);

  const directionCounts = useMemo(() => {
    const c: Record<string, number> = { all: cheques.length };
    cheques.forEach((ch) => { c[ch.direction] = (c[ch.direction] ?? 0) + 1; });
    return c;
  }, [cheques]);

  const rowData = useMemo(
    () =>
      cheques.filter((c) => {
        if (directionFilter !== "all" && c.direction !== directionFilter) return false;
        if (statusFilter !== "all" && c.status !== statusFilter) return false;
        if (
          search &&
          !c.chequeNumber.includes(search) &&
          !c.party.toLowerCase().includes(search.toLowerCase()) &&
          !c.linkedDoc.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [cheques, directionFilter, statusFilter, search]
  );

  const handleUpdateStatus = (id: string, status: ChequeStatus) => {
    updateChequeStatus(id, status);
  };

  const RowMenu = useCallback(
    ({ data }: { data: ChequeInstrument }) => (
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
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [openView]
  );

  const ActionCell = useCallback(
    (p: ICellRendererParams<ChequeInstrument>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const MaturityCell = useCallback((p: ICellRendererParams<ChequeInstrument>) => {
    if (!p.data) return null;
    const overdue = new Date(p.data.maturityDate) < new Date("2026-06-19");
    return (
      <div className="flex flex-col justify-center h-full text-xs">
        <span>{p.data.maturityDate}</span>
        <span className={cn("text-[10px]", overdue ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
          {daysUntilMaturity(p.data.maturityDate)}
        </span>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<ChequeInstrument>[]>(
    () => [
      { field: "chequeNumber", headerName: "Cheque #", pinned: "left", width: 100, cellClass: "font-mono text-xs" },
      { field: "direction", headerName: "Direction", width: 110, cellRenderer: DirectionPill },
      { field: "party", headerName: "Party", flex: 1, minWidth: 150 },
      { field: "bank", headerName: "Bank", width: 130 },
      {
        field: "amount",
        headerName: "Amount",
        width: 120,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      { field: "issueDate", headerName: "Issue", width: 100 },
      { field: "maturityDate", headerName: "Maturity", width: 120, cellRenderer: MaturityCell },
      { field: "linkedDoc", headerName: "Linked Doc", width: 140, cellClass: "font-mono text-xs" },
      { field: "status", headerName: "Status", width: 120, cellRenderer: ChequeStatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell, MaturityCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ChequeInstrument }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <FinanceKpiRow
        kpis={[
          {
            label: "Collect This Week",
            value: formatBdt(kpis.receivedDueAmt),
            sub: `${kpis.receivedDueCount} received PDC`,
          },
          {
            label: "Pay This Week",
            value: formatBdt(kpis.issuedDueAmt),
            sub: `${kpis.issuedDueCount} issued PDC`,
            alert: kpis.issuedDueCount > 0,
          },
          {
            label: "Pending Deposit",
            value: String(kpis.pendingDepositCount),
            sub: "Maturity passed — not deposited",
            alert: kpis.pendingDepositCount > 0,
          },
          {
            label: "Bounced",
            value: String(kpis.bouncedCount),
            sub: "Requires follow-up",
            alert: kpis.bouncedCount > 0,
          },
        ]}
      />

      <FinanceStatusTabs
        tabs={VIEW_TABS}
        active={activeView}
        onChange={setActiveView}
      />

      {activeView === "calendar" && (
        <div className="flex shrink-0 justify-end">
          <Button size="sm" className="hidden sm:inline-flex" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Register Cheque
          </Button>
        </div>
      )}

      <FinanceStatusTabs
        tabs={DIRECTION_TABS}
        active={directionFilter}
        onChange={setDirectionFilter}
        counts={directionCounts}
      />

      {activeView === "calendar" ? (
        <ChequePdcCalendar
          cheques={cheques}
          directionFilter={directionFilter}
          onView={openView}
        />
      ) : (
        <>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search cheque #, party, doc…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-52 text-xs"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-36 text-xs">
          <option value="all">All statuses</option>
          <option value="issued">Issued / PDC</option>
          <option value="deposited">Deposited</option>
          <option value="cleared">Cleared</option>
          <option value="bounced">Bounced</option>
        </Select>
        <Button size="sm" className="ml-auto hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Register Cheque
        </Button>
      </div>

      {/* Desktop grid */}
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
            {rowData.length !== cheques.length && ` (filtered from ${cheques.length})`}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <ChequeMobileCards cheques={rowData} onView={openView} />
      </div>
        </>
      )}

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Register cheque"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ChequeDetailSheet
        cheque={viewCheque}
        open={!!viewId}
        onClose={closeView}
        onUpdateStatus={handleUpdateStatus}
      />

      <ChequeFormSheet
        open={params.get("create") === "1"}
        onClose={closeCreate}
        onSave={handleRegisterSave}
      />
    </div>
  );
}
