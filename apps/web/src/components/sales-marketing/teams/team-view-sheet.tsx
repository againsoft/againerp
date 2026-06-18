"use client";

import Link from "next/link";
import type { SmwTeam } from "@/lib/mock-data/smw-teams";
import {
  TEAM_STATUS_LABELS,
  formatTeamCurrency,
  getMembersByTeam,
  teamQuotaPct,
  teamStatusToEnterprise,
} from "@/lib/mock-data/smw-teams";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Pencil, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: SmwTeam | null;
  onEdit?: (t: SmwTeam) => void;
  onViewMembers?: (teamId: string) => void;
};

export function TeamViewSheet({ open, onOpenChange, team, onEdit, onViewMembers }: Props) {
  if (!team) return null;

  const members = getMembersByTeam(team.id);
  const pct = teamQuotaPct(team);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{team.teamNumber}</p>
            <h2 className="text-lg font-semibold">{team.name}</h2>
            <p className="text-xs text-muted-foreground">Managed by {team.managerName}</p>
          </div>
          <EnterpriseStatusBadge status={teamStatusToEnterprise(team.status)} label={TEAM_STATUS_LABELS[team.status]} />

          {team.description && <p className="text-xs text-muted-foreground">{team.description}</p>}

          <div className="rounded-lg border border-input bg-muted/30 p-3">
            <p className="text-[10px] text-muted-foreground">Team quota (Q2)</p>
            <p className="text-2xl font-semibold tabular-nums">{pct}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full rounded-full bg-violet-500")} style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatTeamCurrency(team.quotaAchieved)} of {formatTeamCurrency(team.quotaTarget)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium">Territories</p>
            <div className="flex flex-wrap gap-1">
              {team.territoryNames.map((t) => (
                <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium">Members ({members.length})</p>
            <ul className="space-y-1.5">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-xs">
                  <span>{m.name}</span>
                  <span className="tabular-nums text-muted-foreground">{teamQuotaPct(m)}%</span>
                </li>
              ))}
            </ul>
          </div>

          {team.notes && <p className="text-xs text-muted-foreground">{team.notes}</p>}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onEdit?.(team)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Edit
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onViewMembers?.(team.id)}>
              <Users className="mr-1.5 h-3.5 w-3.5" aria-hidden /> View members
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/targets?scope=team&q=${encodeURIComponent(team.name)}`}>Targets</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
