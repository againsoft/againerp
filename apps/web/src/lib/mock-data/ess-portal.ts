/**
 * ESS Portal mock data — SCR-ESS-* · DSH-ESS-001
 * @see docs/modules/hr-payroll/uiux/ESS_PORTAL_UI_ARCHITECTURE.md
 */

import { getEmployeeById } from "@/lib/mock-data/hr-employees";
import { getEmployeeProfile } from "@/lib/mock-data/hr-employee-profile";

export const ESS_CURRENT_EMPLOYEE_ID = "emp-003";

export function getEssEmployeeContext() {
  const employee = getEmployeeById(ESS_CURRENT_EMPLOYEE_ID);
  if (!employee) throw new Error("ESS employee not found");
  const profile = getEmployeeProfile(employee);
  return { employee, profile };
}

export const ESS_DASHBOARD_KPIS = [
  { id: "WGT-ESS-KPI-001", label: "Attendance Rate", value: "94%", hint: "This month", href: "/ess/attendance" },
  { id: "WGT-ESS-KPI-002", label: "Leave Balance", value: "12 days", hint: "Annual leave", href: "/ess/leave" },
  { id: "WGT-ESS-KPI-004", label: "Training Progress", value: "78%", hint: "2 pending", href: "/ess/training" },
  { id: "WGT-ESS-KPI-005", label: "Performance Score", value: "4.2 / 5", hint: "Last review", href: "/ess/performance" },
];

export const ESS_QUICK_ACTIONS = [
  { id: "QUICK-ESS-001", label: "Apply Leave", href: "/ess/leave?create=1", icon: "calendar" as const },
  { id: "QUICK-ESS-002", label: "Attendance Correction", href: "/ess/attendance?correction=1", icon: "clock" as const },
  { id: "QUICK-ESS-003", label: "Download Payslip", href: "/ess/payslips", icon: "banknote" as const },
  { id: "QUICK-ESS-004", label: "Request Loan", href: "/ess/requests?type=loan&create=1", icon: "wallet" as const },
  { id: "QUICK-ESS-005", label: "Upload Document", href: "/ess/documents?upload=1", icon: "upload" as const },
];

export const ESS_UPCOMING_HOLIDAYS = [
  { id: "h1", name: "Eid-ul-Adha", date: "17 Jun 2026", type: "Public holiday" },
  { id: "h2", name: "National Mourning Day", date: "15 Aug 2026", type: "Public holiday" },
  { id: "h3", name: "Victory Day", date: "16 Dec 2026", type: "Public holiday" },
];

export const ESS_PENDING_REQUESTS = [
  {
    id: "req-1",
    type: "Attendance correction",
    title: "Missing check-out · 16 Jun",
    status: "pending",
    submittedAt: "17 Jun, 08:47 AM",
    href: "/ess/requests?view=req-1",
  },
  {
    id: "req-2",
    type: "Leave",
    title: "Annual leave · 24–28 Jun",
    status: "pending",
    submittedAt: "16 Jun, 09:02 AM",
    href: "/ess/leave?view=lv-2",
  },
];

export const ESS_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Leave request update",
    body: "Your annual leave (24–28 Jun) is awaiting HR approval.",
    time: "30 min ago",
    unread: true,
    href: "/ess/leave",
  },
  {
    id: "n2",
    title: "June payslip available",
    body: "Your payslip for June 2026 is ready to download.",
    time: "2h ago",
    unread: true,
    href: "/ess/payslips",
  },
  {
    id: "n3",
    title: "Training reminder",
    body: "Complete Information Security training by 21 Jun.",
    time: "Yesterday",
    unread: false,
    href: "/ess/training",
  },
];

export const ESS_RECENT_PAYSLIPS = [
  { id: "ps-6", period: "June 2026", payDate: "25 Jun 2026", netPay: "৳82,450", status: "published" },
  { id: "ps-5", period: "May 2026", payDate: "25 May 2026", netPay: "৳81,200", status: "published" },
  { id: "ps-4", period: "April 2026", payDate: "25 Apr 2026", netPay: "৳80,950", status: "published" },
];

