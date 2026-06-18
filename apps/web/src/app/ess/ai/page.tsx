"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { EssMobilePage } from "@/components/ess/mobile/ess-mobile-page";
import { EssOfflineQueueHint } from "@/components/ess/mobile/ess-offline-banner";
import {
  ESS_AI_CHAT_HISTORY,
  ESS_AI_INSIGHTS_MOBILE,
  ESS_AI_PROMPT_CHIPS,
} from "@/lib/mock-data/ess-portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** SCR-ESS-AI-001 — Full-screen mobile AI assistant page */
export default function EssAiPage() {
  const [draft, setDraft] = useState("");

  return (
    <EssMobilePage className="flex min-h-[calc(100dvh-12rem)] flex-col gap-0 p-0">
      <div className="border-b border-violet-200 bg-gradient-to-r from-violet-50 to-background px-4 py-3 dark:border-violet-900 dark:from-violet-950/40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold">My Assistant</h2>
            <p className="text-[10px] text-muted-foreground">workforce_ess_agent · self scope · advisory only</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <EssOfflineQueueHint />
      </div>

      <section aria-label="AI insights" className="px-4 pb-3">
        <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Insights for you</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ESS_AI_INSIGHTS_MOBILE.map((insight) => (
            <Link
              key={insight.id}
              href={insight.href}
              className="min-w-[200px] shrink-0 rounded-xl border border-violet-200 bg-violet-50/50 p-3 dark:border-violet-900 dark:bg-violet-950/30"
            >
              <p className="text-xs font-semibold">{insight.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{insight.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-1.5 border-y border-input px-4 py-2">
        {ESS_AI_PROMPT_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setDraft(chip)}
            className="min-h-[36px] rounded-full border border-input bg-muted/30 px-3 py-1.5 text-[11px] font-medium hover:bg-muted"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {ESS_AI_CHAT_HISTORY.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                msg.role === "user"
                  ? "bg-primary/10 text-primary"
                  : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
              )}
              aria-hidden
            >
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={cn("max-w-[85%] space-y-1.5", msg.role === "user" && "text-right")}>
              <div
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50",
                )}
              >
                {msg.content}
              </div>
              {msg.action ? (
                <Link href={msg.action.href} className="text-[11px] font-medium text-primary hover:underline">
                  {msg.action.label} →
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <footer className="sticky bottom-0 border-t border-input bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
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
            placeholder="Ask anything about your work…"
            className="h-11"
            aria-label="AI message"
          />
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={!draft.trim()}>
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI cannot submit requests without your confirmation
        </p>
      </footer>
    </EssMobilePage>
  );
}
