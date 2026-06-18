"use client";

import { Handshake } from "lucide-react";
import { tabFromPartnersPath } from "@/lib/mock-data/business-partners";
import { PartnersBreadcrumb, PartnersNav } from "@/components/partners/partners-nav";
import { PartnersControlCenter } from "@/components/partners/partners-control-center";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
};

export function PartnersPageShell({ children, title, subtitle }: Props) {
  const pathname = usePathname();
  const tab = tabFromPartnersPath(pathname);
  const isStandalone = Boolean(children);

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0">
        {!isStandalone && <PartnersBreadcrumb tab={tab} />}
        <div className="flex flex-wrap items-center gap-2">
          <Handshake className="h-5 w-5 text-violet-600" />
          <h1 className="page-title">{title ?? "Business Partners"}</h1>
        </div>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
          {subtitle ??
            "Unified commercial partners — vendors, retailers, wholesalers, distributors, and channel partners."}
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1">{children ?? <PartnersControlCenter />}</div>
    </div>
  );
}

export function PartnersListShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <PartnersPageShell title={title} subtitle={subtitle}>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <PartnersNav />
        <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
      </div>
    </PartnersPageShell>
  );
}
