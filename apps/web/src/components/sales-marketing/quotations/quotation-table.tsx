"use client";

import Link from "next/link";
import type { SmwQuotation } from "@/lib/mock-data/smw-quotations";
import {
  QUOTATION_STATUS_LABELS,
  computeQuotationTotals,
  formatQuoCurrency,
  quotationStatusToEnterprise,
} from "@/lib/mock-data/smw-quotations";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
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
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { Eye, FileDown, MoreHorizontal, Pencil, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  data: SmwQuotation[];
  onView: (q: SmwQuotation) => void;
};

export function QuotationTable({ data, onView }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "validUntil", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwQuotation>[]>(
    () => [
      {
        id: "quotationNumber",
        accessorKey: "quotationNumber",
        header: "Number",
        cell: ({ row }) => (
          <button
            type="button"
            className="font-mono text-xs font-medium text-primary hover:underline"
            onClick={(e) => { e.stopPropagation(); onView(row.original); }}
          >
            {row.original.quotationNumber}
          </button>
        ),
      },
      { id: "accountName", accessorKey: "accountName", header: "Account" },
      {
        id: "opportunity",
        header: "Opportunity",
        cell: ({ row }) =>
          row.original.opportunityId ? (
            <Link
              href={`/sales-marketing/opportunities/${row.original.opportunityId}`}
              className="text-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.original.opportunityTitle ?? "Linked"}
            </Link>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={quotationStatusToEnterprise(row.original.status)}
            label={QUOTATION_STATUS_LABELS[row.original.status]}
            size="sm"
          />
        ),
      },
      {
        id: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs font-medium">
            {formatQuoCurrency(computeQuotationTotals(row.original).grandTotal)}
          </span>
        ),
      },
      { id: "validUntil", accessorKey: "validUntil", header: "Valid until" },
      { id: "ownerName", accessorKey: "ownerName", header: "Owner" },
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
              <DropdownMenuItem asChild>
                <Link href={`/sales-marketing/quotations/create?edit=${row.original.id}`}>
                  <Pencil className="mr-2 h-3.5 w-3.5" aria-hidden /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Send quotation — prototype")}>
                <Send className="mr-2 h-3.5 w-3.5" aria-hidden /> Send
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("PDF export — prototype")}>
                <FileDown className="mr-2 h-3.5 w-3.5" aria-hidden /> PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onView],
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
                No quotations match your filters.
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
