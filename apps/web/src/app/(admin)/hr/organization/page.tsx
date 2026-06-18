import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

function shell(title: string, subtitle: string, placeholder: string) {
  return (
    <HrListShell title={title} subtitle={subtitle}>
      <HrSectionPlaceholder title={title} description={placeholder} />
    </HrListShell>
  );
}

export default function OrganizationPage() {
  return shell(
    "Organization",
    "Departments, teams, locations, and reporting structure.",
    "Organization hub and structure views will mount here.",
  );
}
