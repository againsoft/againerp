import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function AssetsPage() {
  return (
    <HrListShell title="Assets" subtitle="Asset inventory, assignments, and lifecycle.">
      <HrSectionPlaceholder title="Assets" description="Asset workspace will mount here." />
    </HrListShell>
  );
}
