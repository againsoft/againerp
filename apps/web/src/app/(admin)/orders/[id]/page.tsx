"use client";

import { use } from "react";
import { OrderDetailWorkspace } from "@/components/orders/order-detail-workspace";

type Props = {
  params: Promise<{ id: string }>;
};

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <OrderDetailWorkspace orderId={id} />
    </div>
  );
}
