import { EssPage } from "@/components/ess/ess-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ESS_DOCUMENTS } from "@/lib/mock-data/ess-portal";
import { Upload } from "lucide-react";

export default function EssDocumentsPage() {
  return (
    <EssPage>
        <Button className="h-11 w-full gap-2 sm:w-auto" disabled>
          <Upload className="h-4 w-4" aria-hidden />
          Upload document
        </Button>
        <ul className="space-y-2">
          {ESS_DOCUMENTS.map((doc) => (
            <li key={doc.id} className="rounded-xl border border-input p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
                <Badge
                  variant={doc.status === "expiring" ? "warning" : "success"}
                  className="text-[10px] capitalize"
                >
                  {doc.status}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Uploaded {doc.uploaded}
                {doc.expiry ? ` · Expires ${doc.expiry}` : ""}
              </p>
            </li>
          ))}
        </ul>
    </EssPage>
  );
}