export const ESS_AI_INSIGHTS = [
  {
    id: "ai-ess-1",
    title: "Attendance summary",
    summary: "You were present 22 of 23 working days this month. One late arrival on 12 Jun.",
    severity: "info" as const,
  },
  {
    id: "ai-ess-2",
    title: "Leave planning",
    summary: "You have 12 annual leave days remaining. Consider scheduling before year-end encashment cutoff.",
    severity: "info" as const,
  },
  {
    id: "ai-ess-3",
    title: "Training due",
    summary: "Information Security refresher is mandatory — due in 4 days.",
    severity: "warning" as const,
  },
];

export const ESS_ATTENDANCE_DAYS = [
  { date: "17 Jun", day: "Tue", checkIn: "08:52", checkOut: "—", status: "present", hours: "—" },
  { date: "16 Jun", day: "Mon", checkIn: "08:48", checkOut: "18:12", status: "present", hours: "9.4h" },
  { date: "15 Jun", day: "Sun", checkIn: "—", checkOut: "—", status: "weekend", hours: "—" },
  { date: "14 Jun", day: "Sat", checkIn: "—", checkOut: "—", status: "weekend", hours: "—" },
  { date: "13 Jun", day: "Fri", checkIn: "09:05", checkOut: "18:00", status: "late", hours: "8.9h" },
  { date: "12 Jun", day: "Thu", checkIn: "08:55", checkOut: "18:08", status: "present", hours: "9.2h" },
];

export const ESS_LEAVE_REQUESTS = [
  { id: "lv-1", type: "Annual leave", from: "24 Jun", to: "28 Jun", days: 5, status: "pending" },
  { id: "lv-2", type: "Sick leave", from: "03 May", to: "03 May", days: 1, status: "approved" },
];

export const ESS_PAYSLIPS = ESS_RECENT_PAYSLIPS.concat([
  { id: "ps-3", period: "March 2026", payDate: "25 Mar 2026", netPay: "৳80,600", status: "published" },
]);

export const ESS_ASSETS = [
  { id: "ast-1", name: "MacBook Pro 14\"", category: "Laptop", assignedDate: "01 Mar 2024", status: "active" },
  { id: "ast-2", name: "ID Card + Access Fob", category: "Access", assignedDate: "15 Jan 2020", status: "active" },
  { id: "ast-3", name: "Samsung A54", category: "Phone", assignedDate: "10 Jan 2025", status: "active" },
  { id: "ast-4", name: "Dell 27\" Monitor", category: "Monitor", assignedDate: "01 Mar 2024", status: "active" },
];

export const ESS_DOCUMENTS = [
  { id: "doc-1", name: "Employment contract", type: "Contract", uploaded: "15 Jan 2020", status: "verified" },
  { id: "doc-2", name: "NID copy", type: "Identity", uploaded: "15 Jan 2020", status: "verified" },
  { id: "doc-3", name: "TIN certificate", type: "Tax", uploaded: "10 Jun 2024", status: "verified" },
  { id: "doc-4", name: "Passport copy", type: "Identity", uploaded: "20 Aug 2023", status: "expiring", expiry: "Aug 2026" },
];

export const ESS_TRAINING = [
  { id: "tr-1", title: "Information Security Refresher", due: "21 Jun 2026", progress: 0, mandatory: true },
  { id: "tr-2", title: "React Advanced Patterns", due: "30 Jun 2026", progress: 65, mandatory: false },
  { id: "tr-3", title: "Workplace Safety 2026", due: "Completed", progress: 100, mandatory: true },
];

export const ESS_PERFORMANCE = {
  currentScore: "4.2 / 5",
  lastReview: "Dec 2025",
  nextReview: "24 Jun 2026",
  goals: [
    { id: "g1", title: "Deliver inventory module MVP", progress: 85, status: "on_track" },
    { id: "g2", title: "Mentor 1 junior developer", progress: 60, status: "on_track" },
    { id: "g3", title: "Reduce sprint carry-over to <10%", progress: 40, status: "at_risk" },
  ],
  selfReviewStatus: "opens_soon",
};

export const ESS_ALL_REQUESTS = [
  ...ESS_PENDING_REQUESTS,
  {
    id: "req-3",
    type: "Loan",
    title: "Personal loan · ৳150,000",
    status: "approved",
    submittedAt: "01 Jun 2026",
    href: "/ess/requests?view=req-3",
  },
  {
    id: "req-4",
    type: "Document",
    title: "Passport renewal upload",
    status: "rejected",
    submittedAt: "28 May 2026",
    href: "/ess/requests?view=req-4",
  },
];

