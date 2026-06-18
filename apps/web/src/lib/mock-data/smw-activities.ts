/**
 * Sales & Marketing — Activity mock data · SCR-SMW-ACT-001
 */

import type { EnterpriseStatus } from "@/components/enterprise/types";
import { SMW_LEAD_OWNERS } from "@/lib/mock-data/smw-leads";

export type ActivityType = "call" | "meeting" | "email" | "task" | "follow_up" | "note";
export type ActivityStatus = "scheduled" | "open" | "in_progress" | "completed" | "cancelled" | "overdue";
export type ActivityPriority = "low" | "normal" | "high";
export type ActivityRelatedType = "lead" | "opportunity" | "quotation" | "campaign" | "none";

export type SmwActivity = {
  id: string;
  activityNumber: string;
  type: ActivityType;
  status: ActivityStatus;
  priority: ActivityPriority;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  completedAt?: string;
  durationMinutes?: number;
  ownerId: string;
  ownerName: string;
  relatedType: ActivityRelatedType;
  relatedId?: string;
  relatedName?: string;
  createdAt: string;
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: "Call",
  meeting: "Meeting",
  email: "Email",
  task: "Task",
  follow_up: "Follow-up",
  note: "Note",
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  scheduled: "Scheduled",
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  overdue: "Overdue",
};

export const ACTIVITY_PRIORITY_LABELS: Record<ActivityPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

export const ACTIVITY_RELATED_LABELS: Record<ActivityRelatedType, string> = {
  lead: "Lead",
  opportunity: "Opportunity",
  quotation: "Quotation",
  campaign: "Campaign",
  none: "—",
};

export { SMW_LEAD_OWNERS as SMW_ACTIVITY_OWNERS };

export const smwActivitiesSeed: SmwActivity[] = [
  {
    id: "act-001",
    activityNumber: "ACT-2026-0101",
    type: "call",
    status: "completed",
    priority: "high",
    title: "Discovery call — Acme Retail",
    description: "Discussed inventory pain points and timeline for ERP rollout.",
    dueDate: "2026-06-18",
    dueTime: "10:00",
    completedAt: "2026-06-18T10:45:00",
    durationMinutes: 45,
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    relatedType: "lead",
    relatedId: "lead-acme",
    relatedName: "Acme Retail — Rajib Khan",
    createdAt: "2026-06-17T14:00:00",
  },
  {
    id: "act-002",
    activityNumber: "ACT-2026-0102",
    type: "meeting",
    status: "scheduled",
    priority: "high",
    title: "Demo — Nova Foods procurement module",
    description: "Virtual demo with CFO and IT lead.",
    dueDate: "2026-06-19",
    dueTime: "14:30",
    ownerId: "karim",
    ownerName: "Karim Hassan",
    relatedType: "opportunity",
    relatedId: "opp-nova",
    relatedName: "Nova Foods — Procurement suite",
    createdAt: "2026-06-16T09:00:00",
  },
  {
    id: "act-003",
    activityNumber: "ACT-2026-0103",
    type: "task",
    status: "overdue",
    priority: "normal",
    title: "Send revised quotation to GreenTech",
    dueDate: "2026-06-16",
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    relatedType: "quotation",
    relatedId: "qt-greentech",
    relatedName: "QT-2026-0088 — GreenTech",
    createdAt: "2026-06-14T11:00:00",
  },
  {
    id: "act-004",
    activityNumber: "ACT-2026-0104",
    type: "email",
    status: "completed",
    priority: "normal",
    title: "Pricing guide sent — Summit Logistics",
    dueDate: "2026-06-17",
    completedAt: "2026-06-17T08:15:00",
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    relatedType: "lead",
    relatedId: "lead-summit",
    relatedName: "Summit Logistics — Tania Ahmed",
    createdAt: "2026-06-17T07:30:00",
  },
  {
    id: "act-005",
    activityNumber: "ACT-2026-0105",
    type: "follow_up",
    status: "open",
    priority: "high",
    title: "Follow up on LinkedIn ABM responses",
    description: "3 mid-market leads from Q2 ABM campaign need outreach.",
    dueDate: "2026-06-18",
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    relatedType: "campaign",
    relatedId: "camp-abm-q2",
    relatedName: "LinkedIn ABM Q2 — Mid-market ERP",
    createdAt: "2026-06-18T06:00:00",
  },
  {
    id: "act-006",
    activityNumber: "ACT-2026-0106",
    type: "call",
    status: "in_progress",
    priority: "normal",
    title: "Check-in — Pacific Textiles",
    dueDate: "2026-06-18",
    dueTime: "11:00",
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    relatedType: "opportunity",
    relatedId: "opp-pacific",
    relatedName: "Pacific Textiles — WMS rollout",
    createdAt: "2026-06-18T08:00:00",
  },
  {
    id: "act-007",
    activityNumber: "ACT-2026-0107",
    type: "note",
    status: "completed",
    priority: "low",
    title: "Competitor intel — Metro Pharma",
    description: "Evaluating SAP B1; price-sensitive on year-1 licensing.",
    dueDate: "2026-06-15",
    completedAt: "2026-06-15T16:00:00",
    ownerId: "karim",
    ownerName: "Karim Hassan",
    relatedType: "lead",
    relatedId: "lead-metro",
    relatedName: "Metro Pharma — Dr. Hasan",
    createdAt: "2026-06-15T15:30:00",
  },
  {
    id: "act-008",
    activityNumber: "ACT-2026-0108",
    type: "meeting",
    status: "scheduled",
    priority: "normal",
    title: "Quarterly business review — Orion Steel",
    dueDate: "2026-06-20",
    dueTime: "09:00",
    durationMinutes: 60,
    ownerId: "nadia",
    ownerName: "Nadia Chowdhury",
    relatedType: "opportunity",
    relatedId: "opp-orion",
    relatedName: "Orion Steel — Full ERP",
    createdAt: "2026-06-12T10:00:00",
  },
  {
    id: "act-009",
    activityNumber: "ACT-2026-0109",
    type: "task",
    status: "open",
    priority: "normal",
    title: "Prepare trade show lead imports",
    dueDate: "2026-06-21",
    ownerId: "rafiq",
    ownerName: "Rafiq Islam",
    relatedType: "campaign",
    relatedId: "camp-trade-dhaka",
    relatedName: "Dhaka Trade Show 2026",
    createdAt: "2026-06-17T12:00:00",
  },
  {
    id: "act-010",
    activityNumber: "ACT-2026-0110",
    type: "email",
    status: "scheduled",
    priority: "low",
    title: "Webinar reminder — Manufacturing ERP trends",
    dueDate: "2026-06-22",
    dueTime: "08:00",
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    relatedType: "campaign",
    relatedId: "camp-webinar-mfg",
    relatedName: "Manufacturing ERP Webinar Q2",
    createdAt: "2026-06-18T09:00:00",
  },
  {
    id: "act-011",
    activityNumber: "ACT-2026-0111",
    type: "follow_up",
    status: "overdue",
    priority: "high",
    title: "Re-engage stale lead — Bright Auto Parts",
    description: "No response in 14 days after initial outreach.",
    dueDate: "2026-06-14",
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    relatedType: "lead",
    relatedId: "lead-bright",
    relatedName: "Bright Auto Parts — Imran Hossain",
    createdAt: "2026-06-10T09:00:00",
  },
  {
    id: "act-012",
    activityNumber: "ACT-2026-0112",
    type: "call",
    status: "open",
    priority: "high",
    title: "Negotiation call — Delta Construction",
    dueDate: "2026-06-18",
    dueTime: "16:00",
    ownerId: "karim",
    ownerName: "Karim Hassan",
    relatedType: "opportunity",
    relatedId: "opp-delta",
    relatedName: "Delta Construction — Phase 2",
    createdAt: "2026-06-18T07:00:00",
  },
];

