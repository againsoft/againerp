"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Landmark,
  Plus,
  Scale,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  ACCOUNT_TYPE_LABELS,
  coaGlLinesByCode,
  formatBdt,
  getCoaByTemplate,
  type AccountType,
  type CoaAccount,
  type CoaTemplate,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CoaAccountFormSheet } from "./coa-account-form-sheet";
import { FinancePeriodBanner } from "./finance-period-banner";

const TYPE_COLORS: Record<AccountType, string> = {
  asset: "text-blue-600",
  liability: "text-amber-600",
  equity: "text-purple-600",
  revenue: "text-emerald-600",
  expense: "text-rose-600",
};

const TYPE_ICONS: Record<AccountType, React.ElementType> = {
  asset: Wallet,
  liability: Landmark,
  equity: Scale,
  revenue: TrendingUp,
  expense: TrendingDown,
};

function collectExpandableIds(accounts: CoaAccount[]): string[] {
  const childParentIds = new Set(accounts.map((a) => a.parentId).filter(Boolean));
  return accounts.filter((a) => childParentIds.has(a.id)).map((a) => a.id);
}

function CoaTreeNode({
  account,
  allAccounts,
  depth,
  selectedId,
  onSelect,
  expanded,
  toggle,
  searchActive,
  matchedIds,
}: {
  account: CoaAccount;
  allAccounts: CoaAccount[];
  depth: number;
  selectedId: string | null;
  onSelect: (a: CoaAccount) => void;
  expanded: Set<string>;
  toggle: (id: string) => void;
  searchActive: boolean;
  matchedIds: Set<string>;
}) {
  const children = allAccounts.filter((a) => a.parentId === account.id);
  const hasChildren = children.length > 0;
  const isExpanded = expanded.has(account.id) || searchActive;
  const isSelected = selectedId === account.id;
  const TypeIcon = TYPE_ICONS[account.type];
  const isRoot = !account.parentId;
  const isMatch = matchedIds.has(account.id);

  if (searchActive && !matchedIds.has(account.id)) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(account)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted/60",
          isSelected && "bg-indigo-50 dark:bg-indigo-950/40",
          !account.active && "opacity-50",
          searchActive && isMatch && "ring-1 ring-indigo-200"
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {hasChildren ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              toggle(account.id);
            }}
            className="shrink-0"
          >
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isRoot && <TypeIcon className={cn("h-3.5 w-3.5 shrink-0", TYPE_COLORS[account.type])} />}
        <Badge variant="secondary" className="font-mono text-[9px] px-1 py-0 shrink-0">{account.code}</Badge>
        <span className="flex-1 truncate font-medium">{account.name}</span>
        {account.balance !== 0 && (
          <span className={cn("tabular-nums text-[10px] shrink-0", account.balance < 0 ? "text-rose-600" : "text-muted-foreground")}>
            {formatBdt(account.balance)}
          </span>
        )}
      </button>
      {hasChildren && isExpanded &&
        children.map((child) => (
          <CoaTreeNode
            key={child.id}
            account={child}
            allAccounts={allAccounts}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            expanded={expanded}
            toggle={toggle}
            searchActive={searchActive}
            matchedIds={matchedIds}
          />
        ))}
    </>
  );
}

