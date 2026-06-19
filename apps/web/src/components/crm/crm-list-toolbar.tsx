"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CRM_OWNERS, CRM_SAVED_VIEWS } from "@/lib/mock-data/crm/types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  ownerFilter: string;
  onOwnerChange: (v: string) => void;
  savedView: string;
  onSavedViewChange: (v: string) => void;
  statusOptions: { value: string; label: string }[];
};

/** DS-FILTER-BAR + DS-INPUT-SEARCH + saved views. */
export function CrmListToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ownerFilter,
  onOwnerChange,
  savedView,
  onSavedViewChange,
  statusOptions,
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center" data-component="DS-FILTER-BAR">
      <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          data-component="DS-INPUT-SEARCH"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, email, company…"
          className="h-9 pl-8"
          aria-label="Search"
        />
      </div>
      <Select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="h-9 w-full sm:w-36">
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      <Select value={ownerFilter} onChange={(e) => onOwnerChange(e.target.value)} className="h-9 w-full sm:w-40">
        <option value="all">All owners</option>
        <option value="my">My leads</option>
        <option value="unassigned">Unassigned</option>
        {CRM_OWNERS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </Select>
      <Select value={savedView} onChange={(e) => onSavedViewChange(e.target.value)} className="h-9 w-full sm:w-40">
        {CRM_SAVED_VIEWS.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </Select>
      <Button type="button" variant="outline" size="sm" className="min-h-9 gap-1.5">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
        Filters
      </Button>
    </div>
  );
}
