"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  History,
  LayoutDashboard,
  UserCheck,
  XCircle,
  AlertTriangle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ApprovalNavView =
  | "dashboard"
  | "my"
  | "pending"
  | "approved"
  | "rejected"
  | "escalated"
  | "delegated"
  | "history";

const NAV_ITEMS: {
  id: ApprovalNavView;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  match: (pathname: string, params: URLSearchParams) => boolean;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/inbox/approvals",
    icon: LayoutDashboard,
    match: (pathname, params) =>
      pathname === "/inbox/approvals" &&
      !params.get("status") &&
      !params.get("assignee") &&
      !params.get("view"),
  },
  {
    id: "my",
    label: "My Approvals",
    href: "/inbox/approvals?assignee=me&status=pending",
    icon: UserCheck,
    match: (_, params) => params.get("assignee") === "me",
  },
  {
    id: "pending",
    label: "Pending",
    href: "/inbox/approvals?status=pending",
    icon: Clock,
    match: (pathname, params) =>
      pathname === "/inbox/approvals" && params.get("status") === "pending" && params.get("assignee") !== "me",
  },
  {
    id: "approved",
    label: "Approved",
    href: "/inbox/approvals?status=approved",
    icon: CheckCircle2,
    match: (_, params) => params.get("status") === "approved",
  },
  {
    id: "rejected",
    label: "Rejected",
    href: "/inbox/approvals?status=rejected",
    icon: XCircle,
    match: (_, params) => params.get("status") === "rejected",
  },
  {
    id: "escalated",
    label: "Escalated",
    href: "/inbox/approvals?status=escalated",
    icon: AlertTriangle,
    match: (_, params) => params.get("status") === "escalated",
  },
  {
    id: "delegated",
    label: "Delegated",
    href: "/inbox/approvals?status=delegated",
    icon: Users,
    match: (_, params) => params.get("status") === "delegated",
  },
  {
    id: "history",
    label: "History",
    href: "/inbox/approvals/history",
    icon: History,
    match: (pathname) => pathname.startsWith("/inbox/approvals/history"),
  },
];

export function resolveApprovalNavView(pathname: string, params: URLSearchParams): ApprovalNavView {
  const item = NAV_ITEMS.find((n) => n.match(pathname, params));
  return item?.id ?? "pending";
}

export function ApprovalCenterNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav aria-label="Approval center views" className={cn("flex flex-col gap-0.5", className)}>
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname, searchParams);
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getApprovalViewTitle(view: ApprovalNavView): string {
  const titles: Record<ApprovalNavView, string> = {
    dashboard: "Approval Dashboard",
    my: "My Approvals",
    pending: "Pending Approvals",
    approved: "Approved",
    rejected: "Rejected",
    escalated: "Escalated",
    delegated: "Delegated",
    history: "Approval History",
  };
  return titles[view];
}