export const ESS_ALL_NOTIFICATIONS = [
  ...ESS_NOTIFICATIONS,
  {
    id: "n4",
    title: "Performance review scheduled",
    body: "Q2 review meeting booked for 24 Jun at 2:00 PM.",
    time: "2 days ago",
    unread: false,
    href: "/ess/performance",
  },
  {
    id: "n5",
    title: "Holiday announcement",
    body: "Office closed 17 Jun for Eid-ul-Adha.",
    time: "3 days ago",
    unread: false,
    href: "/ess",
  },
];

export const ESS_MORE_LINKS = [
  { label: "My Assets", href: "/ess/assets" },
  { label: "My Documents", href: "/ess/documents" },
  { label: "My Training", href: "/ess/training" },
  { label: "My Performance", href: "/ess/performance" },
];

export type EssMobileSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: "page" | "action" | "record" | "payslip" | "attendance";
  keywords: string[];
};

export const ESS_MOBILE_SEARCH_INDEX: EssMobileSearchItem[] = [
  { id: "s1", title: "Apply for leave", subtitle: "Submit annual or sick leave", href: "/ess/leave?create=1", category: "action", keywords: ["leave", "apply", "time off", "vacation"] },
  { id: "s2", title: "Leave balance", subtitle: "12 days annual remaining", href: "/ess/leave", category: "page", keywords: ["leave", "balance", "days"] },
  { id: "s3", title: "My attendance", subtitle: "This month · 94% rate", href: "/ess/attendance", category: "attendance", keywords: ["attendance", "punch", "clock"] },
  { id: "s4", title: "Attendance correction", subtitle: "Request missing punch fix", href: "/ess/attendance?correction=1", category: "action", keywords: ["correction", "missing", "punch"] },
  { id: "s5", title: "June 2026 payslip", subtitle: "Net ৳82,450 · published", href: "/ess/payslips", category: "payslip", keywords: ["payslip", "salary", "june", "pay"] },
  { id: "s6", title: "Pending requests", subtitle: "2 awaiting approval", href: "/ess/requests?status=pending", category: "record", keywords: ["request", "pending", "approval"] },
  { id: "s7", title: "Information Security training", subtitle: "Due 21 Jun · mandatory", href: "/ess/training", category: "page", keywords: ["training", "security", "course"] },
  { id: "s8", title: "Performance review", subtitle: "Q2 opens 24 Jun", href: "/ess/performance", category: "page", keywords: ["performance", "review", "goals"] },
  { id: "s9", title: "AI Assistant", subtitle: "Ask about leave, pay, attendance", href: "/ess/ai", category: "action", keywords: ["ai", "assistant", "chat", "help"] },
  { id: "s10", title: "My documents", subtitle: "Contracts, NID, TIN", href: "/ess/documents", category: "page", keywords: ["document", "contract", "nid"] },
];

export const ESS_AI_PROMPT_CHIPS = [
  "Leave balance?",
  "Attendance this month",
  "Latest payslip",
  "Pending requests",
  "Training due",
];

export type EssAiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: { label: string; href: string };
};

export const ESS_AI_CHAT_HISTORY: EssAiChatMessage[] = [
  {
    id: "eai-1",
    role: "user",
    content: "How many annual leave days do I have left?",
  },
  {
    id: "eai-2",
    role: "assistant",
    content:
      "You have 12 annual leave days remaining (8 used of 20). Sick leave: 6 of 10 remaining. Consider scheduling before the 31 Dec encashment cutoff.",
    action: { label: "Apply for leave", href: "/ess/leave?create=1" },
  },
  {
    id: "eai-3",
    role: "user",
    content: "Show my attendance for this month.",
  },
  {
    id: "eai-4",
    role: "assistant",
    content:
      "You were present 22 of 23 working days (94% rate). One late arrival on 13 Jun. Today's check-in: 08:52.",
    action: { label: "View attendance", href: "/ess/attendance" },
  },
];

export const ESS_AI_INSIGHTS_MOBILE = [
  {
    id: "eins-1",
    title: "Leave planning",
    summary: "12 days left — book before year-end if you plan time off.",
    href: "/ess/leave",
  },
  {
    id: "eins-2",
    title: "Training due soon",
    summary: "Information Security refresher mandatory by 21 Jun.",
    href: "/ess/training",
  },
  {
    id: "eins-3",
    title: "June payslip ready",
    summary: "Net pay ৳82,450 — download from payslips.",
    href: "/ess/payslips",
  },
];
