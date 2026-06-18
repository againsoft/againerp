import { TargetListWorkspace } from "@/components/sales-marketing/targets/target-list-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-TGT-001 — Targets & KPI workspace */
export default function SmwTargetsPage() {
  return (
    <SmwListShell title="Targets" subtitle="Revenue and activity targets by team, rep, and period." hideHeader>
      <TargetListWorkspace />
    </SmwListShell>
  );
}
