"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/owner-site/admin/use-orders";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { EditableText } from "@/components/ui/editable-text";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_ORDER = {
  id: 0,
  order_number: "ORD-SAMPLE-002",
  created_at: new Date().toISOString(),
  status: "confirmed",
  customer_name: "Jane Doe (Sample)",
  customer_email: "jane.sample@example.com",
  customer_phone: "+977-9800000001",
  shipping_address: "456 Sample Blvd, Pokhara",
  city: "Pokhara",
  total_amount: "2500.00",
  delivery_charge: "150.00",
  order_items: [
    {
      id: 1,
      product_id: 1,
      price: "1175.00",
      quantity: 2,
      product: {
        name: "Sample Luxury Product",
        thumbnail_image: "/fallback/image-not-found.png",
      },
    },
  ],
};

interface OrderConfirmationStyleProps {
  siteUser?: string;
  orderId?: string;
}

const OrderConfirmationStyle2 = ({
  siteUser: propSiteUser,
  orderId: propOrderId,
}: OrderConfirmationStyleProps) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const siteUser = propSiteUser || (params?.siteUser as string);
  const orderId = propOrderId || (params?.orderId as string);
  const isBuilder = pathname?.includes("/builder/");
  const { data: orderResponse, isLoading, error } = useOrder(parseInt(orderId));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = (orderResponse || (isBuilder ? MOCK_ORDER : null)) as any;
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

  if ((error || !order) && !isBuilder) {
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

  if (!order) return null;

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
    <div className="min-h-full px-4 py-12 font-sans transition-colors duration-500 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8 inline-block"
          >
            <div
              className="rounded-full p-6"
              style={{ backgroundColor: `${theme.colors.primary}15` }}
            >
              <CheckCircle
                className="h-16 w-16"
                style={{ color: theme.colors.primary }}
              />
            </div>
          </motion.div>
          <EditableText
            value="Order Confirmed!"
            onChange={() => {}}
            as="h1"
            className="mb-4 text-4xl font-medium md:text-5xl"
            style={{
              fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
            }}
            isEditable={isBuilder}
          />
          <EditableText
            value="Thank you for your purchase. Your order has been received and is being processed."
            onChange={() => {}}
            as="p"
            className="mx-auto mt-3 max-w-lg opacity-70"
            style={{
              fontFamily: `var(--font-body, ${theme.fonts.body})`,
            }}
            isEditable={isBuilder}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Order Items */}
            <div className="rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300">
              <h3
                className="mb-6 flex items-center gap-2 text-xl font-medium"
                style={{
                  fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                }}
              >
                <Package className="h-5 w-5 opacity-70" />
                Order Items
              </h3>
              <div className="space-y-6">
                {orderItems.map((item: any, index: number) => {
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
                      className="flex items-center gap-4 border-b pb-6 last:border-0 last:pb-0"
                      style={{ borderColor: `${theme.colors.primary}05` }}
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-stone-100 shadow-sm">
                        <Image unoptimized
                          src={displayImage || "/fallback/image-not-found.png"}
                          alt={displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 text-base font-medium">
                          {displayName}
                        </h4>
                        <p className="text-sm opacity-50">
                          Qty: {item.quantity}
                        </p>
                        {item.variant && item.variant.option_values && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.variant.option_values.map((option: any) => (
                              <span
                                key={option.id}
                                className="rounded-full px-1.5 py-0.5 text-[10px]"
                                style={{
                                  backgroundColor: `${theme.colors.primary}10`,
                                  color: theme.colors.primary,
                                }}
                              >
                                {option.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          Rs.
                          {Number(
                            Number(itemPrice) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs opacity-40">
                          Rs.{Number(itemPrice).toLocaleString("en-IN")} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Shipping Information */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300">
                <h3
                  className="mb-4 flex items-center gap-2 text-lg font-medium"
                  style={{
                    fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                  }}
                >
                  <Mail className="h-5 w-5 opacity-70" />
                  Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="opacity-70">
                    <span className="block font-medium">Name:</span>{" "}
                    {order.customer_name}
                  </p>
                  <p className="opacity-70">
                    <span className="block font-medium">Email:</span>{" "}
                    {order.customer_email}
                  </p>
                  {order.customer_phone && (
                    <p className="opacity-70">
                      <span className="block font-medium">Phone:</span>{" "}
                      {order.customer_phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300">
                <h3
                  className="mb-4 flex items-center gap-2 text-lg font-medium"
                  style={{
                    fontFamily: `var(--font-heading, ${theme.fonts.heading})`,
                  }}
                >
                  <Truck className="h-5 w-5 opacity-70" />
                  Shipping
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="whitespace-pre-line opacity-70">
                    {order.shipping_address}
                  </p>
                  {order.city && (
                    <p className="mt-1 opacity-70">
                      <span className="font-medium">City:</span> {order.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Summary & Status */}
          <div className="space-y-8">
            {/* Order Info */}
            <div className="rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300">
              <div className="mb-6">
                <Badge
                  className={cn(
                    "mb-3 rounded-full px-3 py-1 text-xs",
                    getStatusColor(order.status || "pending")
                  )}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1) || "Pending"}
                </Badge>
                <p className="mb-1 text-xs opacity-50">Order Number</p>
                <h4 className="text-lg font-semibold">
                  #{order.order_number || order.id}
                </h4>
              </div>

              <div
                className="mt-6 space-y-4 border-t pt-6"
                style={{ borderColor: `${theme.colors.primary}10` }}
              >
                <div className="flex justify-between text-sm opacity-70">
                  <span>Subtotal</span>
                  <span>
                    Rs.
                    {Number(
                      Number(order.total_amount) -
                        Number(order.delivery_charge || 0)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                {order.delivery_charge && Number(order.delivery_charge) > 0 && (
                  <div className="flex justify-between text-sm opacity-70">
                    <span>Delivery</span>
                    <span>
                      Rs.{Number(order.delivery_charge).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4">
                  <span className="font-medium">Total</span>
                  <span
                    className="text-2xl font-semibold"
                    style={{ color: theme.colors.primary }}
                  >
                    Rs.{Number(order.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationStyle2;
