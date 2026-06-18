"use client";

import { ModuleNavSidebar } from "@/components/navigation/module-nav-sidebar";
import {
  SMW_MODULE_NAV,
  SMW_MODULE_ROOT,
  isSmwModulePath,
  isSmwNavItemActive,
  matchSmwNavHref,
} from "@/lib/mock-data/smw-navigation";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showCollapseToggle?: boolean;
  onNavigate?: () => void;
};

export function SmwSidebar({ className, showCollapseToggle, onNavigate }: Props) {
  const collapsed = useAppStore((s) => s.smwModuleNavCollapsed);
  const toggleSmwModuleNavCollapsed = useAppStore((s) => s.toggleSmwModuleNavCollapsed);
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);

  return (
    <ModuleNavSidebar
      items={SMW_MODULE_NAV}
      moduleTitle={SMW_MODULE_ROOT.title}
      moduleIcon={SMW_MODULE_ROOT.icon}
      collapsed={collapsed}
      onToggleCollapse={toggleSmwModuleNavCollapsed}
      isItemActive={(pathname, search, item) =>
        isSmwNavItemActive(pathname, search, item as (typeof SMW_MODULE_NAV)[number])
      }
      matchHref={matchSmwNavHref}
      filterRecent={isSmwModulePath}
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
