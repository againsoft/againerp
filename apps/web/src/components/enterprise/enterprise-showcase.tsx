"use client";

import {
  EnterpriseAiInsightCard,
  EnterpriseAiRecommendationCard,
  EnterpriseAnalyticsCard,
  EnterpriseApprovalCard,
  EnterpriseEmployeeCard,
  EnterpriseKpiCard,
  EnterpriseNotificationCard,
  EnterpriseQuickActionCard,
  EnterpriseTimelineCard,
} from "@/components/enterprise/cards";
import {
  EnterpriseApprovalBadge,
  EnterpriseRiskBadge,
  EnterpriseStatusBadge,
} from "@/components/enterprise/badges";
import {
  MOCK_ENTERPRISE_AI_INSIGHTS,
  MOCK_ENTERPRISE_AI_RECOMMENDATIONS,
  MOCK_ENTERPRISE_ANALYTICS,
  MOCK_ENTERPRISE_APPROVALS,
  MOCK_ENTERPRISE_BADGES,
  MOCK_ENTERPRISE_EMPLOYEES,
  MOCK_ENTERPRISE_KPIS,
  MOCK_ENTERPRISE_NOTIFICATIONS,
  MOCK_ENTERPRISE_QUICK_ACTIONS,
  MOCK_ENTERPRISE_TIMELINE,
} from "@/lib/mock-data/enterprise-components";

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-3">
      <h2 id={`${id}-heading`} className="text-sm font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Enterprise component library showcase — mock data gallery */
export function EnterpriseComponentShowcase() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-muted-foreground">
          CMP-* · DS-* — reusable enterprise cards and badges per HR Design System Specification
        </p>
      </header>

      <Section title="Badges" id="badges">
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">Status (CMP-BDG-STATUS)</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_ENTERPRISE_BADGES.statuses.map((s) => (
                <EnterpriseStatusBadge key={s} status={s} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">Risk (CMP-BDG-RISK)</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_ENTERPRISE_BADGES.risks.map((r) => (
                <EnterpriseRiskBadge key={r} level={r} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">Approval (CMP-BDG-APPROVAL)</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_ENTERPRISE_BADGES.approvals.map((a) => (
                <EnterpriseApprovalBadge key={a} status={a} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="KPI Cards" id="kpi">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_ENTERPRISE_KPIS.map((kpi) => (
            <EnterpriseKpiCard key={kpi.id} {...kpi} />
          ))}
        </div>
      </Section>

      <Section title="Analytics Card" id="analytics">
        <div className="max-w-xl">
          <EnterpriseAnalyticsCard {...MOCK_ENTERPRISE_ANALYTICS}>
            <div className="flex h-full min-h-[100px] items-center justify-center rounded-md border border-dashed border-input bg-muted/20 text-xs text-muted-foreground">
              Chart slot — Recharts / AG Charts
            </div>
          </EnterpriseAnalyticsCard>
        </div>
      </Section>

      <Section title="Approval Cards" id="approval">
        <div className="grid gap-3 md:grid-cols-2">
          {MOCK_ENTERPRISE_APPROVALS.map((item, i) => (
            <EnterpriseApprovalCard
              key={item.id}
              {...item}
              riskLevel={i === 0 ? "high" : "medium"}
            />
          ))}
        </div>
      </Section>

      <Section title="Timeline Cards" id="timeline">
        <div className="space-y-2">
          {MOCK_ENTERPRISE_TIMELINE.map((item) => (
            <EnterpriseTimelineCard key={item.id} {...item} />
          ))}
        </div>
      </Section>

      <Section title="Employee Cards" id="employee">
        <div className="grid gap-3 md:grid-cols-2">
          {MOCK_ENTERPRISE_EMPLOYEES.map((emp) => (
            <EnterpriseEmployeeCard key={emp.id} {...emp} />
          ))}
        </div>
      </Section>

      <Section title="AI Insight Cards" id="ai-insight">
        <div className="grid gap-3 md:grid-cols-2">
          {MOCK_ENTERPRISE_AI_INSIGHTS.map((ins) => (
            <EnterpriseAiInsightCard key={ins.id} {...ins} />
          ))}
        </div>
      </Section>

      <Section title="AI Recommendation Cards" id="ai-recommend">
        <div className="grid gap-3 md:grid-cols-3">
          {MOCK_ENTERPRISE_AI_RECOMMENDATIONS.map((rec) => (
            <EnterpriseAiRecommendationCard key={rec.id} {...rec} />
          ))}
        </div>
      </Section>

      <Section title="Notification Cards" id="notification">
        <div className="max-w-lg space-y-2">
          {MOCK_ENTERPRISE_NOTIFICATIONS.map((n) => (
            <EnterpriseNotificationCard key={n.id} {...n} />
          ))}
        </div>
      </Section>

      <Section title="Quick Action Cards" id="quick-action">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MOCK_ENTERPRISE_QUICK_ACTIONS.map((action) => (
            <EnterpriseQuickActionCard key={action.id} {...action} />
          ))}
        </div>
      </Section>
    </div>
  );
}
