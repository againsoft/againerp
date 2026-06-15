"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Layers,
  Link2,
  Package,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductStatus } from "@/lib/mock-data/products";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SlugInput } from "@/components/ui/slug-input";
import { RichTextEditor } from "@/components/products/rich-text-editor";
import { WordPressClassicEditor } from "@/components/products/wordpress-classic-editor";
import { ProductSpecEditor } from "@/components/specifications/product-spec-editor";
import { ProductVariantEditor } from "@/components/products/product-variant-editor";

const CATEGORIES = ["Apparel", "Electronics", "Home", "Beauty", "Sports", "Books"];
const BRANDS = ["UrbanWear", "TechPro", "HomeNest", "GlowUp", "ActiveLife", "ReadWell"];

const SECTIONS = [
  { id: "general", label: "General", icon: Package },
  { id: "pricing", label: "Pricing", icon: Tag },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "variants", label: "Variants", icon: Layers },
  { id: "specifications", label: "Specifications", icon: SlidersHorizontal },
  { id: "seo", label: "SEO", icon: Search },
  { id: "media", label: "Media", icon: ImagePlus },
  { id: "related", label: "Related Products", icon: Link2 },
  { id: "ai", label: "AI Tools", icon: Sparkles },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export type ProductFormValues = {
  name: string;
  sku: string;
  category: string;
  brand: string;
  status: ProductStatus;
  tags: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice: string;
  cost: string;
  taxClass: string;
  stock: string;
  trackInventory: boolean;
  warehouse: string;
  lowStockAlert: string;
  productType: "simple" | "variable";
  metaTitle: string;
  metaDescription: string;
  slug: string;
};

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  sku: "",
  category: "Apparel",
  brand: "UrbanWear",
  status: "draft",
  tags: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  cost: "",
  taxClass: "standard",
  stock: "0",
  trackInventory: true,
  warehouse: "dhaka-hq",
  lowStockAlert: "10",
  productType: "simple",
  metaTitle: "",
  metaDescription: "",
  slug: "",
};

const MOCK_MEDIA = Array.from({ length: 6 }, (_, i) => ({
  id: `new_media_${i}`,
  url: `https://picsum.photos/seed/newprod${i}/200/200`,
}));

type Props = {
  mode?: "create" | "edit";
  initialProduct?: Product;
  compact?: boolean;
  inDialog?: boolean;
  onClose?: () => void;
};

