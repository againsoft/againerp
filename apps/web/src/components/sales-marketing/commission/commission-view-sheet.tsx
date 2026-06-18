"use client";

import Link from "next/link";
import type { SmwCommission } from "@/lib/mock-data/smw-commissions";
import {
  COMMISSION_STATUS_LABELS,
  COMMISSION_TYPE_LABELS,
  commissionStatusToEnterprise,
  formatCommissionCurrency,
} from "@/lib/mock-data/smw-commissions";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CheckCircle2, ExternalLink, Pencil, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commission: SmwCommission | null;
  onEdit?: (c: SmwCommission) => void;
  onStatusChange?: (id: string, status: SmwCommission["status"]) => void;
};

export function CommissionViewSheet({ open, onOpenChange, commission, onEdit, onStatusChange }: Props) {
  if (!commission) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{commission.commissionNumber}</p>
            <h2 className="text-lg font-semibold">{commission.dealName}</h2>
            <p className="text-xs text-muted-foreground">{commission.repName} · {COMMISSION_TYPE_LABELS[commission.type]}</p>
          </div>
          <EnterpriseStatusBadge
            status={commissionStatusToEnterprise(commission.status)}
            label={COMMISSION_STATUS_LABELS[commission.status]}
          />

          <div className="rounded-lg border border-input bg-muted/30 p-3">
            <p className="text-[10px] text-muted-foreground">Commission amount</p>
            <p
              className={cn(
                "text-2xl font-semibold tabular-nums",
                commission.commissionAmount < 0 && "text-red-600",
                commission.commissionAmount > 0 && "text-emerald-700 dark:text-emerald-300",
              )}
            >
              {formatCommissionCurrency(commission.commissionAmount)}
            </p>
            {commission.commissionRate > 0 && commission.dealValue > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCommissionCurrency(commission.dealValue)} × {commission.commissionRate}%
              </p>
            )}
          </div>

          {commission.notes && <p className="text-xs text-muted-foreground">{commission.notes}</p>}

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Plan</dt><dd>{commission.planName}</dd></div>
            <div><dt className="text-muted-foreground">Period</dt><dd>{commission.periodLabel}</dd></div>
            <div><dt className="text-muted-foreground">Closed</dt><dd>{commission.closedDate}</dd></div>
            {commission.payoutDate && (
              <div><dt className="text-muted-foreground">Paid</dt><dd>{commission.payoutDate}</dd></div>
            )}
          </dl>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(commission)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
            </Button>
            {commission.status === "pending" && onStatusChange && (
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onStatusChange(commission.id, "approved")}>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Approve
              </Button>
            )}
            {commission.status === "approved" && onStatusChange && (
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onStatusChange(commission.id, "paid")}>
                <Wallet className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Mark paid
              </Button>
            )}
            {commission.opportunityId && (
              <Button type="button" variant="outline" size="sm" className="h-8" asChild>
                <Link href={`/sales-marketing/opportunities/${commission.opportunityId}`}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Open opportunity
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
