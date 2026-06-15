"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eye,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type EditorMode = "visual" | "code";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
};

const TOOLBAR: {
  cmd: string;
  icon: typeof Bold;
  label: string;
  arg?: string;
}[] = [
  { cmd: "bold", icon: Bold, label: "Bold" },
  { cmd: "italic", icon: Italic, label: "Italic" },
  { cmd: "underline", icon: Underline, label: "Underline" },
  { cmd: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
  { cmd: "insertUnorderedList", icon: List, label: "Bullet list" },
  { cmd: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { cmd: "formatBlock", icon: Quote, label: "Quote", arg: "<blockquote>" },
  { cmd: "justifyLeft", icon: AlignLeft, label: "Align left" },
  { cmd: "justifyCenter", icon: AlignCenter, label: "Align center" },
  { cmd: "justifyRight", icon: AlignRight, label: "Align right" },
];

export function WordPressClassicEditor({
  value,
  onChange,
  placeholder = "Write your content…",
  minRows = 12,
}: Props) {
  const [mode, setMode] = useState<EditorMode>("visual");
  const visualRef = useRef<HTMLDivElement>(null);
  const skipVisualSync = useRef(false);

  const exec = useCallback((command: string, arg?: string) => {
    if (mode !== "visual") return;
    visualRef.current?.focus();
    document.execCommand(command, false, arg);
    if (visualRef.current) {
      skipVisualSync.current = true;
      onChange(visualRef.current.innerHTML);
    }
  }, [mode, onChange]);

  const insertLink = useCallback(() => {
    if (mode !== "visual") return;
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    visualRef.current?.focus();
    document.execCommand("createLink", false, url);
    if (visualRef.current) {
      skipVisualSync.current = true;
      onChange(visualRef.current.innerHTML);
    }
  }, [mode, onChange]);

  useEffect(() => {
    if (mode !== "visual" || !visualRef.current) return;
    if (skipVisualSync.current) {
      skipVisualSync.current = false;
      return;
    }
    if (visualRef.current.innerHTML !== value) {
      visualRef.current.innerHTML = value;
    }
  }, [mode, value]);

  const switchMode = (next: EditorMode) => {
    if (next === mode) return;
    if (mode === "visual" && visualRef.current) {
      onChange(visualRef.current.innerHTML);
    }
    setMode(next);
  };

  const handleVisualInput = () => {
    if (!visualRef.current) return;
    skipVisualSync.current = true;
    onChange(visualRef.current.innerHTML);
  };

  const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

  return (
    <div className="overflow-hidden rounded-md border border-input bg-background shadow-sm">
      {/* WordPress-style tab bar */}
      <div className="flex items-center justify-between border-b border-input bg-muted/30 px-2 py-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-[11px]"
          onClick={() => toast.info("Add media — prototype")}
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Add Media
        </Button>
        <div className="flex overflow-hidden rounded-md border border-input bg-background text-[11px]">
          <button
            type="button"
            onClick={() => switchMode("visual")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 transition-colors",
              mode === "visual"
                ? "bg-background font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/50",
            )}
          >
            <Eye className="h-3 w-3" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => switchMode("code")}
            className={cn(
              "flex items-center gap-1 border-l border-input px-2.5 py-1 transition-colors",
              mode === "code"
                ? "bg-background font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/50",
            )}
          >
            <Code2 className="h-3 w-3" />
            Code
          </button>
        </div>
      </div>

      {/* Toolbar — visual mode only */}
      {mode === "visual" && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-[#fcfcfc] px-2 py-1 dark:bg-muted/20">
          {TOOLBAR.map(({ cmd, icon: Icon, label, arg }) => (
            <Button
              key={cmd + (arg ?? "")}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              title={label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(cmd, arg)}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            title="Insert link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertLink}
          >
            <Link2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {mode === "visual" ? (
        <div className="relative">
          <div
            ref={visualRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleVisualInput}
            className={cn(
              "min-h-[140px] px-3 py-2 text-sm leading-relaxed outline-none",
              "prose prose-sm max-w-none dark:prose-invert",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-3 [&_blockquote]:italic",
            )}
            style={{ minHeight: `${minRows * 1.5}rem` }}
            data-placeholder={placeholder}
          />
          {isEmpty && (
            <p className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
              {placeholder}
            </p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          spellCheck={false}
          className="min-h-[140px] resize-y rounded-none border-0 font-mono text-xs leading-relaxed focus-visible:ring-0"
        />
      )}

      <p className="border-t border-input bg-muted/20 px-2 py-1 text-[10px] text-muted-foreground">
        WordPress classic editor (prototype) · Visual + Code view
      </p>
    </div>
  );
}
