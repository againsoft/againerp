"use client";

import type { Employee } from "@/lib/mock-data/hr-employees";
import {
  EMPLOYEE_STATUS_LABELS,
  employeeInitials,
  employeeStatusBadgeVariant,
  formatEmployeeDate,
} from "@/lib/mock-data/hr-employees";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Mail,
  MoreHorizontal,
  Pencil,
  UserX,
} from "lucide-react";
import { useMemo } from "react";

export type EmployeeTableColumnId =
  | "photo"
  | "employeeNumber"
  | "name"
  | "department"
  | "designation"
  | "status"
  | "joiningDate";

type Props = {
  data: Employee[];
  columnVisibility: VisibilityState;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  className?: string;
};

function SortHeader({
  label,
  sorted,
}: {
  label: string;
  sorted: false | "asc" | "desc";
}) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <Icon className="h-3 w-3 opacity-50" aria-hidden />
    </span>
  );
}

export function EmployeeTable({
  data,
  columnVisibility,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  pagination,
  onPaginationChange,
  onView,
  onEdit,
  className,
}: Props) {
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomePageRowsSelected();
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all on page"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 44,
      },
      {
        id: "photo",
        accessorKey: "photo",
        header: "Photo",
        enableSorting: false,
        cell: ({ row }) => (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
            aria-hidden
          >
            {employeeInitials(row.original.name)}
          </div>
        ),
      },
      {
        id: "employeeNumber",
        accessorKey: "employeeNumber",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center"
            onClick={column.getToggleSortingHandler()}
          >
            <SortHeader label="Employee ID" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-muted-foreground">
            {row.original.employeeNumber}
          </span>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center"
            onClick={column.getToggleSortingHandler()}
          >
            <SortHeader label="Name" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <button
            type="button"
            className="max-w-[180px] truncate text-left font-medium text-primary hover:underline"
            onClick={() => onView(row.original)}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        id: "department",
        accessorKey: "department",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center"
            onClick={column.getToggleSortingHandler()}
          >
            <SortHeader label="Department" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate">{row.original.department}</span>
        ),
      },
      {
        id: "designation",
        accessorKey: "designation",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center"
            onClick={column.getToggleSortingHandler()}
          >
            <SortHeader label="Designation" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate text-muted-foreground">
            {row.original.designation}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center"
            onClick={column.getToggleSortingHandler()}
          >
            <SortHeader label="Status" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <Badge
            variant={employeeStatusBadgeVariant(row.original.status)}
            className="text-[10px] capitalize"
          >
            {EMPLOYEE_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "joiningDate",
        accessorKey: "joiningDate",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center"
            onClick={column.getToggleSortingHandler()}
          >
            <SortHeader label="Joining Date" sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {formatEmployeeDate(row.original.joiningDate)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => onView(row.original)}
            >
              <Eye className="mr-1 h-3.5 w-3.5" aria-hidden />
              View
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="More actions">
                  <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(row.original)}>
                  <Eye className="mr-2 h-3.5 w-3.5" /> View profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Mail className="mr-2 h-3.5 w-3.5" /> Send email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Archive className="mr-2 h-3.5 w-3.5" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-destructive">
                  <UserX className="mr-2 h-3.5 w-3.5" /> Terminate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onEdit, onView],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, columnVisibility, pagination },
    onSortingChange,
    onRowSelectionChange,
    onPaginationChange,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  const total = data.length;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2", className)}>
      <div className="hidden min-h-0 flex-1 overflow-hidden rounded-lg border border-input md:flex md:flex-col">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No employees match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Showing {from}–{to} of {total}
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5">
            <span className="sr-only">Page size</span>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              value={pageSize}
              onChange={(e) => {
                onPaginationChange({ pageIndex: 0, pageSize: Number(e.target.value) });
              }}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function getSelectedEmployees(
  data: Employee[],
  rowSelection: RowSelectionState,
): Employee[] {
  return data.filter((row) => rowSelection[row.id]);
}
