export type SeoIssueSeverity = "high" | "medium" | "low";

export type SeoEntityType = "product" | "category" | "brand" | "page";

export const SEO_TABS = [
  "dashboard",
  "meta",
  "redirects",
  "audit",
  "sitemap",
  "keywords",
] as const;

export type SeoTab = (typeof SEO_TABS)[number];

export const SEO_TAB_LABELS: Record<SeoTab, string> = {
  dashboard: "Dashboard",
  meta: "Meta Manager",
  redirects: "Redirects",
  audit: "SEO Audit",
  sitemap: "Sitemap",
  keywords: "Keywords",
};

export const seoHealthScore = 78;

export const seoKpis = [
  { label: "Indexed URLs", value: "4,286", sub: "+42 this week" },
  { label: "Open issues", value: 47, sub: "12 high severity", alert: true },
  { label: "Active redirects", value: 128, sub: "3 chains detected" },
  { label: "Tracked keywords", value: 36, sub: "Avg position 14.2" },
];

export const issueBreakdown = [
  { type: "Missing meta title", count: 12, severity: "high" as SeoIssueSeverity },
  { type: "Missing meta description", count: 18, severity: "medium" as SeoIssueSeverity },
  { type: "Duplicate title", count: 5, severity: "high" as SeoIssueSeverity },
  { type: "Missing alt text", count: 8, severity: "medium" as SeoIssueSeverity },
  { type: "Missing schema", count: 4, severity: "low" as SeoIssueSeverity },
];

export const organicTrafficChart = [
  { week: "W1", clicks: 4200, impressions: 68000 },
  { week: "W2", clicks: 4500, impressions: 71000 },
  { week: "W3", clicks: 4100, impressions: 69500 },
  { week: "W4", clicks: 4800, impressions: 74000 },
];

export type SeoMetaRecord = {
  id: string;
  entityType: SeoEntityType;
  title: string;
  url: string;
  metaTitle: string;
  metaDescription: string;
  score: number;
  issues: string[];
};

export const metaRecordsSeed: SeoMetaRecord[] = [
  {
    id: "meta_001",
    entityType: "product",
    title: "Wireless Earbuds Pro",
    url: "/electronics/wireless-earbuds-pro",
    metaTitle: "Wireless Earbuds Pro — UrbanWear",
    metaDescription: "Premium wireless earbuds with ANC and 32-hour battery life.",
    score: 92,
    issues: [],
  },
  {
    id: "meta_002",
    entityType: "product",
    title: "Smart Watch Series 5",
    url: "/electronics/smart-watch-series-5",
    metaTitle: "",
    metaDescription: "Smart watch with health tracking.",
    score: 48,
    issues: ["Missing meta title"],
  },
  {
    id: "meta_003",
    entityType: "category",
    title: "Electronics",
    url: "/electronics",
    metaTitle: "Electronics — Shop Online | UrbanWear",
    metaDescription: "",
    score: 62,
    issues: ["Missing meta description"],
  },
  {
    id: "meta_004",
    entityType: "product",
    title: "Premium Cotton T-Shirt",
    url: "/apparel/premium-cotton-t-shirt",
    metaTitle: "Premium Cotton T-Shirt | UrbanWear",
    metaDescription: "Premium Cotton T-Shirt | UrbanWear",
    score: 55,
    issues: ["Duplicate description pattern"],
  },
  {
    id: "meta_005",
    entityType: "brand",
    title: "UrbanWear",
    url: "/brands/urbanwear",
    metaTitle: "UrbanWear — Shop Fashion Online",
    metaDescription: "Discover UrbanWear's latest collection of premium apparel.",
    score: 88,
    issues: [],
  },
  {
    id: "meta_006",
    entityType: "page",
    title: "About Us",
    url: "/about",
    metaTitle: "About UrbanWear",
    metaDescription: "Learn about our story and mission.",
    score: 74,
    issues: ["Description too short"],
  },
];

export type SeoRedirect = {
  id: string;
  fromPath: string;
  toPath: string;
  type: "301" | "302" | "410";
  hitCount: number;
  source: string;
  updatedAt: string;
};

export const redirectsSeed: SeoRedirect[] = [
  {
    id: "red_001",
    fromPath: "/shop/earbuds-old",
    toPath: "/electronics/wireless-earbuds-pro",
    type: "301",
    hitCount: 842,
    source: "Slug change",
    updatedAt: "2026-06-10",
  },
  {
    id: "red_002",
    fromPath: "/category/phones",
    toPath: "/electronics/phones",
    type: "301",
    hitCount: 1204,
    source: "Category merge",
    updatedAt: "2026-06-05",
  },
  {
    id: "red_003",
    fromPath: "/summer-sale-2025",
    toPath: "/collections/summer-sale-2026",
    type: "302",
    hitCount: 96,
    source: "Campaign redirect",
    updatedAt: "2026-06-01",
  },
  {
    id: "red_004",
    fromPath: "/discontinued-product-x",
    toPath: "/electronics",
    type: "301",
    hitCount: 38,
    source: "Manual",
    updatedAt: "2026-05-28",
  },
];

