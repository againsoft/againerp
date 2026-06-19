"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CrmLead } from "@/lib/mock-data/crm/types";
import {
  CRM_LEAD_SOURCE_LABELS,
  crmLeadInitials,
  crmScoreColor,
  formatCrmCurrency,
} from "@/lib/mock-data/crm/types";
import { CrmStatusBadge } from "@/components/crm/crm-status-badge";

type Props = {
  leads: CrmLead[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onView: (lead: CrmLead) => void;
};

export function CrmLeadTable({ leads, selectedIds, onToggleSelect, onToggleAll, onView }: Props) {
  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.has(l.id));

  return (
    <div data-component="DS-DATAGRID" className="hidden overflow-x-auto rounded-lg border md:block">
      <table className="w-full text-xs">
        <thead className="border-b bg-muted/30">
          <tr className="text-left text-muted-foreground">
            <th className="w-10 p-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleAll(e.target.checked)}
                aria-label="Select all"
                className="h-4 w-4 rounded border-input"
              />
            </th>
            <th className="p-2 font-medium">Name</th>
            <th className="p-2 font-medium">Company</th>
            <th className="p-2 font-medium">Email</th>
            <th className="p-2 font-medium">Source</th>
            <th className="p-2 font-medium">Status</th>
            <th className="p-2 font-medium">Score</th>
            <th className="p-2 font-medium">Owner</th>
            <th className="p-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/20">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(lead.id)}
                  onChange={() => onToggleSelect(lead.id)}
                  aria-label={`Select ${lead.name}`}
                  className="h-4 w-4 rounded border-input"
                />
              </td>
              <td className="p-2">
                <button
                  type="button"
                  className="flex items-center gap-2 font-medium text-primary hover:underline"
                  onClick={() => onView(lead)}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold"
                    aria-hidden
                  >
                    {crmLeadInitials(lead.name)}
                  </span>
                  {lead.name}
                </button>
              </td>
              <td className="p-2">{lead.company}</td>
              <td className="p-2 text-muted-foreground">{lead.email}</td>
              <td className="p-2">{CRM_LEAD_SOURCE_LABELS[lead.source]}</td>
              <td className="p-2">
                <CrmStatusBadge status={lead.status} />
              </td>
              <td className="p-2">
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium text-white", crmScoreColor(lead.score))}>
                  {lead.score}
                </span>
              </td>
              <td className="p-2">{lead.ownerName}</td>
              <td className="p-2 text-muted-foreground">{lead.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type MobileProps = {
  leads: CrmLead[];
  onView: (lead: CrmLead) => void;
};

/** DS-CARD-LIST mobile fallback. */
export function CrmLeadMobileList({ leads, onView }: MobileProps) {
  return (
    <div data-component="DS-CARD-LIST" className="space-y-2 md:hidden">
      {leads.map((lead) => (
        <button
          key={lead.id}
          type="button"
          className="w-full rounded-lg border bg-card p-3 text-left"
          onClick={() => onView(lead)}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{lead.name}</p>
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            </div>
            <CrmStatusBadge status={lead.status} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{lead.ownerName}</span>
            <span>{formatCrmCurrency(lead.expectedValue)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function CrmEmptyLeads({ onCreate }: { onCreate: () => void }) {
  return (
    <div data-component="DS-EMPTY-FIRST" className="rounded-lg border border-dashed p-8 text-center">
      <p className="text-sm font-medium">No leads yet</p>
      <p className="mt-1 text-xs text-muted-foreground">Create your first lead or import from CSV.</p>
      <button type="button" className="mt-4 text-sm text-primary hover:underline" onClick={onCreate}>
        Create Lead
      </button>
    </div>
  );
}

export function CrmPipelineLink() {
  return (
    <Link href="/crm/pipeline" className="text-xs text-primary hover:underline">
      Open Pipeline →
    </Link>
  );
}
