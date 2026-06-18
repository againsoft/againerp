"use client";

import type { Employee } from "@/lib/mock-data/hr-employees";
import type { EmployeeProfile } from "@/lib/mock-data/hr-employee-profile";
import { formatEmployeeDate } from "@/lib/mock-data/hr-employees";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Calendar, Laptop, Package, Sparkles } from "lucide-react";

type Props = {
  employee: Employee;
  profile: EmployeeProfile;
  className?: string;
};

export function EmployeeProfileSidebar({ employee, profile, className }: Props) {
  return (
    <aside
      aria-label="Employee context"
      className={cn(
        "flex w-full shrink-0 flex-col gap-3 border-border/60 bg-muted/10 p-4 lg:w-72 lg:border-l xl:w-80",
        className,
      )}
    >
      <SidebarCard title="Leave balance" icon={Calendar}>
        <ul className="space-y-3">
          {profile.leaveBalances.map((bal) => {
            const pct = Math.round((bal.used / bal.total) * 100);
            return (
              <li key={bal.type}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{bal.type}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {bal.total - bal.used} / {bal.total} {bal.unit}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${100 - pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </SidebarCard>

      <SidebarCard title="Assigned assets" icon={Laptop}>
        <ul className="space-y-2">
          {profile.assignedAssets.map((asset) => (
            <li key={asset.id} className="rounded-md border border-input bg-card px-2.5 py-2">
              <p className="text-xs font-medium">{asset.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {asset.category} · Since {formatEmployeeDate(asset.assignedDate)}
              </p>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="Upcoming events" icon={Package}>
        <ul className="space-y-2">
          {profile.upcomingEvents.map((event) => (
            <li key={event.id} className="flex gap-2 text-xs">
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatEmployeeDate(event.date)}
              </span>
              <span className="min-w-0">
                <span className="font-medium">{event.title}</span>
                <Badge variant="outline" className="ml-1.5 text-[9px] capitalize">
                  {event.type}
                </Badge>
              </span>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="AI insights" icon={Sparkles}>
        <ul className="space-y-2">
          {profile.aiInsights.map((insight) => (
            <li
              key={insight.id}
              className={cn(
                "rounded-md border px-2.5 py-2 text-xs",
                insight.severity === "warning" &&
                  "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/30",
                insight.severity === "info" &&
                  "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20",
              )}
            >
              <p className="font-medium">{insight.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{insight.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Advisory only for {employee.name.split(" ")[0]} — no auto-actions.
        </p>
      </SidebarCard>
    </aside>
  );
}

function SidebarCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-input bg-card p-3">
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        {title}
      </h3>
      {children}
    </section>
  );
}
