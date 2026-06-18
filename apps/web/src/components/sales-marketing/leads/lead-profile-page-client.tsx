"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { LeadFormSheet } from "@/components/sales-marketing/leads/lead-form-sheet";
import { LeadProfileWorkspace } from "@/components/sales-marketing/leads/profile/lead-profile-workspace";
import { SmwPageShell } from "@/components/sales-marketing/smw-page-shell";
import {
  getLeadById,
  isLeadProfileTab,
  smwLeadsSeed,
  type LeadProfileTab,
} from "@/lib/mock-data/smw-leads";
import { useSmwLeadStore } from "@/lib/store/smw-lead-store";

function LeadProfileContent({ leadId }: { leadId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeLeads = useSmwLeadStore((s) => s.leads);
  const leads = storeLeads.length > 0 ? storeLeads : smwLeadsSeed;

  const editId = searchParams.get("edit");
  const tabParam = searchParams.get("tab");
  const tab: LeadProfileTab = isLeadProfileTab(tabParam) ? tabParam : "overview";

  const lead = useMemo(
    () => leads.find((l) => l.id === leadId) ?? getLeadById(leadId) ?? null,
    [leadId, leads],
  );

  const editLead = useMemo(() => {
    if (!editId) return null;
    return leads.find((l) => l.id === editId) ?? getLeadById(editId) ?? null;
  }, [editId, leads]);

  if (!lead) {
    notFound();
  }

  const pushTab = (nextTab: LeadProfileTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "overview") params.delete("tab");
    else params.set("tab", nextTab);
    const qs = params.toString();
    router.replace(
      qs ? `/sales-marketing/leads/${leadId}?${qs}` : `/sales-marketing/leads/${leadId}`,
      { scroll: false },
    );
  };

  const closeEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    const qs = params.toString();
    router.replace(
      qs ? `/sales-marketing/leads/${leadId}?${qs}` : `/sales-marketing/leads/${leadId}`,
      { scroll: false },
    );
  };

  return (
    <>
      <SmwPageShell hideHeader>
        <LeadProfileWorkspace
          lead={lead}
          initialTab={tab}
          onTabChange={pushTab}
          onEdit={(l) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("edit", l.id);
            router.push(`/sales-marketing/leads/${leadId}?${params.toString()}`, { scroll: false });
          }}
        />
      </SmwPageShell>

      <LeadFormSheet
        open={!!editLead}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
        mode="edit"
        lead={editLead}
        onSaved={closeEdit}
      />
    </>
  );
}

export function LeadProfilePageClient({ leadId }: { leadId: string }) {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading…</p>}>
      <LeadProfileContent leadId={leadId} />
    </Suspense>
  );
}
