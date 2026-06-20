"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { CheckCircle2, Circle, Clock, Eye, FileText, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  EXPENSE_STATUS_LABELS,
  expenseApprovalFlowById,
  expenseLinesById,
  expensesSeed,
  formatBdt,
  type ExpenseClaim,
  type ExpenseStatus,
} from "@/lib/mock-data/finance";
import { useIsDark } from "@/lib/use-is-dark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Select } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FinancePeriodBanner } from "./finance-period-banner";

const PAGE_SIZE = 25;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "submitted", label: "Submitted" },
  { id: "approved", label: "Approved" },
  { id: "reimbursed", label: "Reimbursed" },
];

function expenseVariant(v: ExpenseStatus): "success" | "warning" | "muted" | "secondary" {
  const map: Record<ExpenseStatus, "success" | "warning" | "muted" | "secondary"> = {
    draft: "muted",
    submitted: "warning",
    approved: "secondary",
    rejected: "muted",
    reimbursed: "success",
  };
  return map[v];
}

function ExpenseStatusPill({ value }: { value: ExpenseStatus }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={expenseVariant(value)} className="text-[10px]">
        {EXPENSE_STATUS_LABELS[value]}
      </Badge>
    </div>
  );
}

function ExpenseMobileCards({
  claims,
  onView,
}: {
  claims: ExpenseClaim[];
  onView: (c: ExpenseClaim) => void;
}) {
  if (claims.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No claims match the current filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {claims.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onView(c)}
          className="rounded-lg border border-input bg-card p-3 text-left text-xs hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{c.number}</p>
              <p className="mt-0.5 font-medium truncate">{c.employee}</p>
            </div>
            <Badge variant={expenseVariant(c.status)} className="shrink-0 text-[10px]">
              {EXPENSE_STATUS_LABELS[c.status]}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between text-muted-foreground">
            <span>{c.category} · {c.date}</span>
            <span className="font-medium text-foreground tabular-nums">{formatBdt(c.amount)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ExpenseDetailSheet({
  claim,
  open,
  onClose,
  onUpdate,
}: {
  claim: ExpenseClaim | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, status: ExpenseStatus) => void;
}) {
  const [tab, setTab] = useState<"lines" | "approval">("lines");
  if (!claim) return null;

  const lines = expenseLinesById[claim.id] ?? [];
  const flow = expenseApprovalFlowById[claim.id] ?? [
    { step: "Submitted", user: claim.employee, timestamp: claim.date, status: "completed" as const },
    { step: "Manager approval", user: claim.approver, timestamp: "—", status: "pending" as const },
  ];

  const StepIcon = ({ status }: { status: "completed" | "current" | "pending" }) => {
    if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    if (status === "current") return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />;
    return <Circle className="h-4 w-4 text-muted-foreground shrink-0" />;
  };

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
                <p className="font-mono text-xs text-muted-foreground">{claim.number}</p>
                <h2 className="mt-1 font-semibold">{claim.employee}</h2>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <Badge variant={expenseVariant(claim.status)} className="text-[10px]">
                    {EXPENSE_STATUS_LABELS[claim.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{claim.category}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 text-xs">
                Close
              </Button>
            </div>
          </div>

          <div className="mt-3 shrink-0 flex gap-1 border-b border-border">
            {(["lines", "approval"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium capitalize border-b-2 -mb-px transition-colors",
                  tab === t
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "lines" ? "Lines & Receipts" : "Approval"}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-0 flex-1">
            {tab === "lines" && (
              <div className="space-y-2">
                {lines.map((line, i) => (
                  <div key={i} className="rounded-lg border border-input p-3 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">{line.description}</span>
                      <span className="tabular-nums shrink-0">{formatBdt(line.amount)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="font-mono text-[10px]">{line.receiptName}</span>
                      <span>·</span>
                      <span>{line.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 h-7 text-[10px]" onClick={() => toast.info("View receipt (prototype)")}>
                      View receipt
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border font-semibold text-xs">
                  <span>Total</span>
                  <span className="tabular-nums">{formatBdt(claim.amount)}</span>
                </div>
              </div>
            )}

            {tab === "approval" && (
              <div className="space-y-3">
                {flow.map((step, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <StepIcon status={step.status} />
                    <div>
                      <p className="font-medium">{step.step}</p>
                      <p className="text-muted-foreground">{step.user} · {step.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-border pt-3">
            {claim.status === "submitted" && (
              <>
                <Button size="sm" onClick={() => { onUpdate(claim.id, "approved"); toast.success("Claim approved"); onClose(); }}>
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={() => { onUpdate(claim.id, "rejected"); toast.error("Claim rejected"); onClose(); }}>
                  Reject
                </Button>
              </>
            )}
            {claim.status === "approved" && (
              <Button size="sm" onClick={() => { onUpdate(claim.id, "reimbursed"); toast.success("Claim posted & reimbursed"); onClose(); }}>
                Post & Reimburse
              </Button>
            )}
            {claim.status === "draft" && (
              <Button size="sm" variant="outline" onClick={() => { onUpdate(claim.id, "submitted"); toast.success("Claim submitted"); onClose(); }}>
                Submit for Approval
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ExpenseClaims() {
  const router = useRouter();
  const params = useSearchParams();
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<ExpenseClaim>>(null);
  const [claims, setClaims] = useState<ExpenseClaim[]>(() => [...expensesSeed]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);

  const viewId = params.get("view");
  const viewClaim = useMemo(
    () => (viewId ? (claims.find((c) => c.id === viewId) ?? null) : null),
    [viewId, claims]
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
    (claim: ExpenseClaim) => pushParams((p) => { p.delete("create"); p.set("view", claim.id); }),
    [pushParams]
  );
  const closeView = useCallback(() => pushParams((p) => p.delete("view")), [pushParams]);
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.set("create", "1"); }),
    [pushParams]
  );

  const rowData = useMemo(
    () => (statusFilter === "all" ? claims : claims.filter((e) => e.status === statusFilter)),
    [claims, statusFilter]
  );

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: claims.length };
    claims.forEach((e) => { c[e.status] = (c[e.status] ?? 0) + 1; });
    return c;
  }, [claims]);

  const handleUpdate = (id: string, status: ExpenseStatus) => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const RowMenu = useCallback(
    ({ data }: { data: ExpenseClaim }) => (
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
    (p: ICellRendererParams<ExpenseClaim>) => {
      if (!p.data) return null;
      return (
        <div className="flex items-center justify-center h-full">
          <RowMenu data={p.data} />
        </div>
      );
    },
    [RowMenu]
  );

  const columnDefs = useMemo<ColDef<ExpenseClaim>[]>(
    () => [
      { field: "number", headerName: "Claim #", pinned: "left", width: 140, cellClass: "font-mono text-xs" },
      { field: "employee", headerName: "Employee", flex: 1, minWidth: 140 },
      { field: "date", headerName: "Date", width: 100 },
      { field: "category", headerName: "Category", width: 120 },
      {
        field: "amount",
        headerName: "Amount",
        width: 110,
        valueFormatter: (p) => formatBdt(p.value ?? 0),
        cellClass: "text-right tabular-nums",
      },
      { field: "approver", headerName: "Approver", width: 140 },
      { field: "status", headerName: "Status", width: 110, cellRenderer: ExpenseStatusPill },
      { headerName: "", width: 48, maxWidth: 48, sortable: false, resizable: false, cellRenderer: ActionCell },
    ],
    [ActionCell]
  );

  const onRowClicked = useCallback(
    (e: { data?: ExpenseClaim }) => { if (e.data) openView(e.data); },
    [openView]
  );

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-36 text-xs">
          {STATUS_TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} {statusCounts[t.id] !== undefined ? `(${statusCounts[t.id]})` : ""}
            </option>
          ))}
        </Select>
        <Button size="sm" className="ml-auto hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> New Claim
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
            {rowData.length !== claims.length && ` (filtered from ${claims.length})`}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <ExpenseMobileCards claims={rowData} onView={openView} />
      </div>

      {/* Mobile FAB */}
      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="New expense claim"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ExpenseDetailSheet
        claim={viewClaim}
        open={!!viewId}
        onClose={closeView}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
