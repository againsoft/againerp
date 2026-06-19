"use client";

import { useCallback } from "react";
import Link from "next/link";
import type { WidgetSlotConfig } from "@/lib/dashboard/types";
import { DashboardLayoutEngine } from "@/components/dashboard/layout/dashboard-layout-engine";
import { MobileDashboard } from "@/components/dashboard/layout/mobile-dashboard";
import {
  ActivityWidget,
  AiWidget,
  KpiWidget,
  QuickActionsWidget,
  TableWidget,
  WidgetChrome,
} from "@/components/dashboard/widgets";
import { CrmPageHeader } from "@/components/crm/crm-page-header";
import { crmDashboardAiBriefing } from "@/lib/mock-data/crm/ai";
import { crmActivitiesSeed } from "@/lib/mock-data/crm/activities";
import { crmDashboardKpis, crmLeadsSeed } from "@/lib/mock-data/crm/leads";
import type { KpiData, QuickAction, TableColumn, TableRow } from "@/lib/dashboard/types";

const crmLayout = {
  id: "tpl.crm.dashboard",
  type: "module" as const,
  name: "CRM Dashboard",
  slots: [
    { id: "c-kpi", widgetId: "crm.kpi-row", category: "kpi" as const, title: "KPI Summary", colSpan: 12, rowSpan: 1, mobileOrder: 1, mobileSupport: "full" as const },
    { id: "c-leads", widgetId: "crm.recent-leads", category: "table" as const, title: "Recent Leads", colSpan: 6, rowSpan: 3, mobileOrder: 6, mobileSupport: "compact" as const },
    { id: "c-act", widgetId: "crm.activities", category: "activity" as const, title: "Activities", colSpan: 6, rowSpan: 3, mobileOrder: 5, mobileSupport: "compact" as const },
    { id: "c-ai", widgetId: "crm.ai", category: "ai" as const, title: "AI Insights", colSpan: 12, rowSpan: 2, mobileOrder: 4, mobileSupport: "full" as const },
    { id: "c-qa", widgetId: "crm.quick-actions", category: "quick_action" as const, title: "Quick Actions", colSpan: 4, rowSpan: 2, mobileOrder: 3, mobileSupport: "full" as const },
  ],
};

const kpiItems: KpiData[] = [
  { id: "k1", label: crmDashboardKpis.leadSummary.label, value: crmDashboardKpis.leadSummary.value, change: crmDashboardKpis.leadSummary.change, up: crmDashboardKpis.leadSummary.up, href: "/crm/leads?filter=open" },
  { id: "k2", label: crmDashboardKpis.pipelineValue.label, value: crmDashboardKpis.pipelineValue.value, change: crmDashboardKpis.pipelineValue.change, up: crmDashboardKpis.pipelineValue.up, href: "/crm/pipeline" },
  { id: "k3", label: crmDashboardKpis.conversionRate.label, value: crmDashboardKpis.conversionRate.value, change: crmDashboardKpis.conversionRate.change, up: crmDashboardKpis.conversionRate.up },
];

const quickActions: QuickAction[] = [
  { id: "qa1", label: "Create Lead", href: "/crm/leads?create=1" },
  { id: "qa2", label: "Log Activity", href: "/crm/activities?create=1" },
  { id: "qa3", label: "Open Pipeline", href: "/crm/pipeline" },
  { id: "qa4", label: "AI CRM", href: "/crm/ai" },
];

const leadColumns: TableColumn[] = [
  { key: "name", label: "Name" },
  { key: "company", label: "Company" },
  { key: "status", label: "Status" },
  { key: "score", label: "Score", align: "right" },
];

const leadRows: TableRow[] = crmLeadsSeed.slice(0, 5).map((l) => ({
  name: l.name,
  company: l.company,
  status: l.status,
  score: l.score,
}));

/** CRM Dashboard — `/crm/dashboard` */
export function CrmDashboard() {
  const renderSlot = useCallback((slot: WidgetSlotConfig) => {
    switch (slot.widgetId) {
      case "crm.kpi-row":
        return (
          <WidgetChrome title={slot.title} widgetId={slot.widgetId}>
            <KpiWidget items={kpiItems} />
          </WidgetChrome>
        );
      case "crm.recent-leads":
        return (
          <WidgetChrome title={slot.title} widgetId={slot.widgetId}>
            <TableWidget columns={leadColumns} rows={leadRows} maxRows={5} viewAllHref="/crm/leads" />
          </WidgetChrome>
        );
      case "crm.activities":
        return (
          <WidgetChrome title={slot.title} widgetId={slot.widgetId}>
            <ActivityWidget
              items={crmActivitiesSeed.slice(0, 4).map((a) => ({
                id: a.id,
                user: a.ownerName,
                action: a.title,
                time: a.dueDate,
              }))}
              viewAllHref="/crm/activities"
            />
          </WidgetChrome>
        );
      case "crm.ai":
        return (
          <WidgetChrome title={slot.title} widgetId={slot.widgetId}>
            <AiWidget briefing={crmDashboardAiBriefing} />
          </WidgetChrome>
        );
      case "crm.quick-actions":
        return (
          <WidgetChrome title={slot.title} widgetId={slot.widgetId}>
            <QuickActionsWidget actions={quickActions} />
          </WidgetChrome>
        );
      default:
        return null;
    }
  }, []);

  const mobileKpis: KpiData[] = kpiItems;

  return (
    <>
      <CrmPageHeader
        title="CRM Dashboard"
        subtitle="Lead summary · pipeline · conversion · AI insights"
        createHref="/crm/leads?create=1"
        createLabel="Create Lead"
        showImportExport={false}
      />
      <div className="hidden lg:block">
        <DashboardLayoutEngine
          layout={crmLayout}
          title="CRM Dashboard"
          hideHeader
          renderSlot={renderSlot}
          storageKey="crm-dashboard"
        />
      </div>
      <MobileDashboard
        kpis={mobileKpis}
        activities={crmActivitiesSeed.slice(0, 3).map((a) => ({
          id: a.id,
          user: a.ownerName,
          action: a.title,
          time: a.dueDate,
        }))}
        aiBriefing={crmDashboardAiBriefing}
        title="CRM Dashboard"
      />
      <p className="text-[10px] text-muted-foreground">
        Prototype · mock data · <Link href="/crm/leads" className="text-primary hover:underline">View all leads</Link>
      </p>
    </>
  );
}
