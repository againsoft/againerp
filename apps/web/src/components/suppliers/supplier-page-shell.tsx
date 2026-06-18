"use client";

import { Truck } from "lucide-react";
import { tabFromPath } from "@/lib/mock-data/suppliers";
import { VendorMigrationBanner } from "@/components/partners/vendor-migration-banner";
import { SupplierBreadcrumb } from "@/components/suppliers/supplier-nav";
import { SupplierControlCenter } from "@/components/suppliers/supplier-control-center";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
};

export function SupplierPageShell({ children, title, subtitle }: Props) {
  const pathname = usePathname();
  const tab = tabFromPath(pathname);
  const isStandalone = Boolean(children);

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0">
        <p className="page-subtitle">AgainERP › Suppliers</p>
        {!isStandalone && <SupplierBreadcrumb tab={tab} />}
        <div className="flex flex-wrap items-center gap-2">
          <Truck className="h-5 w-5 text-indigo-600" />
          <h1 className="page-title">{title ?? "Suppliers"}</h1>
        </div>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
          {subtitle ??
            "Purchase orders, RFQs, receipts, and bills — vendor master is in Business Partners."}
        </p>
        <VendorMigrationBanner className="mt-3" compact />
      </div>

      <div className="mt-4 min-h-0 flex-1">{children ?? <SupplierControlCenter />}</div>
    </div>
  );
}
