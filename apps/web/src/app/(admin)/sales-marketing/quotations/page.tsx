import { QuotationListWorkspace } from "@/components/sales-marketing/quotations/quotation-list-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-QUO-001 — Quotation list */
export default function SmwQuotationsPage() {
  return (
    <SmwListShell title="Quotations" subtitle="Build, send, and track sales quotations." hideHeader>
      <QuotationListWorkspace />
    </SmwListShell>
  );
}
