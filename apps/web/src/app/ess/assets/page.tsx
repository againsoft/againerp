import { EssPage } from "@/components/ess/ess-page";
import { Badge } from "@/components/ui/badge";
import { ESS_ASSETS } from "@/lib/mock-data/ess-portal";

export default function EssAssetsPage() {
  return (
    <EssPage>
        <ul className="space-y-2">
          {ESS_ASSETS.map((asset) => (
            <li key={asset.id} className="rounded-xl border border-input p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.category}</p>
                </div>
                <Badge variant="success" className="text-[10px] capitalize">
                  {asset.status}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Assigned {asset.assignedDate}</p>
            </li>
          ))}
        </ul>
    </EssPage>
  );
}
