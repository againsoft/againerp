"use client";

import { Bold, Italic, Link2, List, ListOrdered, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
};

export function RichTextEditor({ value, onChange, placeholder, minRows = 6 }: Props) {
  return (
    <div className="overflow-hidden rounded-md border border-input bg-background">
      <div className="flex items-center gap-0.5 overflow-x-auto border-b border-input bg-muted/40 px-2 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[Bold, Italic, List, ListOrdered, Link2].map((Icon, i) => (
          <Button key={i} type="button" variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Icon className="h-3.5 w-3.5" />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1 px-2 text-[11px]"
          onClick={() => toast.success("Mock: AI expanded description")}
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI write
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="min-h-[140px] resize-y border-0 focus-visible:ring-0"
      />
      <p className="border-t border-input px-2 py-1 text-[10px] text-muted-foreground">
        Rich text editor (prototype — toolbar mock)
      </p>
    </div>
  );
}
