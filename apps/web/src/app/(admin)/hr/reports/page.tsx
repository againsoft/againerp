import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function HrReportsPage() {
  return (
    <HrListShell title="HR reports" subtitle="Report center and operational exports.">
      <HrSectionPlaceholder
        title="Report center"
        description="HR report catalog and slug pages will mount here."
      />
    </HrListShell>
  );
}
