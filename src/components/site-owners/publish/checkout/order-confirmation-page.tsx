"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/owner-site/admin/use-orders";
import { CheckCircle, Package, Truck, Mail } from "lucide-react";
import { use } from "react";
import Image from "next/image";

interface PublishOrderConfirmationPageProps {
  params: { siteUser: string; orderId: string };
}

const PublishOrderConfirmationPage: React.FC<
  PublishOrderConfirmationPageProps
> = ({ params }) => {
  const router = useRouter();
  const { siteUser, orderId } = params;
  const { data: order, isLoading, error } = useOrder(parseInt(orderId));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Order not found</h1>
          <p className="mb-8 text-gray-600">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Button onClick={() => router.push(`/publish/${siteUser}`)}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Use order_items if available, fallback to items
  const orderItems = order.order_items || order.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">
                  Order #
                  {order.order_number ||
                    `ORD-${order.id.toString().padStart(6, "0")}`}
                </CardTitle>
                <CardDescription>
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(order.status || "pending")}>
                {order.status?.charAt(0).toUpperCase() +
                  order.status?.slice(1) || "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center font-semibold">
                  <Mail className="mr-2 h-4 w-4" />
                  Customer Details
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {order.customer_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {order.customer_email}
                </p>
                {order.customer_phone && (
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {order.customer_phone}
                  </p>
                )}
              </div>

              <div>
                <h3 className="mb-2 flex items-center font-semibold">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping Address
                </h3>
                <p className="text-sm whitespace-pre-line text-gray-600">
                  {order.shipping_address}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="mb-4 flex items-center font-semibold">
                <Package className="mr-2 h-4 w-4" />
                Order Items
              </h3>
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
                  >
                    <div className="flex flex-1 items-center space-x-4">
                      {/* Product Image */}
                      {item.product?.thumbnail_image && (
                        <Image
                          src={item.product.thumbnail_image}
                          alt={
                            item.product.name || `Product ${item.product_id}`
                          }
                          width={60}
                          height={60}
                          className="h-15 w-15 rounded object-cover"
                        />
                      )}

                      <div className="flex-1">
                        <p className="font-medium">
                          {item.product?.name ||
                            `Product ID: ${item.product_id}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        ${Number(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: $
                        {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Total */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>${Number(order.total_amount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Order Confirmation</h4>
                <p className="text-sm text-gray-600">
                  You&apos;ll receive an email confirmation shortly with your
                  order details.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Processing</h4>
                <p className="text-sm text-gray-600">
                  We&apos;ll start preparing your order for shipment within 1-2
                  business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Shipping Updates</h4>
                <p className="text-sm text-gray-600">
                  You&apos;ll receive tracking information once your order
                  ships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => router.push(`/publish/${siteUser}`)}
            variant="outline"
            className="px-8"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => router.push(`/admin/orders`)}
            className="bg-[#B85450] px-8 hover:bg-[#A04A46]"
          >
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishOrderConfirmationPage;
