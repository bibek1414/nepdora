import CheckoutPage from "@/components/site-owners/publish/checkout/checkout-page";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePublishPageMetadata({
    pageName: "Checkout",
    pageDescription:
      "Complete your purchase for {storeName}. Review your order, enter payment details, and finalize your transaction securely.",
    pageRoute: "/checkout",
  });
}

export default function Checkout() {
  return <CheckoutPage />;
}
