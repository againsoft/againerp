"use client";

import {
  EMPLOYEE_STATUS_LABELS,
  employeeInitials,
  employeeStatusBadgeVariant,
  formatEmployeeDate,
  type Employee,
} from "@/lib/mock-data/hr-employees";
import type { EmployeeProfile, EmployeeProfileTab } from "@/lib/mock-data/hr-employee-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Archive,
  ChevronDown,
  Pencil,
  Sparkles,
  UserCog,
  X,
} from "lucide-react";

type Props = {
  employee: Employee;
  profile: EmployeeProfile;
  onEdit?: (employee: Employee) => void;
  onClose?: () => void;
  onTabChange: (tab: EmployeeProfileTab) => void;
  onAskAi?: () => void;
};

const SMART_SHORTCUTS: { tab: EmployeeProfileTab; label: string }[] = [
  { tab: "leave", label: "Leave" },
  { tab: "attendance", label: "Attendance" },
  { tab: "payroll", label: "Payslip" },
  { tab: "assets", label: "Assets" },
  { tab: "timeline", label: "Timeline" },
];

export function EmployeeProfileHeader({
  employee,
  profile,
  onEdit,
  onClose,
  onTabChange,
  onAskAi,
}: Props) {
  const stats = [
    { label: "Tenure", value: profile.stats.yearsOfService, tab: "employment" as const },
    { label: "Attendance (30d)", value: profile.stats.attendanceRate, tab: "attendance" as const },
    { label: "Leave balance", value: `${profile.stats.leaveBalanceDays}d`, tab: "leave" as const },
    { label: "Performance", value: profile.stats.performanceScore, tab: "performance" as const },
    { label: "Training", value: profile.stats.trainingCompletion, tab: "training" as const },
    { label: "Assets", value: String(profile.stats.assetsAssigned), tab: "assets" as const },
  ];

  return (
    <header className="shrink-0 border-b border-border/60 bg-background">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between">
        {/* LEFT — identity */}
        <div className="flex min-w-0 gap-4">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-800 ring-2 ring-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800"
            aria-hidden
          >
            {employeeInitials(employee.name)}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">{employee.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px]">
                {employee.employeeNumber}
              </Badge>
              <Badge variant={employeeStatusBadgeVariant(employee.status)} className="text-[10px]">
                {EMPLOYEE_STATUS_LABELS[employee.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">{employee.designation}</p>
            <p className="text-sm text-muted-foreground">{employee.department}</p>
            <p className="text-xs text-muted-foreground">
              {employee.branch} · UrbanWear Retail
            </p>
          </div>
        </div>

        {/* CENTER — quick stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:max-w-md lg:flex-1">
          {stats.map((stat) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => onTabChange(stat.tab)}
              className="rounded-lg border border-input bg-muted/30 px-3 py-2 text-left transition-colors hover:border-primary/30 hover:bg-accent/40"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">{stat.value}</p>
            </button>
          ))}
        </div>

        {/* RIGHT — actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {onEdit ? (
            <Button type="button" size="sm" variant="default" className="h-8" onClick={() => onEdit(employee)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Edit
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" variant="outline" className="h-8 gap-1">
                Actions
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <UserCog className="mr-2 h-3.5 w-3.5" /> Transfer employee
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Promote employee</DropdownMenuItem>
              <DropdownMenuItem disabled>Salary revision</DropdownMenuItem>
              <DropdownMenuItem disabled>Assign asset</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Archive className="mr-2 h-3.5 w-3.5" /> Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={onAskAi}
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
            Ask AI
          </Button>
          {onClose ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={onClose}
              aria-label="Close profile"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Smart shortcuts */}
      <div className="flex gap-1 overflow-x-auto border-t border-border/40 px-4 py-2">
        {SMART_SHORTCUTS.map((s) => (
          <Button
            key={s.tab}
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 px-2.5 text-xs"
            onClick={() => onTabChange(s.tab)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </header>
  );
}

export function EmployeeProfileSummary({
  employee,
  profile,
  collapsed,
}: {
  employee: Employee;
  profile: EmployeeProfile;
  collapsed?: boolean;
}) {
  if (collapsed) return null;

  return (
    <section
      aria-label="Profile summary"
      className="shrink-0 border-b border-border/60 bg-muted/20 px-4 py-3"
    >
      <dl className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem label="Manager" value={employee.managerName ?? "—"} />
        <SummaryItem label="Employment type" value={employee.employmentType ?? "Permanent"} />
        <SummaryItem label="Joined" value={formatEmployeeDate(employee.joiningDate)} />
        <SummaryItem
          label="Confirmed"
          value={
            profile.confirmationDate
              ? formatEmployeeDate(profile.confirmationDate)
              : "On probation"
          }
        />
        <SummaryItem label="Location" value={profile.workLocation} />
        <SummaryItem label="Cost center" value={profile.costCenter} />
        <div className="sm:col-span-2">
          <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Reporting line
          </dt>
          <dd className="mt-0.5 text-xs">{profile.reportingLine.join(" → ")}</dd>
        </div>
      </dl>
      {profile.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {profile.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px] font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

export function EmployeeProfileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: EmployeeProfileTab;
  onTabChange: (tab: EmployeeProfileTab) => void;
}) {
  return (
    <nav
      aria-label="Employee profile sections"
      className="flex shrink-0 gap-0 overflow-x-auto border-b border-input bg-background px-2"
    >
      {(
        [
          { id: "overview", label: "Overview" },
          { id: "employment", label: "Employment" },
          { id: "attendance", label: "Attendance" },
          { id: "leave", label: "Leave" },
          { id: "payroll", label: "Payroll" },
          { id: "assets", label: "Assets" },
          { id: "performance", label: "Performance" },
          { id: "training", label: "Training" },
          { id: "documents", label: "Documents" },
          { id: "timeline", label: "Timeline" },
        ] as const
      ).map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "shrink-0 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors",
            activeTab === tab.id
              ? "border-emerald-600 text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
