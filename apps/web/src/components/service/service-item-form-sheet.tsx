"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SERVICE_BILLING_LABELS,
  serviceCategoriesSeed,
  type ServiceBillingType,
  type ServiceItem,
  type ServiceItemStatus,
} from "@/lib/mock-data/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: ServiceItem, mode: "create" | "edit") => void;
  editItem?: ServiceItem | null;
  existingCodes: string[];
};

const BILLING_TYPES: ServiceBillingType[] = ["fixed", "hourly", "project", "contract", "subscription"];

export function ServiceItemFormSheet({ open, onClose, onSave, editItem, existingCodes }: Props) {
  const isEdit = !!editItem;

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(serviceCategoriesSeed[0].id);
  const [description, setDescription] = useState("");
  const [billingType, setBillingType] = useState<ServiceBillingType>("fixed");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [taxGroup, setTaxGroup] = useState("VAT 15%");
  const [status, setStatus] = useState<ServiceItemStatus>("active");

  useEffect(() => {
    if (!open) return;
    if (editItem) {
      setCode(editItem.code);
      setName(editItem.name);
      setCategoryId(editItem.categoryId);
      setDescription(editItem.description);
      setBillingType(editItem.billingType);
      setCostPrice(String(editItem.costPrice));
      setSalePrice(String(editItem.salePrice));
      setHourlyRate(editItem.hourlyRate != null ? String(editItem.hourlyRate) : "");
      setDurationMinutes(editItem.durationMinutes != null ? String(editItem.durationMinutes) : "");
      setTaxGroup(editItem.taxGroup);
      setStatus(editItem.status);
    } else {
      setCode("");
      setName("");
      setCategoryId(serviceCategoriesSeed[0].id);
      setDescription("");
      setBillingType("fixed");
      setCostPrice("");
      setSalePrice("");
      setHourlyRate("");
      setDurationMinutes("60");
      setTaxGroup("VAT 15%");
      setStatus("active");
    }
  }, [open, editItem]);

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Service code and name are required");
      return;
    }
    if (existingCodes.includes(code.trim()) && code.trim() !== editItem?.code) {
      toast.error("Service code already exists");
      return;
    }
    const cost = Number(costPrice) || 0;
    const sale = Number(salePrice) || 0;
    if (sale <= 0) {
      toast.error("Sale price must be greater than zero");
      return;
    }

    const item: ServiceItem = {
      id: editItem?.id ?? `svc-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      categoryId,
      description: description.trim(),
      billingType,
      costPrice: cost,
      salePrice: sale,
      hourlyRate: billingType === "hourly" ? Number(hourlyRate) || sale : undefined,
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      taxGroup: taxGroup.trim() || "VAT 15%",
      skillTags: editItem?.skillTags ?? [],
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    onSave(item, isEdit ? "edit" : "create");
    toast.success(isEdit ? "Service updated" : "Service created");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="shrink-0 border-b border-border pb-4">
            <h2 className="font-semibold">{isEdit ? "Edit Service" : "Add Service"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Catalog item for quotes, orders, and mixed product + service billing
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Service code</label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SVC-WIN-INSTALL"
                  className="mt-1 h-8 font-mono text-xs"
                  disabled={isEdit}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as ServiceItemStatus)} className="mt-1 h-8 w-full text-xs">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Service name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Category</label>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 h-8 w-full text-xs">
                {serviceCategoriesSeed.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Billing type</label>
                <Select
                  value={billingType}
                  onChange={(e) => setBillingType(e.target.value as ServiceBillingType)}
                  className="mt-1 h-8 w-full text-xs"
                >
                  {BILLING_TYPES.map((t) => (
                    <option key={t} value={t}>{SERVICE_BILLING_LABELS[t]}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Tax group</label>
                <Input value={taxGroup} onChange={(e) => setTaxGroup(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Cost price (৳)</label>
                <Input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="mt-1 h-8 text-xs tabular-nums" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Sale price (৳)</label>
                <Input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="mt-1 h-8 text-xs tabular-nums" />
              </div>
            </div>

            {billingType === "hourly" && (
              <div>
                <label className="text-[11px] text-muted-foreground">Hourly rate (৳)</label>
                <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="mt-1 h-8 text-xs tabular-nums" />
              </div>
            )}

            {(billingType === "fixed" || billingType === "contract") && (
              <div>
                <label className="text-[11px] text-muted-foreground">Default duration (minutes)</label>
                <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className="mt-1 h-8 text-xs tabular-nums" />
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSave}>
              {isEdit ? "Save changes" : "Create service"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
