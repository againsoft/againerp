"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DocumentBuilderLayout } from "@/components/shared/document-builder";
import { QuotationBuilderContextPanel } from "@/components/sales-marketing/quotations/quotation-builder-context-panel";
import {
  quotationFormSchema,
  type QuotationFormValues,
} from "@/components/sales-marketing/quotations/quotation-schema";
import { EnterpriseStatusBadge } from "@/components/enterprise/badges/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  QUOTATION_STATUS_LABELS,
  QUOTATION_UOM_OPTIONS,
  SMW_QUO_CATALOG_PRODUCTS,
  computeQuotationTotals,
  emptyQuotation,
  emptyQuotationLine,
  formatQuoCurrency,
  getQuotationById,
  lineTotal,
  quotationFromOpportunity,
  quotationStatusToEnterprise,
  type SmwQuotation,
} from "@/lib/mock-data/smw-quotations";
import { getOpportunityById } from "@/lib/mock-data/smw-opportunities";
import { useSmwQuotationStore } from "@/lib/store/smw-quotation-store";

type Props = {
  editId?: string | null;
  opportunityId?: string | null;
};

function toFormValues(quo: SmwQuotation): QuotationFormValues {
  return {
    accountName: quo.accountName,
    opportunityId: quo.opportunityId,
    opportunityTitle: quo.opportunityTitle,
    validUntil: quo.validUntil,
    documentDiscountPct: quo.documentDiscountPct,
    taxPct: quo.taxPct,
    terms: quo.terms,
    notes: quo.notes,
    lines: quo.lines,
  };
}

