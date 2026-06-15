"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { branches, companies, quickCreateItems } from "@/lib/navigation";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const toggleAi = useAppStore((s) => s.toggleAiDrawer);
  const utilityPanelOpen = useAppStore((s) => s.utilityPanelOpen);
  const toggleUtilityPanel = useAppStore((s) => s.toggleUtilityPanel);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const companyId = useAppStore((s) => s.companyId);
  const branchId = useAppStore((s) => s.branchId);
  const setCompany = useAppStore((s) => s.setCompany);
  const setBranch = useAppStore((s) => s.setBranch);

  const company = companies.find((c) => c.id === companyId);
  const branchList = branches.filter((b) => b.companyId === companyId);
  const branch = branchList.find((b) => b.id === branchId);

  return (
    <header className="flex h-11 shrink-0 items-center gap-1.5 border-b bg-background px-2.5 lg:px-3 text-sm">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
        <Menu className="h-4 w-4" />
      </Button>
      <Link href="/dashboard" className="hidden text-sm font-semibold tracking-tight sm:block">
        AgainERP
      </Link>
      <div className="relative mx-1.5 hidden max-w-sm flex-1 md:block">
        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Global search…" className="pl-8" />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="hidden gap-1 text-muted-foreground sm:flex"
        onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
      >
        <span className="text-xs">⌘K</span>
      </Button>
      <div className="relative group">
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Quick Create <ChevronDown className="h-3 w-3" />
        </Button>
        <div className="absolute right-0 top-full z-50 hidden min-w-[160px] rounded-md border border-input bg-popover p-1 shadow-md group-hover:block">
          {quickCreateItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-2 py-1.5 text-sm hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <select
        className="hidden h-8 max-w-[128px] truncate rounded-md border border-input bg-background px-2 text-[11px] lg:block"
        value={companyId}
        onChange={(e) => setCompany(e.target.value)}
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        className="hidden h-8 max-w-[108px] rounded-md border border-input bg-background px-2 text-[11px] md:block"
        value={branchId}
        onChange={(e) => setBranch(e.target.value)}
      >
        {branchList.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <Button variant="ghost" size="icon" title="Notifications">
        <Bell className="h-4 w-4" />
        <span className="absolute -mt-4 ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          12
        </span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Activity & Chatter"
        aria-label="Activity & Chatter"
        aria-pressed={utilityPanelOpen}
        onClick={toggleUtilityPanel}
        className={cn(utilityPanelOpen && "bg-accent text-foreground")}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleAi} title="AI Assistant">
        <Sparkles className="h-4 w-4 text-violet-500" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <div className="flex items-center gap-1.5 rounded-full border border-input px-1.5 py-0.5 text-[11px]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
          AD
        </div>
        <span className="hidden sm:inline">{company?.name?.split(" ")[0]}</span>
      </div>
    </header>
  );
}
