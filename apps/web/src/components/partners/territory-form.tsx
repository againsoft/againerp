"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  PARTNER_ROLE_LABELS,
  businessPartnersSeed,
  type PartnerRole,
} from "@/lib/mock-data/business-partners";
import {
  buildTerritoryFromPartnerInput,
  useBusinessPartnerTerritoryStore,
} from "@/lib/store/business-partner-territory-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const ROLES = Object.keys(PARTNER_ROLE_LABELS) as PartnerRole[];

type Props = {
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
};

export function TerritoryForm({ inDialog, onClose, onSaved }: Props) {
  const addTerritory = useBusinessPartnerTerritoryStore((s) => s.addTerritory);
  const [partnerId, setPartnerId] = useState(businessPartnersSeed[0]?.id ?? "");
  const [role, setRole] = useState<PartnerRole>("wholesaler");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [isExclusive, setIsExclusive] = useState(false);
  const [notes, setNotes] = useState("");

  const selected = businessPartnersSeed.find((p) => p.id === partnerId);

  useEffect(() => {
    if (selected) setRegion(selected.territory);
  }, [selected]);

  const save = useCallback(() => {
    const row = buildTerritoryFromPartnerInput({
      partnerId,
      role,
      region,
      district,
      country: selected?.country,
      isExclusive,
      notes: notes.trim() || undefined,
    });
    if (!row) return;
    addTerritory(row);
    onSaved?.();
  }, [addTerritory, district, isExclusive, notes, onSaved, partnerId, region, role, selected?.country]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <h2 className="text-base font-semibold">Assign territory</h2>
        {inDialog && onClose && (
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3 text-xs">
        <div className="space-y-1">
          <Label htmlFor="terr-partner">Partner</Label>
          <Select id="terr-partner" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
            {businessPartnersSeed.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.partnerCode}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="terr-role">Role context</Label>
            <Select id="terr-role" value={role} onChange={(e) => setRole(e.target.value as PartnerRole)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {PARTNER_ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="terr-region">Region *</Label>
            <Input id="terr-region" value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="terr-district">District</Label>
          <Input id="terr-district" value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>

        <Switch
          label="Exclusive territory"
          description="No other partner may sell in this region for this role."
          checked={isExclusive}
          onCheckedChange={setIsExclusive}
        />

        <div className="space-y-1">
          <Label htmlFor="terr-notes">Notes</Label>
          <Textarea id="terr-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
      </div>

      <div className="flex shrink-0 gap-2 border-t border-input pt-3">
        <Button size="sm" className="h-8 text-xs" onClick={save}>
          Save assignment
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
