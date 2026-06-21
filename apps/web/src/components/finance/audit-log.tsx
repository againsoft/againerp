"use client";

import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { auditLogSeed, type AuditLogEntry } from "@/lib/mock-data/finance";
import { useIsDark } from "@/lib/use-is-dark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FinancePeriodBanner } from "./finance-period-banner";

const PAGE_SIZE = 25;

const ACTION_VARIANT: Record<string, "success" | "warning" | "muted" | "secondary"> = {
  POST: "success",
  CREATE: "secondary",
  APPROVE: "success",
  REJECT: "muted",
  RECONCILE: "secondary",
  REVERSE: "warning",
  DELETE: "muted",
};

function ActionPill({ value }: { value: string }) {
  return (
    <div className="flex items-center h-full">
      <Badge variant={ACTION_VARIANT[value] ?? "secondary"} className="font-mono text-[10px]">
        {value}
      </Badge>
    </div>
  );
}

function AuditMobileCards({ rows }: { rows: AuditLogEntry[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
        No audit entries match the filter.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.id} className="rounded-lg border border-input bg-card p-3 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted-foreground">{row.entityId}</p>
              <p className="mt-0.5 font-medium">{row.entity}</p>
            </div>
            <Badge variant={ACTION_VARIANT[row.action] ?? "secondary"} className="shrink-0 font-mono text-[10px]">
              {row.action}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{row.summary}</p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{row.user}</span>
            <span>{row.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AuditLog() {
  const isDark = useIsDark();
  const gridRef = useRef<AgGridReact<AuditLogEntry>>(null);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [page, setPage] = useState(0);

  const rowData = useMemo(() => {
    return auditLogSeed.filter((e) => {
      if (entityFilter !== "all" && e.entity !== entityFilter) return false;
      if (
        search &&
        !e.summary.toLowerCase().includes(search.toLowerCase()) &&
        !e.entityId.toLowerCase().includes(search.toLowerCase()) &&
        !e.user.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, entityFilter]);

  const pageStart = page * PAGE_SIZE + 1;
  const pageEnd = Math.min((page + 1) * PAGE_SIZE, rowData.length);

  const columnDefs = useMemo<ColDef<AuditLogEntry>[]>(
    () => [
      { field: "timestamp", headerName: "Timestamp", width: 140, cellClass: "font-mono text-xs" },
      { field: "user", headerName: "User", width: 140 },
      {
        field: "action",
        headerName: "Action",
        width: 100,
        cellRenderer: (p: ICellRendererParams<AuditLogEntry>) =>
          p.value ? <ActionPill value={p.value} /> : null,
      },
      { field: "entity", headerName: "Entity", width: 140 },
      { field: "entityId", headerName: "Entity ID", width: 160, cellClass: "font-mono text-xs" },
      { field: "summary", headerName: "Summary", flex: 1, minWidth: 200, cellClass: "text-muted-foreground" },
    ],
    []
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <FinancePeriodBanner />

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search user, entity ID, summary…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-56 text-xs"
        />
        <Select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="h-8 w-44 text-xs"
        >
          <option value="all">All entities</option>
          <option value="Journal Entry">Journal Entry</option>
          <option value="AR Invoice">AR Invoice</option>
          <option value="AP Bill">AP Bill</option>
          <option value="Bank Statement">Bank Statement</option>
          <option value="Expense Claim">Expense Claim</option>
          <option value="Receipt">Receipt</option>
          <option value="Payment">Payment</option>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          {rowData.length} {rowData.length === 1 ? "entry" : "entries"}
        </span>
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
            {rowData.length !== auditLogSeed.length &&
              ` (filtered from ${auditLogSeed.length})`}
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <AuditMobileCards rows={rowData} />
      </div>
    </div>
  );
}
