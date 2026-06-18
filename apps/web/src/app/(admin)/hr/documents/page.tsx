import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function DocumentsPage() {
  return (
    <HrListShell title="Documents" subtitle="Employee files, contracts, and expiry tracking.">
      <HrSectionPlaceholder title="Documents" description="Document center will mount here." />
    </HrListShell>
  );
}
