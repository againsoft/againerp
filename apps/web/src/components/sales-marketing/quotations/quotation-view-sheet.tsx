"use client";

import Link from "next/link";
import type { SmwQuotation } from "@/lib/mock-data/smw-quotations";
import {
  QUOTATION_STATUS_LABELS,
  computeQuotationTotals,
  formatQuoCurrency,
  quotationStatusToEnterprise,
} from "@/lib/mock-data/smw-quotations";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowRight, FileDown, Pencil, Send } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: SmwQuotation | null;
};

export function QuotationViewSheet({ open, onOpenChange, quotation }: Props) {
  if (!quotation) return null;

  const totals = computeQuotationTotals(quotation);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">{quotation.quotationNumber}</p>
            <h2 className="text-lg font-semibold">{quotation.accountName}</h2>
            <p className="text-xs text-muted-foreground">v{quotation.version} · Valid until {quotation.validUntil}</p>
          </div>
          <EnterpriseStatusBadge
            status={quotationStatusToEnterprise(quotation.status)}
            label={QUOTATION_STATUS_LABELS[quotation.status]}
          />
          {quotation.opportunityId && (
            <Link href={`/sales-marketing/opportunities/${quotation.opportunityId}`} className="text-xs font-medium text-primary hover:underline">
              {quotation.opportunityTitle} →
            </Link>
          )}
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div><dt className="text-muted-foreground">Subtotal</dt><dd className="font-medium tabular-nums">{formatQuoCurrency(totals.subtotal)}</dd></div>
            <div><dt className="text-muted-foreground">Grand total</dt><dd className="font-semibold tabular-nums">{formatQuoCurrency(totals.grandTotal)}</dd></div>
            <div><dt className="text-muted-foreground">Owner</dt><dd>{quotation.ownerName}</dd></div>
            <div><dt className="text-muted-foreground">Lines</dt><dd>{quotation.lines.length}</dd></div>
          </dl>
          <ul className="space-y-2 border-t pt-3">
            {quotation.lines.map((line) => (
              <li key={line.id} className="text-xs">
                <span className="font-medium">{line.description}</span>
                <span className="ml-2 tabular-nums text-muted-foreground">×{line.qty}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="button" variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/sales-marketing/quotations/create?edit=${quotation.id}`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Open builder
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.success("Send — prototype")}>
              <Send className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Send
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.info("PDF — prototype")}>
              <FileDown className="mr-1.5 h-3.5 w-3.5" aria-hidden /> PDF
            </Button>
          </div>
          {quotation.status === "pending_approval" && (
            <Button type="button" variant="secondary" size="sm" className="h-9 w-full" asChild>
              <Link href="/inbox/approvals">
                View in approval center <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
