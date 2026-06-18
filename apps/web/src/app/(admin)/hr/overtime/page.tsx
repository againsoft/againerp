import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function OvertimePage() {
  return (
    <HrListShell title="Overtime" subtitle="Overtime requests, policies, and approvals.">
      <HrSectionPlaceholder title="Overtime" description="Overtime workspace will mount here." />
    </HrListShell>
  );
}
