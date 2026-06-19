"use client";

import type { CrmLead, CrmLeadDetailTab } from "@/lib/mock-data/crm/types";
import {
  CRM_LEAD_DETAIL_TABS,
  CRM_LEAD_SOURCE_LABELS,
  crmScoreColor,
  formatCrmCurrency,
} from "@/lib/mock-data/crm/types";
import {
  crmLeadActivities,
  crmLeadHistory,
  crmLeadNotes,
} from "@/lib/mock-data/crm/activities";
import { ActivityWidget } from "@/components/dashboard/widgets/activity-widget";
import { CrmStatusBadge } from "@/components/crm/crm-status-badge";
import { cn } from "@/lib/utils";

type Props = {
  lead: CrmLead;
  tab: CrmLeadDetailTab;
};

export function CrmLeadTabContent({ lead, tab }: Props) {
  switch (tab) {
    case "overview":
      return (
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone || "—"} />
          <Field label="Company" value={lead.company} />
          <Field label="Title" value={lead.title || "—"} />
          <Field label="Source" value={CRM_LEAD_SOURCE_LABELS[lead.source]} />
          <Field label="Owner" value={lead.ownerName} />
          <Field label="Expected value" value={formatCrmCurrency(lead.expectedValue)} />
          <Field label="Last activity" value={lead.lastActivityRelative} />
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Lead score</dt>
            <dd className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", crmScoreColor(lead.score))} style={{ width: `${lead.score}%` }} />
              </div>
              <span className="text-sm font-semibold">{lead.score}</span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <CrmStatusBadge status={lead.status} />
            </dd>
          </div>
        </dl>
      );
    case "activities":
      return (
        <ActivityWidget
          items={(crmLeadActivities[lead.id] ?? []).map((a) => ({
            id: a.id,
            user: a.user,
            action: a.action,
            time: a.time,
          }))}
        />
      );
    case "notes":
      return (
        <ul className="space-y-2">
          {(crmLeadNotes[lead.id] ?? [{ id: "empty", author: "—", body: "No notes yet.", at: "" }]).map((n) => (
            <li key={n.id} className="rounded-md border p-3 text-xs">
              <p className="font-medium">{n.author}</p>
              <p className="mt-1 text-muted-foreground">{n.body}</p>
              {n.at ? <p className="mt-1 text-[10px] text-muted-foreground">{n.at}</p> : null}
            </li>
          ))}
        </ul>
      );
    case "emails":
      return <EmptyTab message="Email integration coming soon — connect mailbox in Settings." />;
    case "calls":
      return (
        <ActivityWidget
          items={(crmLeadActivities[lead.id] ?? [])
            .filter((a) => a.action.toLowerCase().includes("call"))
            .map((a) => ({ id: a.id, user: a.user, action: a.action, time: a.time }))}
          maxItems={10}
        />
      );
    case "meetings":
      return (
        <ul className="space-y-2 text-xs">
          <li className="rounded-md border p-3">
            <p className="font-medium">Demo — {lead.company}</p>
            <p className="text-muted-foreground">Jun 22, 2026 · 3:00 PM · Scheduled</p>
          </li>
        </ul>
      );
    case "attachments":
      return <EmptyTab message="No attachments — upload files when document service is connected." />;
    case "history":
      return (
        <ul className="space-y-2">
          {(crmLeadHistory[lead.id] ?? []).map((h, i) => (
            <li key={i} className="flex gap-3 border-l-2 border-primary/30 pl-3 text-xs">
              <span className="shrink-0 text-muted-foreground">{h.at}</span>
              <span>{h.event}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

function EmptyTab({ message }: { message: string }) {
  return <p className="text-xs text-muted-foreground">{message}</p>;
}

export function CrmLeadTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: CrmLeadDetailTab;
  onTabChange: (tab: CrmLeadDetailTab) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b px-2" role="tablist">
      {CRM_LEAD_DETAIL_TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={activeTab === t.id}
          onClick={() => onTabChange(t.id)}
          className={cn(
            "shrink-0 border-b-2 px-3 py-2 text-[11px] font-medium transition-colors min-h-11",
            activeTab === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