export function getActivityById(id: string): SmwActivity | undefined {
  return smwActivitiesSeed.find((a) => a.id === id);
}

export function activityStatusToEnterprise(status: ActivityStatus): EnterpriseStatus {
  const map: Record<ActivityStatus, EnterpriseStatus> = {
    scheduled: "pending",
    open: "active",
    in_progress: "active",
    completed: "approved",
    cancelled: "rejected",
    overdue: "rejected",
  };
  return map[status];
}

export function computeActivityMetrics(activities: SmwActivity[]) {
  const today = new Date().toISOString().slice(0, 10);
  const open = activities.filter((a) => ["open", "scheduled", "in_progress"].includes(a.status));
  const dueToday = activities.filter(
    (a) => a.dueDate === today && !["completed", "cancelled"].includes(a.status),
  );
  const overdue = activities.filter((a) => a.status === "overdue");
  const completedWeek = activities.filter((a) => a.status === "completed");
  return {
    openCount: open.length,
    dueTodayCount: dueToday.length,
    overdueCount: overdue.length,
    completedCount: completedWeek.length,
  };
}

export function emptyActivity(): SmwActivity {
  const owner = SMW_LEAD_OWNERS[0]!;
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `act-${Date.now()}`,
    activityNumber: `ACT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    type: "task",
    status: "open",
    priority: "normal",
    title: "",
    dueDate: today,
    ownerId: owner.id,
    ownerName: owner.name,
    relatedType: "none",
    createdAt: new Date().toISOString(),
  };
}

export function relatedEntityHref(activity: SmwActivity): string | null {
  if (!activity.relatedId || activity.relatedType === "none") return null;
  switch (activity.relatedType) {
    case "lead":
      return `/sales-marketing/leads/${activity.relatedId}`;
    case "opportunity":
      return `/sales-marketing/opportunities/${activity.relatedId}`;
    case "quotation":
      return `/sales-marketing/quotations?view=${activity.relatedId}`;
    case "campaign":
      return `/sales-marketing/campaigns?view=${activity.relatedId}`;
    default:
      return null;
  }
}
