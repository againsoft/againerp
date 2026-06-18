import Link from "next/link";
import { EssPage } from "@/components/ess/ess-page";
import { ESS_ALL_NOTIFICATIONS } from "@/lib/mock-data/ess-portal";
import { cn } from "@/lib/utils";

export default function EssNotificationsPage() {
  return (
    <EssPage>
        <ul className="space-y-2">
          {ESS_ALL_NOTIFICATIONS.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className={cn(
                  "block rounded-xl border p-4 transition-colors hover:bg-muted/50",
                  n.unread ? "border-primary/20 bg-primary/5" : "border-input",
                )}
              >
                <div className="flex items-start gap-2">
                  {n.unread ? (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-label="Unread" />
                  ) : (
                    <span className="mt-2 h-2 w-2 shrink-0" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
    </EssPage>
  );
}
