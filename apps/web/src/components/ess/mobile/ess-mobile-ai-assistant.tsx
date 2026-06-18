"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEssMobileStore } from "@/components/ess/mobile/ess-mobile-store";
import {
  ESS_AI_CHAT_HISTORY,
  ESS_AI_PROMPT_CHIPS,
} from "@/lib/mock-data/ess-portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/** ESS-scoped AI assistant — bottom sheet on mobile */
export function EssMobileAiAssistant() {
  const open = useEssMobileStore((s) => s.essAiOpen);
  const setEssAiOpen = useEssMobileStore((s) => s.setEssAiOpen);
  const [draft, setDraft] = useState("");

  return (
    <Sheet open={open} onOpenChange={setEssAiOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <div className="border-b border-violet-200 bg-gradient-to-r from-violet-50 to-background px-4 py-3 dark:border-violet-900 dark:from-violet-950/40">
          <div className="flex items-center gap-2 pr-8">
            <Sparkles className="h-5 w-5 text-violet-500" aria-hidden />
            <div>
              <h2 className="text-base font-semibold">My Assistant</h2>
              <p className="text-[10px] text-muted-foreground">workforce_ess_agent · self scope only</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-input px-3 py-2">
          {ESS_AI_PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setDraft(chip)}
              className="rounded-full border border-input bg-muted/30 px-2.5 py-1 text-[10px] font-medium hover:bg-muted"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {ESS_AI_CHAT_HISTORY.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  msg.role === "user"
                    ? "bg-primary/10 text-primary"
                    : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
                )}
                aria-hidden
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn("max-w-[85%] space-y-1", msg.role === "user" && "text-right")}>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50",
                  )}
                >
                  {msg.content}
                </div>
                {msg.action ? (
                  <Link
                    href={msg.action.href}
                    onClick={() => setEssAiOpen(false)}
                    className="inline-block text-[10px] font-medium text-primary hover:underline"
                  >
                    {msg.action.label} →
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t border-input p-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setDraft("");
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about leave, attendance, payslips…"
              className="h-11"
              aria-label="AI message"
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={!draft.trim()}>
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Advisory only · confirms before submit</span>
            <Link href="/ess/ai" onClick={() => setEssAiOpen(false)} className="font-medium text-primary hover:underline">
              Full workspace
            </Link>
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