export function QuotationBuilder({ editId, opportunityId }: Props) {
  const router = useRouter();
  const upsertQuotation = useSmwQuotationStore((s) => s.upsertQuotation);
  const storeQuotes = useSmwQuotationStore((s) => s.quotations);
  const [previewMode, setPreviewMode] = useState<"document" | "email">("document");
  const [savedMeta, setSavedMeta] = useState<{ id: string; number: string; status: SmwQuotation["status"] } | null>(null);

  const existing = useMemo(() => {
    if (!editId) return null;
    return storeQuotes.find((q) => q.id === editId) ?? getQuotationById(editId) ?? null;
  }, [editId, storeQuotes]);

  const initialQuotation = useMemo(() => {
    if (existing) return existing;
    if (opportunityId) {
      const opp = getOpportunityById(opportunityId);
      if (opp) return quotationFromOpportunity(opp);
    }
    return emptyQuotation();
  }, [existing, opportunityId]);

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: toFormValues(initialQuotation),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "lines" });

  useEffect(() => {
    form.reset(toFormValues(initialQuotation));
    if (existing) {
      setSavedMeta({ id: existing.id, number: existing.quotationNumber, status: existing.status });
    }
  }, [initialQuotation, existing, form]);

  const watched = form.watch();
  const totals = computeQuotationTotals({
    lines: watched.lines ?? [],
    documentDiscountPct: watched.documentDiscountPct ?? 0,
    taxPct: watched.taxPct ?? 15,
  });
  const needsApproval = (watched.documentDiscountPct ?? 0) > 10 || totals.grandTotal > 500000;

  const persistQuotation = (values: QuotationFormValues, nextStatus: SmwQuotation["status"]) => {
    const id = savedMeta?.id ?? initialQuotation.id;
    const saved: SmwQuotation = {
      ...initialQuotation,
      id,
      quotationNumber: savedMeta?.number ?? initialQuotation.quotationNumber,
      accountName: values.accountName,
      opportunityId: values.opportunityId,
      opportunityTitle: values.opportunityTitle,
      validUntil: values.validUntil,
      documentDiscountPct: values.documentDiscountPct,
      taxPct: values.taxPct,
      terms: values.terms,
      notes: values.notes,
      lines: values.lines,
      status: nextStatus,
      ownerId: initialQuotation.ownerId,
      ownerName: initialQuotation.ownerName,
    };
    upsertQuotation(saved);
    setSavedMeta({ id: saved.id, number: saved.quotationNumber, status: saved.status });
    return saved;
  };

  const saveDraft = form.handleSubmit((values) => {
    persistQuotation(values, "draft");
    toast.success("Draft saved");
  });

  const submitForApproval = form.handleSubmit((values) => {
    const nextStatus = needsApproval ? "pending_approval" : "sent";
    const saved = persistQuotation(values, nextStatus);
    toast.success(needsApproval ? "Submitted for approval" : "Quotation sent");
    router.push(needsApproval ? "/inbox/approvals" : `/sales-marketing/quotations?view=${saved.id}`);
  });

  const addProduct = (product: (typeof SMW_QUO_CATALOG_PRODUCTS)[number]) => {
    append({
      ...emptyQuotationLine(),
      sku: product.sku,
      productId: product.id,
      description: product.name,
      unitPrice: product.unitPrice,
      uom: "License",
    });
  };

  const status = savedMeta?.status ?? initialQuotation.status;

  return (
    <DocumentBuilderLayout
      title={savedMeta?.number ?? "New quotation"}
      subtitle={`SCR-SMW-QUO-BLD · Valid until ${watched.validUntil}`}
      statusBadge={
        <EnterpriseStatusBadge
          status={quotationStatusToEnterprise(status)}
          label={QUOTATION_STATUS_LABELS[status]}
          size="sm"
        />
      }
      previewMode={previewMode}
      onPreviewModeChange={setPreviewMode}
      canvas={
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="mb-1 block font-medium">Account</span>
              <Input {...form.register("accountName")} className="h-9" />
              {form.formState.errors.accountName && (
                <span className="text-[10px] text-red-600">{form.formState.errors.accountName.message}</span>
              )}
            </label>
            <label className="block text-xs">
              <span className="mb-1 block font-medium">Valid until</span>
              <Input type="date" {...form.register("validUntil")} className="h-9" />
            </label>
          </div>

          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground">
                  <th className="px-2 py-2 font-medium">SKU</th>
                  <th className="px-2 py-2 font-medium">Description</th>
                  <th className="px-2 py-2 font-medium w-16">Qty</th>
                  <th className="px-2 py-2 font-medium w-20">UOM</th>
                  <th className="px-2 py-2 font-medium w-24">Unit</th>
                  <th className="px-2 py-2 font-medium w-16">Disc%</th>
                  <th className="px-2 py-2 font-medium w-24 text-right">Total</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  const line = watched.lines?.[index];
                  return (
                    <tr key={field.id} className="border-b border-border/50">
                      <td className="px-2 py-1.5">
                        <Input {...form.register(`lines.${index}.sku`)} className="h-8 font-mono text-[11px]" />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input {...form.register(`lines.${index}.description`)} className="h-8" />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input type="number" step="0.01" {...form.register(`lines.${index}.qty`, { valueAsNumber: true })} className="h-8" />
                      </td>
                      <td className="px-2 py-1.5">
                        <Select {...form.register(`lines.${index}.uom`)} className="h-8 w-full text-[11px]">
                          {QUOTATION_UOM_OPTIONS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-2 py-1.5">
                        <Input type="number" {...form.register(`lines.${index}.unitPrice`, { valueAsNumber: true })} className="h-8" />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input type="number" {...form.register(`lines.${index}.discountPct`, { valueAsNumber: true })} className="h-8" />
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums font-medium">
                        {line ? formatQuoCurrency(lineTotal(line)) : "—"}
                      </td>
                      <td className="px-1 py-1.5">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)} disabled={fields.length <= 1} aria-label="Remove line">
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => append(emptyQuotationLine())}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Add row
          </Button>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-input p-3 text-xs">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="text-lg font-semibold tabular-nums">{formatQuoCurrency(totals.subtotal)}</p>
            </div>
            <label className="rounded-md border border-input p-3 text-xs">
              <span className="text-muted-foreground">Doc discount %</span>
              <Input type="number" {...form.register("documentDiscountPct", { valueAsNumber: true })} className="mt-1 h-8" />
            </label>
            <label className="rounded-md border border-input p-3 text-xs">
              <span className="text-muted-foreground">Tax %</span>
              <Input type="number" {...form.register("taxPct", { valueAsNumber: true })} className="mt-1 h-8" />
            </label>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">
              <p className="text-muted-foreground">Grand total</p>
              <p className="text-lg font-semibold tabular-nums">{formatQuoCurrency(totals.grandTotal)}</p>
            </div>
          </div>

          <label className="block text-xs">
            <span className="mb-1 block font-medium">Terms</span>
            <Input {...form.register("terms")} className="h-9" />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium">Notes</span>
            <Input {...form.register("notes")} className="h-9" />
          </label>
        </div>
      }
      context={
        <QuotationBuilderContextPanel
          form={form}
          onAddProduct={addProduct}
          needsApproval={needsApproval}
          previewMode={previewMode}
        />
      }
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" className="h-9" asChild>
            <Link href="/sales-marketing/quotations">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Back to list
            </Link>
          </Button>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={saveDraft}>
              Save draft
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => toast.info("Send PDF — prototype")}>
              Send PDF
            </Button>
            <Button type="button" size="sm" className="h-9" onClick={submitForApproval}>
              {needsApproval ? "Submit for approval" : "Send to customer"}
            </Button>
          </div>
        </div>
      }
    />
  );
}
