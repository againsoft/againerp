"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  aiSeoSuggestions,
  auditIssuesSeed,
  ENTITY_TYPE_LABELS,
  issueBreakdown,
  keywordsSeed,
  metaRecordsSeed,
  organicTrafficChart,
  redirectsSeed,
  SEVERITY_LABELS,
  seoHealthScore,
  seoKpis,
  sitemapsSeed,
  type SeoEntityType,
  type SeoIssueSeverity,
  type SeoTab,
} from "@/lib/mock-data/seo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SeoNav } from "@/components/seo/seo-nav";

function severityVariant(severity: SeoIssueSeverity) {
  if (severity === "high") return "warning" as const;
  if (severity === "medium") return "secondary" as const;
  return "muted" as const;
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

function DashboardTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["Run audit", "Generate sitemap", "Bulk meta fix", "Add redirect"].map((label) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => toast.info(`${label} — prototype`)}
          >
            {label === "Run audit" && <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
            {label === "Add redirect" && <Plus className="mr-1.5 h-3.5 w-3.5" />}
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center rounded-lg border border-input bg-card p-4 lg:col-span-1">
          <p className="text-xs text-muted-foreground">SEO Health Score</p>
          <p className={cn("mt-1 text-4xl font-bold", scoreColor(seoHealthScore))}>
            {seoHealthScore}
          </p>
          <p className="text-xs text-muted-foreground">/ 100</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${seoHealthScore}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {seoKpis.map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-input bg-card p-3 shadow-sm">
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
              <p className="mt-0.5 text-xl font-semibold">{kpi.value}</p>
              <p className={cn("text-xs", kpi.alert ? "text-amber-600" : "text-muted-foreground")}>
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-input bg-card p-3 lg:col-span-2">
          <h2 className="mb-2 text-sm font-medium">Organic traffic (4 weeks)</h2>
          <div className="h-44 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={organicTrafficChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  name="Clicks"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 dark:border-violet-900 dark:bg-violet-950/20">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-medium">AI suggestions</h2>
          </div>
          <div className="space-y-2">
            {aiSeoSuggestions.map((s) => (
              <div key={s.title} className="rounded-md border border-input bg-background px-3 py-2">
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-input bg-card p-3">
        <h2 className="mb-3 text-sm font-medium">Issue breakdown</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {issueBreakdown.map((issue) => (
            <div key={issue.type} className="rounded-md border border-input px-3 py-2">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-medium">{issue.type}</p>
                <Badge variant={severityVariant(issue.severity)} className="text-[10px]">
                  {issue.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaTab() {
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return metaRecordsSeed.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q) && !r.url.toLowerCase().includes(q)) return false;
      if (entityType !== "all" && r.entityType !== entityType) return false;
      return true;
    });
  }, [search, entityType]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search title, URL…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[220px]"
        />
        <Select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="w-[140px]">
          <option value="all">All types</option>
          {(Object.keys(ENTITY_TYPE_LABELS) as SeoEntityType[]).map((t) => (
            <option key={t} value={t}>
              {ENTITY_TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => toast.info("AI bulk meta generate — prototype")}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI suggest
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-input">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-input bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Entity</th>
              <th className="px-3 py-2 font-medium">Meta title</th>
              <th className="px-3 py-2 font-medium">Meta description</th>
              <th className="px-3 py-2 font-medium">Score</th>
              <th className="px-3 py-2 font-medium">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-3 py-2">
                  <Badge variant="outline" className="mb-1 text-[10px]">
                    {ENTITY_TYPE_LABELS[r.entityType]}
                  </Badge>
                  <p className="font-medium">{r.title}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{r.url}</p>
                </td>
                <td className="max-w-[180px] px-3 py-2 text-xs">
                  {r.metaTitle || <span className="text-red-500">Missing</span>}
                </td>
                <td className="max-w-[200px] truncate px-3 py-2 text-xs text-muted-foreground">
                  {r.metaDescription || <span className="text-amber-600">Missing</span>}
                </td>
                <td className={cn("px-3 py-2 font-semibold", scoreColor(r.score))}>{r.score}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {r.issues.length ? r.issues.join(", ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RedirectsTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => toast.info("Add redirect — prototype")}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add redirect
        </Button>
      </div>
      <div className="space-y-2">
        {redirectsSeed.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-input bg-card p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground">{r.fromPath}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium">{r.toPath}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.type} · {r.hitCount.toLocaleString()} hits · {r.source}
              </p>
            </div>
            <Badge variant="outline">{r.type}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditTab() {
  const [severity, setSeverity] = useState("all");
  const filtered = useMemo(
    () =>
      severity === "all"
        ? auditIssuesSeed
        : auditIssuesSeed.filter((i) => i.severity === severity),
    [severity],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-[140px]">
          <option value="all">All severity</option>
          {(Object.keys(SEVERITY_LABELS) as SeoIssueSeverity[]).map((s) => (
            <option key={s} value={s}>
              {SEVERITY_LABELS[s]}
            </option>
          ))}
        </Select>
        <Button size="sm" className="ml-auto" onClick={() => toast.success("Audit started (mock)")}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Run full audit
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((issue) => (
          <div key={issue.id} className="rounded-lg border border-input bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={severityVariant(issue.severity)} className="text-[10px]">
                    {SEVERITY_LABELS[issue.severity]}
                  </Badge>
                  <span className="font-mono text-[11px] text-muted-foreground">{issue.type}</span>
                </div>
                <p className="mt-1 font-medium">{issue.entity}</p>
                <p className="font-mono text-xs text-muted-foreground">{issue.url}</p>
                <p className="mt-2 text-sm text-muted-foreground">{issue.suggestion}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.info("Fix issue — prototype")}>
                Fix
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SitemapTab() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Auto-generated nightly · incremental on product publish
        </p>
        <Button size="sm" onClick={() => toast.success("Sitemap regeneration queued (mock)")}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate all
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sitemapsSeed.map((sm) => (
          <div key={sm.id} className="rounded-lg border border-input bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{sm.name}</h3>
              <Badge variant={sm.status === "fresh" ? "success" : sm.status === "stale" ? "warning" : "secondary"}>
                {sm.status}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{sm.path}</p>
            <p className="mt-2 text-sm">{sm.urlCount.toLocaleString()} URLs</p>
            <p className="text-xs text-muted-foreground">Last: {sm.lastGenerated}</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => toast.info(`Open ${sm.path}`)}
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View XML
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeywordsTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => toast.info("Add keyword — prototype")}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Track keyword
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-input">
        <table className="w-full text-sm">
          <thead className="border-b border-input bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Keyword</th>
              <th className="px-3 py-2 font-medium">Target URL</th>
              <th className="px-3 py-2 font-medium text-right">Position</th>
              <th className="px-3 py-2 font-medium text-right">Change</th>
              <th className="px-3 py-2 font-medium text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {keywordsSeed.map((kw) => (
              <tr key={kw.id} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-medium">{kw.keyword}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{kw.targetUrl}</td>
                <td className="px-3 py-2 text-right font-semibold">#{kw.position}</td>
                <td
                  className={cn(
                    "px-3 py-2 text-right text-xs",
                    kw.change > 0 ? "text-emerald-600" : kw.change < 0 ? "text-red-500" : "text-muted-foreground",
                  )}
                >
                  {kw.change > 0 ? `↑${kw.change}` : kw.change < 0 ? `↓${Math.abs(kw.change)}` : "—"}
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground">
                  {kw.volume.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SeoControlCenter() {
  const [tab, setTab] = useState<SeoTab>("dashboard");
  const openIssues = auditIssuesSeed.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/40 px-4 py-2.5 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <Search className="h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          Search visibility control plane — meta, URLs, redirects, schema, sitemaps, and audits.
          Entity SEO fields live in Catalog/Builder; global rules in seo_* tables.
        </span>
      </div>

      <SeoNav active={tab} onChange={setTab} issueCount={openIssues} />

      {tab === "dashboard" && <DashboardTab />}
      {tab === "meta" && <MetaTab />}
      {tab === "redirects" && <RedirectsTab />}
      {tab === "audit" && <AuditTab />}
      {tab === "sitemap" && <SitemapTab />}
      {tab === "keywords" && <KeywordsTab />}
    </div>
  );
}
