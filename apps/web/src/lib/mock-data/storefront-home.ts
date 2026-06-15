import { products } from "./products";
import { categoriesFlat } from "./categories";
import type { StorefrontBlogPost } from "./storefront-blog";
import { blogPosts } from "./storefront-blog";
import { categoryPath } from "@/lib/url-slug/paths";

export type { StorefrontBlogPost };

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
  badge?: "new" | "sale" | "bestseller" | "ai-pick";
};

export type StorefrontCategory = {
  id: string;
  slug: string;
  name: string;
  image: string;
  productCount: number;
};

export type StorefrontBrand = {
  id: string;
  name: string;
  slug: string;
  logo: string;
};

export type StorefrontReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  productName: string;
  verified: boolean;
};


export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  theme: "light" | "dark";
};

const published = products.filter((p) => p.status === "published");

export function toStorefrontProduct(p: (typeof products)[0], i: number): StorefrontProduct {
  const badges: StorefrontProduct["badge"][] = ["bestseller", "sale", "new", "ai-pick", undefined];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: `https://picsum.photos/seed/${p.id}/600/600`,
    brand: p.brand,
    rating: 3.8 + (i % 12) * 0.1,
    reviewCount: 12 + (i % 80),
    badge: badges[i % badges.length],
  };
}

export const heroSlides: HeroSlide[] = [
  {
    id: "h1",
    eyebrow: "Summer Collection 2026",
    title: "Style that moves with you",
    subtitle: "Free shipping on orders over ৳2,000 · Easy returns within 30 days",
    cta: "Shop now",
    href: categoryPath("electronics"),
    image: "https://picsum.photos/seed/hero1/1400/700",
    theme: "dark",
  },
  {
    id: "h2",
    eyebrow: "New arrivals",
    title: "Fresh picks every week",
    subtitle: "Discover the latest in tech, fashion, and home essentials",
    cta: "Explore new",
    href: categoryPath("apparel"),
    image: "https://picsum.photos/seed/hero2/1400/700",
    theme: "light",
  },
  {
    id: "h3",
    eyebrow: "AI curated for you",
    title: "Smart recommendations",
    subtitle: "Personalized picks based on what shoppers like you love",
    cta: "See picks",
    href: "#ai-picks",
    image: "https://picsum.photos/seed/hero3/1400/700",
    theme: "dark",
  },
];

export const featuredCategories: StorefrontCategory[] = categoriesFlat
  .filter((c) => c.parentId === null && c.active)
  .slice(0, 6)
  .map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    image: c.iconUrl ?? `https://picsum.photos/seed/${c.id}/400/400`,
    productCount: c.productCount,
  }));

export const featuredProducts = published.slice(0, 8).map(toStorefrontProduct);
export const bestSellers = published.slice(8, 16).map(toStorefrontProduct);
export const newArrivals = published.slice(16, 24).map(toStorefrontProduct);
export const dealProducts = published
  .filter((p) => p.compareAtPrice)
  .slice(0, 6)
  .map(toStorefrontProduct);

export const storefrontBrands: StorefrontBrand[] = [
  { id: "b1", name: "UrbanWear", slug: "urbanwear", logo: "https://picsum.photos/seed/brand1/120/48" },
  { id: "b2", name: "TechPro", slug: "techpro", logo: "https://picsum.photos/seed/brand2/120/48" },
  { id: "b3", name: "HomeNest", slug: "homenest", logo: "https://picsum.photos/seed/brand3/120/48" },
  { id: "b4", name: "GlowUp", slug: "glowup", logo: "https://picsum.photos/seed/brand4/120/48" },
  { id: "b5", name: "ActiveLife", slug: "activelife", logo: "https://picsum.photos/seed/brand5/120/48" },
  { id: "b6", name: "ReadWell", slug: "readwell", logo: "https://picsum.photos/seed/brand6/120/48" },
];

export const customerReviews: StorefrontReview[] = [
  {
    id: "r1",
    author: "Fatima R.",
    rating: 5,
    title: "Exactly as described",
    body: "Fast delivery and great quality. Will order again!",
    productName: "Wireless Earbuds Pro",
    verified: true,
  },
  {
    id: "r2",
    author: "Karim H.",
    rating: 5,
    title: "Best price in town",
    body: "Compared three sites — AgainERP store had the best deal and support.",
    productName: "Smart Watch Series 5",
    verified: true,
  },
  {
    id: "r3",
    author: "Nadia S.",
    rating: 4,
    title: "Love the packaging",
    body: "Premium feel from unboxing to product. Minor delay but worth it.",
    productName: "Organic Face Serum",
    verified: true,
  },
];

export { blogPosts };

export const aiPicks = published.slice(24, 30).map((p, i) => ({
  ...toStorefrontProduct(p, i),
  badge: "ai-pick" as const,
}));

export const storeConfig = {
  name: "AgainShop",
  tagline: "Modern shopping, powered by AI",
  currency: "BDT",
  cartCount: 2,
};
