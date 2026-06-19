import type { CrmActivity } from "./types";

export const crmActivitiesSeed: CrmActivity[] = [
  {
    id: "act-001",
    type: "call",
    title: "Discovery call — Metro Retail",
    relatedTo: "Metro Retail Ltd",
    ownerName: "Karim Hassan",
    dueDate: "2026-06-19",
    status: "completed",
    notes: "Discussed bulk pricing and delivery SLA.",
  },
  {
    id: "act-002",
    type: "meeting",
    title: "Demo — GreenMart category team",
    relatedTo: "GreenMart Superstores",
    ownerName: "Sadia Akter",
    dueDate: "2026-06-20",
    status: "scheduled",
  },
  {
    id: "act-003",
    type: "task",
    title: "Send revised quotation",
    relatedTo: "Metro Retail Ltd",
    ownerName: "Karim Hassan",
    dueDate: "2026-06-19",
    status: "open",
  },
  {
    id: "act-004",
    type: "follow_up",
    title: "Follow up — TechHub proposal",
    relatedTo: "TechHub Ltd",
    ownerName: "Nadia Chowdhury",
    dueDate: "2026-06-18",
    status: "overdue",
  },
  {
    id: "act-005",
    type: "call",
    title: "Check-in — MediCare Supplies",
    relatedTo: "MediCare Supplies",
    ownerName: "Farhana Rahman",
    dueDate: "2026-06-21",
    status: "scheduled",
  },
  {
    id: "act-006",
    type: "meeting",
    title: "Quarterly review — UrbanWear",
    relatedTo: "UrbanWear Retail",
    ownerName: "Farhana Rahman",
    dueDate: "2026-06-22",
    status: "scheduled",
  },
];

export const CRM_ACTIVITY_TYPE_LABELS = {
  call: "Call",
  meeting: "Meeting",
  task: "Task",
  follow_up: "Follow up",
  email: "Email",
} as const;

export function getCrmActivityById(id: string) {
  return crmActivitiesSeed.find((a) => a.id === id);
}

export const crmLeadActivities: Record<string, { id: string; user: string; action: string; time: string }[]> = {
  "lead-001": [
    { id: "la1", user: "Karim Hassan", action: "logged a call — discovery complete", time: "2h ago" },
    { id: "la2", user: "System", action: "lead score updated to 86", time: "2h ago" },
    { id: "la3", user: "Karim Hassan", action: "scheduled demo meeting", time: "1d ago" },
  ],
  "lead-002": [
    { id: "lb1", user: "Sadia Akter", action: "sent follow-up email", time: "1d ago" },
  ],
};

export const crmLeadHistory: Record<string, { at: string; event: string }[]> = {
  "lead-001": [
    { at: "2026-06-19 09:00", event: "Status changed to Qualified" },
    { at: "2026-06-15 14:30", event: "Owner assigned to Karim Hassan" },
    { at: "2026-06-01 10:00", event: "Lead created from Website form" },
  ],
};

export const crmLeadNotes: Record<string, { id: string; author: string; body: string; at: string }[]> = {
  "lead-001": [
    {
      id: "n1",
      author: "Karim Hassan",
      body: "Strong buying intent — wants pricing for 12 outlets by end of month.",
      at: "2026-06-18",
    },
  ],
};
