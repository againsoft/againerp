"use client";

import { ModuleNavSidebar } from "@/components/navigation/module-nav-sidebar";
import {
  HR_MODULE_NAV,
  HR_MODULE_ROOT,
  isHrModulePath,
  isNavItemActive,
  matchNavHref,
} from "@/lib/mock-data/hr-navigation";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showCollapseToggle?: boolean;
  onNavigate?: () => void;
};

export function HrSidebar({ className, showCollapseToggle, onNavigate }: Props) {
  const collapsed = useAppStore((s) => s.hrModuleNavCollapsed);
  const toggleHrModuleNavCollapsed = useAppStore((s) => s.toggleHrModuleNavCollapsed);
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);

  return (
    <ModuleNavSidebar
      items={HR_MODULE_NAV}
      moduleTitle={HR_MODULE_ROOT.title}
      moduleIcon={HR_MODULE_ROOT.icon}
      collapsed={collapsed}
      onToggleCollapse={toggleHrModuleNavCollapsed}
      isItemActive={(pathname, search, item) =>
        isNavItemActive(pathname, search, item as (typeof HR_MODULE_NAV)[number])
      }
      matchHref={matchNavHref}
      filterRecent={isHrModulePath}
      className={cn(className)}
      showCollapseToggle={showCollapseToggle}
      onNavigate={() => onNavigate?.()}
      onAction={(action) => {
        if (action === "ai-chat") toggleAiDrawer();
        onNavigate?.();
      }}
    />
  );
}
