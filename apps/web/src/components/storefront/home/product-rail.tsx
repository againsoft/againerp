import { ProductCard } from "@/components/storefront/product-card";
import type { StorefrontProduct } from "@/lib/mock-data/storefront-home";
import { cn } from "@/lib/utils";

type ProductRailProps = {
  products: StorefrontProduct[];
  className?: string;
};

export function ProductRail({ products, className }: ProductRailProps) {
  return (
    <div
      className={cn(
        "-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-thin sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} className="min-w-[160px] shrink-0 sm:min-w-0" />
      ))}
    </div>
  );
}
