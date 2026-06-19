"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { CrmLead, CrmLeadSource, CrmLeadStatus } from "@/lib/mock-data/crm/types";
import {
  CRM_LEAD_SOURCE_LABELS,
  CRM_LEAD_STATUSES,
  CRM_LEAD_STATUS_LABELS,
  CRM_OWNERS,
} from "@/lib/mock-data/crm/types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  lead?: CrmLead | null;
};

export function CrmLeadFormSheet({ open, onOpenChange, mode, lead }: Props) {
  const title = mode === "create" ? "Create Lead" : "Edit Lead";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "create" ? "Lead created (prototype)" : "Lead updated (prototype)");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <Field label="Name" defaultValue={lead?.name} required />
          <Field label="Company" defaultValue={lead?.company} required />
          <Field label="Email" type="email" defaultValue={lead?.email} />
          <Field label="Phone" defaultValue={lead?.phone} />
          <div>
            <label className="text-xs font-medium">Source</label>
            <Select defaultValue={lead?.source ?? "website"} className="mt-1 h-9 w-full">
              {(Object.keys(CRM_LEAD_SOURCE_LABELS) as CrmLeadSource[]).map((s) => (
                <option key={s} value={s}>
                  {CRM_LEAD_SOURCE_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          {mode === "edit" ? (
            <div>
              <label className="text-xs font-medium">Status</label>
              <Select defaultValue={lead?.status ?? "new"} className="mt-1 h-9 w-full">
                {CRM_LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {CRM_LEAD_STATUS_LABELS[s as CrmLeadStatus]}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
          <div>
            <label className="text-xs font-medium">Owner</label>
            <Select defaultValue={lead?.ownerId ?? "karim"} className="mt-1 h-9 w-full">
              {CRM_OWNERS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm">
              {mode === "create" ? "Create" : "Save"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium">
        {label}
        {required ? " *" : ""}
      </label>
      <Input type={type} defaultValue={defaultValue} required={required} className="mt-1 h-9" />
    </div>
  );
}
