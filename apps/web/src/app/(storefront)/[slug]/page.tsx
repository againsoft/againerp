import { notFound } from "next/navigation";
import { Suspense } from "react";
import { resolveStorefrontSlug } from "@/lib/url-slug/resolver";
import { CatalogView } from "@/components/storefront/catalog/catalog-view";
import { ProductDetailView } from "@/components/storefront/product/product-detail-view";
import { getStorefrontProductDetail } from "@/lib/mock-data/storefront-product";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveStorefrontSlug(slug);
  if (!resolved) return { title: "Not found" };

  switch (resolved.type) {
    case "category":
      return {
        title: `${resolved.category.metaTitle ?? resolved.category.name} — AgainShop`,
        description: resolved.category.metaDescription ?? resolved.category.description,
      };
    case "brand":
      return {
        title: `${resolved.brand.metaTitle ?? resolved.brand.name} — AgainShop`,
        description: resolved.brand.metaDescription ?? resolved.brand.description,
      };
    case "product": {
      const detail = getStorefrontProductDetail(resolved.product.slug);
      return {
        title: `${resolved.product.name} — AgainShop`,
        description: detail?.product.description,
      };
    }
    case "page":
      return {
        title: `${resolved.page.metaTitle ?? resolved.page.title} — AgainShop`,
        description: resolved.page.metaDescription,
      };
  }
}

export default async function FlatSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveStorefrontSlug(slug);
  if (!resolved) notFound();

  if (resolved.type === "category") {
    return (
      <Suspense fallback={null}>
        <CatalogView categorySlug={resolved.category.slug} />
      </Suspense>
    );
  }

  if (resolved.type === "brand") {
    return (
      <Suspense fallback={null}>
        <CatalogView brandSlug={resolved.brand.slug} />
      </Suspense>
    );
  }

  if (resolved.type === "product") {
    const detail = getStorefrontProductDetail(resolved.product.slug);
    if (!detail) notFound();
    return <ProductDetailView detail={detail} />;
  }

  if (resolved.type === "page") {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <h1 className="mb-6 text-2xl font-bold">{resolved.page.title}</h1>
        <div className="space-y-4 text-sm text-muted-foreground">
          {resolved.page.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    );
  }

  notFound();
}
