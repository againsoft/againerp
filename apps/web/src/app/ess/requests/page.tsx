import Link from "next/link";
import { EssPage } from "@/components/ess/ess-page";
import { EssOfflineQueueHint } from "@/components/ess/mobile/ess-offline-banner";
import { Badge } from "@/components/ui/badge";
import { ESS_ALL_REQUESTS } from "@/lib/mock-data/ess-portal";

export default function EssRequestsPage() {
  return (
    <EssPage>
        <EssOfflineQueueHint />
        <p className="text-xs text-muted-foreground">Track leave, attendance corrections, loans, and document submissions.</p>
        <ul className="space-y-2">
          {ESS_ALL_REQUESTS.map((req) => (
            <li key={req.id}>
              <Link href={req.href} className="block rounded-xl border border-input p-4 hover:bg-muted/50">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {req.type}
                  </Badge>
                  <Badge
                    variant={
                      req.status === "approved" ? "success" : req.status === "rejected" ? "warning" : "secondary"
                    }
                    className="text-[10px] capitalize"
                  >
                    {req.status}
                  </Badge>
                </div>
                <p className="mt-2 font-medium">{req.title}</p>
                <p className="text-[11px] text-muted-foreground">{req.submittedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
    </EssPage>
  );
}
