import { CommissionListWorkspace } from "@/components/sales-marketing/commission/commission-list-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-COM-001 — Commission workspace */
export default function SmwCommissionPage() {
  return (
    <SmwListShell title="Commission" subtitle="Commission rules, calculations, and payout tracking." hideHeader>
      <CommissionListWorkspace />
    </SmwListShell>
  );
}
