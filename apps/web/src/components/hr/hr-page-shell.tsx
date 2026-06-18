"use client";

import { Briefcase } from "lucide-react";
import type { ReactNode } from "react";
import { HrControlCenter } from "@/components/hr/hr-control-center";

type Props = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  /** Hide page header when dashboard provides Zone A chrome. */
  hideHeader?: boolean;
};

export function HrPageShell({ children, title, subtitle, hideHeader }: Props) {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      {!hideHeader && (
        <div className="shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-600" aria-hidden />
            <h1 className="page-title">{title ?? "HR & Payroll"}</h1>
          </div>
          <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
            {subtitle ??
              "Workforce management — employees, time, leave, payroll, and talent operations."}
          </p>
        </div>
      )}

      <div className={hideHeader ? "min-h-0 flex-1" : "mt-4 min-h-0 flex-1"}>
        {children ?? <HrControlCenter />}
      </div>
    </div>
  );
}

export function HrListShell({
  children,
  title,
  subtitle,
  hideHeader,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  hideHeader?: boolean;
}) {
  return (
    <HrPageShell title={title} subtitle={subtitle} hideHeader={hideHeader}>
      <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
    </HrPageShell>
  );
}
