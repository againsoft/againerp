"use client";

import Link from "next/link";
import { MapPin, Sparkles, Target, TrendingUp, User } from "lucide-react";
import type { SmwAiContext } from "@/lib/mock-data/smw-ai-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { context: SmwAiContext };

export function SmwAiContextHeader({ context }: Props) {
  return (
    <header className="shrink-0 border-b border-input bg-gradient-to-r from-violet-50/80 to-background px-4 py-3 dark:from-violet-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Sparkles className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h1 className="text-base font-semibold">Revenue AI Copilot</h1>
            <p className="text-[11px] text-muted-foreground">Deal coaching · Next-best actions · Advisory only</p>
          </div>
          <Badge variant="outline" className="ml-1 text-[10px] capitalize">{context.scope}</Badge>
        </div>
        <Button type="button" variant="outline" size="sm" className="h-8 text-xs" disabled>
          Revenue auditor
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip icon={TrendingUp} label="Module" value={context.module} />
        <Chip icon={MapPin} label="Territory" value={context.territory} href="/sales-marketing/dashboard" />
        <Chip icon={User} label="View as" value={context.viewAs} />
        <Chip icon={Target} label="Period" value={context.period} href="/sales-marketing/targets" />
      </div>
    </header>
  );
}

function Chip({ icon: Icon, label, value, href }: { icon?: typeof MapPin; label: string; value: string; href?: string }) {
  const cls = "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1 text-[11px]";
  if (href) {
    return (
      <Link href={href} className={cls + " hover:bg-muted/50"}>
        {Icon ? <Icon className="h-3 w-3 text-muted-foreground" aria-hidden /> : null}
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </Link>
    );
  }
  return (
    <span className={cls}>
      {Icon ? <Icon className="h-3 w-3 text-muted-foreground" aria-hidden /> : null}
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}
