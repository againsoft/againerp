"use client";

import type { SmwCommission } from "@/lib/mock-data/smw-commissions";
import {
  COMMISSION_STATUS_LABELS,
  COMMISSION_TYPE_LABELS,
  commissionStatusToEnterprise,
  formatCommissionCurrency,
} from "@/lib/mock-data/smw-commissions";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { CheckCircle2, Eye, MoreHorizontal, Pencil, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  data: SmwCommission[];
  onView: (c: SmwCommission) => void;
  onEdit: (c: SmwCommission) => void;
  onStatusChange?: (id: string, status: SmwCommission["status"]) => void;
};

export function CommissionTable({ data, onView, onEdit, onStatusChange }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "commissionAmount", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwCommission>[]>(
    () => [
      {
        id: "dealName",
        header: "Deal / entry",
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="text-sm font-medium">{row.original.dealName}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{row.original.commissionNumber}</p>
          </div>
        ),
      },
      { id: "repName", accessorKey: "repName", header: "Rep" },
      {
        id: "type",
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {COMMISSION_TYPE_LABELS[row.original.type]}
          </Badge>
        ),
      },
      {
        id: "dealValue",
        header: "Deal value",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs">
            {row.original.dealValue > 0 ? formatCommissionCurrency(row.original.dealValue) : "—"}
          </span>
        ),
      },
      {
        id: "commissionRate",
        header: "Rate",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs">
            {row.original.commissionRate > 0 ? `${row.original.commissionRate}%` : "—"}
          </span>
        ),
      },
      {
        id: "commissionAmount",
        accessorKey: "commissionAmount",
        header: "Commission",
        cell: ({ row }) => (
          <span
            className={cn(
              "tabular-nums text-xs font-medium",
              row.original.commissionAmount < 0 && "text-red-600",
              row.original.commissionAmount > 0 && row.original.status === "paid" && "text-emerald-600",
            )}
          >
            {formatCommissionCurrency(row.original.commissionAmount)}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={commissionStatusToEnterprise(row.original.status)}
            label={COMMISSION_STATUS_LABELS[row.original.status]}
            size="sm"
          />
        ),
      },
      {
        id: "periodLabel",
        accessorKey: "periodLabel",
        header: "Period",
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.periodLabel}</span>,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <Eye className="mr-2 h-3.5 w-3.5" aria-hidden /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-3.5 w-3.5" aria-hidden /> Edit
              </DropdownMenuItem>
              {row.original.status === "pending" && onStatusChange && (
                <DropdownMenuItem onClick={() => onStatusChange(row.original.id, "approved")}>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" aria-hidden /> Approve
                </DropdownMenuItem>
              )}
              {row.original.status === "approved" && onStatusChange && (
                <DropdownMenuItem onClick={() => onStatusChange(row.original.id, "paid")}>
                  <Wallet className="mr-2 h-3.5 w-3.5" aria-hidden /> Mark paid
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onStatusChange, onView],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="overflow-auto rounded-lg border border-input">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="h-9 text-xs">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                No commission entries match your filters.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => onView(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2 text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
