"use client";

import { MessageSquare, Paperclip, StickyNote, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";

const activities = [
  { user: "Sadia", action: "updated price on SKU-0042", time: "5m ago" },
  { user: "Rahim", action: "published 3 products", time: "1h ago" },
  { user: "System", action: "low stock alert: Earbuds", time: "2h ago" },
];

export function UtilityPanel() {
  const open = useAppStore((s) => s.utilityPanelOpen);
  const toggle = useAppStore((s) => s.toggleUtilityPanel);

  if (!open) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="hidden w-8 shrink-0 border-l bg-muted/30 text-xs writing-mode-vertical xl:block"
      >
        Activity
      </button>
    );
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-l bg-muted/10 xl:flex text-xs">
      <div className="flex items-center justify-between border-b px-2.5 py-1.5">
        <span className="text-xs font-medium">Activity & Chatter</span>
        <button type="button" className="text-xs text-muted-foreground" onClick={toggle}>
          Hide
        </button>
      </div>
      <div className="flex border-b text-xs">
        {[
          { icon: Clock, label: "Activity" },
          { icon: MessageSquare, label: "Comments" },
          { icon: StickyNote, label: "Notes" },
          { icon: Paperclip, label: "Files" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2",
              tab.label === "Activity" && "border-b-2 border-primary",
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="rounded-md border bg-background p-2 text-xs">
            <p className="font-medium">{a.user}</p>
            <p className="text-muted-foreground">{a.action}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{a.time}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