export type SeoAuditIssue = {
  id: string;
  type: string;
  severity: SeoIssueSeverity;
  url: string;
  entity: string;
  suggestion: string;
};

export const auditIssuesSeed: SeoAuditIssue[] = [
  {
    id: "iss_001",
    type: "missing_meta_title",
    severity: "high",
    url: "/electronics/smart-watch-series-5",
    entity: "Smart Watch Series 5",
    suggestion: "Add title: Smart Watch Series 5 — UrbanWear",
  },
  {
    id: "iss_002",
    type: "missing_meta_description",
    severity: "medium",
    url: "/electronics",
    entity: "Electronics category",
    suggestion: "Write 150–160 char description with primary keyword",
  },
  {
    id: "iss_003",
    type: "duplicate_title",
    severity: "high",
    url: "/apparel/linen-dress",
    entity: "Linen Summer Dress",
    suggestion: "Title duplicates another product — make unique",
  },
  {
    id: "iss_004",
    type: "missing_alt_text",
    severity: "medium",
    url: "/electronics/usb-c-hub",
    entity: "USB-C Hub 7-in-1",
    suggestion: "Add alt text to 2 gallery images",
  },
  {
    id: "iss_005",
    type: "broken_link",
    severity: "high",
    url: "/blog/old-post-link",
    entity: "Blog: Summer trends",
    suggestion: "Link to /collections/summer-sale-2026 returns 404",
  },
  {
    id: "iss_006",
    type: "missing_schema",
    severity: "low",
    url: "/about",
    entity: "About page",
    suggestion: "Add Organization schema JSON-LD",
  },
];

export type SeoSitemap = {
  id: string;
  name: string;
  path: string;
  urlCount: number;
  lastGenerated: string;
  status: "fresh" | "stale" | "generating";
};

export const sitemapsSeed: SeoSitemap[] = [
  {
    id: "sm_index",
    name: "Sitemap index",
    path: "/sitemap.xml",
    urlCount: 4,
    lastGenerated: "2026-06-15 02:00",
    status: "fresh",
  },
  {
    id: "sm_products",
    name: "Products",
    path: "/sitemap-products.xml",
    urlCount: 2840,
    lastGenerated: "2026-06-15 02:00",
    status: "fresh",
  },
  {
    id: "sm_categories",
    name: "Categories",
    path: "/sitemap-categories.xml",
    urlCount: 186,
    lastGenerated: "2026-06-15 02:00",
    status: "fresh",
  },
  {
    id: "sm_pages",
    name: "CMS Pages",
    path: "/sitemap-pages.xml",
    urlCount: 42,
    lastGenerated: "2026-06-14 02:00",
    status: "stale",
  },
];

export type SeoKeyword = {
  id: string;
  keyword: string;
  targetUrl: string;
  position: number;
  change: number;
  volume: number;
};

export const keywordsSeed: SeoKeyword[] = [
  {
    id: "kw_001",
    keyword: "wireless earbuds bangladesh",
    targetUrl: "/electronics/wireless-earbuds-pro",
    position: 8,
    change: 2,
    volume: 2400,
  },
  {
    id: "kw_002",
    keyword: "cotton t shirt online",
    targetUrl: "/apparel/premium-cotton-t-shirt",
    position: 14,
    change: -1,
    volume: 1800,
  },
  {
    id: "kw_003",
    keyword: "urbanwear fashion",
    targetUrl: "/brands/urbanwear",
    position: 3,
    change: 0,
    volume: 920,
  },
  {
    id: "kw_004",
    keyword: "smart watch price bd",
    targetUrl: "/electronics/smart-watch-series-5",
    position: 22,
    change: 4,
    volume: 3100,
  },
  {
    id: "kw_005",
    keyword: "electronics shop dhaka",
    targetUrl: "/electronics",
    position: 11,
    change: 1,
    volume: 4200,
  },
];

export const aiSeoSuggestions = [
  {
    title: "Bulk meta fix",
    body: "12 products missing meta title — AI can generate from product name + brand template",
  },
  {
    title: "Schema gap",
    body: "4 published products lack Product JSON-LD — run schema wizard",
  },
  {
    title: "Redirect opportunity",
    body: "404 spike on /shop/earbuds-old — redirect already exists, purge CDN cache",
  },
];

export const SEVERITY_LABELS: Record<SeoIssueSeverity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const ENTITY_TYPE_LABELS: Record<SeoEntityType, string> = {
  product: "Product",
  category: "Category",
  brand: "Brand",
  page: "Page",
};
