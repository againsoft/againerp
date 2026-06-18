"use client";

import Link from "next/link";
import type { SmwLead } from "@/lib/mock-data/smw-leads";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatLeadCurrency,
  leadInitials,
  leadScoreColor,
  leadStatusToEnterprise,
} from "@/lib/mock-data/smw-leads";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ArrowRight, GitBranch, Pencil, UserCog } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: SmwLead | null;
  onEdit?: (lead: SmwLead) => void;
  onAssign?: (lead: SmwLead) => void;
  onConvert?: (lead: SmwLead) => void;
};

export function LeadViewSheet({
  open,
  onOpenChange,
  lead,
  onEdit,
  onAssign,
  onConvert,
}: Props) {
  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md"
        aria-describedby={undefined}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200"
              aria-hidden
            >
              {leadInitials(lead.name)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold leading-tight">{lead.name}</h2>
              <p className="text-sm text-muted-foreground">{lead.company}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{lead.leadNumber}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <EnterpriseStatusBadge
              status={leadStatusToEnterprise(lead.status)}
              label={LEAD_STATUS_LABELS[lead.status]}
            />
            <Badge variant="secondary">{LEAD_SOURCE_LABELS[lead.source]}</Badge>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-0.5 font-medium">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="mt-0.5 font-medium">{lead.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="mt-0.5 font-medium">{lead.ownerName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Territory</dt>
              <dd className="mt-0.5 font-medium">{lead.territoryName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expected value</dt>
              <dd className="mt-0.5 font-medium tabular-nums">{formatLeadCurrency(lead.expectedValue)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last activity</dt>
              <dd className="mt-0.5 font-medium">{lead.lastActivityRelative}</dd>
            </div>
          </dl>

          <div>
            <p className="text-xs text-muted-foreground">Lead score</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", leadScoreColor(lead.score))}
                  style={{ width: `${lead.score}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">{lead.score}</span>
            </div>
          </div>

          {lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {lead.notes && (
            <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{lead.notes}</p>
          )}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(lead)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                onAssign?.(lead);
                toast.info("Assign owner — use bulk bar for multiple");
              }}
            >
              <UserCog className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Assign
            </Button>
            {lead.status !== "converted" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  onConvert?.(lead);
                  toast.success("Lead marked for conversion — opportunity stub");
                }}
              >
                <GitBranch className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Convert
              </Button>
            )}
          </div>

          <Button type="button" variant="secondary" size="sm" className="h-9 w-full" asChild>
            <Link href={`/sales-marketing/leads/${lead.id}`}>
              Open full profile
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
