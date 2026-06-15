"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { createEmptyBulkAttribute, type BulkAttributeRow } from "@/lib/mock-data/attribute-profiles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function reorderByKey<T extends { key: string }>(items: T[], fromKey: string, toKey: string): T[] {
  const from = items.findIndex((i) => i.key === fromKey);
  const to = items.findIndex((i) => i.key === toKey);
  if (from < 0 || to < 0 || from === to) return items;
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

type SortableAttributeGridProps = {
  attributes: BulkAttributeRow[];
  onChange: (attributes: BulkAttributeRow[]) => void;
};

export function SortableAttributeGrid({ attributes, onChange }: SortableAttributeGridProps) {
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  const updateName = (key: string, name: string) => {
    onChange(attributes.map((a) => (a.key === key ? { ...a, name } : a)));
  };

  const removeAttribute = (key: string) => {
    onChange(attributes.filter((a) => a.key !== key));
  };

  const addAttribute = () => {
    onChange([...attributes, createEmptyBulkAttribute()]);
  };

  const handleDrop = (targetKey: string) => {
    if (!dragKey || dragKey === targetKey) return;
    onChange(reorderByKey(attributes, dragKey, targetKey));
    setDragKey(null);
    setOverKey(null);
  };

  if (attributes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input py-6 text-center">
        <p className="text-xs text-muted-foreground">No attributes in this group yet</p>
        <Button type="button" variant="outline" size="sm" className="mt-3 h-7 text-xs" onClick={addAttribute}>
          <Plus className="mr-1 h-3 w-3" />
          Add attribute
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">
        <GripVertical className="mr-0.5 inline h-3 w-3" />
        Drag to reorder · 2 columns
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {attributes.map((attr) => (
          <div
            key={attr.key}
            draggable
            onDragStart={() => setDragKey(attr.key)}
            onDragEnd={() => {
              setDragKey(null);
              setOverKey(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverKey(attr.key);
            }}
            onDragLeave={() => setOverKey((k) => (k === attr.key ? null : k))}
            onDrop={() => handleDrop(attr.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border border-input bg-background p-1.5 transition-shadow",
              dragKey === attr.key && "opacity-50",
              overKey === attr.key && dragKey !== attr.key && "border-primary ring-2 ring-primary/25",
            )}
          >
            <button
              type="button"
              className="cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:text-foreground active:cursor-grabbing"
              aria-label="Drag to reorder"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <Input
              value={attr.name}
              onChange={(e) => updateName(attr.key, e.target.value)}
              placeholder="Attribute name"
              className="h-8 min-w-0 flex-1 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 shrink-0 p-0 text-destructive"
              onClick={() => removeAttribute(attr.key)}
              aria-label="Remove attribute"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={addAttribute}>
        <Plus className="mr-1 h-3 w-3" />
        Add attribute
      </Button>
    </div>
  );
}

export function reorderGroupsByKey<T extends { key: string }>(
  groups: T[],
  fromKey: string,
  toKey: string,
): T[] {
  return reorderByKey(groups, fromKey, toKey);
}
