"use client";

import Link from "next/link";
import { Building2, MapPin, Pin, Sparkles, User, X } from "lucide-react";
import type { AiWorkspaceContext } from "@/lib/mock-data/hr-ai-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  context: AiWorkspaceContext;
};

/** ZONE A — Context header */
export function AiWorkspaceContextHeader({ context }: Props) {
  return (
    <header className="shrink-0 border-b border-input bg-gradient-to-r from-violet-50/80 to-background px-4 py-3 dark:from-violet-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Sparkles className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h1 className="text-base font-semibold">AI Workspace</h1>
            <p className="text-[11px] text-muted-foreground">Workforce copilot · Advisory only</p>
          </div>
          <Badge variant="outline" className="ml-1 text-[10px] capitalize">
            {context.scope}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-xs" disabled>
            <Pin className="h-3.5 w-3.5" aria-hidden />
            Pin context
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8 text-xs" disabled>
            Auditor mode
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ContextChip icon={Building2} label="Module" value={context.module} />
        <ContextChip icon={MapPin} label="Department" value={context.department} />
        <ContextChip
          icon={User}
          label="Employee"
          value={`${context.employee} · ${context.employeeId.replace("emp-", "EMP-00")}`}
          href={`/hr/employees?view=${context.employeeId}`}
        />
        <ContextChip icon={MapPin} label="Branch" value={context.branch} />
        {context.payrollRun ? (
          <ContextChip
            label="Payroll"
            value={context.payrollRun}
            href={`/payroll/runs?view=${context.payrollRun}`}
          />
        ) : null}
      </div>
    </header>
  );
}

function ContextChip({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: typeof Building2;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      {Icon ? <Icon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden /> : null}
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
      {href ? null : (
        <button type="button" className="ml-1 rounded p-0.5 hover:bg-muted" aria-label={`Clear ${label}`} disabled>
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </>
  );

  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-2.5 py-1 text-[11px]";

  if (href) {
    return (
      <Link href={href} className={`${className} hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/20`}>
        {inner}
      </Link>
    );
  }

  return <span className={className}>{inner}</span>;
}
