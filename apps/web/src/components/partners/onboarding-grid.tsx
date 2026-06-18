"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  ONBOARDING_STATUS_LABELS,
  onboardingApplicationsSeed,
  type OnboardingStatus,
  type PartnerOnboardingApplication,
} from "@/lib/mock-data/business-partner-onboarding";
import { PARTNER_ROLE_LABELS } from "@/lib/mock-data/business-partners";
import {
  onboardingStatusBadgeVariant,
  useBusinessPartnerOnboardingStore,
} from "@/lib/store/business-partner-onboarding-store";
import { partnerRoleBadgeVariant } from "@/lib/store/business-partner-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartnersAgGrid } from "@/components/partners/partners-ag-grid";

const PAGE_SIZE = 25;
const STATUSES = Object.keys(ONBOARDING_STATUS_LABELS) as OnboardingStatus[];

type Props = {
  className?: string;
  initialStatus?: string;
  onView: (app: PartnerOnboardingApplication) => void;
};

export function OnboardingGrid({ className, initialStatus = "all", onView }: Props) {
  const storeApps = useBusinessPartnerOnboardingStore((s) => s.applications);
  const startReview = useBusinessPartnerOnboardingStore((s) => s.startReview);
  const applications = storeApps.length > 0 ? storeApps : onboardingApplicationsSeed;
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const rows = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((a) => a.status === statusFilter);
  }, [applications, statusFilter]);

  const StatusCell = useCallback((p: ICellRendererParams<PartnerOnboardingApplication>) => {
    if (!p.data) return null;
    return (
      <Badge variant={onboardingStatusBadgeVariant(p.data.status)} className="text-[10px] capitalize">
        {ONBOARDING_STATUS_LABELS[p.data.status]}
      </Badge>
    );
  }, []);

  const RolesCell = useCallback((p: ICellRendererParams<PartnerOnboardingApplication>) => {
    if (!p.data) return null;
    return (
      <div className="flex flex-wrap gap-0.5 py-1">
        {p.data.requestedRoles.slice(0, 2).map((role) => (
          <Badge key={role} variant={partnerRoleBadgeVariant(role)} className="text-[9px]">
            {PARTNER_ROLE_LABELS[role]}
          </Badge>
        ))}
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<PartnerOnboardingApplication>[]>(
    () => [
      {
        field: "applicationNumber",
        headerName: "Application #",
        width: 130,
        pinned: "left",
        cellRenderer: (p: ICellRendererParams<PartnerOnboardingApplication>) => {
          if (!p.data) return null;
          return (
            <button
              type="button"
              className="font-mono text-xs font-medium text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onView(p.data!);
              }}
            >
              {p.data.applicationNumber}
            </button>
          );
        },
      },
      {
        field: "companyName",
        headerName: "Company",
        flex: 1,
        minWidth: 160,
      },
      {
        colId: "contact",
        headerName: "Contact",
        width: 180,
        valueGetter: (p) =>
          p.data ? `${p.data.contactName} · ${p.data.email}` : "",
        cellRenderer: (p: ICellRendererParams<PartnerOnboardingApplication>) => {
          if (!p.data) return null;
          return (
            <div className="py-1 text-xs">
              <p className="font-medium">{p.data.contactName}</p>
              <p className="truncate text-muted-foreground">{p.data.email}</p>
            </div>
          );
        },
      },
      {
        colId: "roles",
        headerName: "Roles",
        width: 140,
        cellRenderer: RolesCell,
        sortable: false,
      },
      {
        field: "submittedAt",
        headerName: "Submitted",
        width: 110,
        valueFormatter: (p) =>
          p.value ? new Date(p.value as string).toLocaleDateString() : "",
      },
      {
        field: "status",
        headerName: "Status",
        width: 110,
        cellRenderer: StatusCell,
      },
      {
        field: "reviewerName",
        headerName: "Reviewer",
        width: 120,
        valueFormatter: (p) => (p.value as string) || "—",
      },
      {
        colId: "actions",
        headerName: "",
        width: 56,
        pinned: "right",
        sortable: false,
        cellRenderer: (p: ICellRendererParams<PartnerOnboardingApplication>) => {
          if (!p.data) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(p.data!)}>
                  <Eye className="mr-2 h-3.5 w-3.5" /> View
                </DropdownMenuItem>
                {p.data.status === "submitted" && (
                  <DropdownMenuItem onClick={() => startReview(p.data!.id)}>
                    Start review
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [RolesCell, StatusCell, onView, startReview],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1 overflow-x-auto">
        {["all", ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
              statusFilter === status
                ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200"
                : "border-input text-muted-foreground hover:bg-muted/60",
            )}
          >
            {status === "all" ? "All" : ONBOARDING_STATUS_LABELS[status as OnboardingStatus]}
          </button>
        ))}
      </div>

      <PartnersAgGrid<PartnerOnboardingApplication>
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
