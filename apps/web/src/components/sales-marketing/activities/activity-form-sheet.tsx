"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_RELATED_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  SMW_ACTIVITY_OWNERS,
  emptyActivity,
  type ActivityPriority,
  type ActivityRelatedType,
  type ActivityStatus,
  type ActivityType,
  type SmwActivity,
} from "@/lib/mock-data/smw-activities";
import { useSmwActivityStore } from "@/lib/store/smw-activity-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  activity: SmwActivity | null;
  onSaved: (activity: SmwActivity) => void;
};

export function ActivityFormSheet({ open, onOpenChange, mode, activity, onSaved }: Props) {
  const upsertActivity = useSmwActivityStore((s) => s.upsertActivity);
  const [form, setForm] = useState<SmwActivity>(activity ?? emptyActivity());

  useEffect(() => {
    setForm(activity ?? emptyActivity());
  }, [activity, open, mode]);

  const save = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const owner = SMW_ACTIVITY_OWNERS.find((o) => o.id === form.ownerId) ?? SMW_ACTIVITY_OWNERS[0]!;
    const saved: SmwActivity = { ...form, title: form.title.trim(), ownerName: owner.name };
    upsertActivity(saved);
    onSaved(saved);
    toast.success(mode === "create" ? "Activity logged" : "Activity updated");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{mode === "create" ? "Log activity" : `Edit · ${activity?.title}`}</h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-ACT-001</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2">
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Type">
              <Select value={form.type} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ActivityType }))}>
                {(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((t) => (
                  <option key={t} value={t}>{ACTIVITY_TYPE_LABELS[t]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ActivityStatus }))}>
                {(Object.keys(ACTIVITY_STATUS_LABELS) as ActivityStatus[]).map((s) => (
                  <option key={s} value={s}>{ACTIVITY_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as ActivityPriority }))}>
                {(Object.keys(ACTIVITY_PRIORITY_LABELS) as ActivityPriority[]).map((p) => (
                  <option key={p} value={p}>{ACTIVITY_PRIORITY_LABELS[p]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={form.ownerId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}>
                {SMW_ACTIVITY_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Due date">
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Due time">
              <Input type="time" value={form.dueTime ?? ""} onChange={(e) => setForm((f) => ({ ...f, dueTime: e.target.value || undefined }))} className="h-9" />
            </Field>
            <Field label="Related type">
              <Select value={form.relatedType} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, relatedType: e.target.value as ActivityRelatedType }))}>
                {(Object.keys(ACTIVITY_RELATED_LABELS) as ActivityRelatedType[]).map((rt) => (
                  <option key={rt} value={rt}>{ACTIVITY_RELATED_LABELS[rt]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Related name">
              <Input value={form.relatedName ?? ""} onChange={(e) => setForm((f) => ({ ...f, relatedName: e.target.value || undefined }))} className="h-9" placeholder="Optional" />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || undefined }))} className="h-9" />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="button" className="flex-1" onClick={save}>{mode === "create" ? "Log" : "Save"}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}
