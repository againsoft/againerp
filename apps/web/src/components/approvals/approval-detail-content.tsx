"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  Paperclip,
  Sparkles,
  User,
  X,
  XCircle,
} from "lucide-react";
import type { ApprovalDetail } from "@/lib/mock-data/approval-center";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleChip, PriorityBadge, StatusBadge } from "@/components/approvals/approval-list-table";
import { cn } from "@/lib/utils";

type Props = {
  approval: ApprovalDetail;
  onClose: () => void;
};

/** CMP-APR-WORKSPACE-001 — Approval Details Workspace */
export function ApprovalDetailContent({ approval, onClose }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ZONE A — Request summary */}
      <header className="shrink-0 border-b border-border/60 bg-card px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-sm font-semibold">{approval.requestId}</h2>
              <ModuleChip module={approval.module} />
              <PriorityBadge priority={approval.priority} />
              <StatusBadge status={approval.status} />
            </div>
            <p className="mt-1 text-lg font-semibold">{approval.requestType}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {approval.requester} · {approval.requesterNumber} · {approval.department}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted {approval.submittedAt}
              {approval.dueAt ? ` · ${approval.dueAt}` : ""}
              {" · "}
              Step {approval.stepNumber} of {approval.totalSteps} — {approval.currentStep}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {approval.sodWarning ? (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs dark:border-emerald-900 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
            {approval.sodWarning}
          </div>
        ) : null}
        <div className="mt-3">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
            <Link href={approval.sourceRecordHref}>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Open source record
            </Link>
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-5">
          {/* ZONE B — Business data */}
          <section aria-label="Request summary" className="lg:col-span-3 space-y-4">
            <Panel title="Request Summary">
              <p className="text-sm text-muted-foreground">{approval.summary}</p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {approval.businessData.map((row) => (
                  <div key={row.label} className="rounded-md border border-input px-3 py-2">
                    <dt className="text-[10px] text-muted-foreground">{row.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            {/* ZONE D — Impact analysis */}
            <Panel title="Impact Analysis">
              <ul className="space-y-2">
                {approval.impacts.map((impact) => (
                  <li
                    key={impact.label}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                      impact.severity === "critical" && "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20",
                      impact.severity === "warning" && "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30",
                    )}
                  >
                    <span className="text-muted-foreground">{impact.label}</span>
                    <span className="font-medium">{impact.value}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Comments */}
            <Panel title="Comments">
              <ul className="space-y-3">
                {approval.comments.map((c) => (
                  <li key={c.id} className="rounded-md border border-input px-3 py-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      <span className="text-xs font-medium">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">{c.createdAt}</span>
                    </div>
                    <p className="mt-1 text-sm">{c.body}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Attachments */}
            {approval.attachments.length > 0 ? (
              <Panel title="Attachments">
                <ul className="space-y-2">
                  {approval.attachments.map((att) => (
                    <li
                      key={att.id}
                      className="flex items-center justify-between rounded-md border border-input px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                        <div>
                          <p className="text-sm font-medium">{att.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {att.type} · {att.size}
                          </p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled>
                        <Download className="h-3.5 w-3.5" aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : null}
          </section>

          {/* ZONE C — Workflow */}
          <section aria-label="Approval workflow" className="lg:col-span-2 space-y-4">
            <Panel title="Workflow Timeline">
              <ol className="space-y-0">
                {approval.chain.map((step, i) => (
                  <li key={step.id} className="relative flex gap-3 pb-4">
                    {i < approval.chain.length - 1 ? (
                      <span className="absolute left-[11px] top-6 h-full w-px bg-border" aria-hidden />
                    ) : null}
                    <ChainIcon status={step.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{step.role}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" aria-hidden />
                        {step.assignee}
                      </p>
                      {step.completedAt ? (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{step.completedAt}</p>
                      ) : null}
                      {step.comment ? (
                        <p className="mt-1 rounded bg-muted/50 px-2 py-1 text-[11px]">{step.comment}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="Approval Chain">
              <div className="flex flex-wrap gap-1">
                {approval.chain.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-1">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        step.status === "completed" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
                        step.status === "current" && "bg-primary text-primary-foreground",
                        step.status === "pending" && "bg-muted text-muted-foreground",
                        step.status === "rejected" && "bg-red-100 text-red-800",
                      )}
                    >
                      {step.role}
                    </span>
                    {i < approval.chain.length - 1 ? (
                      <span className="text-muted-foreground" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </Panel>

            {/* ZONE F — AI panel */}
            <Panel title="AI Recommendation Panel" className="border-violet-200 bg-violet-50/30 dark:border-violet-900 dark:bg-violet-950/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
                <Badge variant="outline" className="text-[9px] capitalize">
                  {approval.aiConfidence} confidence
                </Badge>
                <Badge
                  variant={approval.aiRecommendation === "approve" ? "success" : "warning"}
                  className="text-[9px] capitalize"
                >
                  Recommend: {approval.aiRecommendation.replace("_", " ")}
                </Badge>
              </div>
              <ul className="mt-3 space-y-1.5">
                {approval.aiSummary.map((line, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    · {line}
                  </li>
                ))}
              </ul>
              {approval.aiRisks.length > 0 ? (
                <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/50 px-2.5 py-2 dark:border-amber-900 dark:bg-amber-950/30">
                  <p className="text-[10px] font-semibold uppercase text-amber-800 dark:text-amber-200">Risk flags</p>
                  <ul className="mt-1 space-y-0.5">
                    {approval.aiRisks.map((risk) => (
                      <li key={risk} className="flex items-start gap-1 text-[11px]">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" aria-hidden />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Panel>
          </section>
        </div>

        {/* ZONE E — Activity timeline */}
        <section aria-label="Activity timeline" className="border-t border-border/60 px-4 py-4 sm:px-6">
          <h3 className="mb-3 text-sm font-semibold">Activity Timeline</h3>
          <ul className="space-y-3">
            {approval.activities.map((event) => (
              <li key={event.id} className="flex gap-3">
                <ActivityIcon type={event.type} />
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  {event.meta ? <p className="text-xs text-muted-foreground">{event.meta}</p> : null}
                  <p className="text-[10px] text-muted-foreground">{event.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Action bar */}
      <footer className="shrink-0 border-t border-border/60 bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" className="gap-1.5" disabled>
            <Check className="h-3.5 w-3.5" aria-hidden />
            Approve
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled>
            <X className="h-3.5 w-3.5" aria-hidden />
            Reject
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            Request changes
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            Escalate
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            Delegate
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled>
            Comment
          </Button>
        </div>
      </footer>
    </div>
  );
}

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-input bg-card", className)}>
      <h3 className="border-b border-border/60 px-4 py-2.5 text-sm font-semibold">{title}</h3>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ChainIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" aria-hidden />;
  if (status === "current") return <Clock className="h-6 w-6 shrink-0 text-primary" aria-hidden />;
  if (status === "rejected") return <XCircle className="h-6 w-6 shrink-0 text-red-500" aria-hidden />;
  return <Circle className="h-6 w-6 shrink-0 text-muted-foreground/40" aria-hidden />;
}

function ActivityIcon({ type }: { type: string }) {
  const className = "mt-0.5 h-4 w-4 shrink-0";
  switch (type) {
    case "approved":
      return <CheckCircle2 className={cn(className, "text-emerald-500")} aria-hidden />;
    case "rejected":
      return <XCircle className={cn(className, "text-red-500")} aria-hidden />;
    case "escalated":
      return <AlertTriangle className={cn(className, "text-amber-500")} aria-hidden />;
    case "ai":
      return <Sparkles className={cn(className, "text-violet-500")} aria-hidden />;
    default:
      return <MessageSquare className={cn(className, "text-muted-foreground")} aria-hidden />;
  }
}
