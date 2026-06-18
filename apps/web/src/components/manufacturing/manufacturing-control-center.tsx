"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Layers, Lightbulb, Settings2 } from "lucide-react";
import {
  buildManufacturingKpis,
  manufacturingDemoHints,
} from "@/lib/mock-data/manufacturing";
import { useManufacturingBomStore } from "@/lib/store/manufacturing-bom-store";
import { useManufacturingWorkCenterStore } from "@/lib/store/manufacturing-work-center-store";
import { useManufacturingWorkOrderStore } from "@/lib/store/manufacturing-work-order-store";
import { ManufacturingNav } from "@/components/manufacturing/manufacturing-nav";
import { Button } from "@/components/ui/button";

export function ManufacturingControlCenter() {
  const workOrders = useManufacturingWorkOrderStore((s) => s.workOrders);
  const boms = useManufacturingBomStore((s) => s.boms);
  const workCenters = useManufacturingWorkCenterStore((s) => s.workCenters);

  const kpis = buildManufacturingKpis({ workOrders, boms, workCenters });
  const openWo = workOrders.filter((wo) => wo.status !== "done" && wo.status !== "cancelled");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ManufacturingNav />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-input bg-card px-4 py-3">
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            <p className="text-2xl font-semibold">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Open work orders</h2>
            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
              <Link href="/manufacturing/work-orders">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <ul className="space-y-2">
            {openWo.slice(0, 6).map((wo) => (
              <li key={wo.id} className="flex items-center justify-between gap-2 text-xs">
                <Link
                  href={`/manufacturing/work-orders?view=${wo.id}`}
                  className="shrink-0 font-medium text-primary hover:underline"
                >
                  {wo.number}
                </Link>
                <span className="min-w-0 truncate text-muted-foreground">{wo.productName}</span>
                <span className="shrink-0 capitalize text-muted-foreground">
                  {wo.status.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <h2 className="text-sm font-semibold">Demo scenarios</h2>
          </div>
          <ul className="space-y-2">
            {manufacturingDemoHints.map((hint) => (
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

      <div className="rounded-lg border border-input bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">Quick links</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { label: "New work order", href: "/manufacturing/work-orders?create=1", icon: ClipboardList },
            { label: "BOM library", href: "/manufacturing/boms", icon: Layers },
            { label: "MRP planning", href: "/manufacturing/mrp", icon: Settings2 },
          ].map((item) => (
            <Button key={item.label} variant="outline" size="sm" className="h-9 justify-start" asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-3.5 w-3.5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
