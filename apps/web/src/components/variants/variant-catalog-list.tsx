"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, Star } from "lucide-react";
import { getAllCatalogVariants } from "@/lib/mock-data/variants";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VariantCatalogList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return getAllCatalogVariants().filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (!q) return true;
      return (
        row.productName.toLowerCase().includes(q) ||
        row.variantSku.toLowerCase().includes(q) ||
        row.variantLabel.toLowerCase().includes(q) ||
        row.productSku.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const categories = useMemo(() => {
    const set = new Set(getAllCatalogVariants().map((r) => r.category));
    return ["all", ...Array.from(set).sort()];
  }, []);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-input bg-muted/30 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="variant-search" className="text-xs font-medium text-muted-foreground">
              Search SKU or product
            </label>
            <Input
              id="variant-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SKU-0002, Wireless Earbuds…"
              className="mt-1"
            />
          </div>
          <div className="w-full sm:w-44">
            <label htmlFor="variant-category" className="text-xs font-medium text-muted-foreground">
              Category
            </label>
            <select
              id="variant-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-input bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-input bg-muted/40 text-xs">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Product</th>
                <th className="px-3 py-2 text-left font-medium">Variant</th>
                <th className="px-3 py-2 text-left font-medium">SKU</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Stock</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((row) => (
                <tr key={row.id} className="border-b border-input/60 last:border-0">
                  <td className="px-3 py-2">
                    <p className="font-medium">{row.productName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{row.productSku}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      {row.variantLabel}
                      {row.isDefault ? <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> : null}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.variantSku}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(row.price)}</td>
                  <td className={`px-3 py-2 text-right ${row.stock === 0 ? "font-medium text-red-500" : ""}`}>
                    {row.stock}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={row.status === "published" ? "default" : "secondary"} className="capitalize">
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                      <Link href={`/catalog/products?highlight=${row.productId}`}>
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        Product
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-input px-3 py-2 text-xs text-muted-foreground">
          Showing {Math.min(rows.length, 50)} of {rows.length} sellable SKUs · variable products expand to child variants
        </div>
      </div>
    </div>
  );
}
