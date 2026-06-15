import { Suspense } from "react";
import { BlogListView } from "@/components/storefront/blog/blog-list-view";

export const metadata = {
  title: "Blog — AgainShop",
  description: "Tips, trends, and inspiration from AgainShop.",
};

export default function BlogIndexPage() {
  return (
    <Suspense fallback={null}>
      <BlogListView />
    </Suspense>
  );
}
