import Link from "next/link";
import { EssPage } from "@/components/ess/ess-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ESS_LEAVE_REQUESTS, getEssEmployeeContext } from "@/lib/mock-data/ess-portal";

export default function EssLeavePage() {
  const { profile } = getEssEmployeeContext();

  return (
    <EssPage>
        <div className="grid gap-2 sm:grid-cols-3">
          {profile.leaveBalances.map((bal) => (
            <div key={bal.type} className="rounded-xl border border-input bg-card p-3">
              <p className="text-[11px] text-muted-foreground">{bal.type}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {bal.total - bal.used} <span className="text-sm font-normal text-muted-foreground">/ {bal.total}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">{bal.used} used</p>
            </div>
          ))}
        </div>

        <Button className="h-11 w-full sm:w-auto" asChild>
          <Link href="/ess/leave?create=1">Apply for leave</Link>
        </Button>

        <div>
          <h2 className="mb-2 text-sm font-semibold">My requests</h2>
          <ul className="space-y-2">
            {ESS_LEAVE_REQUESTS.map((req) => (
              <li key={req.id} className="rounded-lg border border-input p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{req.type}</p>
                  <Badge variant={req.status === "approved" ? "success" : "warning"} className="text-[10px] capitalize">
                    {req.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {req.from} – {req.to} · {req.days} days
                </p>
              </li>
            ))}
          </ul>
        </div>
    </EssPage>
  );
}
