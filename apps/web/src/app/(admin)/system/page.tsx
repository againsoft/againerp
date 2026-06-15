import Link from "next/link";
import { SettingsLayerNav } from "@/components/settings/settings-layer-nav";
import { Button } from "@/components/ui/button";

export default function SystemPage() {
  return (
    <div className="space-y-4">
      <SettingsLayerNav />
      <div>
        <p className="page-subtitle">AgainERP › System</p>
        <h1 className="page-title">System Hub</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Three-layer settings architecture — Business · Workspace · Control Center
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <HubCard
          title="Business Settings"
          desc="Store, catalog, checkout, payments — daily business config"
          href="/settings"
        />
        <HubCard
          title="Workspace Settings"
          desc="Users, roles, branches, workflows — organization management"
          href="/workspace"
        />
        <HubCard
          title="Control Center"
          desc="Licensing, AI, monitoring — platform intelligence (internal)"
          href="/control-center"
          internal
        />
      </div>
    </div>
  );
}

function HubCard({
  title,
  desc,
  href,
  internal,
}: {
  title: string;
  desc: string;
  href: string;
  internal?: boolean;
}) {
  return (
    <div className="rounded-xl border border-input bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{title}</p>
        {internal && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-800">
            Internal
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
      <Button variant="outline" size="sm" asChild className="mt-3">
        <Link href={href}>Open</Link>
      </Button>
    </div>
  );
}
