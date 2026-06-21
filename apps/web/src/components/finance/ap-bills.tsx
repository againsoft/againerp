"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { CheckCircle2, Eye, MoreHorizontal, Plus, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  apActivityById,
  apBillsSeed,
  apMatchDetailsById,
  apPaymentScheduleById,
  computeApKpis,
  DOC_STATUS_LABELS,
  formatBdt,
  getApBillLines,
  type ApBill,
  type ChequeInstrument,
  type DocStatus,
} from "@/lib/mock-data/finance";
import { useFinanceChequeStore } from "@/lib/store/finance-cheque-store";
import { useIsDark } from "@/lib/use-is-dark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DocumentChequesTab, DrawerTabs } from "./document-cheques-tab";

const PAGE_SIZE = 25;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "posted", label: "Posted" },
  { id: "overdue", label: "Overdue" },
  { id: "paid", label: "Paid" },
];

function docStatusVariant(s: DocStatus): "success" | "warning" | "muted" | "secondary" {
  if (s === "paid") return "success";
  if (s === "partial") return "warning";
  if (s === "overdue") return "muted";
  return "secondary";
}

function DocStatusPill({ value }: { value: DocStatus }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={docStatusVariant(value)} className="text-[10px]">
        {DOC_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function MatchPill({ value }: { value: ApBill["matchStatus"] }) {
  const variant = value === "matched" ? "success" : value === "partial" ? "warning" : "muted";
  return (
    <div className="flex items-center h-full">
      <Badge variant={variant} className="text-[10px] capitalize">{value}</Badge>
    </div>
  );
}

function ApMobileCards({
  bills,
  onView,
}: {
  bills: ApBill[];
  onView: (bill: ApBill) => void;
}) {
  if (bills.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No bills match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {bills.map((bill) => (
        <button
          key={bill.id}
          type="button"
          onClick={() => onView(bill)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{bill.number}</p>
              <p className="mt-0.5 font-medium truncate">{bill.vendor}</p>
            </div>
            <Badge variant={docStatusVariant(bill.status)} className="shrink-0 text-[10px]">
              {DOC_STATUS_LABELS[bill.status]}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>Due {bill.dueDate}</span>
            <span className="font-medium text-foreground tabular-nums">{formatBdt(bill.total)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ApDetailSheet({
  bill,
  open,
  onClose,
  cheques,
  onAddCheque,
  chequeFormOpen,
  onChequeFormClose,
  onChequeSave,
}: {
  bill: ApBill | null;
  open: boolean;
  onClose: () => void;
  cheques: ChequeInstrument[];
  onAddCheque: () => void;
  chequeFormOpen: boolean;
  onChequeFormClose: () => void;
  onChequeSave: (created: ChequeInstrument[]) => void;
}) {
  const [tab, setTab] = useState<"lines" | "match" | "schedule" | "cheques" | "activity">("lines");
  if (!bill) return null;

  const lines = getApBillLines(bill);
  const match = apMatchDetailsById[bill.id];
  const schedule = apPaymentScheduleById[bill.id] ?? [];
  const activity = apActivityById[bill.id] ?? [];
  const linkedChequeCount = cheques.filter(
    (c) => c.linkedDoc === bill.number && c.direction === "issued"
  ).length;

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="shrink-0 border-b border-border pb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{bill.number}</p>
                <h2 className="mt-1 font-semibold">{bill.vendor}</h2>
                <div className="mt-2 flex gap-2">
                  <Badge variant={docStatusVariant(bill.status)} className="text-[10px]">
                    {DOC_STATUS_LABELS[bill.status]}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {bill.matchStatus}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 text-xs">
                Close
              </Button>
            </div>
          </div>

          <div className="mt-4 shrink-0 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Total</span>
              <p className="font-medium tabular-nums">{formatBdt(bill.total)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Open</span>
              <p className="font-medium tabular-nums text-amber-600 dark:text-amber-400">{formatBdt(bill.residual)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bill Date</span>
              <p className="font-medium">{bill.billDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Due</span>
              <p className="font-medium">{bill.dueDate}</p>
            </div>
          </div>

          <DrawerTabs
            tabs={[
              { id: "lines", label: "Bill Lines" },
              { id: "match", label: "3-Way Match" },
              { id: "schedule", label: "Payment" },
              { id: "cheques", label: "Cheques", badge: linkedChequeCount },
              { id: "activity", label: "Activity" },
            ]}
            active={tab}
            onChange={(id) => setTab(id as typeof tab)}
          />

          <div className="mt-3 min-h-0 flex-1">
            {tab === "lines" && (
              <table className="w-full text-xs border border-input rounded-lg overflow-hidden">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-medium">Description</th>
                    <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                    <th className="px-2 py-1.5 text-right font-medium">Unit</th>
                    <th className="px-2 py-1.5 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 py-1.5">{l.description}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{l.qty}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{formatBdt(l.unitPrice)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums font-medium">{formatBdt(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "match" && match && (
              <div className="rounded-lg border border-input p-3 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  {bill.matchStatus === "matched" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className="font-medium capitalize">{bill.matchStatus} — 3-way match</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded bg-muted/40 p-2">
                    <span className="text-muted-foreground">PO</span>
                    <p className="font-mono font-medium">{match.poNumber}</p>
                    <p className="tabular-nums">{formatBdt(match.poAmount)}</p>
                  </div>
                  <div className="rounded bg-muted/40 p-2">
                    <span className="text-muted-foreground">GRN</span>
                    <p className="font-mono font-medium">{match.grnNumber}</p>
                    <p className="tabular-nums">{formatBdt(match.grnAmount)}</p>
                  </div>
                  <div className="rounded bg-muted/40 p-2">
                    <span className="text-muted-foreground">Bill</span>
                    <p className="font-mono font-medium">{bill.number}</p>
                    <p className="tabular-nums">{formatBdt(match.billAmount)}</p>
                  </div>
                  <div className="rounded bg-muted/40 p-2">
                    <span className="text-muted-foreground">Variance</span>
                    <p className={cn("font-medium tabular-nums", match.variance !== 0 && "text-amber-600 dark:text-amber-400")}>
                      {formatBdt(match.variance)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === "schedule" && (
              <div className="space-y-2">
                {schedule.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-input p-3 text-xs">
                    <div>
                      <p className="font-medium tabular-nums">{formatBdt(s.amount)}</p>
                      <p className="text-muted-foreground">Due {s.dueDate}</p>
                    </div>
                    <Badge
                      variant={s.status === "paid" ? "success" : s.status === "overdue" ? "muted" : "secondary"}
                      className="text-[10px] capitalize"
                    >
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {tab === "cheques" && (
              <DocumentChequesTab
                linkedDoc={bill.number}
                direction="issued"
                cheques={cheques}
                onAddCheque={onAddCheque}
              />
            )}

            {tab === "activity" && (
              <div className="space-y-2">
                {(activity.length > 0
                  ? activity
                  : [{ timestamp: bill.billDate, user: "System", action: "CREATE", detail: `Bill posted — ${formatBdt(bill.total)}` }]
                ).map((a, i) => (
                  <div key={i} className="flex gap-2 text-xs border-b border-border pb-2 last:border-0">
                    <span className="font-mono text-[10px] text-muted-foreground w-28 shrink-0">{a.timestamp}</span>
                    <div>
                      <span className="font-mono text-[10px] bg-muted px-1 rounded">{a.action}</span>
                      <span className="mx-1 text-muted-foreground">·</span>
                      <span>{a.user}</span>
                      <p className="text-muted-foreground mt-0.5">{a.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {bill.residual > 0 && (
            <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-border pt-3">
              <Button size="sm" onClick={() => { toast.success("Payment recorded (prototype)"); onClose(); }}>
                Record Payment
              </Button>
              <Button variant="outline" size="sm" onClick={() => setTab("cheques")}>
                Issue PDC
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Bill approved (prototype)")}>
                Approve
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>

      <ChequeFormSheet
        open={chequeFormOpen}
        onClose={onChequeFormClose}
        onSave={onChequeSave}
        initialDirection="issued"
        initialLinkedDocId={bill.id}
      />
    </>
  );
}

export function ApBills() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ApBill>>(null);
  const [bills] = useState(() => [...apBillsSeed]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [chequeFormOpen, setChequeFormOpen] = useState(false);
  const cheques = useFinanceChequeStore((s) => s.cheques);
  const addCheques = useFinanceChequeStore((s) => s.addCheques);

  const viewId = params.get("view");
  const viewBill = useMemo(
    () => (viewId ? (bills.find((b) => b.id === viewId) ?? null) : null),
    [viewId, bills]
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
    (bill: ApBill) => pushParams((p) => { p.delete("create"); p.set("view", bill.id); }),
    [pushParams]
  );
  const closeView = useCallback(
    () => pushParams((p) => p.delete("view")),
    [pushParams]
  );
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.set("create", "1"); }),
    [pushParams]
  );

  const handleAddCheque = useCallback(() => setChequeFormOpen(true), []);
  const handleChequeSave = useCallback(
    (created: ChequeInstrument[]) => {
      addCheques(created);
      setChequeFormOpen(false);
    },
    [addCheques]
  );

  const kpis = useMemo(() => computeApKpis(bills), [bills]);
  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: bills.length };
    bills.forEach((b) => { c[b.status] = (c[b.status] ?? 0) + 1; });
    return c;
  }, [bills]);

  const rowData = useMemo(
    () =>
      bills.filter((b) => {
        if (statusFilter !== "all" && b.status !== statusFilter) return false;
        if (
          search &&
          !b.number.toLowerCase().includes(search.toLowerCase()) &&
          !b.vendor.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [bills, statusFilter, search]
  );

  const RowMenu = useCallback(
    ({ data }: { data: ApBill }) => (
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
    (p: ICellRendererParams<ApBill>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const columnDefs = useMemo<ColDef<ApBill>[]>(
    () => [
      { field: "number", headerName: "Bill #", pinned: "left", width: 140, cellClass: "font-mono text-xs" },
      { field: "vendor", headerName: "Vendor", flex: 1, minWidth: 160 },
      { field: "billDate", headerName: "Bill Date", width: 100 },
      { field: "dueDate", headerName: "Due", width: 100 },
      {
        field: "total",
        headerName: "Total",
        width: 120,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      {
        field: "residual",
        headerName: "Open",
        width: 120,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      { field: "matchStatus", headerName: "Match", width: 100, cellRenderer: MatchPill },
      { field: "status", headerName: "Status", width: 100, cellRenderer: DocStatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ApBill }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <FinanceKpiRow
        kpis={[
          { label: "Total AP Outstanding", value: formatBdt(kpis.totalAp), sub: `${bills.filter((b) => b.status !== "paid").length} open bills` },
          { label: "Overdue", value: formatBdt(kpis.overdueAmt), sub: `${kpis.overdueCount} bills`, alert: kpis.overdueCount > 0 },
          { label: "Due This Week", value: String(kpis.dueThisWeekCount), sub: "Bills due by Jun 26" },
          { label: "Unmatched", value: String(kpis.unmatchedCount), sub: "Missing PO/GRN match", alert: kpis.unmatchedCount > 0 },
        ]}
      />

      <FinanceStatusTabs tabs={STATUS_TABS} active={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search bills…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-48 text-xs"
        />
        <Button size="sm" className="ml-auto hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> New Bill
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
            {rowData.length !== bills.length && ` (filtered from ${bills.length})`}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <ApMobileCards bills={rowData} onView={openView} />
      </div>

      {/* Mobile FAB */}
      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="New bill"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ApDetailSheet
        bill={viewBill}
        open={!!viewId}
        onClose={closeView}
        cheques={cheques}
        onAddCheque={handleAddCheque}
        chequeFormOpen={chequeFormOpen}
        onChequeFormClose={() => setChequeFormOpen(false)}
        onChequeSave={handleChequeSave}
      />
    </div>
  );
}
