import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function PerformancePage() {
  return (
    <HrListShell title="Performance" subtitle="Goals, review cycles, and promotions.">
      <HrSectionPlaceholder title="Performance" description="Performance workspace will mount here." />
    </HrListShell>
  );
}
