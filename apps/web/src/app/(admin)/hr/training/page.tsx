import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function TrainingPage() {
  return (
    <HrListShell title="Training" subtitle="Programs, sessions, and certifications.">
      <HrSectionPlaceholder title="Training" description="Training workspace will mount here." />
    </HrListShell>
  );
}
