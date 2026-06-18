import { TeamWorkspace } from "@/components/sales-marketing/teams/team-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-TEM-001 — Teams workspace */
export default function SmwTeamsPage() {
  return (
    <SmwListShell title="Teams" subtitle="Sales teams, territories, and assignment rules." hideHeader>
      <TeamWorkspace />
    </SmwListShell>
  );
}
