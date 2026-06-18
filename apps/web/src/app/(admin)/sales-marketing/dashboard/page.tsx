import { Suspense } from "react";
import { SmwDashboard } from "@/components/sales-marketing/dashboard/smw-dashboard";
import { SmwPageShell } from "@/components/sales-marketing/smw-page-shell";

/** SCR-SMW-DSH-001 — Revenue Operations dashboard */
export default function SmwDashboardPage() {
  return (
    <SmwPageShell hideHeader>
      <Suspense fallback={null}>
        <SmwDashboard />
      </Suspense>
    </SmwPageShell>
  );
}
