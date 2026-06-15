"use client";

import { ReviewDetailWorkspace } from "@/components/reviews/review-detail-workspace";

type Props = { params: { id: string } };

export default function ReviewDetailPage({ params }: Props) {
  return (
    <div>
      <p className="page-subtitle">AgainERP › Catalog › Reviews</p>
      <ReviewDetailWorkspace reviewId={params.id} />
    </div>
  );
}
