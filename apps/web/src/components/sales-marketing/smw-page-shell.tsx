"use client";

import { TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  hideHeader?: boolean;
};

export function SmwPageShell({ children, title, subtitle, hideHeader }: Props) {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      {!hideHeader && (
        <div className="shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" aria-hidden />
            <h1 className="page-title">{title ?? "Sales & Marketing"}</h1>
          </div>
          <p className="page-subtitle mt-1 max-w-3xl">
            {subtitle ?? "Revenue operations — leads, pipeline, quotations, campaigns, and growth analytics."}
          </p>
        </div>
      )}

      <div className={hideHeader ? "min-h-0 flex-1" : "mt-4 min-h-0 flex-1"}>{children}</div>
    </div>
  );
}

export function SmwListShell({
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
    <SmwPageShell title={title} subtitle={subtitle} hideHeader={hideHeader}>
      <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
    </SmwPageShell>
  );
}
