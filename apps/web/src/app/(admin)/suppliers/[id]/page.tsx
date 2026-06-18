"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPartnerBySupplierId } from "@/lib/mock-data/business-partners";
import { SupplierDetailWorkspace } from "@/components/suppliers/supplier-detail-workspace";

/** M2 — legacy supplier detail → partner drawer when mapped. */
export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const partner = getPartnerBySupplierId(id);

  useEffect(() => {
    if (partner) {
      router.replace(`/partners/directory?view=${partner.id}`);
    }
  }, [partner, router]);

  if (partner) {
    return (
      <p className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Opening partner in Business Partners…
      </p>
    );
  }

  return (
    <div className="space-y-1">
      <p className="page-subtitle">AgainERP › Suppliers › Vendor</p>
      <div className="pt-2">
        <SupplierDetailWorkspace supplierId={id} />
      </div>
    </div>
  );
}
