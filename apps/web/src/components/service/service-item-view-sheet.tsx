"use client";

import { Edit2, X } from "lucide-react";
import {
  formatBdt,
  getServiceCategoryName,
  SERVICE_BILLING_LABELS,
  SERVICE_ITEM_STATUS_LABELS,
  type ServiceItem,
} from "@/lib/mock-data/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  item: ServiceItem | null;
  onClose: () => void;
  onEdit: (item: ServiceItem) => void;
};

export function ServiceItemViewSheet({ open, item, onClose, onEdit }: Props) {
  if (!item) return null;

  const margin = item.salePrice > 0 ? Math.round(((item.salePrice - item.costPrice) / item.salePrice) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4">
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <Badge variant={item.status === "active" ? "success" : "muted"} className="text-[10px]">
                  {SERVICE_ITEM_STATUS_LABELS[item.status]}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {SERVICE_BILLING_LABELS[item.billingType]}
                </Badge>
                <span className="font-mono text-[10px] text-muted-foreground">{item.code}</span>
              </div>
              <h2 className="text-base font-semibold leading-snug">{item.name}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{getServiceCategoryName(item.categoryId)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2.5 text-xs"
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
              <button type="button" className="rounded-md p-1 hover:bg-accent" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 px-4 py-4 text-xs">
            {item.description && (
              <section>
                <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </section>
            )}

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Sale price</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums">{formatBdt(item.salePrice)}</p>
              </div>
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Cost price</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums">{formatBdt(item.costPrice)}</p>
              </div>
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Margin</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums">{margin}%</p>
              </div>
              <div className="rounded-lg border border-input p-3">
                <p className="text-muted-foreground">Tax group</p>
                <p className="mt-0.5 text-sm font-semibold">{item.taxGroup}</p>
              </div>
            </section>

            {(item.hourlyRate != null || item.durationMinutes != null) && (
              <section className="grid grid-cols-2 gap-3">
                {item.hourlyRate != null && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Hourly rate</p>
                    <p className="mt-0.5 font-semibold tabular-nums">{formatBdt(item.hourlyRate)}</p>
                  </div>
                )}
                {item.durationMinutes != null && (
                  <div className="rounded-lg border border-input p-3">
                    <p className="text-muted-foreground">Duration</p>
                    <p className="mt-0.5 font-semibold tabular-nums">{item.durationMinutes} min</p>
                  </div>
                )}
              </section>
            )}

            {item.skillTags.length > 0 && (
              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1">
                  {item.skillTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <p className="text-[10px] text-muted-foreground">Last updated {item.updatedAt}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
