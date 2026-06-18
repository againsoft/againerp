import { z } from "zod";

export const quotationLineSchema = z.object({
  id: z.string(),
  sku: z.string(),
  productId: z.string().optional(),
  description: z.string().min(1, "Description required"),
  qty: z.number().min(0.01, "Qty must be greater than 0"),
  uom: z.string().min(1),
  unitPrice: z.number().min(0),
  discountPct: z.number().min(0).max(25, "Max 25% line discount"),
});

export const quotationFormSchema = z.object({
  accountName: z.string().min(1, "Account is required"),
  opportunityId: z.string().optional(),
  opportunityTitle: z.string().optional(),
  validUntil: z.string().min(1),
  documentDiscountPct: z.number().min(0).max(20, "Max 20% document discount"),
  taxPct: z.number().min(0).max(100),
  terms: z.string(),
  notes: z.string(),
  lines: z.array(quotationLineSchema).min(1, "At least one line item required"),
});

export type QuotationFormValues = z.infer<typeof quotationFormSchema>;
