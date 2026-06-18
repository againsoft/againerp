"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  PARTNER_ROLE_LABELS,
  PARTNER_STATUS_LABELS,
  businessPartnersSeed,
  formatPartnerMoney,
  type BusinessPartner,
  type PartnerRole,
  type PartnerStatus,
} from "@/lib/mock-data/business-partners";
import {
  partnerRoleBadgeVariant,
  partnerStatusBadgeVariant,
  useBusinessPartnerStore,
} from "@/lib/store/business-partner-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { PartnersAgGrid } from "@/components/partners/partners-ag-grid";

const PAGE_SIZE = 25;
const ROLES = Object.keys(PARTNER_ROLE_LABELS) as PartnerRole[];
const STATUSES = Object.keys(PARTNER_STATUS_LABELS) as PartnerStatus[];

type FilterState = { search: string; role: string; status: string };

type Props = {
  className?: string;
  initialRole?: string;
  onView: (partner: BusinessPartner) => void;
  onEdit: (partner: BusinessPartner) => void;
};

export function PartnerGrid({ className, initialRole = "all", onView, onEdit }: Props) {
  const storePartners = useBusinessPartnerStore((s) => s.partners);
  const partners = storePartners.length > 0 ? storePartners : businessPartnersSeed;
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    role: initialRole,
    status: "all",
  });

  const rows = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return partners.filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.role !== "all" && !p.roles.includes(filters.role as PartnerRole)) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.partnerCode.toLowerCase().includes(q) &&
        !p.email.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [partners, filters]);

  const RolesCell = useCallback((p: ICellRendererParams<BusinessPartner>) => {
    if (!p.data) return null;
    return (
      <div className="flex flex-wrap gap-0.5 py-1">
        {p.data.roles.slice(0, 2).map((role) => (
          <Badge key={role} variant={partnerRoleBadgeVariant(role)} className="text-[9px]">
            {PARTNER_ROLE_LABELS[role]}
          </Badge>
        ))}
        {p.data.roles.length > 2 && (
          <Badge variant="muted" className="text-[9px]">
            +{p.data.roles.length - 2}
          </Badge>
        )}
      </div>
    );
  }, []);

  const StatusCell = useCallback((p: ICellRendererParams<BusinessPartner>) => {
    if (!p.data) return null;
    return (
      <Badge variant={partnerStatusBadgeVariant(p.data.status)} className="text-[10px] capitalize">
        {PARTNER_STATUS_LABELS[p.data.status]}
      </Badge>
    );
  }, []);

  const columnDefs = useMemo<ColDef<BusinessPartner>[]>(
    () => [
      {
        field: "name",
        headerName: "Partner",
        flex: 1,
        minWidth: 180,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<BusinessPartner>) => {
          if (!p.data) return null;
          return (
            <div className="py-1">
              <button
                type="button"
                className="text-left font-medium text-primary hover:underline"
                onClick={() => onView(p.data!)}
              >
                {p.data.name}
              </button>
              <p className="font-mono text-[10px] text-muted-foreground">{p.data.partnerCode}</p>
            </div>
          );
        },
      },
      {
        colId: "roles",
        headerName: "Roles",
        width: 150,
        cellRenderer: RolesCell,
        sortable: false,
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        cellRenderer: StatusCell,
      },
      { field: "territory", headerName: "Territory", width: 110 },
      { field: "tierCode", headerName: "Tier", width: 110 },
      {
        field: "rating",
        headerName: "Rating",
        width: 80,
        valueFormatter: (p) => (p.value ? `★ ${p.value}` : "—"),
      },
      {
        field: "spendYtd",
        headerName: "Spend YTD",
        width: 100,
        type: "rightAligned",
        valueFormatter: (p) => (p.value > 0 ? formatPartnerMoney(p.value) : "—"),
      },
      {
        field: "revenueYtd",
        headerName: "Revenue YTD",
        width: 110,
        type: "rightAligned",
        valueFormatter: (p) => (p.value > 0 ? formatPartnerMoney(p.value) : "—"),
      },
      {
        colId: "actions",
        headerName: "",
        width: 88,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<BusinessPartner>) => {
          if (!p.data) return null;
          return (
            <div className="flex items-center justify-end gap-0.5">
              <ActivityTriggerButton
                entity={{
                  type: "business_partner",
                  id: p.data!.id,
                  label: p.data!.name,
                  subtitle: p.data!.partnerCode,
                }}
                className="h-7 w-7"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(p.data!)}>
                    <Eye className="mr-2 h-3.5 w-3.5" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(p.data!)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [RolesCell, StatusCell, onEdit, onView],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {["all", ...ROLES.slice(0, 5)].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, role }))}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
              filters.role === role
                ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200"
                : "border-input text-muted-foreground hover:bg-muted/60",
            )}
          >
            {role === "all" ? "All" : PARTNER_ROLE_LABELS[role as PartnerRole]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name, code, email…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="h-8 max-w-[220px] text-xs"
        />
        <Select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="h-8 w-[130px] text-xs"
        >
          <option value="all">All status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {PARTNER_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      <PartnersAgGrid<BusinessPartner>
        rowData={rows}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={PAGE_SIZE}
        onRowClicked={(e) => {
          if (e.data) onView(e.data);
        }}
        rowClass="cursor-pointer"
      />
    </div>
  );
}
