"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuotationBuilder } from "@/components/sales-marketing/quotations/quotation-builder";
import { SmwPageShell } from "@/components/sales-marketing/smw-page-shell";

function QuotationCreateContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const opportunityId = searchParams.get("opportunity");

  return (
    <SmwPageShell hideHeader>
      <QuotationBuilder editId={editId} opportunityId={opportunityId} />
    </SmwPageShell>
  );
}

/** SCR-SMW-QUO-BLD — Document builder (full-page exception) */
export default function QuotationCreatePage() {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading builder…</p>}>
      <QuotationCreateContent />
    </Suspense>
  );
}
