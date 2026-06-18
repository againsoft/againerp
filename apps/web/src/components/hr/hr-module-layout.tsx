"use client";

import { Menu } from "lucide-react";
import { Suspense, useState, type ReactNode } from "react";
import { HrSidebar } from "@/components/hr/hr-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function HrModuleLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="-mx-3 -mb-3 flex min-h-[calc(100vh-2.75rem)] flex-1 flex-col lg:-mx-4 lg:-mb-4 lg:min-h-[calc(100vh-2.75rem)]">
      <div className="flex min-h-0 flex-1">
        <div className="hidden shrink-0 md:flex">
          <Suspense
            fallback={
              <aside className="h-full w-56 shrink-0 border-r bg-muted/10 lg:w-60" aria-hidden />
            }
          >
            <HrSidebar className="h-full min-h-0" />
          </Suspense>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-2 border-b bg-background px-3 py-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open HR navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
            <span className="text-sm font-medium">HR &amp; Payroll</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-4">{children}</div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(100vw,18rem)] gap-0 p-0">
          <Suspense fallback={null}>
            <HrSidebar
              className="h-full w-full border-0"
              showCollapseToggle={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </Suspense>
        </SheetContent>
      </Sheet>
    </div>
  );
}
