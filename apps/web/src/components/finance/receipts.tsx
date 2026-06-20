"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  findArInvoiceByNumber,
  formatBdt,
  receiptsSeed,
  type ChequeInstrument,
  type Receipt,
} from "@/lib/mock-data/finance";
import { useIsDark } from "@/lib/use-is-dark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function receiptVariant(v: Receipt["status"]): "success" | "secondary" | "warning" {
  if (v === "reconciled") return "success";
  if (v === "posted") return "secondary";
  return "warning";
}

function ReceiptStatusPill({ value }: { value: Receipt["status"] }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={receiptVariant(value)} className="text-[10px] capitalize">
        {value}
      </Badge>
    </div>
  );
}

function ReceiptMobileCards({
  receipts,
  onView,
}: {
  receipts: Receipt[];
  onView: (r: Receipt) => void;
}) {
  if (receipts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No receipts found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {receipts.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onView(r)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{r.number}</p>
              <p className="mt-0.5 font-medium truncate">{r.customer}</p>
            </div>
            <Badge variant={receiptVariant(r.status)} className="shrink-0 text-[10px] capitalize">
              {r.status}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>{r.method} · {r.date}</span>
            <span className="font-medium text-foreground tabular-nums">{formatBdt(r.amount)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ReceiptDetailSheet({
  receipt,
  open,
  onClose,
  cheques,
  onAddCheque,
  chequeFormOpen,
  onChequeFormClose,
  onChequeSave,
  chequeFormLinkedDocId,
}: {
  receipt: Receipt | null;
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

  if (!receipt) return null;

  const linkedChequeCount = cheques.filter(
    (c) => c.linkedDoc === receipt.allocatedTo && c.direction === "received"
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
                  <p className="font-mono text-xs text-muted-foreground">{receipt.number}</p>
                  <h2 className="mt-1 font-semibold">{receipt.customer}</h2>
                  <Badge variant={receiptVariant(receipt.status)} className="mt-2 text-[10px] capitalize">
                    {receipt.status}
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
                      <span className="font-semibold tabular-nums">{formatBdt(receipt.amount)}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Date</span>
                      <span>{receipt.date}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Method</span>
                      <span>{receipt.method}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Allocated To</span>
                      <span className="font-mono">{receipt.allocatedTo}</span>
                    </div>
                  </div>

                  <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-border pt-3">
                    {receipt.status === "draft" && (
                      <Button size="sm" onClick={() => { toast.success("Receipt posted (prototype)"); onClose(); }}>
                        Post
                      </Button>
                    )}
                    {receipt.status === "posted" && (
                      <Button size="sm" variant="outline" onClick={() => toast.info("Reconciliation (prototype)")}>
                        Reconcile
                      </Button>
                    )}
                    {receipt.method === "Cheque" && (
                      <Button size="sm" variant="outline" onClick={() => setTab("cheques")}>
                        View Cheques
                      </Button>
                    )}
                  </div>
                </>
              )}

              {tab === "cheques" && (
                <DocumentChequesTab
                  linkedDoc={receipt.allocatedTo}
                  direction="received"
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
        initialDirection="received"
        initialLinkedDocId={chequeFormLinkedDocId}
      />
    </>
  );
}

export function Receipts() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<Receipt>>(null);
  const [page, setPage] = useState(0);
  const cheques = useFinanceChequeStore((s) => s.cheques);
  const addCheques = useFinanceChequeStore((s) => s.addCheques);
  const [chequeFormOpen, setChequeFormOpen] = useState(false);
  const [chequeFormLinkedDocId, setChequeFormLinkedDocId] = useState("");

  const viewId = params.get("view");
  const viewReceipt = useMemo(
    () => (viewId ? (receiptsSeed.find((r) => r.id === viewId) ?? null) : null),
    [viewId]
  );

  const linkedDocIdForReceipt = useMemo(() => {
    if (!viewReceipt) return "";
    const inv = findArInvoiceByNumber(viewReceipt.allocatedTo);
    return inv?.id ?? "";
  }, [viewReceipt]);

  const handleAddChequeFromReceipt = useCallback(() => {
    setChequeFormLinkedDocId(linkedDocIdForReceipt);
    setChequeFormOpen(true);
  }, [linkedDocIdForReceipt]);

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
    (r: Receipt) => pushParams((p) => { p.delete("create"); p.set("view", r.id); }),
    [pushParams]
  );
  const closeView = useCallback(() => pushParams((p) => p.delete("view")), [pushParams]);
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.set("create", "1"); }),
    [pushParams]
  );

  const RowMenu = useCallback(
    ({ data }: { data: Receipt }) => (
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
    (p: ICellRendererParams<Receipt>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const columnDefs = useMemo<ColDef<Receipt>[]>(
    () => [
      { field: "number", headerName: "Receipt #", pinned: "left", width: 140, cellClass: "font-mono text-xs" },
      { field: "customer", headerName: "Customer", flex: 1, minWidth: 160 },
      { field: "date", headerName: "Date", width: 100 },
      {
        field: "amount",
        headerName: "Amount",
        width: 120,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      { field: "method", headerName: "Method", width: 130 },
      { field: "allocatedTo", headerName: "Allocated To", width: 140, cellClass: "font-mono text-xs" },
      { field: "status", headerName: "Status", width: 110, cellRenderer: ReceiptStatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: Receipt }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, receiptsSeed.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <div className="flex shrink-0 justify-end">
        <Button size="sm" className="hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Record Receipt
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
            rowData={receiptsSeed}
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
        {receiptsSeed.length > 0 && (
          <p className="shrink-0 pt-1 text-xs text-muted-foreground">
            Showing {pageStart}–{pageEnd} of {receiptsSeed.length}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <ReceiptMobileCards receipts={receiptsSeed} onView={openView} />
      </div>

      {/* Mobile FAB */}
      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Record receipt"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ReceiptDetailSheet
        receipt={viewReceipt}
        open={!!viewId}
        onClose={closeView}
        cheques={cheques}
        onAddCheque={handleAddChequeFromReceipt}
        chequeFormOpen={chequeFormOpen}
        onChequeFormClose={() => setChequeFormOpen(false)}
        onChequeSave={handleChequeSave}
        chequeFormLinkedDocId={chequeFormLinkedDocId}
      />
    </div>
  );
}
