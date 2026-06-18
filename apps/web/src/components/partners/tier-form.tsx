"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  PRICE_LIST_OPTIONS,
  TIER_TYPE_LABELS,
  type PartnerTierDefinition,
  type TierType,
} from "@/lib/mock-data/business-partner-tiers";
import {
  buildTierDraft,
  useBusinessPartnerTierStore,
} from "@/lib/store/business-partner-tier-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const TIER_TYPES = Object.keys(TIER_TYPE_LABELS) as TierType[];

type Props = {
  mode?: "create" | "edit";
  initialTier?: PartnerTierDefinition | null;
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: (tier: PartnerTierDefinition) => void;
};

export function TierForm({
  mode = "create",
  initialTier,
  inDialog,
  onClose,
  onSaved,
}: Props) {
  const addTier = useBusinessPartnerTierStore((s) => s.addTier);
  const patchTier = useBusinessPartnerTierStore((s) => s.patchTier);

  const [code, setCode] = useState(initialTier?.code ?? "");
  const [name, setName] = useState(initialTier?.name ?? "");
  const [tierType, setTierType] = useState<TierType>(initialTier?.tierType ?? "wholesale");
  const [discountPercent, setDiscountPercent] = useState(
    String(initialTier?.discountPercent ?? 0),
  );
  const [priceListId, setPriceListId] = useState(
    initialTier?.priceListId ?? PRICE_LIST_OPTIONS[0].id,
  );
  const [description, setDescription] = useState(initialTier?.description ?? "");
  const [active, setActive] = useState(initialTier?.active ?? true);

  useEffect(() => {
    if (!initialTier) return;
    setCode(initialTier.code);
    setName(initialTier.name);
    setTierType(initialTier.tierType);
    setDiscountPercent(String(initialTier.discountPercent));
    setPriceListId(initialTier.priceListId);
    setDescription(initialTier.description ?? "");
    setActive(initialTier.active);
  }, [initialTier]);

  const save = useCallback(() => {
    if (!code.trim()) {
      toast.error("Tier code is required");
      return;
    }
    if (!name.trim()) {
      toast.error("Tier name is required");
      return;
    }

    const discount = Number(discountPercent);
    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }

    const priceList = PRICE_LIST_OPTIONS.find((p) => p.id === priceListId) ?? PRICE_LIST_OPTIONS[0];

    if (mode === "edit" && initialTier) {
      patchTier(initialTier.id, {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        tierType,
        discountPercent: discount,
        priceListId: priceList.id,
        priceListName: priceList.name,
        description: description.trim() || undefined,
        active,
      });
      onSaved?.({
        ...initialTier,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        tierType,
        discountPercent: discount,
        priceListId: priceList.id,
        priceListName: priceList.name,
        description: description.trim() || undefined,
        active,
      });
      return;
    }

    const tier = buildTierDraft({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      tierType,
      discountPercent: discount,
      priceListId: priceList.id,
      priceListName: priceList.name,
      description: description.trim() || undefined,
      active,
    });
    addTier(tier);
    onSaved?.(tier);
  }, [
    active,
    addTier,
    code,
    description,
    discountPercent,
    initialTier,
    mode,
    name,
    onSaved,
    patchTier,
    priceListId,
    tierType,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <h2 className="text-base font-semibold">
          {mode === "create" ? "New price tier" : `Edit ${initialTier?.code}`}
        </h2>
        {inDialog && onClose && (
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="tier-code">Code</Label>
            <Input
              id="tier-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="WHOLESALE-A"
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tier-name">Name</Label>
            <Input
              id="tier-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Wholesale Tier A"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="tier-type">Tier type</Label>
            <Select
              id="tier-type"
              value={tierType}
              onChange={(e) => setTierType(e.target.value as TierType)}
            >
              {TIER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TIER_TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="tier-discount">Default discount %</Label>
            <Input
              id="tier-discount"
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="tier-pricelist">Price list</Label>
          <Select
            id="tier-pricelist"
            value={priceListId}
            onChange={(e) => setPriceListId(e.target.value)}
          >
            {PRICE_LIST_OPTIONS.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name}
              </option>
            ))}
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Links to Product Master price list (prototype stub).
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="tier-desc">Description</Label>
          <Textarea
            id="tier-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional notes for sales team…"
          />
        </div>

        <Switch
          label="Active"
          description="Inactive tiers cannot be assigned to new partners."
          checked={active}
          onCheckedChange={setActive}
        />
      </div>

      <div className="flex shrink-0 gap-2 border-t border-input pt-3">
        <Button size="sm" className="h-8 text-xs" onClick={save}>
          {mode === "create" ? "Create tier" : "Save changes"}
        </Button>
        {onClose && (
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
