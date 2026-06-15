import type { Metadata } from "next";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { storeConfig } from "@/lib/mock-data/storefront-home";

export const metadata: Metadata = {
  title: `${storeConfig.name} — Online Shopping`,
  description: storeConfig.tagline,
};

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="storefront flex min-h-screen flex-col">
      <StorefrontHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 pb-20 sm:px-5 sm:py-5 sm:pb-6">
        {children}
      </main>
      <StorefrontFooter />
      <MobileBottomNav />
    </div>
  );
}
