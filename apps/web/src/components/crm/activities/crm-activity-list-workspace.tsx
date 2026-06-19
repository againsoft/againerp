"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, Calendar, CheckSquare, Mail } from "lucide-react";
import { CrmPageHeader } from "@/components/crm/crm-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  crmActivitiesSeed,
  CRM_ACTIVITY_TYPE_LABELS,
  getCrmActivityById,
} from "@/lib/mock-data/crm/activities";
import type { CrmActivityType } from "@/lib/mock-data/crm/types";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  call: Phone,
  meeting: Calendar,
  task: CheckSquare,
  follow_up: Mail,
  email: Mail,
};

function ActivityListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");
  const createOpen = searchParams.get("create") === "1";
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const activity = viewId ? getCrmActivityById(viewId) : null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return crmActivitiesSeed.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (q && !a.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [typeFilter, statusFilter, search]);

  const push = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams.toString());
    mutate(p);
    router.push(p.toString() ? `/crm/activities?${p}` : "/crm/activities", { scroll: false });
  };

  const tabs: { id: CrmActivityType | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "call", label: "Calls" },
    { id: "meeting", label: "Meetings" },
    { id: "task", label: "Tasks" },
    { id: "follow_up", label: "Follow ups" },
  ];

  return (
    <div className="space-y-4" data-layout="LAYOUT-LIST">
      <CrmPageHeader
        title="Activities"
        subtitle="Calls, meetings, tasks, and follow-ups."
        onCreate={() => push((p) => p.set("create", "1"))}
        createLabel="Log Activity"
        showImportExport={false}
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button
            key={t.id}
            type="button"
            variant={typeFilter === t.id ? "default" : "outline"}
            size="sm"
            className="min-h-9"
            onClick={() => setTypeFilter(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities…" className="h-9 max-w-xs" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 w-36">
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>

      <ul className="space-y-2">
        {filtered.map((a) => {
          const Icon = TYPE_ICONS[a.type];
          return (
            <li key={a.id}>
              <button
                type="button"
                className="flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-left hover:bg-accent/30"
                onClick={() => push((p) => p.set("view", a.id))}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.relatedTo} · {a.ownerName}</p>
                </div>
                <div className="text-right text-[11px]">
                  <p className={cn(a.status === "overdue" && "text-red-500")}>{a.dueDate}</p>
                  <p className="capitalize text-muted-foreground">{a.status.replace("_", " ")}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Sheet open={!!activity} onOpenChange={(o) => !o && push((p) => p.delete("view"))}>
        <SheetContent side="right" className="sm:max-w-md">
          {activity ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">{activity.title}</h2>
              <p className="text-sm text-muted-foreground">{CRM_ACTIVITY_TYPE_LABELS[activity.type]} · {activity.relatedTo}</p>
              <dl className="text-xs space-y-2">
                <div><dt className="text-muted-foreground">Owner</dt><dd>{activity.ownerName}</dd></div>
                <div><dt className="text-muted-foreground">Due</dt><dd>{activity.dueDate}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="capitalize">{activity.status}</dd></div>
              </dl>
              {activity.notes ? <p className="text-xs text-muted-foreground">{activity.notes}</p> : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={createOpen} onOpenChange={(o) => !o && push((p) => p.delete("create"))}>
        <SheetContent side="right" className="sm:max-w-md">
          <h2 className="text-lg font-semibold">Log Activity</h2>
          <p className="mt-2 text-xs text-muted-foreground">Prototype form — no persistence.</p>
          <Button type="button" className="mt-4" onClick={() => push((p) => p.delete("create"))}>
            Save (prototype)
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function CrmActivityListWorkspace() {
  return (
    <Suspense fallback={null}>
      <ActivityListContent />
    </Suspense>
  );
}
