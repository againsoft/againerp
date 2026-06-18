import { EssPage } from "@/components/ess/ess-page";
import { Badge } from "@/components/ui/badge";
import { ESS_PERFORMANCE } from "@/lib/mock-data/ess-portal";
import { cn } from "@/lib/utils";

export default function EssPerformancePage() {
  const perf = ESS_PERFORMANCE;

  return (
    <EssPage>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-[11px] text-muted-foreground">Current score</p>
            <p className="text-2xl font-semibold">{perf.currentScore}</p>
          </div>
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-[11px] text-muted-foreground">Last review</p>
            <p className="text-lg font-semibold">{perf.lastReview}</p>
          </div>
          <div className="rounded-xl border border-input bg-card p-4">
            <p className="text-[11px] text-muted-foreground">Next review</p>
            <p className="text-lg font-semibold">{perf.nextReview}</p>
          </div>
        </div>

        <Badge variant="secondary" className="text-xs">
          Self-review opens soon
        </Badge>

        <div>
          <h2 className="mb-2 text-sm font-semibold">Goals</h2>
          <ul className="space-y-3">
            {perf.goals.map((goal) => (
              <li key={goal.id} className="rounded-xl border border-input p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{goal.title}</p>
                  <Badge
                    variant={goal.status === "at_risk" ? "warning" : "success"}
                    className="text-[9px] capitalize"
                  >
                    {goal.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium tabular-nums">{goal.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        goal.status === "at_risk" ? "bg-amber-500" : "bg-emerald-500",
                      )}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
    </EssPage>
  );
}
