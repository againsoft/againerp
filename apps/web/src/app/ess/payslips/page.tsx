import { EssPage } from "@/components/ess/ess-page";
import { Button } from "@/components/ui/button";
import { ESS_PAYSLIPS } from "@/lib/mock-data/ess-portal";
import { Download } from "lucide-react";

export default function EssPayslipsPage() {
  return (
    <EssPage>
        <p className="text-xs text-muted-foreground">Published payslips only — net pay shown after statutory deductions.</p>
        <ul className="space-y-2">
          {ESS_PAYSLIPS.map((ps) => (
            <li key={ps.id} className="flex items-center justify-between gap-3 rounded-xl border border-input p-4">
              <div>
                <p className="font-semibold">{ps.period}</p>
                <p className="text-xs text-muted-foreground">Pay date {ps.payDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold tabular-nums">{ps.netPay}</p>
                <Button variant="outline" size="sm" className="mt-1 h-8 gap-1 text-xs" disabled>
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
    </EssPage>
  );
}
