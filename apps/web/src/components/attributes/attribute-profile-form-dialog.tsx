"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AttributeProfile } from "@/lib/mock-data/attribute-profiles";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  profile?: AttributeProfile | null;
  onSave: (data: Partial<AttributeProfile>) => void;
};

export function AttributeProfileFormDialog({
  open,
  onOpenChange,
  mode = "create",
  profile,
  onSave,
}: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const categories = String(fd.get("categoryLabels") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({
      name: String(fd.get("name") ?? ""),
      code: String(fd.get("code") ?? ""),
      description: String(fd.get("description") ?? ""),
      active: fd.get("active") === "on",
      categoryLabels: categories,
      iconUrl: profile?.iconUrl ?? `https://picsum.photos/seed/prof${Date.now()}/64/64`,
    });
    toast.success(mode === "create" ? "Profile created (mock)" : "Profile updated (mock)");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(520px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-input bg-background p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">
              {mode === "create" ? "Add Attribute Profile" : "Edit Profile"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="rounded-md p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Profile name" required>
              <Input name="name" required defaultValue={profile?.name} placeholder="Laptop" />
            </Field>
            <Field label="Code" required hint="unique key">
              <Input name="code" required defaultValue={profile?.code} placeholder="laptop" />
            </Field>
            <Field label="Description">
              <Textarea name="description" rows={2} defaultValue={profile?.description} />
            </Field>
            <Field label="Category mapping" hint="comma separated">
              <Input
                name="categoryLabels"
                defaultValue={profile?.categoryLabels.join(", ")}
                placeholder="Computers, Laptops"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={profile?.active ?? true} />
              Active profile
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {mode === "create" ? "Create profile" : "Save"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
