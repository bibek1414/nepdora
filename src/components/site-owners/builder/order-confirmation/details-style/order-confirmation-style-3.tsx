"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrder } from "@/hooks/owner-site/admin/use-orders";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Home,
} from "lucide-react";
import Image from "next/image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { EditableText } from "@/components/ui/editable-text";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_ORDER = {
  id: 0,
  order_number: "ORD-CATALOG-001",
  created_at: new Date().toISOString(),
  status: "confirmed",
  customer_name: "Jane Doe (Sample)",
  customer_email: "jane.sample@example.com",
  customer_phone: "+977-9800000001",
  shipping_address: "456 Sample Blvd, Pokhara",
  city: "Pokhara",
  order_items: [
    {
      id: 1,
      product_id: 1,
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

const OrderConfirmationStyle3 = ({
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
  const order = (orderResponse || (isBuilder ? MOCK_ORDER : null)) as any;
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }

  if ((error || !order) && !isBuilder) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="mb-4 text-2xl font-bold">Order not found</h1>
        <Button onClick={() => router.push(pathname?.includes("/preview/") ? `/preview/${siteUser}` : "/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const orderItems = order.order_items || order.items || [];

  return (
    <div className="min-h-full px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 inline-block">
            <div className="rounded-full p-6" style={{ backgroundColor: `${theme.colors.primary}15` }}>
              <CheckCircle className="h-16 w-16" style={{ color: theme.colors.primary }} />
            </div>
          </motion.div>
          <EditableText
            value="Request Received!"
            onChange={() => {}}
            as="h1"
            className="mb-4 text-4xl font-medium md:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isBuilder}
          />
          <p className="mx-auto mt-3 max-w-lg opacity-70">Thank you! Your order request has been received and is being processed.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-gray-100 p-8 -sm">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-medium" style={{ fontFamily: theme.fonts.heading }}>
                <Package className="h-5 w-5 opacity-70" /> Items Requested
              </h3>
              <div className="space-y-6">
                {orderItems.map((item: any, index: number) => {
                  const displayImage = item.variant?.image || item.product?.thumbnail_image;
                  const displayName = item.variant?.product?.name || item.product?.name || `Item ${index + 1}`;

                  return (
                    <div key={index} className="flex items-center gap-4 border-b pb-6 last:border-0 last:pb-0">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border">
                        <Image unoptimized src={displayImage || "/fallback/image-not-found.png"} alt={displayName} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="line-clamp-1 text-base font-medium">{displayName}</h4>
                        <p className="text-sm opacity-50">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-100 p-8 -sm">
              <Badge className={cn("mb-3 rounded-full px-3 py-1 text-xs", getStatusColor(order.status))}>
                {order.status || "Pending"}
              </Badge>
              <p className="mb-1 text-xs opacity-50">Reference Number</p>
              <h4 className="text-lg font-semibold">#{order.order_number || order.id}</h4>
              <div className="mt-8">
                <Button onClick={() => router.push(pathname?.includes("/preview/") ? `/preview/${siteUser}` : "/")} className="w-full rounded-full" style={primaryButtonStyle}>
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </div>
            </div>
            <div className="">
              <div className="rounded-3xl border border-gray-100 p-8 -sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium" style={{ fontFamily: theme.fonts.heading }}><Mail className="h-5 w-5 opacity-70" /> Contact</h3>
                <div className="space-y-2 text-sm opacity-70">
                  <p><span className="font-medium">Name:</span> {order.customer_name}</p>
                  <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                  <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-gray-100 p-8 mt-4 -sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium" style={{ fontFamily: theme.fonts.heading }}><Truck className="h-5 w-5 opacity-70" /> Delivery</h3>
                <div className="space-y-2 text-sm opacity-70">
                  <p className="whitespace-pre-line">{order.shipping_address}</p>
                  <p>{order.city}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationStyle3;
