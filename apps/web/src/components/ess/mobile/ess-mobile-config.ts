/**
 * ESS mobile layout — routes, nav, search index
 * @see docs/modules/hr-payroll/uiux/ESS_PORTAL_UI_ARCHITECTURE.md
 */

import type { LucideIcon } from "lucide-react";
import { Calendar, ClipboardList, Clock, Home, Sparkles, Wallet } from "lucide-react";

export type EssMobileHeaderVariant = "dashboard" | "page" | "hidden";

export type EssMobileRouteMeta = {
  href: string;
  title: string;
  header: EssMobileHeaderVariant;
  match: (pathname: string) => boolean;
};

/** Primary bottom navigation — 5 tabs + center AI */
export const ESS_MOBILE_PRIMARY_NAV = [
  {
    id: "home",
    href: "/ess",
    label: "Home",
    icon: Home,
    match: (p: string) => p === "/ess",
  },
  {
    id: "attendance",
    href: "/ess/attendance",
    label: "Attendance",
    icon: Clock,
    match: (p: string) => p.startsWith("/ess/attendance"),
  },
  {
    id: "leave",
    href: "/ess/leave",
    label: "Leave",
    icon: Calendar,
    match: (p: string) => p.startsWith("/ess/leave"),
  },
  {
    id: "payslips",
    href: "/ess/payslips",
    label: "Payslips",
    icon: Wallet,
    match: (p: string) => p.startsWith("/ess/payslips"),
  },
  {
    id: "requests",
    href: "/ess/requests",
    label: "Requests",
    icon: ClipboardList,
    match: (p: string) => p.startsWith("/ess/requests"),
  },
] as const;

export const ESS_MOBILE_AI_NAV = {
  id: "ai",
  href: "/ess/ai",
  label: "AI",
  icon: Sparkles,
  match: (p: string) => p.startsWith("/ess/ai"),
};

export const ESS_MOBILE_ROUTE_META: EssMobileRouteMeta[] = [
  { href: "/ess", title: "Dashboard", header: "dashboard", match: (p) => p === "/ess" },
  { href: "/ess/attendance", title: "Attendance", header: "page", match: (p) => p.startsWith("/ess/attendance") },
  { href: "/ess/leave", title: "Leave", header: "page", match: (p) => p.startsWith("/ess/leave") },
  { href: "/ess/payslips", title: "Payslips", header: "page", match: (p) => p.startsWith("/ess/payslips") },
  { href: "/ess/requests", title: "Requests", header: "page", match: (p) => p.startsWith("/ess/requests") },
  { href: "/ess/ai", title: "AI Assistant", header: "page", match: (p) => p.startsWith("/ess/ai") },
  { href: "/ess/notifications", title: "Notifications", header: "page", match: (p) => p.startsWith("/ess/notifications") },
  { href: "/ess/assets", title: "Assets", header: "page", match: (p) => p.startsWith("/ess/assets") },
  { href: "/ess/documents", title: "Documents", header: "page", match: (p) => p.startsWith("/ess/documents") },
  { href: "/ess/training", title: "Training", header: "page", match: (p) => p.startsWith("/ess/training") },
  { href: "/ess/performance", title: "Performance", header: "page", match: (p) => p.startsWith("/ess/performance") },
];

export function getEssMobileRouteMeta(pathname: string): EssMobileRouteMeta {
  return ESS_MOBILE_ROUTE_META.find((r) => r.match(pathname)) ?? {
    href: pathname,
    title: "Employee Portal",
    header: "page",
    match: () => false,
  };
}
