import { categoriesFlat } from "./categories";
import { productPath } from "@/lib/url-slug/paths";

export type ProductStatus = "draft" | "published" | "archived";

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  category: string;
  brand: string;
  thumbnail: string;
  updatedAt: string;
  description?: string;
  tags: string[];
};

const productCategories = categoriesFlat.filter((c) => c.active);
const brands = ["UrbanWear", "TechPro", "HomeNest", "GlowUp", "ActiveLife", "ReadWell"];
const statuses: ProductStatus[] = ["published", "published", "published", "draft", "archived"];

const names = [
  "Premium Cotton T-Shirt",
  "Wireless Earbuds Pro",
  "Ceramic Coffee Mug Set",
  "Running Shoes Ultra",
  "Smart Watch Series 5",
  "Linen Summer Dress",
  "Bluetooth Speaker Mini",
  "Organic Face Serum",
  "Yoga Mat Pro",
  "LED Desk Lamp",
  "Leather Wallet",
  "Stainless Water Bottle",
  "Graphic Hoodie",
  "USB-C Hub 7-in-1",
  "Scented Candle Pack",
];

function pad(n: number, len = 4) {
  return String(n).padStart(len, "0");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const products: Product[] = Array.from({ length: 120 }, (_, i) => {
  const base = names[i % names.length];
  const variant = Math.floor(i / names.length) + 1;
  const status = statuses[i % statuses.length];
  const price = 299 + (i % 50) * 47;
  const stock = status === "archived" ? 0 : (i * 7) % 200;
  const day = (i % 28) + 1;
  const name = variant > 1 ? `${base} v${variant}` : base;
  return {
    id: `prod_${pad(i + 1)}`,
    name,
    slug: `${slugify(name)}-${pad(i + 1)}`,
    sku: `SKU-${pad(i + 1)}`,
    price,
    compareAtPrice: i % 3 === 0 ? price + 200 : undefined,
    stock,
    status,
    category: productCategories[i % productCategories.length].name,
    brand: brands[i % brands.length],
    thumbnail: `https://picsum.photos/seed/${i + 1}/80/80`,
    updatedAt: `2026-06-${pad(day, 2)}T10:00:00+06:00`,
    tags: ["featured", "bestseller"].slice(0, i % 2 === 0 ? 2 : 1),
    description: `High-quality ${base.toLowerCase()} for everyday use. Prototype dummy data.`,
  };
});

export type QuickAddProductInput = {
  name: string;
  sku?: string;
  price: number;
  category?: string;
  brand?: string;
  stock?: number;
};

export function buildProductFromQuickAdd(input: QuickAddProductInput): Product {
  const stamp = Date.now();
  const id = `prod_${stamp}`;
  const sku = input.sku?.trim() || `SKU-${String(stamp).slice(-6)}`;
  const name = input.name.trim();
  const price = input.price;
  const stock = input.stock ?? 0;

  return {
    id,
    name,
    slug: slugify(name),
    sku,
    price,
    stock,
    status: "published",
    category: input.category?.trim() || "Apparel",
    brand: input.brand?.trim() || "UrbanWear",
    thumbnail: `https://picsum.photos/seed/${id}/80/80`,
    updatedAt: new Date().toISOString(),
    tags: [],
    description: `Quick-added product: ${name}`,
  };
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  const normalized = slug.toLowerCase();
  return products.find(
    (p) =>
      p.slug.toLowerCase() === normalized ||
      p.sku.toLowerCase() === normalized ||
      p.id === slug,
  );
}

export function getProductStorefrontPath(product: Product) {
  return productPath(product.slug);
}

export function getRelatedProducts(productId: string, limit = 4) {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter((p) => p.id !== productId && p.status === "published" && p.category === product.category)
    .slice(0, limit);
}

export type ProductMediaType = "image" | "video";

export type ProductMedia = {
  id: string;
  type: ProductMediaType;
  url: string;
  poster?: string;
  title?: string;
  duration?: string;
  isPrimary?: boolean;
};

export type ProductVariant = {
  id: string;
  label: string;
  color: string;
  storage?: string;
  ram?: string;
  price: number;
  stock: number;
  sku: string;
  gallery: string[];
};

const SAMPLE_VIDEOS = {
  showcase:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  unboxing:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  features:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
} as const;

/** Rich mixed media for prod_0002 — Wireless Earbuds Pro */
const PROD_0002_MEDIA: Record<string, ProductMedia[]> = {
  v1: [
    {
      id: "p2_v1_vid1",
      type: "video",
      url: SAMPLE_VIDEOS.showcase,
      poster: "https://picsum.photos/seed/prod_0002_vid1/800/800",
      title: "360° product showcase",
      duration: "0:15",
      isPrimary: true,
    },
    {
      id: "p2_v1_img1",
      type: "image",
      url: "https://picsum.photos/seed/prod_0002_blk1/800/800",
      title: "Black — front view",
    },
    {
      id: "p2_v1_img2",
      type: "image",
      url: "https://picsum.photos/seed/prod_0002_blk2/800/800",
      title: "Black — case open",
    },
    {
      id: "p2_v1_vid2",
      type: "video",
      url: SAMPLE_VIDEOS.unboxing,
      poster: "https://picsum.photos/seed/prod_0002_vid2/800/800",
      title: "Unboxing & first impressions",
      duration: "0:15",
    },
    {
      id: "p2_v1_img3",
      type: "image",
      url: "https://picsum.photos/seed/prod_0002_blk3/800/800",
      title: "Lifestyle shot",
    },
  ],
  v2: [
    {
      id: "p2_v2_vid1",
      type: "video",
      url: SAMPLE_VIDEOS.features,
      poster: "https://picsum.photos/seed/prod_0002_slv_vid/800/800",
      title: "Active noise cancellation demo",
      duration: "0:05",
      isPrimary: true,
    },
    {
      id: "p2_v2_img1",
      type: "image",
      url: "https://picsum.photos/seed/prod_0002_slv1/800/800",
      title: "Silver — front view",
    },
    {
      id: "p2_v2_img2",
      type: "image",
      url: "https://picsum.photos/seed/prod_0002_slv2/800/800",
      title: "Silver — charging case",
    },
  ],
  v3: [
    {
      id: "p2_v3_img1",
      type: "image",
      url: "https://picsum.photos/seed/prod_0002_blu1/800/800",
      title: "Blue — front view",
      isPrimary: true,
    },
    {
      id: "p2_v3_vid1",
      type: "video",
      url: SAMPLE_VIDEOS.showcase,
      poster: "https://picsum.photos/seed/prod_0002_blu_vid/800/800",
      title: "Water resistance test",
      duration: "0:15",
    },
  ],
};

const PRODUCT_VARIANT_MEDIA: Record<string, Record<string, ProductMedia[]>> = {
  prod_0002: PROD_0002_MEDIA,
};

export function getVariantMedia(productId: string, variantId: string): ProductMedia[] {
  const productMedia = PRODUCT_VARIANT_MEDIA[productId];
  if (productMedia?.[variantId]?.length) return productMedia[variantId];

  const variant = demoVariants.find((v) => v.id === variantId);
  if (!variant) return [];

  return variant.gallery.map((url, i) => ({
    id: `${variantId}_img_${i}`,
    type: "image" as const,
    url,
    title: `Image ${i + 1}`,
    isPrimary: i === 0,
  }));
}

export const demoVariants: ProductVariant[] = [
  {
    id: "v1",
    label: "Black / 128GB / 8GB",
    color: "Black",
    storage: "128GB",
    ram: "8GB",
    price: 45999,
    stock: 42,
    sku: "PHN-BLK-128-8",
    gallery: [
      "https://picsum.photos/seed/v1a/600/600",
      "https://picsum.photos/seed/v1b/600/600",
      "https://picsum.photos/seed/v1c/600/600",
    ],
  },
  {
    id: "v2",
    label: "Silver / 256GB / 12GB",
    color: "Silver",
    storage: "256GB",
    ram: "12GB",
    price: 52999,
    stock: 18,
    sku: "PHN-SLV-256-12",
    gallery: [
      "https://picsum.photos/seed/v2a/600/600",
      "https://picsum.photos/seed/v2b/600/600",
    ],
  },
  {
    id: "v3",
    label: "Blue / 128GB / 8GB",
    color: "Blue",
    storage: "128GB",
    ram: "8GB",
    price: 45999,
    stock: 0,
    sku: "PHN-BLU-128-8",
    gallery: ["https://picsum.photos/seed/v3a/600/600"],
  },
];
