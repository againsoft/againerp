"use client";

import { useMemo } from "react";
import type { Employee } from "@/lib/mock-data/hr-employees";
import {
  getEmployeeProfile,
  isEmployeeProfileTab,
  type EmployeeProfileTab,
} from "@/lib/mock-data/hr-employee-profile";
import { useAppStore } from "@/lib/store/app-store";
import {
  EmployeeProfileHeader,
  EmployeeProfileSummary,
  EmployeeProfileTabBar,
} from "@/components/hr/employees/profile/employee-profile-chrome";
import { EmployeeProfileSidebar } from "@/components/hr/employees/profile/employee-profile-sidebar";
import { EmployeeProfileTabContent } from "@/components/hr/employees/profile/employee-profile-tab-content";
import { cn } from "@/lib/utils";

type Props = {
  employee: Employee;
  inDialog?: boolean;
  initialTab?: EmployeeProfileTab;
  onTabChange?: (tab: EmployeeProfileTab) => void;
  onClose?: () => void;
  onEdit?: (employee: Employee) => void;
};

export function EmployeeProfileWorkspace({
  employee,
  inDialog,
  initialTab = "overview",
  onTabChange,
  onClose,
  onEdit,
}: Props) {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);
  const profile = useMemo(() => getEmployeeProfile(employee), [employee]);
  const activeTab = isEmployeeProfileTab(initialTab) ? initialTab : "overview";

  const handleTabChange = (tab: EmployeeProfileTab) => {
    onTabChange?.(tab);
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", inDialog && "h-full")}>
      <EmployeeProfileHeader
        employee={employee}
        profile={profile}
        onEdit={onEdit}
        onClose={onClose}
        onTabChange={handleTabChange}
        onAskAi={toggleAiDrawer}
      />

      <EmployeeProfileSummary
        employee={employee}
        profile={profile}
        collapsed={activeTab !== "overview" && activeTab !== "employment"}
      />

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <EmployeeProfileTabBar activeTab={activeTab} onTabChange={handleTabChange} />

          <div
            role="tabpanel"
            className="min-h-0 flex-1 overflow-y-auto p-4"
            id={`employee-tab-${activeTab}`}
          >
            <EmployeeProfileTabContent tab={activeTab} employee={employee} profile={profile} />
          </div>

          {/* Zone D — mobile / tablet stack */}
          <EmployeeProfileSidebar
            employee={employee}
            profile={profile}
            className="border-t xl:hidden"
          />
        </div>

        {/* Zone D — desktop right rail */}
        <EmployeeProfileSidebar employee={employee} profile={profile} className="hidden xl:flex" />
      </div>
    </div>
  );
}
