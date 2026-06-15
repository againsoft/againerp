"use client";

import { Truck } from "lucide-react";
import { tabFromPath } from "@/lib/mock-data/suppliers";
import { SupplierBreadcrumb } from "@/components/suppliers/supplier-nav";
import { SupplierControlCenter } from "@/components/suppliers/supplier-control-center";
import { usePathname } from "next/navigation";

export function SupplierPageShell() {
  const pathname = usePathname();
  const tab = tabFromPath(pathname);

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0">
        <p className="page-subtitle">AgainERP › Suppliers</p>
        <SupplierBreadcrumb tab={tab} />
        <div className="flex flex-wrap items-center gap-2">
          <Truck className="h-5 w-5 text-indigo-600" />
          <h1 className="page-title">Suppliers</h1>
        </div>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
          Vendor directory, purchase orders, RFQs, and supplier stock feeds — procurement from a
          single control center.
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <SupplierControlCenter />
      </div>
    </div>
  );
}
