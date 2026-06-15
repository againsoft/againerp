"use client";

import { ReviewGrid } from "@/components/reviews/review-grid";

export default function AllReviewsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0 mb-1">
        <p className="page-subtitle">AgainERP › Catalog › Reviews</p>
        <h1 className="page-title">All Reviews</h1>
      </div>
      <ReviewGrid className="min-h-0 flex-1" />
    </div>
  );
}
