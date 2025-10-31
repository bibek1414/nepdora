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
import Image from "next/image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PreviewOrderConfirmationPageProps {
  params: { siteUser: string; orderId: string };
}

const PreviewOrderConfirmationPage: React.FC<
  PreviewOrderConfirmationPageProps
> = ({ params }) => {
  const router = useRouter();
  const { siteUser, orderId } = params;
  const { data: order, isLoading, error } = useOrder(parseInt(orderId));
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    borderColor: theme.colors.primary,
  };

  const outlineButtonStyle: React.CSSProperties = {
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  };

  const subtlePrimaryBg = `${theme.colors.primary}0D`;

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
          <Button onClick={() => router.push(`/preview/${siteUser}`)}>
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
      case "confirmed":
        return "bg-green-100 text-green-800";
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
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <CheckCircle
            className="mx-auto mb-4 h-16 w-16"
            style={{ color: theme.colors.primary }}
          />
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
                {order.city && (
                  <p className="mt-1 text-sm text-gray-600">
                    <strong>City:</strong> {order.city}
                  </p>
                )}
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
                {orderItems.map((item, index) => {
                  // Use variant data if available, otherwise use product data
                  const displayImage =
                    item.variant?.image || item.product?.thumbnail_image;
                  const displayName =
                    item.variant?.product?.name ||
                    item.product?.name ||
                    `Product ID: ${item.product_id}`;
                  const itemPrice = item.price;

                  return (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0"
                    >
                      <div className="flex flex-1 items-center space-x-4">
                        {/* Product/Variant Image */}
                        {displayImage && (
                          <Image
                            src={displayImage}
                            alt={displayName}
                            width={60}
                            height={60}
                            className="h-15 w-15 rounded object-cover"
                          />
                        )}

                        <div className="flex-1">
                          <p className="font-medium">{displayName}</p>

                          {/* Display variant options as badges if variant exists */}
                          {item.variant && item.variant.option_values && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.variant.option_values.map(option => (
                                <Badge
                                  key={option.id}
                                  variant="secondary"
                                  className="text-xs capitalize"
                                  style={{
                                    backgroundColor: subtlePrimaryBg,
                                    color: theme.colors.primary,
                                  }}
                                >
                                  {option.value}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <p className="mt-1 text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          Rs.{Number(itemPrice).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: Rs.
                          {(Number(itemPrice) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  Rs.
                  {(
                    Number(order.total_amount) -
                    Number(order.delivery_charge || 0)
                  ).toFixed(2)}
                </span>
              </div>

              {order.delivery_charge && Number(order.delivery_charge) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-medium">
                    Rs.{Number(order.delivery_charge).toFixed(2)}
                  </span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>Rs.{Number(order.total_amount).toFixed(2)}</span>
              </div>
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
              <div
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: subtlePrimaryBg }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  1
                </span>
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
              <div
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: subtlePrimaryBg }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  2
                </span>
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
              <div
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: subtlePrimaryBg }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  3
                </span>
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
            onClick={() => router.push(`/preview/${siteUser}`)}
            variant="outline"
            className="px-8"
            style={outlineButtonStyle}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewOrderConfirmationPage;
