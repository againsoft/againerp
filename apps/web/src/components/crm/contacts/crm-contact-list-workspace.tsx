"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CrmListToolbar } from "@/components/crm/crm-list-toolbar";
import { CrmPageHeader } from "@/components/crm/crm-page-header";
import { CrmLeadDetailSheet } from "@/components/crm/leads/crm-lead-detail-sheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { crmContactsSeed, getCrmContactById } from "@/lib/mock-data/crm/contacts";
import { crmLeadInitials } from "@/lib/mock-data/crm/types";
import { ActivityWidget } from "@/components/dashboard/widgets/activity-widget";

function ContactListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [savedView, setSavedView] = useState("all");

  const contact = viewId ? getCrmContactById(viewId) : null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return crmContactsSeed.filter(
      (c) => !q || `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q),
    );
  }, [search]);

  const pushView = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("view", id);
    else params.delete("view");
    router.push(params.toString() ? `/crm/contacts?${params}` : "/crm/contacts", { scroll: false });
  };

  return (
    <div className="space-y-4" data-layout="LAYOUT-LIST">
      <CrmPageHeader title="Contacts" subtitle="People linked to Core contacts — CRM view." showImportExport />

      <CrmListToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter="all"
        onStatusChange={() => {}}
        ownerFilter={ownerFilter}
        onOwnerChange={setOwnerFilter}
        savedView={savedView}
        onSavedViewChange={setSavedView}
        statusOptions={[{ value: "all", label: "All" }]}
      />

      <div data-component="DS-DATAGRID" className="overflow-x-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead className="border-b bg-muted/30">
            <tr className="text-left text-muted-foreground">
              <th className="p-2 font-medium">Name</th>
              <th className="p-2 font-medium">Company</th>
              <th className="p-2 font-medium">Email</th>
              <th className="p-2 font-medium">Title</th>
              <th className="p-2 font-medium">Owner</th>
              <th className="p-2 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-muted/20">
                <td className="p-2">
                  <button type="button" className="font-medium text-primary hover:underline" onClick={() => pushView(c.id)}>
                    {c.name}
                  </button>
                </td>
                <td className="p-2">{c.company}</td>
                <td className="p-2 text-muted-foreground">{c.email}</td>
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.ownerName}</td>
                <td className="p-2 text-muted-foreground">{c.lastActivityRelative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {filtered.map((c) => (
          <button
            key={c.id}
            type="button"
            className="w-full rounded-lg border bg-card p-3 text-left"
            onClick={() => pushView(c.id)}
          >
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.company}</p>
          </button>
        ))}
      </div>

      <Sheet open={!!contact} onOpenChange={(o) => !o && pushView(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {contact ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                  {crmLeadInitials(contact.name)}
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{contact.name}</h2>
                  <p className="text-sm text-muted-foreground">{contact.title} · {contact.company}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{contact.email}</dd></div>
                <div><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{contact.phone}</dd></div>
                <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium">{contact.ownerName}</dd></div>
              </dl>
              <section>
                <h3 className="mb-2 text-xs font-medium">Activities</h3>
                <ActivityWidget items={[{ id: "1", user: contact.ownerName, action: "last touchpoint", time: contact.lastActivityRelative }]} />
              </section>
              <section>
                <h3 className="mb-2 text-xs font-medium">History</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>Contact synced from Core · 2026-05-01</li>
                  <li>Linked to lead LD-2026-0042</li>
                </ul>
              </section>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function CrmContactListWorkspace() {
  return (
    <Suspense fallback={null}>
      <ContactListContent />
    </Suspense>
  );
}
