"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GitCompare,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LiveSearch } from "@/components/storefront/search/live-search";
import { StorefrontBuilderNav } from "@/components/storefront/storefront-builder-nav";
import { useStorefrontAuth } from "@/lib/store/storefront-auth-store";
import { useStorefrontCart } from "@/lib/store/storefront-cart-store";
import { useStorefrontCompare } from "@/lib/store/storefront-compare-store";
import { useStorefrontWishlist } from "@/lib/store/storefront-wishlist-store";
import { storeConfig } from "@/lib/mock-data/storefront-home";
import { accountPaths, categoryPath, storefrontPaths } from "@/lib/url-slug/storefront-paths";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: categoryPath("electronics"), label: "Electronics" },
  { href: categoryPath("apparel"), label: "Fashion" },
  { href: storefrontPaths.deals, label: "Deals" },
  { href: storefrontPaths.blog, label: "Blog" },
];

function isNavLinkActive(pathname: string, href: string) {
  if (href === storefrontPaths.home) return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StorefrontHeader() {
  const pathname = usePathname();
  const user = useStorefrontAuth((s) => s.user);
  const count = useStorefrontCart((s) => s.count);
  const wishlistCount = useStorefrontWishlist((s) => s.count);
  const compareCount = useStorefrontCompare((s) => s.count);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-11 max-w-6xl items-center gap-2 px-3 sm:h-12 sm:gap-3 sm:px-5">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <h2 className="text-lg font-semibold">{storeConfig.name}</h2>
            <nav className="mt-6 flex flex-col gap-1">
              <StorefrontBuilderNav variant="mobile" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                    isNavLinkActive(pathname, link.href) && "bg-accent text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href={storefrontPaths.home} className="shrink-0 text-base font-bold tracking-tight sm:text-lg">
          {storeConfig.name}
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block lg:max-w-xl lg:px-4 xl:max-w-2xl">
          <LiveSearch variant="header" />
        </div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex" aria-label="Compare" asChild>
            <Link href={storefrontPaths.compare}>
              <GitCompare className="h-5 w-5" />
              {compareCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {compareCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex" aria-label="Wishlist" asChild>
            <Link href={storefrontPaths.wishlist}>
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex" aria-label="Account" asChild>
            <Link href={user ? accountPaths.dashboard : storefrontPaths.account}>
              <User className="h-5 w-5" />
              <span className="hidden text-sm font-medium md:inline">
                {user ? user.name.split(" ")[0] : "Login"}
              </span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Account" asChild>
            <Link href={user ? accountPaths.dashboard : storefrontPaths.account}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Cart" asChild>
            <Link href={storefrontPaths.cart}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-border/60 bg-muted/20">
        <nav
          className="mx-auto flex max-w-6xl items-center gap-0.5 overflow-x-auto px-3 py-2 sm:gap-1 sm:px-5 lg:py-2.5"
          aria-label="Main menu"
        >
          <StorefrontBuilderNav variant="desktop" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isNavLinkActive(pathname, link.href)
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {searchOpen && (
        <div className="border-t border-border/60 px-4 py-3 lg:hidden">
          <LiveSearch variant="mobile" autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
