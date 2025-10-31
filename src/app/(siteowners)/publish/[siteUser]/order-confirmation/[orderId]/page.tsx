import OrderConfirmationPage from "@/components/site-owners/publish/checkout/order-confirmation-page";
import { use } from "react";
interface PageProps {
  params: Promise<{
    orderId: string;
    siteUser: string;
  }>;
}

export default function OrderConfirmation({ params }: PageProps) {
  const { orderId, siteUser } = use(params);

  return (
    <OrderConfirmationPage
      params={{ siteUser: siteUser, orderId: orderId.toString() }}
    />
  );
}
