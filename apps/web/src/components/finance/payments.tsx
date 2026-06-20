"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Banknote, Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  bankAccountsSeed,
  batchPayableBillsSeed,
  findApBillByNumber,
  formatBdt,
  paymentsSeed,
  type ApBill,
  type ChequeInstrument,
  type Payment,
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
import { FinancePeriodBanner } from "./finance-period-banner";
import { ChequeFormSheet } from "./cheque-form-sheet";
import { DocumentChequesTab, DrawerTabs } from "./document-cheques-tab";
import { useFinanceChequeStore } from "@/lib/store/finance-cheque-store";

const PAGE_SIZE = 25;

function paymentVariant(v: Payment["status"]): "success" | "secondary" | "warning" {
  if (v === "reconciled") return "success";
  if (v === "posted") return "secondary";
  return "warning";
}

function PaymentStatusPill({ value }: { value: Payment["status"] }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={paymentVariant(value)} className="text-[10px] capitalize">
        {value}
      </Badge>
    </div>
  );
}

function BillCheckboxCell({
  data,
  selectedIds,
  toggle,
}: ICellRendererParams<ApBill> & { selectedIds: Set<string>; toggle: (id: string) => void }) {
  if (!data) return null;
  return (
    <div className="flex items-center h-full">
      <input
        type="checkbox"
        checked={selectedIds.has(data.id)}
        onChange={() => toggle(data.id)}
        className="h-3.5 w-3.5 rounded border-input"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function PaymentMobileCards({
  payments,
  onView,
}: {
  payments: Payment[];
  onView: (p: Payment) => void;
}) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No payments found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {payments.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onView(p)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{p.number}</p>
              <p className="mt-0.5 font-medium truncate">{p.vendor}</p>
            </div>
            <Badge variant={paymentVariant(p.status)} className="shrink-0 text-[10px] capitalize">
              {p.status}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>{p.bankAccount.split(" ")[0]} · {p.date}</span>
            <span className="font-medium text-foreground tabular-nums">{formatBdt(p.amount)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function PaymentDetailSheet({
  payment,
  open,
  onClose,
  cheques,
  onAddCheque,
  chequeFormOpen,
  onChequeFormClose,
  onChequeSave,
  chequeFormLinkedDocId,
}: {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
  cheques: ChequeInstrument[];
  onAddCheque: () => void;
  chequeFormOpen: boolean;
  onChequeFormClose: () => void;
  onChequeSave: (created: ChequeInstrument[]) => void;
  chequeFormLinkedDocId: string;
}) {
  const [tab, setTab] = useState<"details" | "cheques">("details");

  if (!payment) return null;

  const linkedDoc = payment.allocatedTo.split(",")[0].trim();
  const linkedChequeCount = cheques.filter(
    (c) => payment.allocatedTo.includes(c.linkedDoc) && c.direction === "issued"
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
                  <p className="font-mono text-xs text-muted-foreground">{payment.number}</p>
                  <h2 className="mt-1 font-semibold">{payment.vendor}</h2>
                  <Badge variant={paymentVariant(payment.status)} className="mt-2 text-[10px] capitalize">
                    {payment.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 text-xs">
                  Close
                </Button>
              </div>
            </div>

            <DrawerTabs
              tabs={[
                { id: "details", label: "Details" },
                { id: "cheques", label: "Cheques", badge: linkedChequeCount },
              ]}
              active={tab}
              onChange={(id) => setTab(id as "details" | "cheques")}
            />

            <div className="mt-3 min-h-0 flex-1">
              {tab === "details" && (
                <>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold tabular-nums">{formatBdt(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Date</span>
                      <span>{payment.date}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Bank Account</span>
                      <span>{payment.bankAccount}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Allocated To</span>
                      <span className="font-mono text-right max-w-[60%] break-all">{payment.allocatedTo}</span>
                    </div>
                  </div>

                  {payment.status === "draft" && (
                    <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-border pt-3">
                      <Button
                        size="sm"
                        onClick={() => { toast.success("Payment posted (prototype)"); onClose(); }}
                      >
                        Post
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setTab("cheques")}>
                        Issue Cheque
                      </Button>
                    </div>
                  )}
                  {payment.status !== "draft" && (
                    <div className="mt-4 shrink-0 border-t border-border pt-3">
                      <Button size="sm" variant="outline" onClick={() => setTab("cheques")}>
                        View Cheques
                      </Button>
                    </div>
                  )}
                </>
              )}

              {tab === "cheques" && (
                <DocumentChequesTab
                  linkedDoc={linkedDoc}
                  direction="issued"
                  cheques={cheques}
                  onAddCheque={onAddCheque}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ChequeFormSheet
        open={chequeFormOpen}
        onClose={onChequeFormClose}
        onSave={onChequeSave}
        initialDirection="issued"
        initialLinkedDocId={chequeFormLinkedDocId}
      />
    </>
  );
}

export function Payments() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<Payment>>(null);
  const batchGridRef = useRef<AgGridReact<ApBill>>(null);

  const [payments, setPayments] = useState<Payment[]>(() => [...paymentsSeed]);
  const [payableBills] = useState<ApBill[]>(() => [...batchPayableBillsSeed]);
  const [selectedBillIds, setSelectedBillIds] = useState<Set<string>>(new Set());
  const [batchBank, setBatchBank] = useState(bankAccountsSeed[0].id);
  const [batchDate, setBatchDate] = useState("2026-06-19");
  const [batchPanelOpen, setBatchPanelOpen] = useState(true);
  const [page, setPage] = useState(0);
  const cheques = useFinanceChequeStore((s) => s.cheques);
  const addCheques = useFinanceChequeStore((s) => s.addCheques);
  const [chequeFormOpen, setChequeFormOpen] = useState(false);
  const [chequeFormLinkedDocId, setChequeFormLinkedDocId] = useState("");

  const viewId = params.get("view");
  const viewPayment = useMemo(
    () => (viewId ? (payments.find((p) => p.id === viewId) ?? null) : null),
    [viewId, payments]
  );

  const linkedDocIdForPayment = useMemo(() => {
    if (!viewPayment) return "";
    const billNum = viewPayment.allocatedTo.split(",")[0].trim();
    const bill = findApBillByNumber(billNum);
    return bill?.id ?? "";
  }, [viewPayment]);

  const handleAddChequeFromPayment = useCallback(() => {
    setChequeFormLinkedDocId(linkedDocIdForPayment);
    setChequeFormOpen(true);
  }, [linkedDocIdForPayment]);

  const handleChequeSave = useCallback((created: ChequeInstrument[]) => {
    addCheques(created);
    setChequeFormOpen(false);
  }, [addCheques]);

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`?${p.toString()}`);
    },
    [router, params]
  );

  const openView = useCallback(
    (p: Payment) => pushParams((sp) => { sp.delete("create"); sp.set("view", p.id); }),
    [pushParams]
  );
  const closeView = useCallback(() => pushParams((p) => p.delete("view")), [pushParams]);
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.set("create", "1"); }),
    [pushParams]
  );

  const toggleBill = useCallback((id: string) => {
    setSelectedBillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectedBills = useMemo(
    () => payableBills.filter((b) => selectedBillIds.has(b.id)),
    [payableBills, selectedBillIds]
  );
  const batchTotal = selectedBills.reduce((s, b) => s + b.residual, 0);
  const bankLabel = bankAccountsSeed.find((b) => b.id === batchBank);

  const createBatchPayment = () => {
    if (selectedBills.length === 0) {
      toast.error("Select at least one bill");
      return;
    }
    const nextNum = `PAY/2026/${String(payments.length + 96).padStart(4, "0")}`;
    const newPayment: Payment = {
      id: `py-batch-${Date.now()}`,
      number: nextNum,
      vendor: `${selectedBills.length} vendors (batch)`,
      date: batchDate,
      amount: batchTotal,
      bankAccount: `${bankLabel?.bank} ${bankLabel?.accountNo}`,
      allocatedTo: selectedBills.map((b) => b.number).join(", "),
      status: "posted",
    };
    setPayments((prev) => [newPayment, ...prev]);
    setSelectedBillIds(new Set());
    toast.success(`Batch payment ${nextNum} — ${formatBdt(batchTotal)}`);
  };

  const RowMenu = useCallback(
    ({ data }: { data: Payment }) => (
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
    (p: ICellRendererParams<Payment>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const paymentColumnDefs = useMemo<ColDef<Payment>[]>(
    () => [
      { field: "number", headerName: "Payment #", pinned: "left", width: 140, cellClass: "font-mono text-xs" },
      { field: "vendor", headerName: "Vendor", flex: 1, minWidth: 140 },
      { field: "date", headerName: "Date", width: 100 },
      {
        field: "amount",
        headerName: "Amount",
        width: 120,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      { field: "bankAccount", headerName: "Bank", width: 160 },
      { field: "allocatedTo", headerName: "Allocated To", width: 140, cellClass: "font-mono text-xs" },
      { field: "status", headerName: "Status", width: 110, cellRenderer: PaymentStatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const batchColumnDefs = useMemo<ColDef<ApBill>[]>(
    () => [
      {
        headerName: "",
        width: 44,
        pinned: "left",
        sortable: false,
        cellRenderer: BillCheckboxCell,
        cellRendererParams: { selectedIds: selectedBillIds, toggle: toggleBill },
      },
      { field: "number", headerName: "Bill #", width: 130, cellClass: "font-mono text-xs" },
      { field: "vendor", headerName: "Vendor", flex: 1, minWidth: 120 },
      { field: "dueDate", headerName: "Due", width: 90 },
      {
        field: "residual",
        headerName: "Open",
        width: 100,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
    ],
    [selectedBillIds, toggleBill]
  );

  const onRowClicked = useCallback(
    (e: { data?: Payment }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, payments.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => setBatchPanelOpen((v) => !v)}>
          <Banknote className="h-3.5 w-3.5 mr-1" />
          {batchPanelOpen ? "Hide" : "Show"} Batch Panel
        </Button>
        <Button size="sm" className="hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Record Payment
        </Button>
      </div>

      {/* Batch payment panel */}
      {batchPanelOpen && (
        <div className="shrink-0 rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">Batch Payment</h3>
              <p className="text-[11px] text-muted-foreground">Select open AP bills → one outbound payment</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {selectedBills.length} selected · {formatBdt(batchTotal)}
            </Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div
                className={cn(
                  "ag-theme-quartz control-border rounded-md border border-input",
                  isDark && "ag-theme-quartz-dark"
                )}
                style={{ height: 200 }}
              >
                <AgGridReact
                  ref={batchGridRef}
                  theme="legacy"
                  rowData={payableBills}
                  columnDefs={batchColumnDefs}
                  suppressRowClickSelection
                  suppressCellFocus
                  defaultColDef={{ sortable: true, resizable: true, suppressHeaderMenuButton: true }}
                />
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-muted-foreground">Payment date</label>
                <Input type="date" value={batchDate} onChange={(e) => setBatchDate(e.target.value)} className="mt-1 h-8" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Bank account</label>
                <Select value={batchBank} onChange={(e) => setBatchBank(e.target.value)} className="mt-1 h-8 w-full">
                  {bankAccountsSeed.map((b) => (
                    <option key={b.id} value={b.id}>{b.bank} {b.accountNo}</option>
                  ))}
                </Select>
              </div>
              <div className="rounded-lg border border-input bg-card p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bills</span>
                  <span>{selectedBills.length}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatBdt(batchTotal)}</span>
                </div>
              </div>
              <Button size="sm" className="w-full" disabled={selectedBills.length === 0} onClick={createBatchPayment}>
                Create Batch Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment history — Desktop grid */}
      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        <h3 className="shrink-0 mb-2 text-sm font-medium">Payment History</h3>
        <div
          className={cn(
            "ag-theme-quartz control-border h-0 min-h-0 flex-1 overflow-hidden rounded-md border border-input bg-card",
            isDark && "ag-theme-quartz-dark"
          )}
        >
          <AgGridReact
            ref={gridRef}
            theme="legacy"
            rowData={payments}
            columnDefs={paymentColumnDefs}
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
        {payments.length > 0 && (
          <p className="shrink-0 pt-1 text-xs text-muted-foreground">
            Showing {pageStart}–{pageEnd} of {payments.length}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <h3 className="mb-2 text-sm font-medium">Payment History</h3>
        <PaymentMobileCards payments={payments} onView={openView} />
      </div>

      {/* Mobile FAB */}
      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Record payment"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <PaymentDetailSheet
        payment={viewPayment}
        open={!!viewId}
        onClose={closeView}
        cheques={cheques}
        onAddCheque={handleAddChequeFromPayment}
        chequeFormOpen={chequeFormOpen}
        onChequeFormClose={() => setChequeFormOpen(false)}
        onChequeSave={handleChequeSave}
        chequeFormLinkedDocId={chequeFormLinkedDocId}
      />
    </div>
  );
}
