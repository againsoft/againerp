"use client";

import Link from "next/link";
import type { SmwTeamMember } from "@/lib/mock-data/smw-teams";
import {
  MEMBER_STATUS_LABELS,
  TEAM_MEMBER_ROLE_LABELS,
  formatTeamCurrency,
  teamQuotaPct,
} from "@/lib/mock-data/smw-teams";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: SmwTeamMember | null;
};

export function TeamMemberViewSheet({ open, onOpenChange, member }: Props) {
  if (!member) return null;

  const pct = teamQuotaPct(member);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{member.name}</h2>
            <p className="text-xs text-muted-foreground">{TEAM_MEMBER_ROLE_LABELS[member.role]} · {member.teamName}</p>
          </div>
          <EnterpriseStatusBadge
            status={member.status === "active" ? "active" : member.status === "on_leave" ? "pending" : "inactive"}
            label={MEMBER_STATUS_LABELS[member.status]}
          />

          <div className="rounded-lg border border-input bg-muted/30 p-3">
            <p className="text-[10px] text-muted-foreground">Quota achievement</p>
            <p className={cn("text-2xl font-semibold tabular-nums", pct >= 90 && "text-emerald-700 dark:text-emerald-300")}>{pct}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatTeamCurrency(member.quotaAchieved)} of {formatTeamCurrency(member.quotaTarget)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Email</dt><dd className="break-all">{member.email}</dd></div>
            <div><dt className="text-muted-foreground">Phone</dt><dd>{member.phone}</dd></div>
            <div><dt className="text-muted-foreground">Territory</dt><dd>{member.territoryName}</dd></div>
            <div><dt className="text-muted-foreground">Active leads</dt><dd className="tabular-nums">{member.activeLeads}</dd></div>
            <div><dt className="text-muted-foreground">Open opportunities</dt><dd className="tabular-nums">{member.openOpportunities}</dd></div>
          </dl>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/leads?owner=${member.id}`}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Leads
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/opportunities?owner=${member.id}`}>Opportunities</Link>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/targets?scope=rep&q=${encodeURIComponent(member.name)}`}>Targets</Link>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/commission?rep=${member.id}`}>Commission</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
