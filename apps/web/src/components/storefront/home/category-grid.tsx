import Image from "next/image";
import Link from "next/link";
import type { StorefrontCategory } from "@/lib/mock-data/storefront-home";
import { categoryPath } from "@/lib/url-slug/storefront-paths";

type CategoryGridProps = {
  categories: StorefrontCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={categoryPath(cat.slug)}
          className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-center transition-colors hover:border-primary/30 hover:bg-accent/50"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted sm:h-20 sm:w-20">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="80px"
              className="object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <span className="text-sm font-medium leading-tight">{cat.name}</span>
          <span className="text-[11px] text-muted-foreground">{cat.productCount} items</span>
        </Link>
      ))}
    </div>
  );
}
