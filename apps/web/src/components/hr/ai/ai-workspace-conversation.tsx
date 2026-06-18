"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import {
  AI_CHAT_HISTORY,
  AI_SUGGESTED_PROMPTS,
  type AiChatMessage,
} from "@/lib/mock-data/hr-ai-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** ZONE B — Conversation area */
export function AiWorkspaceConversation() {
  const [messages] = useState<AiChatMessage[]>(AI_CHAT_HISTORY);
  const [draft, setDraft] = useState("");

  return (
    <section aria-label="AI conversation" className="flex min-h-0 flex-1 flex-col rounded-lg border border-input bg-card">
      <div className="border-b border-border/60 px-4 py-2.5">
        <h2 className="text-sm font-semibold">Conversation</h2>
        <p className="text-[11px] text-muted-foreground">Session · workforce_agent · 17 Jun 2026</p>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2">
        {AI_SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setDraft(prompt)}
            className="rounded-full border border-input bg-muted/30 px-2.5 py-1 text-[10px] font-medium hover:bg-muted"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" style={{ maxHeight: "min(520px, 50vh)" }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <footer className="border-t border-border/60 p-3">
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
            placeholder="Ask anything about workforce, attendance, leave, payroll…"
            className="h-10 text-sm"
            aria-label="AI message"
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={!draft.trim()}>
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </form>
        <p className="mt-2 text-[10px] text-muted-foreground">
          AI responses are advisory. Confirm before applying payroll or approval actions.
        </p>
      </footer>
    </section>
  );
}

function MessageBubble({ message }: { message: AiChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary/10 text-primary" : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
        )}
        aria-hidden
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("max-w-[85%] space-y-2", isUser && "text-right")}>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted/50",
          )}
        >
          {message.content}
        </div>

        {message.structured ? (
          <div className="flex flex-wrap gap-2">
            {message.structured.items.map((item) => (
              <div key={item.label} className="rounded-md border border-input bg-background px-2.5 py-1.5 text-center">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        {message.citations && message.citations.length > 0 ? (
          <div className={cn("flex flex-wrap gap-1", isUser && "justify-end")}>
            {message.citations.map((c, i) => (
              <Link
                key={c.id}
                href={c.href}
                className="rounded border border-input bg-background px-1.5 py-0.5 text-[10px] font-medium text-primary hover:underline"
              >
                [{i + 1}] {c.label}
              </Link>
            ))}
          </div>
        ) : null}

        {message.suggestedActions && message.suggestedActions.length > 0 ? (
          <div className={cn("flex flex-wrap gap-1", isUser && "justify-end")}>
            {message.suggestedActions.map((action) =>
              action.href ? (
                <Link
                  key={action.id}
                  href={action.href}
                  className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-medium text-violet-800 hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-200"
                >
                  {action.label} →
                </Link>
              ) : (
                <Badge key={action.id} variant="outline" className="text-[10px]">
                  {action.label}
                </Badge>
              ),
            )}
          </div>
        ) : null}

        <p className="text-[10px] text-muted-foreground">{message.timestamp}</p>
      </div>
    </div>
  );
}
