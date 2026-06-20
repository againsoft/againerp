"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ACCOUNT_TYPE_LABELS,
  type AccountType,
  type CoaAccount,
} from "@/lib/mock-data/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (account: CoaAccount, mode: "create" | "edit") => void;
  accounts: CoaAccount[];
  editAccount?: CoaAccount | null;
  defaultParentId?: string;
};

const ACCOUNT_TYPES: AccountType[] = ["asset", "liability", "equity", "revenue", "expense"];

export function CoaAccountFormSheet({
  open,
  onClose,
  onSave,
  accounts,
  editAccount,
  defaultParentId,
}: Props) {
  const isEdit = !!editAccount;
  const parentOptions = useMemo(
    () => accounts.filter((a) => accounts.some((c) => c.parentId === a.id) || !a.parentId),
    [accounts]
  );

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("expense");
  const [parentId, setParentId] = useState<string>("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (editAccount) {
      setCode(editAccount.code);
      setName(editAccount.name);
      setType(editAccount.type);
      setParentId(editAccount.parentId ?? "");
      setActive(editAccount.active);
    } else {
      setCode("");
      setName("");
      setType("expense");
      setParentId(defaultParentId ?? "5");
      setActive(true);
    }
  }, [open, editAccount, defaultParentId]);

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Code and name are required");
      return;
    }
    if (accounts.some((a) => a.code === code.trim() && a.id !== editAccount?.id)) {
      toast.error("Account code already exists");
      return;
    }
    const account: CoaAccount = {
      id: editAccount?.id ?? `coa-${Date.now()}`,
      code: code.trim(),
      name: name.trim(),
      type,
      parentId: parentId || undefined,
      balance: editAccount?.balance ?? 0,
      active,
    };
    onSave(account, isEdit ? "edit" : "create");
    toast.success(isEdit ? "Account updated" : "Account created");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div className="border-b border-border pb-4">
          <h2 className="font-semibold">{isEdit ? "Edit Account" : "Add Account"}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isEdit ? "Update account details" : "Create a new GL account under the chart"}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] text-muted-foreground">Account code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 5910" className="mt-1 h-8 text-xs font-mono" disabled={isEdit} />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Account name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Account name…" className="mt-1 h-8 text-xs" />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as AccountType)} className="mt-1 h-8 text-xs w-full">
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{ACCOUNT_TYPE_LABELS[t]}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Parent account</label>
            <Select value={parentId} onChange={(e) => setParentId(e.target.value)} className="mt-1 h-8 text-xs w-full">
              <option value="">None (root)</option>
              {parentOptions.map((a) => (
                <option key={a.id} value={a.id}>{a.code} — {a.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="coa-active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-input"
            />
            <label htmlFor="coa-active" className="text-xs">Active account</label>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button size="sm" onClick={handleSave}>{isEdit ? "Save changes" : "Create account"}</Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
