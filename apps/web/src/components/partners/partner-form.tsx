"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  PARTNER_ROLE_LABELS,
  PARTNER_STATUS_LABELS,
  buildPartnerDraft,
  type BusinessPartner,
  type PartnerRole,
  type PartnerStatus,
} from "@/lib/mock-data/business-partners";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ROLES = Object.keys(PARTNER_ROLE_LABELS) as PartnerRole[];
const STATUSES = Object.keys(PARTNER_STATUS_LABELS) as PartnerStatus[];

type Props = {
  mode?: "create" | "edit";
  initialPartner?: BusinessPartner | null;
  inDialog?: boolean;
  onClose?: () => void;
  onSaved?: (partner: BusinessPartner) => void;
};

export function PartnerForm({
  mode = "create",
  initialPartner,
  inDialog,
  onClose,
  onSaved,
}: Props) {
  const addPartner = useBusinessPartnerStore((s) => s.addPartner);
  const patchPartner = useBusinessPartnerStore((s) => s.patchPartner);

  const [name, setName] = useState(initialPartner?.name ?? "");
  const [email, setEmail] = useState(initialPartner?.email ?? "");
  const [phone, setPhone] = useState(initialPartner?.phone ?? "");
  const [country, setCountry] = useState(initialPartner?.country ?? "Bangladesh");
  const [territory, setTerritory] = useState(initialPartner?.territory ?? "Dhaka");
  const [primaryRole, setPrimaryRole] = useState<PartnerRole>(
    initialPartner?.primaryRole ?? "vendor",
  );
  const [status, setStatus] = useState<PartnerStatus>(initialPartner?.status ?? "draft");
  const [assignedTo, setAssignedTo] = useState(initialPartner?.assignedTo ?? "");
  const [notes, setNotes] = useState(initialPartner?.notes ?? "");

  useEffect(() => {
    if (!initialPartner) return;
    setName(initialPartner.name);
    setEmail(initialPartner.email);
    setPhone(initialPartner.phone);
    setCountry(initialPartner.country);
    setTerritory(initialPartner.territory);
    setPrimaryRole(initialPartner.primaryRole);
    setStatus(initialPartner.status);
    setAssignedTo(initialPartner.assignedTo ?? "");
    setNotes(initialPartner.notes ?? "");
  }, [initialPartner]);

  const save = useCallback(() => {
    if (!name.trim()) {
      toast.error("Partner name is required");
      return;
    }

    if (mode === "edit" && initialPartner) {
      const roles = initialPartner.roles.includes(primaryRole)
        ? initialPartner.roles
        : [...initialPartner.roles, primaryRole];
      patchPartner(initialPartner.id, {
        name: name.trim(),
        email,
        phone,
        country,
        territory,
        primaryRole,
        roles,
        status,
        assignedTo: assignedTo || undefined,
        notes: notes || undefined,
      });
      toast.success("Partner updated");
      onSaved?.({ ...initialPartner, name: name.trim() });
      return;
    }

    const partner = buildPartnerDraft({
      name: name.trim(),
      email,
      phone,
      country,
      territory,
      primaryRole,
      roles: [primaryRole],
      status: status === "draft" ? "active" : status,
      assignedTo: assignedTo || undefined,
      notes: notes || undefined,
      terms: [
        {
          role: primaryRole,
          paymentTerms: "Net 30",
          paymentTermsDays: 30,
          currencyCode: "BDT",
        },
      ],
    });
    addPartner(partner);
    toast.success("Partner created");
    onSaved?.(partner);
  }, [
    addPartner,
    assignedTo,
    country,
    email,
    initialPartner,
    mode,
    name,
    notes,
    onSaved,
    patchPartner,
    phone,
    primaryRole,
    status,
    territory,
  ]);

  return (
    <div className={inDialog ? "flex h-full min-h-0 flex-col" : "space-y-4"}>
      <div className="flex shrink-0 items-center justify-between border-b border-input pb-3">
        <h2 className="text-base font-semibold">
          {mode === "create" ? "New business partner" : "Edit partner"}
        </h2>
        {onClose && (
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-1">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bp-name">Organization / name *</Label>
            <Input id="bp-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bp-email">Email</Label>
            <Input id="bp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bp-phone">Phone</Label>
            <Input id="bp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bp-country">Country</Label>
            <Input id="bp-country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bp-territory">Territory</Label>
            <Input id="bp-territory" value={territory} onChange={(e) => setTerritory(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bp-role">Primary role</Label>
            <Select
              id="bp-role"
              value={primaryRole}
              onChange={(e) => setPrimaryRole(e.target.value as PartnerRole)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {PARTNER_ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bp-status">Status</Label>
            <Select
              id="bp-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PartnerStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PARTNER_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bp-assigned">Assigned to</Label>
            <Input
              id="bp-assigned"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Account manager"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bp-notes">Notes</Label>
            <Textarea id="bp-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-input pt-3">
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button size="sm" onClick={save}>
          {mode === "create" ? "Create partner" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
