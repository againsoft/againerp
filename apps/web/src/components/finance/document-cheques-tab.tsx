"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Plus, ScrollText } from "lucide-react";
import {
  CHEQUE_STATUS_LABELS,
  formatBdt,
  type ChequeDirection,
  type ChequeInstrument,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function statusVariant(s: ChequeInstrument["status"]) {
  if (s === "cleared") return "success" as const;
  if (s === "deposited") return "secondary" as const;
  if (s === "issued") return "warning" as const;
  return "muted" as const;
}

export function DocumentChequesTab({
  linkedDoc,
  direction,
  cheques,
  onAddCheque,
}: {
  linkedDoc: string;
  direction: ChequeDirection;
  cheques: ChequeInstrument[];
  onAddCheque: () => void;
}) {
  const linked = cheques.filter((c) => c.linkedDoc === linkedDoc && c.direction === direction);
  const total = linked.reduce((s, c) => s + c.amount, 0);
  const isReceived = direction === "received";

  if (linked.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input p-6 text-center">
        <ScrollText className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No cheques linked to {linkedDoc}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Register post-dated cheques with maturity schedule for this document.
        </p>
        <Button size="sm" className="mt-3" onClick={onAddCheque}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Cheque
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5">
          {isReceived ? (
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          )}
          <span>
            {linked.length} cheque{linked.length !== 1 ? "s" : ""} ·{" "}
            <strong className="tabular-nums">{formatBdt(total)}</strong>
          </span>
        </span>
        <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={onAddCheque}>
          <Plus className="mr-1 h-3 w-3" /> Add Cheque
        </Button>
      </div>

      <div className="space-y-2">
        {linked.map((c) => (
          <Link
            key={c.id}
            href={`/finance/cheques?view=${c.id}`}
            className="flex items-center gap-2 rounded-lg border border-input bg-card p-3 text-xs hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-medium">#{c.chequeNumber}</span>
                <Badge variant={statusVariant(c.status)} className="text-[9px]">
                  {CHEQUE_STATUS_LABELS[c.status]}
                </Badge>
              </div>
              <p className="mt-0.5 text-muted-foreground">
                {c.bank} · Maturity {c.maturityDate}
              </p>
            </div>
            <span className="shrink-0 tabular-nums font-semibold">{formatBdt(c.amount)}</span>
          </Link>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground">
        <Link href={`/finance/cheques?tab=calendar`} className="text-indigo-600 hover:underline dark:text-indigo-400">
          View PDC calendar
        </Link>
        {" "}for maturity schedule
      </p>
    </div>
  );
}

export function DrawerTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; badge?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mt-4 shrink-0 flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors",
            active === t.id
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {t.label}
          {t.badge !== undefined && t.badge > 0 && (
            <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px]">{t.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
