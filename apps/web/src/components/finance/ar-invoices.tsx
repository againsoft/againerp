"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  arActivityById,
  arInvoicesSeed,
  arPaymentHistoryById,
  computeArKpis,
  DOC_STATUS_LABELS,
  formatBdt,
  getArInvoiceLines,
  type ArInvoice,
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
  { id: "partial", label: "Partial" },
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

function ArMobileCards({
  invoices,
  onView,
}: {
  invoices: ArInvoice[];
  onView: (inv: ArInvoice) => void;
}) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No invoices match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {invoices.map((inv) => (
        <button
          key={inv.id}
          type="button"
          onClick={() => onView(inv)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{inv.number}</p>
              <p className="mt-0.5 font-medium truncate">{inv.customer}</p>
            </div>
            <Badge variant={docStatusVariant(inv.status)} className="shrink-0 text-[10px]">
              {DOC_STATUS_LABELS[inv.status]}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>Due {inv.dueDate}</span>
            <span className="font-medium text-foreground tabular-nums">{formatBdt(inv.total)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ArDetailSheet({
  invoice,
  open,
  onClose,
  cheques,
  onAddCheque,
  chequeFormOpen,
  onChequeFormClose,
  onChequeSave,
}: {
  invoice: ArInvoice | null;
  open: boolean;
  onClose: () => void;
  cheques: ChequeInstrument[];
  onAddCheque: () => void;
  chequeFormOpen: boolean;
  onChequeFormClose: () => void;
  onChequeSave: (created: ChequeInstrument[]) => void;
}) {
  const [tab, setTab] = useState<"lines" | "payments" | "activity" | "cheques">("lines");

  if (!invoice) return null;

  const lines = getArInvoiceLines(invoice);
  const payments = arPaymentHistoryById[invoice.id] ?? [];
  const activity = arActivityById[invoice.id] ?? [];
  const paid = invoice.total - invoice.residual;
  const linkedChequeCount = cheques.filter(
    (c) => c.linkedDoc === invoice.number && c.direction === "received"
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
                <p className="font-mono text-xs text-muted-foreground">{invoice.number}</p>
                <h2 className="mt-1 font-semibold">{invoice.customer}</h2>
                <Badge variant={docStatusVariant(invoice.status)} className="mt-2 text-[10px]">
                  {DOC_STATUS_LABELS[invoice.status]}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 text-xs">
                Close
              </Button>
            </div>
          </div>

          <div className="mt-4 shrink-0 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Total</span>
              <p className="font-medium tabular-nums">{formatBdt(invoice.total)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Paid</span>
              <p className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">{formatBdt(paid)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Outstanding</span>
              <p className="font-medium tabular-nums text-amber-600 dark:text-amber-400">{formatBdt(invoice.residual)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Due</span>
              <p className="font-medium">{invoice.dueDate}</p>
            </div>
          </div>

          <DrawerTabs
            tabs={[
              { id: "lines", label: "Invoice Lines" },
              { id: "payments", label: "Payments" },
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
                <tfoot className="bg-muted/30">
                  <tr>
                    <td colSpan={3} className="px-2 py-1.5 text-right font-medium">Total</td>
                    <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{formatBdt(invoice.total)}</td>
                  </tr>
                </tfoot>
              </table>
            )}

            {tab === "payments" &&
              (payments.length > 0 ? (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p.receiptNumber} className="rounded-lg border border-input p-3 text-xs">
                      <div className="flex justify-between">
                        <span className="font-mono">{p.receiptNumber}</span>
                        <span className="font-medium tabular-nums">{formatBdt(p.amount)}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-muted-foreground">
                        <span>{p.date}</span>
                        <span>{p.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                  No payments recorded yet.
                </p>
              ))}

            {tab === "cheques" && (
              <DocumentChequesTab
                linkedDoc={invoice.number}
                direction="received"
                cheques={cheques}
                onAddCheque={onAddCheque}
              />
            )}

            {tab === "activity" && (
              <div className="space-y-2">
                {(activity.length > 0
                  ? activity
                  : [{ timestamp: invoice.date, user: "System", action: "CREATE", detail: `Invoice created — ${formatBdt(invoice.total)}` }]
                ).map((a, i) => (
                  <div key={i} className="flex gap-2 text-xs border-b border-border pb-2 last:border-0">
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-28">{a.timestamp}</span>
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

          <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-border pt-3">
            {invoice.residual > 0 && (
              <Button
                size="sm"
                onClick={() => { toast.success("Receipt recorded (prototype)"); onClose(); }}
              >
                Record Receipt
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => toast.info("Reminder sent (prototype)")}>
              Send Reminder
            </Button>
            {invoice.residual > 0 && (
              <Button variant="outline" size="sm" onClick={() => setTab("cheques")}>
                Register PDC
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>

      <ChequeFormSheet
        open={chequeFormOpen}
        onClose={onChequeFormClose}
        onSave={onChequeSave}
        initialDirection="received"
        initialLinkedDocId={invoice.id}
      />
    </>
  );
}

export function ArInvoices() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ArInvoice>>(null);
  const [invoices] = useState<ArInvoice[]>(() => [...arInvoicesSeed]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [chequeFormOpen, setChequeFormOpen] = useState(false);
  const cheques = useFinanceChequeStore((s) => s.cheques);
  const addCheques = useFinanceChequeStore((s) => s.addCheques);

  const viewId = params.get("view");
  const viewInvoice = useMemo(
    () => (viewId ? (invoices.find((i) => i.id === viewId) ?? null) : null),
    [viewId, invoices]
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
    (inv: ArInvoice) => pushParams((p) => { p.delete("create"); p.set("view", inv.id); }),
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

  const kpis = useMemo(() => computeArKpis(invoices), [invoices]);
  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: invoices.length };
    invoices.forEach((i) => { c[i.status] = (c[i.status] ?? 0) + 1; });
    return c;
  }, [invoices]);

  const rowData = useMemo(
    () =>
      invoices.filter((inv) => {
        if (statusFilter !== "all" && inv.status !== statusFilter) return false;
        if (
          search &&
          !inv.number.toLowerCase().includes(search.toLowerCase()) &&
          !inv.customer.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [invoices, statusFilter, search]
  );

  const RowMenu = useCallback(
    ({ data }: { data: ArInvoice }) => (
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
    (p: ICellRendererParams<ArInvoice>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const columnDefs = useMemo<ColDef<ArInvoice>[]>(
    () => [
      { field: "number", headerName: "Invoice #", pinned: "left", width: 140, cellClass: "font-mono text-xs" },
      { field: "customer", headerName: "Customer", flex: 1, minWidth: 160 },
      { field: "date", headerName: "Date", width: 100 },
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
      { field: "status", headerName: "Status", width: 100, cellRenderer: DocStatusPill },
      { field: "aging", headerName: "Aging", width: 80 },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ArInvoice }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <FinanceKpiRow
        kpis={[
          { label: "Total AR Outstanding", value: formatBdt(kpis.totalAr), sub: `${invoices.filter((i) => i.status !== "paid").length} open invoices` },
          { label: "Overdue", value: formatBdt(kpis.overdueAmt), sub: `${kpis.overdueCount} invoices`, alert: kpis.overdueCount > 0 },
          { label: "Due This Week", value: String(kpis.dueThisWeekCount), sub: "Invoices due by Jun 26" },
          { label: "Avg Days Overdue", value: kpis.avgOverdue ? `${kpis.avgOverdue} days` : "—", sub: "Overdue invoices only" },
        ]}
      />

      <FinanceStatusTabs tabs={STATUS_TABS} active={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search invoices…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-48 text-xs"
        />
        <Button size="sm" className="ml-auto hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> New Invoice
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
            {rowData.length !== invoices.length && ` (filtered from ${invoices.length})`}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <ArMobileCards invoices={rowData} onView={openView} />
      </div>

      {/* Mobile FAB */}
      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="New invoice"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ArDetailSheet
        invoice={viewInvoice}
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
