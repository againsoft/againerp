"use client";

import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/app-store";

export function TopNavAiAssistant() {
  const toggleAiDrawer = useAppStore((s) => s.toggleAiDrawer);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleAiDrawer();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggleAiDrawer]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 shrink-0"
      onClick={toggleAiDrawer}
      title="AI Assistant (Ctrl+J)"
      aria-label="Open AI assistant"
      aria-keyshortcuts="Control+J"
    >
      <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
    </Button>
  );
}
