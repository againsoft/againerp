"use client";

import Link from "next/link";
import type { SmwOpportunity } from "@/lib/mock-data/smw-opportunities";
import {
  STAGE_LABELS,
  formatOppCurrency,
  type OpportunityStage,
} from "@/lib/mock-data/smw-opportunities";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { EnterpriseRiskBadge } from "@/components/enterprise/badges/risk-badge";
import { Button } from "@/components/ui/button";
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
import { Eye, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  data: SmwOpportunity[];
  onView: (opp: SmwOpportunity) => void;
  onEdit: (opp: SmwOpportunity) => void;
};

function stageStatus(stage: OpportunityStage) {
  if (stage === "won") return "approved" as const;
  if (stage === "lost") return "rejected" as const;
  if (stage === "negotiation" || stage === "final_review") return "active" as const;
  return "pending" as const;
}

export function OpportunityTable({ data, onView, onEdit }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "expectedCloseDate", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });

  const columns = useMemo<ColumnDef<SmwOpportunity>[]>(
    () => [
      {
        id: "opportunityNumber",
        accessorKey: "opportunityNumber",
        header: "Deal #",
        cell: ({ row }) => (
          <Link
            href={`/sales-marketing/opportunities/${row.original.id}`}
            className="font-mono text-xs text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.opportunityNumber}
          </Link>
        ),
      },
      {
        id: "title",
        header: "Title / Account",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium">{row.original.title}</p>
            <p className="text-[11px] text-muted-foreground">{row.original.accountName}</p>
          </div>
        ),
      },
      {
        id: "stage",
        accessorKey: "stage",
        header: "Stage",
        cell: ({ row }) => (
          <EnterpriseStatusBadge
            status={stageStatus(row.original.stage)}
            label={STAGE_LABELS[row.original.stage]}
            size="sm"
          />
        ),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs">{formatOppCurrency(row.original.amount)}</span>
        ),
      },
      {
        id: "probability",
        accessorKey: "probability",
        header: "Prob.",
        cell: ({ row }) => <span className="tabular-nums text-xs">{row.original.probability}%</span>,
      },
      {
        id: "ownerName",
        accessorKey: "ownerName",
        header: "Owner",
        cell: ({ row }) => <span className="text-xs">{row.original.ownerName}</span>,
      },
      {
        id: "expectedCloseDate",
        accessorKey: "expectedCloseDate",
        header: "Close date",
        cell: ({ row }) => (
          <span className="text-xs tabular-nums">{row.original.expectedCloseDate}</span>
        ),
      },
      {
        id: "risk",
        header: "Risk",
        cell: ({ row }) =>
          row.original.atRisk && row.original.riskLevel ? (
            <EnterpriseRiskBadge level={row.original.riskLevel} size="sm" showIcon={false} label="!" />
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <Eye className="mr-2 h-3.5 w-3.5" aria-hidden />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/sales-marketing/opportunities/${row.original.id}`}>Open 360</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onView],
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
    <div className="flex min-h-0 flex-col">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => onView(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2 text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
