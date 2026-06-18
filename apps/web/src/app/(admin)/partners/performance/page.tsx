import { PartnersPageShell } from "@/components/partners/partners-page-shell";
import { PartnersPerformanceCenter } from "@/components/partners/partners-performance-center";

export default function PartnersPerformancePage() {
  return (
    <PartnersPageShell
      title="Performance"
      subtitle="Cross-partner KPIs — spend, revenue, on-time delivery, and open PO/SO counts (mock rollup)."
    >
      <PartnersPerformanceCenter />
    </PartnersPageShell>
  );
}
