import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function RecruitmentPage() {
  return (
    <HrListShell
      title="Recruitment"
      subtitle="Requisitions, candidates, interviews, and hiring pipeline."
    >
      <HrSectionPlaceholder
        title="Recruitment workspace"
        description="Pipeline kanban and candidate drawers will mount here."
      />
    </HrListShell>
  );
}
