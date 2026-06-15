import { Suspense } from "react";
import { ThankYouView } from "@/components/storefront/checkout/thank-you-view";

export const metadata = {
  title: "Order confirmed — AgainShop",
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouView />
    </Suspense>
  );
}
