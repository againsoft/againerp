import { SmwAiWorkspace } from "@/components/sales-marketing/ai/smw-ai-workspace";
import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-AI-001 — Revenue AI Copilot */
export default function SmwAiPage() {
  return (
    <SmwListShell title="AI Copilot" subtitle="Revenue intelligence, deal coaching, and next-best actions." hideHeader>
      <SmwAiWorkspace />
    </SmwListShell>
  );
}
