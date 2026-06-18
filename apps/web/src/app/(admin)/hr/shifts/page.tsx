import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function ShiftsPage() {
  return (
    <HrListShell title="Shifts" subtitle="Shift definitions, assignments, and rotations.">
      <HrSectionPlaceholder title="Shifts" description="Shift workspace will mount here." />
    </HrListShell>
  );
}
