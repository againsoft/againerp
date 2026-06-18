"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb, Plus, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  partnerDemoHints,
  partnerKpis,
  partnersByRoleChart,
  topVendorSpendChart,
} from "@/lib/mock-data/business-partners";
import { useBusinessPartnerOnboardingStore } from "@/lib/store/business-partner-onboarding-store";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";
import { cn } from "@/lib/utils";
import { PartnersNav } from "@/components/partners/partners-nav";
import { Button } from "@/components/ui/button";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export function PartnersControlCenter() {
  const partners = useBusinessPartnerStore((s) => s.partners);
  const applications = useBusinessPartnerOnboardingStore((s) => s.applications);
  const active = partners.filter((p) => p.status === "active");
  const onHold = partners.filter((p) => p.status === "on_hold" || p.creditHold);
  const pendingOnboarding = applications.filter(
    (a) => a.status === "submitted" || a.status === "review",
  ).length;
  const recentOnboarding = applications
    .filter((a) => a.status === "submitted" || a.status === "review")
    .slice(0, 4);

  const kpis = [
    { ...partnerKpis[0], value: String(active.length) },
    { ...partnerKpis[1], value: String(pendingOnboarding) },
    {
      ...partnerKpis[2],
      value: String(partners.filter((p) => p.roles.includes("vendor")).length),
    },
    {
      ...partnerKpis[3],
      value: String(
        partners.filter((p) => p.roles.includes("wholesaler") || p.roles.includes("retailer")).length,
      ),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PartnersNav />

      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="h-8" asChild>
          <Link href="/partners/directory?create=1">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New partner
          </Link>
        </Button>
        <Button size="sm" variant="outline" className="h-8" asChild>
          <Link href="/partners/onboarding">Review onboarding</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-input bg-card px-4 py-3">
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            <p className="text-2xl font-semibold">{kpi.value}</p>
            <p
              className={cn(
                "text-[11px]",
                kpi.alert ? "text-amber-600" : "text-muted-foreground",
              )}
            >
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-input bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold">Partners by role</h2>
          <div className="h-44 min-h-[176px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={partnersByRoleChart}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ role, count }: { role?: string; count?: number }) =>
                    `${role ?? ""} (${count ?? 0})`
                  }
                >
                  {partnersByRoleChart.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-input bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold">Top vendors by spend (YTD)</h2>
          <div className="h-44 min-h-[176px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVendorSpendChart} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `৳${v / 1e6}M`} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `৳${Number(v).toLocaleString("en-BD")}`} />
                <Bar dataKey="spend" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pending onboarding</h2>
            <Button variant="ghost" className="h-auto p-0 text-xs text-primary" asChild>
              <Link href="/partners/onboarding">View all</Link>
            </Button>
          </div>
          {recentOnboarding.length === 0 ? (
            <p className="text-xs text-muted-foreground">No applications in queue.</p>
          ) : (
            <ul className="space-y-2">
              {recentOnboarding.map((app) => (
                <li key={app.id} className="flex justify-between gap-2 text-xs">
                  <Link
                    href={`/partners/onboarding?view=${app.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {app.companyName}
                  </Link>
                  <span className="text-muted-foreground">{app.applicationNumber}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Credit hold</h2>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          {onHold.length === 0 ? (
            <p className="text-xs text-muted-foreground">No partners on hold.</p>
          ) : (
            <ul className="space-y-2">
              {onHold.map((p) => (
                <li key={p.id} className="flex justify-between gap-2 text-xs">
                  <Link
                    href={`/partners/directory?view=${p.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="text-muted-foreground capitalize">{p.status.replace(/_/g, " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <h2 className="text-sm font-semibold">Demo scenarios</h2>
          </div>
          <ul className="space-y-2">
            {partnerDemoHints.map((hint) => (
              <li key={hint.href}>
                <Link
                  href={hint.href}
                  className="group block rounded-md px-2 py-1.5 hover:bg-muted/60"
                >
                  <p className="text-xs font-medium text-primary group-hover:underline">
                    {hint.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{hint.hint}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-violet-200 bg-violet-50/40 px-4 py-2.5 text-xs dark:border-violet-900/50 dark:bg-violet-950/20">
        Vendor master is in{" "}
        <strong>Business Partners</strong>. Purchase PO/RFQ screens stay under Suppliers.
        <Button variant="ghost" className="ml-1 h-auto p-0 text-xs text-primary" asChild>
          <Link href="/partners/directory?role=vendor">
            Vendor directory <ArrowRight className="ml-0.5 inline h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
