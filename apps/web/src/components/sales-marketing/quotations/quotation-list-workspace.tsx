"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { QuotationTable } from "@/components/sales-marketing/quotations/quotation-table";
import { QuotationViewSheet } from "@/components/sales-marketing/quotations/quotation-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  QUOTATION_STATUS_LABELS,
  getQuotationById,
  smwQuotationsSeed,
  type QuotationStatus,
  type SmwQuotation,
} from "@/lib/mock-data/smw-quotations";
import { SMW_QUO_OWNERS } from "@/lib/mock-data/smw-quotations";
import { useSmwQuotationStore } from "@/lib/store/smw-quotation-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/quotations?${query}` : "/sales-marketing/quotations";
}

function QuotationListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeQuotes = useSmwQuotationStore((s) => s.quotations);
  const quotations = storeQuotes.length > 0 ? storeQuotes : smwQuotationsSeed;

  const viewId = searchParams.get("view");
  const statusParam = searchParams.get("status") ?? "all";
  const ownerParam = searchParams.get("owner") ?? "all";
  const qParam = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(qParam);
  const [debouncedSearch, setDebouncedSearch] = useState(qParam);
  const [statusFilter, setStatusFilter] = useState(statusParam);
  const [ownerFilter, setOwnerFilter] = useState(ownerParam);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    pushParams((params) => {
      if (debouncedSearch) params.set("q", debouncedSearch);
      else params.delete("q");
    });
  }, [debouncedSearch]);

  const viewQuotation = useMemo(() => {
    if (!viewId) return null;
    return quotations.find((q) => q.id === viewId) ?? getQuotationById(viewId) ?? null;
  }, [viewId, quotations]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return quotations.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (ownerFilter !== "all" && item.ownerId !== ownerFilter) return false;
      if (
        q &&
        !item.accountName.toLowerCase().includes(q) &&
        !item.quotationNumber.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [quotations, debouncedSearch, statusFilter, ownerFilter]);

  const handleView = (q: SmwQuotation) => {
    pushParams((params) => {
      params.set("view", q.id);
    });
  };

  const closeView = () => pushParams((p) => p.delete("view"));

  useEffect(() => {
    if (viewId && !viewQuotation) {
      toast.error("Quotation not found");
      closeView();
    }
  }, [viewId, viewQuotation]);

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setOwnerFilter("all");
    pushParams((params) => {
      params.delete("q");
      params.delete("status");
      params.delete("owner");
    });
  };

  const activeFilters = [debouncedSearch, statusFilter !== "all", ownerFilter !== "all"].filter(Boolean).length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search account, quote #…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-8 max-w-[240px] text-xs"
          aria-label="Search quotations"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Status">
          <option value="all">All statuses</option>
          {(Object.keys(QUOTATION_STATUS_LABELS) as QuotationStatus[]).map((s) => (
            <option key={s} value={s}>{QUOTATION_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        <Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Owner">
          <option value="all">All owners</option>
          {SMW_QUO_OWNERS.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Select>
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto">
          <Button type="button" size="sm" className="h-8" asChild>
            <Link href="/sales-marketing/quotations/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Create quotation
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} quotation{filtered.length === 1 ? "" : "s"}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">{quotations.length === 0 ? "No quotations yet" : "No matches"}</p>
          <Button type="button" size="sm" className="mt-4" asChild>
            <Link href="/sales-marketing/quotations/create">Create quotation</Link>
          </Button>
        </div>
      ) : (
        <QuotationTable data={filtered} onView={handleView} />
      )}

      <QuotationViewSheet
        open={!!viewQuotation}
        onOpenChange={(open) => { if (!open) closeView(); }}
        quotation={viewQuotation}
      />
    </>
  );
}

export function QuotationListWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading quotations…</p>}>
      <QuotationListContent />
    </Suspense>
  );
}
