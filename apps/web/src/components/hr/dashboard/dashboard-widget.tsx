import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DashboardWidgetProps = {
  title: string;
  children: ReactNode;
  className?: string;
  footer?: string;
  footerHref?: string;
  footerLabel?: string;
  id?: string;
};

export function DashboardWidget({
  title,
  children,
  className,
  footer = "Updated 5m ago",
  footerHref,
  footerLabel = "View details",
  id,
}: DashboardWidgetProps) {
  return (
    <section
      id={id}
      className={cn("flex flex-col rounded-lg border border-input bg-card", className)}
      aria-label={title}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          aria-label={`${title} options`}
          disabled
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden />
        </Button>
      </header>
      <div className="min-h-0 flex-1 p-4">{children}</div>
      {(footer || footerHref) && (
        <footer className="flex items-center justify-between gap-2 border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
          <span>{footer}</span>
          {footerHref ? (
            <Link
              href={footerHref}
              className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
            >
              {footerLabel}
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          ) : null}
        </footer>
      )}
    </section>
  );
}
