"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getEssEmployeeContext } from "@/lib/mock-data/ess-portal";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";

type Props = {
  showBack?: boolean;
  title?: string;
};

export function EssHeader({ showBack, title }: Props) {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const { employee } = getEssEmployeeContext();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (showBack && title) {
    return (
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-input bg-background/95 px-4 py-3 backdrop-blur">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" asChild>
          <Link href="/ess" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{title}</h1>
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={toggleAiDrawer}>
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
        </Button>
      </header>
    );
  }

  return (
    <header className="border-b border-input bg-gradient-to-br from-primary/5 to-background px-4 py-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary"
          aria-hidden
        >
          {employee.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{greeting}</p>
          <h1 className="truncate text-lg font-semibold">{employee.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{employee.designation}</p>
          <p className="text-xs text-muted-foreground">
            {employee.department} · {employee.branch}
          </p>
        </div>
        <Button type="button" variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={toggleAiDrawer}>
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
        </Button>
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">{employee.employeeNumber}</p>
    </header>
  );
}
