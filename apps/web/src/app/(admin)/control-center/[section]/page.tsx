"use client";

import { use } from "react";
import { SettingsCategoryWorkspace } from "@/components/settings/settings-category-workspace";

type Props = { params: Promise<{ section: string }> };

export default function ControlCenterSectionPage({ params }: Props) {
  const { section } = use(params);
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <SettingsCategoryWorkspace layer="platform" categoryId={section} />
    </div>
  );
}
