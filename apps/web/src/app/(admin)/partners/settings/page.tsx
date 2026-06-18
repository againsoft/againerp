import { PartnersPageShell } from "@/components/partners/partners-page-shell";
import { PartnerSettingsForm } from "@/components/partners/partner-settings-form";

export default function PartnersSettingsPage() {
  return (
    <PartnersPageShell
      title="Settings"
      subtitle="Partner numbering, default terms, onboarding rules, and integration toggles."
    >
      <PartnerSettingsForm />
    </PartnersPageShell>
  );
}