export function ChartOfAccounts() {
  const [template, setTemplate] = useState<CoaTemplate>("retail");
  const [accounts, setAccounts] = useState<CoaAccount[]>(() => getCoaByTemplate("retail"));
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CoaAccount | null>(() => getCoaByTemplate("retail")[1] ?? null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(collectExpandableIds(getCoaByTemplate("retail"))));
  const [formOpen, setFormOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<CoaAccount | null>(null);

  const matchedIds = useMemo(() => {
    if (!search.trim()) return new Set<string>();
    const q = search.toLowerCase();
    const direct = accounts.filter((a) => a.name.toLowerCase().includes(q) || a.code.includes(q));
    const ids = new Set(direct.map((a) => a.id));
    direct.forEach((a) => {
      let cur = a;
      while (cur.parentId) {
        ids.add(cur.parentId);
        cur = accounts.find((x) => x.id === cur.parentId)!;
      }
    });
    return ids;
  }, [search, accounts]);

  const roots = useMemo(() => accounts.filter((a) => !a.parentId), [accounts]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(collectExpandableIds(accounts)));
  const collapseAll = () => setExpanded(new Set(roots.map((r) => r.id)));

  const handleTemplateChange = (value: CoaTemplate) => {
    setTemplate(value);
    const next = getCoaByTemplate(value);
    setAccounts(next);
    setExpanded(new Set(collectExpandableIds(next)));
    setSelected(next.find((a) => a.code === "1100") ?? next[1] ?? null);
    toast.info(`Loaded ${value} COA template (${next.length} accounts)`);
  };

  const openCreate = () => {
    setEditAccount(null);
    setFormOpen(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setEditAccount(selected);
    setFormOpen(true);
  };

  const handleSaveAccount = (account: CoaAccount, mode: "create" | "edit") => {
    setAccounts((prev) => {
      if (mode === "edit") return prev.map((a) => (a.id === account.id ? account : a));
      return [...prev, account];
    });
    setSelected(account);
    if (mode === "create" && account.parentId) {
      setExpanded((prev) => new Set([...prev, account.parentId!]));
    }
  };

  const handleDeactivate = () => {
    if (!selected) return;
    setAccounts((prev) => prev.map((a) => (a.id === selected.id ? { ...a, active: false } : a)));
    setSelected({ ...selected, active: false });
    toast.warning(`${selected.code} deactivated`);
  };

  const glLines = selected ? coaGlLinesByCode[selected.code] ?? [] : [];

  return (
    <div className="flex flex-col gap-4">
      <FinancePeriodBanner />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by code or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Select
          value={template}
          onChange={(e) => handleTemplateChange(e.target.value as CoaTemplate)}
          className="h-8 w-40 text-xs"
        >
          <option value="retail">Retail</option>
          <option value="services">Services</option>
          <option value="manufacturing">Manufacturing</option>
        </Select>
        <Button variant="outline" size="sm" className="h-8" onClick={expandAll}>
          <ChevronsUpDown className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={collapseAll}>
          <ChevronsDownUp className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add account
        </Button>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>{accounts.length} accounts</span>
        <span>·</span>
        <span>{accounts.filter((a) => a.active).length} active</span>
        <span>·</span>
        <span>Template: {template}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-5 min-h-[420px]">
        <div className="lg:col-span-2 rounded-xl border border-input bg-card p-2 overflow-y-auto max-h-[560px]">
          {roots.map((root) => (
            <CoaTreeNode
              key={root.id}
              account={root}
              allAccounts={accounts}
              depth={0}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
              expanded={expanded}
              toggle={toggle}
              searchActive={!!search.trim()}
              matchedIds={matchedIds}
            />
          ))}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-input bg-card p-4">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-mono text-[10px]">{selected.code}</Badge>
                    <h2 className="font-semibold">{selected.name}</h2>
                    {!selected.active && <Badge variant="muted" className="text-[10px]">Inactive</Badge>}
                  </div>
                  <p className={cn("mt-1 text-xs font-medium", TYPE_COLORS[selected.type])}>
                    {ACCOUNT_TYPE_LABELS[selected.type]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={openEdit}>Edit</Button>
                  {selected.active && (
                    <Button variant="outline" size="sm" onClick={handleDeactivate}>Deactivate</Button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Current Balance", value: formatBdt(selected.balance) },
                  { label: "YTD Movement", value: formatBdt(Math.abs(selected.balance) * 0.12) },
                  { label: "Parent", value: selected.parentId ? accounts.find((a) => a.id === selected.parentId)?.name ?? "—" : "Root" },
                  { label: "Status", value: selected.active ? "Active" : "Inactive" },
                ].map((r) => (
                  <div key={r.label} className="rounded-lg border border-input bg-muted/30 p-3">
                    <p className="text-[11px] text-muted-foreground">{r.label}</p>
                    <p className="text-sm font-semibold truncate">{r.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-medium mb-2">Recent GL Lines</h3>
                {glLines.length > 0 ? (
                  <div className="rounded-lg border border-input overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Date</th>
                          <th className="px-3 py-2 text-left font-medium">Reference</th>
                          <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">Description</th>
                          <th className="px-3 py-2 text-right font-medium">Debit</th>
                          <th className="px-3 py-2 text-right font-medium">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {glLines.map((line) => (
                          <tr key={line.ref} className="border-t border-border">
                            <td className="px-3 py-2">{line.date}</td>
                            <td className="px-3 py-2 font-mono">{line.ref}</td>
                            <td className="px-3 py-2 hidden sm:table-cell text-muted-foreground">{line.description}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{line.debit ? formatBdt(line.debit) : "—"}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{line.credit ? formatBdt(line.credit) : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-input p-4 text-center">
                    No GL activity for this account in the current period.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select an account from the tree.</p>
          )}
        </div>
      </div>

      <CoaAccountFormSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveAccount}
        accounts={accounts}
        editAccount={editAccount}
        defaultParentId={selected?.parentId ?? selected?.id ?? "5"}
      />
    </div>
  );
}
