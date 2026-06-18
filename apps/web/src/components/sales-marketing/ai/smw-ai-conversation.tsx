"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { SMW_AI_CHAT, SMW_AI_PROMPTS, type SmwAiChatMessage } from "@/lib/mock-data/smw-ai-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SmwAiConversation() {
  const [messages] = useState<SmwAiChatMessage[]>(SMW_AI_CHAT);
  const [draft, setDraft] = useState("");

  return (
    <section aria-label="AI conversation" className="flex min-h-0 flex-1 flex-col rounded-lg border border-input bg-card">
      <div className="border-b border-border/60 px-4 py-2.5">
        <h2 className="text-sm font-semibold">Conversation</h2>
        <p className="text-[11px] text-muted-foreground">Session · revenue_agent · 18 Jun 2026</p>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2">
        {SMW_AI_PROMPTS.map((prompt) => (
          <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="rounded-full border border-input bg-muted/30 px-2.5 py-1 text-[10px] font-medium hover:bg-muted">
            {prompt}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" style={{ maxHeight: "min(520px, 50vh)" }}>
        {messages.map((msg) => (
          <Bubble key={msg.id} message={msg} />
        ))}
      </div>
      <footer className="border-t border-border/60 p-3">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setDraft(""); }}>
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about pipeline, leads, campaigns, forecasts…" className="h-10 text-sm" aria-label="AI message" />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={!draft.trim()}>
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </form>
        <p className="mt-2 text-[10px] text-muted-foreground">AI responses are advisory. Confirm before changing quotes, targets, or deal stages.</p>
      </footer>
    </section>
  );
}

function Bubble({ message }: { message: SmwAiChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", isUser ? "bg-muted" : "bg-violet-600 text-white")}>
        {isUser ? <User className="h-3.5 w-3.5" aria-hidden /> : <Bot className="h-3.5 w-3.5" aria-hidden />}
      </div>
      <div className={cn("max-w-[85%] space-y-2", isUser && "text-right")}>
        <div className={cn("rounded-lg px-3 py-2 text-sm", isUser ? "bg-muted text-foreground" : "bg-violet-50 text-foreground dark:bg-violet-950/40")}>
          {message.content}
        </div>
        <p className="text-[10px] text-muted-foreground">{message.timestamp}</p>
        {message.structured && (
          <div className="flex flex-wrap gap-2">
            {message.structured.items.map((item) => (
              <Badge key={item.label} variant="secondary" className="text-[10px]">{item.label}: {item.value}</Badge>
            ))}
          </div>
        )}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.citations.map((c) => (
              <Link key={c.id} href={c.href} className="text-[10px] text-violet-600 underline-offset-2 hover:underline dark:text-violet-400">{c.label}</Link>
            ))}
          </div>
        )}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.suggestedActions.map((a) => (
              <Button key={a.id} type="button" variant="outline" size="sm" className="h-7 text-[10px]" asChild={!!a.href}>
                {a.href ? <Link href={a.href}>{a.label}</Link> : <span>{a.label}</span>}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
