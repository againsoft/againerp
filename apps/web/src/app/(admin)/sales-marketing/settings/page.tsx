import { SmwSettingsWorkspace } from "@/components/sales-marketing/settings/smw-settings-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-SET-001 — Module settings */
export default function SmwSettingsPage() {
  return (
    <SmwListShell title="Settings" subtitle="Pipeline stages, lead sources, quotation templates, and module configuration." hideHeader>
      <SmwSettingsWorkspace />
    </SmwListShell>
  );
}
