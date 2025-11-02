import OrderConfirmationPage from "@/components/site-owners/publish/checkout/order-confirmation-page";
import { use } from "react";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    orderId: string;
    siteUser: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { siteUser, orderId } = await params;

  return generatePublishPageMetadata({
    pageName: `Order Confirmation #${orderId}`,
    pageDescription:
      "Thank you for your purchase from {storeName}. Review your order details and track your order status here.",
    pageRoute: `/checkout/order-confirmation/${orderId}`,
  });
}

export default function OrderConfirmation({ params }: PageProps) {
  const { orderId, siteUser } = use(params);

  return (
    <OrderConfirmationPage
      params={{ siteUser: siteUser, orderId: orderId.toString() }}
    />
  );
}
