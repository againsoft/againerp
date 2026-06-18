import { LeadWorkspace } from "@/components/sales-marketing/leads/lead-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-LDS-001 — Lead list workspace */
export default function SmwLeadsPage() {
  return (
    <SmwListShell
      title="Leads"
      subtitle="Capture, qualify, and convert inbound and outbound leads."
      hideHeader
    >
      <LeadWorkspace />
    </SmwListShell>
  );
}
