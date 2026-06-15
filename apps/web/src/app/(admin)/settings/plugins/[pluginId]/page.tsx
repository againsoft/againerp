"use client";

import { use } from "react";
import { PluginConfigWorkspace } from "@/components/settings/plugins/plugin-config-workspace";

type Props = { params: Promise<{ pluginId: string }> };

export default function PluginConfigPage({ params }: Props) {
  const { pluginId } = use(params);
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <PluginConfigWorkspace pluginId={pluginId} />
    </div>
  );
}
