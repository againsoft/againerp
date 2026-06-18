"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { QuotationFormValues } from "@/components/sales-marketing/quotations/quotation-schema";
import { SMW_QUO_CATALOG_PRODUCTS } from "@/lib/mock-data/smw-quotations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Props = {
  form: UseFormReturn<QuotationFormValues>;
  onAddProduct: (product: (typeof SMW_QUO_CATALOG_PRODUCTS)[number]) => void;
  needsApproval: boolean;
  previewMode: "document" | "email";
};

export function QuotationBuilderContextPanel({ form, onAddProduct, needsApproval, previewMode }: Props) {
  const opportunityId = form.watch("opportunityId");
  const opportunityTitle = form.watch("opportunityTitle");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</h2>
        <p className="mt-1 text-sm font-medium">{form.watch("accountName") || "—"}</p>
      </div>

      {opportunityId && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Opportunity</h2>
          <Link href={`/sales-marketing/opportunities/${opportunityId}`} className="mt-1 block text-xs font-medium text-primary hover:underline">
            {opportunityTitle ?? opportunityId} →
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product search</h2>
        <ul className="mt-2 space-y-1">
          {SMW_QUO_CATALOG_PRODUCTS.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted/60"
                onClick={() => onAddProduct(product)}
              >
                <span>
                  <span className="font-mono text-[10px] text-muted-foreground">{product.sku}</span>
                  <span className="ml-1">{product.name}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">৳{(product.unitPrice / 1000).toFixed(0)}K</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
          <h2 className="text-xs font-semibold">AI suggest lines</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Based on similar {form.watch("accountName") || "deals"}, add implementation + training lines.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 h-7 text-xs"
          onClick={() => onAddProduct(SMW_QUO_CATALOG_PRODUCTS[2]!)}
        >
          Add suggested line
        </Button>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approval</h2>
        {needsApproval ? (
          <Badge variant="secondary" className="mt-1 text-[10px]">Discount threshold — submit for approval</Badge>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Within policy — ready to send</p>
        )}
        {needsApproval && (
          <Link href="/inbox/approvals" className="mt-2 block text-xs font-medium text-primary hover:underline">
            Open approval center →
          </Link>
        )}
      </div>

      {previewMode === "email" && (
        <div className="rounded-md border border-dashed border-input p-3 text-xs text-muted-foreground">
          Email preview: Dear customer, please find attached quotation valid until {form.watch("validUntil")}.
        </div>
      )}
    </div>
  );
}
