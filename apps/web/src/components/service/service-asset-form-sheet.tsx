"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SERVICE_ASSET_CATEGORY_LABELS,
  type ServiceAsset,
  type ServiceAssetCategory,
  type ServiceAssetStatus,
} from "@/lib/mock-data/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const CUSTOMERS = [
  "GreenMart Superstores",
  "Metro Retail Ltd",
  "TechZone BD",
  "Apex Motors",
  "Digital Hive Agency",
  "BRAC IT Services",
];

const CATEGORIES = Object.keys(SERVICE_ASSET_CATEGORY_LABELS) as ServiceAssetCategory[];

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (asset: ServiceAsset, mode: "create" | "edit") => void;
  editAsset?: ServiceAsset | null;
  existingTags: string[];
  nextTag: string;
};

export function ServiceAssetFormSheet({
  open,
  onClose,
  onSave,
  editAsset,
  existingTags,
  nextTag,
}: Props) {
  const isEdit = !!editAsset;

  const [assetTag, setAssetTag] = useState("");
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [category, setCategory] = useState<ServiceAssetCategory>("laptop");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<ServiceAssetStatus>("active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editAsset) {
      setAssetTag(editAsset.assetTag);
      setName(editAsset.name);
      setCustomer(editAsset.customer);
      setCategory(editAsset.category);
      setBrand(editAsset.brand);
      setModel(editAsset.model);
      setSerialNumber(editAsset.serialNumber ?? "");
      setWarrantyEndDate(editAsset.warrantyEndDate ?? "");
      setLocation(editAsset.location);
      setStatus(editAsset.status);
      setNotes("");
    } else {
      setAssetTag(nextTag);
      setName("");
      setCustomer(CUSTOMERS[0]);
      setCategory("laptop");
      setBrand("");
      setModel("");
      setSerialNumber("");
      setWarrantyEndDate("");
      setLocation("");
      setStatus("active");
      setNotes("");
    }
  }, [open, editAsset, nextTag]);

  const handleSave = () => {
    if (!name.trim() || !brand.trim()) {
      toast.error("Asset name and brand are required");
      return;
    }
    if (existingTags.includes(assetTag.trim()) && assetTag.trim() !== editAsset?.assetTag) {
      toast.error("Asset tag already exists");
      return;
    }

    const asset: ServiceAsset = {
      id: editAsset?.id ?? `ast-${Date.now()}`,
      assetTag: assetTag.trim(),
      name: name.trim(),
      customer,
      contactId: editAsset?.contactId ?? `ct-${Date.now()}`,
      category,
      brand: brand.trim(),
      model: model.trim() || "—",
      serialNumber: serialNumber.trim() || undefined,
      warrantyEndDate: warrantyEndDate || undefined,
      location: location.trim() || "—",
      status,
      registeredAt: editAsset?.registeredAt ?? new Date().toISOString().slice(0, 10),
    };

    onSave(asset, isEdit ? "edit" : "create");
    toast.success(isEdit ? "Asset updated" : "Asset registered");
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
            <h2 className="font-semibold">{isEdit ? "Edit Asset" : "Register Asset"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Customer-owned equipment tracked for service history and AMC
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Asset tag</label>
                <Input value={assetTag} onChange={(e) => setAssetTag(e.target.value)} className="mt-1 h-8 font-mono text-xs" disabled={isEdit} />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as ServiceAssetStatus)} className="mt-1 h-8 w-full text-xs">
                  <option value="active">Active</option>
                  <option value="in_repair">In Repair</option>
                  <option value="retired">Retired</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Asset name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dell Latitude 5520" className="mt-1 h-8 text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Customer</label>
                <Select value={customer} onChange={(e) => setCustomer(e.target.value)} className="mt-1 h-8 w-full text-xs">
                  {CUSTOMERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Category</label>
                <Select value={category} onChange={(e) => setCategory(e.target.value as ServiceAssetCategory)} className="mt-1 h-8 w-full text-xs">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{SERVICE_ASSET_CATEGORY_LABELS[c]}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Brand</label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Model</label>
                <Input value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Serial number</label>
                <Input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="mt-1 h-8 font-mono text-xs" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Warranty end</label>
                <Input type="date" value={warrantyEndDate} onChange={(e) => setWarrantyEndDate(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Location / site</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>

            {!isEdit && (
              <div>
                <label className="text-[11px] text-muted-foreground">Notes (optional)</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 text-xs" />
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSave}>
              {isEdit ? "Save changes" : "Register asset"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
