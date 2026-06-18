import { EnterpriseComponentShowcase } from "@/components/enterprise/enterprise-showcase";

/** Enterprise component library showcase — DS/CMP reference gallery */
export default function EnterpriseDesignSystemPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
      <div>
        <h1 className="page-title">Enterprise Components</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Reusable HR design system cards and badges — mock data only.
        </p>
      </div>
      <EnterpriseComponentShowcase />
    </div>
  );
}
