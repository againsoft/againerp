"use client";

import type { ReactNode } from "react";
import type { Employee } from "@/lib/mock-data/hr-employees";
import { formatEmployeeDate } from "@/lib/mock-data/hr-employees";
import type {
  EmployeeProfile,
  EmployeeProfileTab,
  EmployeeTimelineEvent,
} from "@/lib/mock-data/hr-employee-profile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

type Props = {
  tab: EmployeeProfileTab;
  employee: Employee;
  profile: EmployeeProfile;
};

export function EmployeeProfileTabContent({ tab, employee, profile }: Props) {
  switch (tab) {
    case "overview":
      return <OverviewTab employee={employee} profile={profile} />;
    case "employment":
      return <EmploymentTab employee={employee} profile={profile} />;
    case "attendance":
      return <AttendanceTab profile={profile} />;
    case "leave":
      return <LeaveTab profile={profile} />;
    case "payroll":
      return <PayrollTab profile={profile} />;
    case "assets":
      return <AssetsTab profile={profile} />;
    case "performance":
      return <PerformanceTab profile={profile} />;
    case "training":
      return <TrainingTab profile={profile} />;
    case "documents":
      return <DocumentsTab profile={profile} />;
    case "timeline":
      return <TimelineTab profile={profile} />;
    default:
      return null;
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-input bg-card p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function OverviewTab({ employee, profile }: { employee: Employee; profile: EmployeeProfile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title="Key metrics">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Attendance (30d)", value: profile.stats.attendanceRate },
            { label: "Leave balance", value: `${profile.stats.leaveBalanceDays} days` },
            { label: "Performance", value: profile.stats.performanceScore },
            { label: "Training", value: profile.stats.trainingCompletion },
          ].map((m) => (
            <div key={m.label} className="rounded-md bg-muted/40 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
              <p className="text-sm font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AI summary">
        <p className="text-sm text-muted-foreground">
          {employee.name} maintains stable attendance and is on track for Q2 goals. Consider
          scheduling unused annual leave before fiscal year-end.
        </p>
        <button type="button" className="mt-2 text-xs font-medium text-violet-600 hover:underline">
          View insights →
        </button>
      </Section>

      <Section title="Recent activity">
        <ul className="space-y-2">
          {profile.timeline.slice(0, 4).map((e) => (
            <TimelineRow key={e.id} event={e} compact />
          ))}
        </ul>
      </Section>

      <Section title="Organization">
        <p className="text-xs text-muted-foreground">Manager</p>
        <p className="text-sm font-medium">{employee.managerName ?? "—"}</p>
        {profile.directReports.length > 0 && (
          <>
            <p className="mt-3 text-xs text-muted-foreground">Direct reports</p>
            <ul className="mt-1 space-y-1">
              {profile.directReports.map((r) => (
                <li key={r.id} className="text-sm">
                  {r.name} · <span className="text-muted-foreground">{r.designation}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
    </div>
  );
}

function EmploymentTab({ employee, profile }: { employee: Employee; profile: EmployeeProfile }) {
  return (
    <div className="space-y-4">
      <Section title="Employment details">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="Status" value={employee.status.replace(/_/g, " ")} />
          <Field label="Type" value={employee.employmentType ?? "Permanent"} />
          <Field label="Designation" value={employee.designation} />
          <Field label="Department" value={employee.department} />
          <Field label="Branch" value={employee.branch} />
          <Field label="Joining date" value={formatEmployeeDate(employee.joiningDate)} />
          <Field label="Manager" value={employee.managerName ?? "—"} />
          <Field label="Cost center" value={profile.costCenter} />
        </dl>
      </Section>
      {profile.transferHistory.length > 0 && (
        <Section title="Transfer history">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-2 font-medium">Date</th>
                <th className="pb-2 pr-2 font-medium">From</th>
                <th className="pb-2 pr-2 font-medium">To</th>
                <th className="pb-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {profile.transferHistory.map((row, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="py-2 pr-2 tabular-nums">{formatEmployeeDate(row.date)}</td>
                  <td className="py-2 pr-2">{row.from}</td>
                  <td className="py-2 pr-2">{row.to}</td>
                  <td className="py-2">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}
    </div>
  );
}

function AttendanceTab({ profile }: { profile: EmployeeProfile }) {
  const s = profile.attendanceSummary;
  return (
    <div className="space-y-4">
      <Section title="Month summary (Jun 2026)">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Present", value: s.present, icon: CheckCircle2 },
            { label: "Absent", value: s.absent, icon: Calendar },
            { label: "Late", value: s.late, icon: Clock },
            { label: "WFH", value: s.wfh, icon: Briefcase },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
              <item.icon className="h-4 w-4 text-emerald-600" aria-hidden />
              <div>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold tabular-nums">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Attendance rate">
        <p className="text-2xl font-semibold tabular-nums">{profile.stats.attendanceRate}</p>
        <p className="text-xs text-muted-foreground">Rolling 30-day rate · tap analytics for full view</p>
      </Section>
    </div>
  );
}

function LeaveTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <div className="space-y-4">
      <Section title="Leave balances">
        <div className="grid gap-3 sm:grid-cols-3">
          {profile.leaveBalances.map((bal) => (
            <div key={bal.type} className="rounded-md border border-input p-3">
              <p className="text-xs font-medium">{bal.type}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {bal.total - bal.used}
                <span className="text-sm font-normal text-muted-foreground"> / {bal.total}d</span>
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Leave requests">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">From</th>
              <th className="pb-2 font-medium">To</th>
              <th className="pb-2 font-medium">Days</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {profile.leaveRequests.map((lr) => (
              <tr key={lr.id} className="border-b border-border/40">
                <td className="py-2">{lr.type}</td>
                <td className="py-2 tabular-nums">{formatEmployeeDate(lr.from)}</td>
                <td className="py-2 tabular-nums">{formatEmployeeDate(lr.to)}</td>
                <td className="py-2 tabular-nums">{lr.days}</td>
                <td className="py-2 capitalize">{lr.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

function PayrollTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <Section title="Recent payslips">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">Period</th>
            <th className="pb-2 font-medium">Net pay</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {profile.payslips.map((ps) => (
            <tr key={ps.id} className="border-b border-border/40">
              <td className="py-2">{ps.period}</td>
              <td className="py-2 font-medium tabular-nums">{ps.netPay}</td>
              <td className="py-2 capitalize">{ps.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Salary amounts masked per RBAC in production · full detail requires hr.sensitive.view
      </p>
    </Section>
  );
}

function AssetsTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <Section title="Assigned assets">
      <ul className="divide-y divide-border/60">
        {profile.assignedAssets.map((asset) => (
          <li key={asset.id} className="flex items-center justify-between gap-2 py-3 first:pt-0">
            <div>
              <p className="text-sm font-medium">{asset.name}</p>
              <p className="text-xs text-muted-foreground">
                {asset.category} · Assigned {formatEmployeeDate(asset.assignedDate)}
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] capitalize">
              {asset.status}
            </Badge>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function PerformanceTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <div className="space-y-4">
      <Section title="Last review score">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden />
          <span className="text-2xl font-semibold">{profile.stats.performanceScore}</span>
        </div>
      </Section>
      <Section title="Active goals">
        <ul className="space-y-3">
          {profile.performanceGoals.map((goal) => (
            <li key={goal.id}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{goal.title}</span>
                <span className="text-muted-foreground">Due {formatEmployeeDate(goal.due)}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{goal.progress}% complete</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function TrainingTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <Section title="Training records">
      <ul className="space-y-2">
        {profile.trainingRecords.map((tr) => (
          <li
            key={tr.id}
            className="flex items-center justify-between rounded-md border border-input px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span className="text-sm font-medium">{tr.program}</span>
            </div>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {tr.status.replace(/_/g, " ")}
            </Badge>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DocumentsTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <Section title="Employee documents">
      <ul className="divide-y divide-border/60">
        {profile.documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-2 py-3 first:pt-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
              <div>
                <p className="text-sm font-medium">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.type}</p>
              </div>
            </div>
            {doc.expiry ? (
              <span className="text-[10px] text-muted-foreground">
                Expires {formatEmployeeDate(doc.expiry)}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function TimelineTab({ profile }: { profile: EmployeeProfile }) {
  return (
    <Section title="Activity timeline">
      <p className="mb-3 text-xs text-muted-foreground">
        Employee 360° feed — newest first. Merges attendance, leave, payroll, and approvals.
      </p>
      <ul className="space-y-0">
        {profile.timeline.map((event, index) => (
          <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
            {index < profile.timeline.length - 1 && (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-border"
                aria-hidden
              />
            )}
            <TimelineIcon category={event.category} />
            <div className="min-w-0 flex-1">
              <TimelineRow event={event} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function TimelineIcon({ category }: { category: EmployeeTimelineEvent["category"] }) {
  const Icon =
    category === "payroll"
      ? Wallet
      : category === "leave"
        ? Calendar
        : category === "attendance"
          ? Clock
          : category === "training"
            ? GraduationCap
            : category === "approval"
              ? CheckCircle2
              : category === "document"
                ? FileText
                : Sparkles;
  return (
    <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-input bg-background">
      <Icon className="h-3 w-3 text-muted-foreground" aria-hidden />
    </span>
  );
}

function TimelineRow({ event, compact }: { event: EmployeeTimelineEvent; compact?: boolean }) {
  return (
    <div className={cn(compact && "text-xs")}>
      <p className="font-medium">{event.title}</p>
      <p className="text-muted-foreground">{event.description}</p>
      {!compact && (
        <p className="mt-1 text-[10px] text-muted-foreground">
          {event.actor} · {event.relativeTime}
        </p>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm capitalize">{value}</dd>
    </div>
  );
}
