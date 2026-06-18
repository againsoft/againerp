"use client";

import { Factory } from "lucide-react";
import { tabFromManufacturingPath } from "@/lib/mock-data/manufacturing";
import {
  ManufacturingBreadcrumb,
  ManufacturingNav,
} from "@/components/manufacturing/manufacturing-nav";
import { ManufacturingControlCenter } from "@/components/manufacturing/manufacturing-control-center";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
};

export function ManufacturingPageShell({ children, title, subtitle }: Props) {
  const pathname = usePathname();
  const tab = tabFromManufacturingPath(pathname);
  const isStandalone = Boolean(children);

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0">
        {!isStandalone && <ManufacturingBreadcrumb tab={tab} />}
        <div className="flex flex-wrap items-center gap-2">
          <Factory className="h-5 w-5 text-amber-600" />
          <h1 className="page-title">{title ?? "Manufacturing"}</h1>
        </div>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
          {subtitle ??
            "Production planning, bills of materials, work orders, and shop floor execution (prototype)."}
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1">{children ?? <ManufacturingControlCenter />}</div>
    </div>
  );
}

export function ManufacturingListShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <ManufacturingPageShell title={title} subtitle={subtitle}>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <ManufacturingNav />
        <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
      </div>
    </ManufacturingPageShell>
  );
}
