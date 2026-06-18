import { HrListShell } from "@/components/hr/hr-page-shell";
import { HrSectionPlaceholder } from "@/components/hr/hr-section-placeholder";

export default function HrSettingsPage() {
  return (
    <HrListShell title="HR settings" subtitle="Module configuration and policies.">
      <HrSectionPlaceholder
        title="Settings"
        description="Attendance, leave, payroll, and HR policy settings will mount here."
      />
    </HrListShell>
  );
}
