import { HrListShell } from "@/components/hr/hr-page-shell";
import { AiWorkspace } from "@/components/hr/ai/ai-workspace";

export default function HrAiPage() {
  return (
    <HrListShell
      title="AI Workspace"
      subtitle="Workforce copilot — insights, recommendations, and governed actions."
      hideHeader
    >
      <AiWorkspace />
    </HrListShell>
  );
}