export function ProductForm({ mode = "create", initialProduct, compact, inDialog, onClose }: Props) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<SectionId>("general");
  const [autosave, setAutosave] = useState("All changes saved");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [values, setValues] = useState<ProductFormValues>(() => ({
    ...DEFAULT_VALUES,
    ...(initialProduct
      ? {
          name: initialProduct.name,
          sku: initialProduct.sku,
          category: initialProduct.category,
          brand: initialProduct.brand,
          status: initialProduct.status,
          tags: initialProduct.tags.join(", "),
          description: initialProduct.description ?? "",
          price: String(initialProduct.price),
          compareAtPrice: initialProduct.compareAtPrice ? String(initialProduct.compareAtPrice) : "",
          stock: String(initialProduct.stock),
          metaTitle: initialProduct.name,
          slug: initialProduct.slug,
        }
      : {}),
  }));

  const set = useCallback(<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    setAutosave("Saving draft…");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAutosave("Saved · just now"), 800);
    return () => clearTimeout(t);
  }, [values]);

  useEffect(() => {
    if (!inDialog) return;
    contentRef.current?.scrollTo(0, 0);
  }, [section, inDialog]);

  const selectSection = useCallback((id: SectionId) => {
    setSection(id);
  }, []);

  const handleSave = (publish = false) => {
    if (!values.name.trim()) {
      toast.error("Product name is required");
      setSection("general");
      return;
    }
    toast.success(publish ? "Product published (mock)" : "Product saved as draft (mock)");
    if (onClose) onClose();
    else router.push("/catalog/products");
  };

  const title = mode === "create" ? "Add Product" : "Edit Product";

  const actionButtons = (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none"
        onClick={() => (onClose ? onClose() : router.push("/catalog/products"))}
      >
        Discard
      </Button>
      <Button variant="secondary" size="sm" className="flex-1 sm:flex-none" onClick={() => handleSave(false)}>
        Save draft
      </Button>
      <Button size="sm" className="flex-1 sm:flex-none" onClick={() => handleSave(true)}>
        Publish
      </Button>
    </>
  );

  return (
    <div
      className={
        inDialog
          ? "flex h-full min-h-0 flex-col"
          : compact
            ? "flex min-h-0 flex-col"
            : "flex min-h-0 flex-col pb-20 sm:min-h-[calc(100vh-2.75rem-1.5rem)] sm:pb-0 lg:min-h-[calc(100vh-2.75rem-2rem)]"
      }
    >
      {/* Header */}
      <div className={inDialog ? "shrink-0 border-b border-input pb-2" : "shrink-0 border-b border-input pb-3"}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-2">
            {!compact && (
              <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
                <Link href="/catalog/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <div className="min-w-0">
              {!inDialog && (
                <>
                  <p className="page-subtitle hidden truncate sm:block">
                    AgainERP › Ecommerce › Catalog › Products › {title}
                  </p>
                  <p className="page-subtitle sm:hidden">
                    Catalog › Products › {mode === "create" ? "Add" : "Edit"}
                  </p>
                </>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {!inDialog && <h1 className="page-title">{title}</h1>}
                <Badge
                  variant={
                    values.status === "published" ? "success" : values.status === "draft" ? "warning" : "muted"
                  }
                  className="capitalize"
                >
                  {values.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{autosave}</p>
            </div>
          </div>
          <div className={`flex-wrap gap-1.5 ${compact ? "flex" : "hidden sm:flex"}`}>
            {inDialog ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => (onClose ? onClose() : router.push("/catalog/products"))}
                >
                  Discard
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleSave(false)}
                >
                  Save
                </Button>
                <Button size="sm" className="h-7 px-2 text-xs" onClick={() => handleSave(true)}>
                  Publish
                </Button>
              </>
            ) : (
              actionButtons
            )}
          </div>
        </div>
      </div>

      {/* Section pills — mobile only (not in dialog) */}
      <div
        className={`sticky top-0 z-10 shrink-0 border-b border-input bg-background py-1.5 ${inDialog ? "hidden" : "md:hidden"}`}
      >
        <div className="flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectSection(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                section === id
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-input text-muted-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex min-h-0 flex-1 gap-3 ${inDialog ? "flex-row overflow-hidden pt-2" : "flex-col pt-2 md:flex-row md:pt-4"}`}
      >
        {/* Left section nav */}
        <nav
          className={`shrink-0 border-r border-input pr-2 ${inDialog ? "block w-40 overflow-hidden" : "hidden w-44 md:block"}`}
        >
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sections
          </p>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectSection(id)}
              className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
                inDialog ? "text-xs" : "text-sm"
              } ${
                section === id
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className={`shrink-0 ${inDialog ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content — only this area scrolls in dialog */}
        <div
          ref={contentRef}
          className={`min-h-0 min-w-0 flex-1 ${inDialog ? "overflow-y-auto pr-1" : "overflow-y-auto pb-4 md:pb-8"}`}
        >
          {section === "general" && (
            <Section title="General" description="Basic product information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product name" required>
                  <Input
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Premium Cotton T-Shirt"
                  />
                </Field>
                <Field label="SKU" required>
                  <Input
                    value={values.sku}
                    onChange={(e) => set("sku", e.target.value)}
                    placeholder="TSH-BLK-M"
                  />
                </Field>
                <Field label="Category" required>
                  <div className="flex flex-col gap-1 sm:flex-row">
                    <Select
                      value={values.category}
                      onChange={(e) => set("category", e.target.value)}
                      className="min-w-0 flex-1"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                    <Button type="button" variant="outline" size="sm" className="shrink-0 sm:w-9 sm:px-0">
                      +
                    </Button>
                  </div>
                </Field>
                <Field label="Brand">
                  <div className="flex flex-col gap-1 sm:flex-row">
                    <Select
                      value={values.brand}
                      onChange={(e) => set("brand", e.target.value)}
                      className="min-w-0 flex-1"
                    >
                      {BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </Select>
                    <Button type="button" variant="outline" size="sm" className="shrink-0 sm:w-9 sm:px-0">
                      +
                    </Button>
                  </div>
                </Field>
                <Field label="Status">
                  <Select
                    value={values.status}
                    onChange={(e) => set("status", e.target.value as ProductStatus)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </Field>
                <Field label="Tags" hint="Comma separated">
                  <Input
                    value={values.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    placeholder="featured, bestseller"
                  />
                </Field>
              </div>
              <Field label="Short description" className="mt-4">
                <RichTextEditor
                  value={values.shortDescription}
                  onChange={(v) => set("shortDescription", v)}
                  placeholder="Brief summary for listings and SEO…"
                  minRows={3}
                />
              </Field>
              <Field label="Description" className="mt-4">
                <WordPressClassicEditor
                  value={values.description}
                  onChange={(v) => set("description", v)}
                  placeholder="Full product description…"
                />
              </Field>
            </Section>
          )}

          {section === "pricing" && (
            <Section title="Pricing" description="Selling price, compare-at, and tax">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Price (BDT)" required>
                  <Input
                    type="number"
                    value={values.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="899"
                  />
                </Field>
                <Field label="Compare at price">
                  <Input
                    type="number"
                    value={values.compareAtPrice}
                    onChange={(e) => set("compareAtPrice", e.target.value)}
                    placeholder="1299"
                  />
                </Field>
                <Field label="Cost per item">
                  <Input
                    type="number"
                    value={values.cost}
                    onChange={(e) => set("cost", e.target.value)}
                    placeholder="450"
                  />
                </Field>
                <Field label="Tax class">
                  <Select value={values.taxClass} onChange={(e) => set("taxClass", e.target.value)}>
                    <option value="standard">Standard VAT</option>
                    <option value="reduced">Reduced</option>
                    <option value="zero">Zero rated</option>
                  </Select>
                </Field>
              </div>
              {values.price && (
                <p className="mt-4 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm">
                  Preview: <strong>{formatCurrency(Number(values.price) || 0)}</strong>
                  {values.compareAtPrice && (
                    <span className="ml-2 text-muted-foreground line-through">
                      {formatCurrency(Number(values.compareAtPrice))}
                    </span>
                  )}
                </p>
              )}
            </Section>
          )}

          {section === "inventory" && (
            <Section title="Inventory" description="Stock levels and warehouse">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Quantity" required>
                  <Input
                    type="number"
                    value={values.stock}
                    onChange={(e) => set("stock", e.target.value)}
                  />
                </Field>
                <Field label="Warehouse">
                  <Select value={values.warehouse} onChange={(e) => set("warehouse", e.target.value)}>
                    <option value="dhaka-hq">Dhaka HQ</option>
                    <option value="chittagong">Chittagong</option>
                    <option value="online">Online fulfillment</option>
                  </Select>
                </Field>
                <Field label="Low stock alert at">
                  <Input
                    type="number"
                    value={values.lowStockAlert}
                    onChange={(e) => set("lowStockAlert", e.target.value)}
                  />
                </Field>
                <Field label="Track inventory">
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={values.trackInventory}
                      onChange={(e) => set("trackInventory", e.target.checked)}
                      className="rounded border-input"
                    />
                    Track quantity for this product
                  </label>
                </Field>
              </div>
            </Section>
          )}

          {section === "variants" && (
            <Section
              title="Variants"
              description="Define sellable SKUs — simple product or variable matrix (per catalog architecture)"
            >
              <ProductVariantEditor
                productType={values.productType}
                onProductTypeChange={(t) => set("productType", t)}
                baseSku={values.sku}
                basePrice={values.price}
                category={values.category}
              />
            </Section>
          )}

          {section === "specifications" && (
            <Section title="Specifications" description="Select a profile and fill specification values for this product">
              <ProductSpecEditor />
            </Section>
          )}

          {section === "seo" && (
            <Section title="SEO" description="Search engine optimization">
              <div className="mb-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    set("metaTitle", values.name || "Product title");
                    set("metaDescription", values.shortDescription || "Shop quality products at UrbanWear.");
                    set("slug", (values.sku || "product").toLowerCase().replace(/\s+/g, "-"));
                    toast.success("Mock: SEO generated");
                  }}
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Generate SEO
                </Button>
              </div>
              <div className="grid gap-4">
                <Field label="URL slug">
                  <SlugInput
                    value={values.slug}
                    onChange={(v) => set("slug", v)}
                    excludeId={initialProduct?.id}
                    urlPrefix={<span className="shrink-0 text-sm text-muted-foreground">/</span>}
                  />
                </Field>
                <Field label="Meta title">
                  <Input
                    value={values.metaTitle}
                    onChange={(e) => set("metaTitle", e.target.value)}
                    maxLength={70}
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">{values.metaTitle.length}/70</p>
                </Field>
                <Field label="Meta description">
                  <Textarea
                    value={values.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">{values.metaDescription.length}/160</p>
                </Field>
                <div className="rounded-md border border-input bg-muted/20 p-3">
                  <p className="text-sm font-medium text-primary">{values.metaTitle || values.name || "Product title"}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    urbanwear.com/products/{values.slug || "product-slug"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {values.metaDescription || "Meta description preview…"}
                  </p>
                </div>
              </div>
            </Section>
          )}

          {section === "media" && (
            <Section title="Media" description="Images and videos — drag & drop or pick from library">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                  <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                  Upload files
                </Button>
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                  <Link href="/media">Open media library</Link>
                </Button>
              </div>
              <div className="mb-4 rounded-lg border border-dashed border-input bg-muted/20 p-6 text-center text-sm text-muted-foreground sm:p-8">
                Drag & drop images or videos here
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {MOCK_MEDIA.map((m) => {
                  const selected = selectedMedia.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setSelectedMedia((prev) =>
                          selected ? prev.filter((id) => id !== m.id) : [...prev, m.id],
                        )
                      }
                      className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                        selected ? "border-primary ring-2 ring-primary/30" : "border-input"
                      }`}
                    >
                      <img src={m.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
              {selectedMedia.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">{selectedMedia.length} selected</p>
              )}
            </Section>
          )}

          {section === "related" && (
            <Section title="Related Products" description="Cross-sell and upsell">
              <Input placeholder="Search products to link…" className="mb-3 max-w-md" />
              <div className="space-y-2">
                {["Wireless Earbuds Pro", "Running Shoes Ultra", "LED Desk Lamp"].map((name) => (
                  <div
                    key={name}
                    className="flex flex-col gap-2 rounded-md border border-input px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm">{name}</span>
                    <Button type="button" variant="ghost" size="sm" className="h-7 self-start text-destructive sm:self-auto">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-3">
                + Add related product
              </Button>
            </Section>
          )}

          {section === "ai" && (
            <Section title="AI Tools" description="Generate content with AI assistant">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Generate full description", action: "description" },
                  { label: "Generate SEO meta", action: "seo" },
                  { label: "Suggest tags", action: "tags" },
                  { label: "Translate to Bengali", action: "translate" },
                ].map((item) => (
                  <Button
                    key={item.action}
                    type="button"
                    variant="outline"
                    className="h-auto justify-start px-3 py-3 text-left"
                    onClick={() => toast.success(`Mock: AI ${item.action}`)}
                  >
                    <Sparkles className="mr-2 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Mobile sticky action bar — full page only */}
      {!compact && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-input bg-background/95 p-3 backdrop-blur sm:hidden">
          <div className="flex gap-2">{actionButtons}</div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
