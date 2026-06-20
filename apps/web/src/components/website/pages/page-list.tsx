"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsiteNav } from "@/components/website/website-nav";
import {
  websitePagesSeed,
  PAGE_STATUS_LABELS,
  type WebsitePageStatus,
} from "@/lib/mock-data/website";

const STATUS_TABS: { key: WebsitePageStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "review", label: "In Review" },
  { key: "archived", label: "Archived" },
];

const statusColor: Record<WebsitePageStatus, string> = {
  published: "text-emerald-600 bg-emerald-50 border-emerald-200",
  draft: "text-amber-600 bg-amber-50 border-amber-200",
  review: "text-blue-600 bg-blue-50 border-blue-200",
  archived: "text-muted-foreground bg-muted border-border",
};

const seoColor = (score: number) =>
  score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500";

export function WebsitePageList() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<WebsitePageStatus | "all">("all");

  const filtered = websitePagesSeed.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "all" || p.status === activeStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Website</p>
          <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage your website pages</p>
        </div>
        <Button size="sm" asChild>
          <Link href="/website/pages?create=1">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New Page
          </Link>
        </Button>
      </div>

      <WebsiteNav compact />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                activeStatus === tab.key
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-input bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-input bg-muted/40">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden md:table-cell">Template</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Author</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden lg:table-cell">Views</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground hidden xl:table-cell">SEO</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-input">
            {filtered.map((page) => (
              <tr key={page.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{page.title}</p>
                  <p className="text-[11px] text-muted-foreground">/{page.slug}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">{page.template}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{page.author}</td>
                <td className="px-4 py-3 text-[12px] tabular-nums hidden lg:table-cell">{page.views.toLocaleString()}</td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className={`text-[12px] font-semibold ${seoColor(page.seoScore)}`}>{page.seoScore}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${statusColor[page.status]}`}>
                    {PAGE_STATUS_LABELS[page.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Preview">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
