"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Search,
  ChevronRight,
  AlertCircle,
  CreditCard,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useTrackOrder } from "@/hooks/owner-site/use-track-order";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const statusConfig: Record<
  string,
  { key: string; label: string; color: string; icon: any }
> = {
  pending: {
    key: "pending",
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    key: "confirmed",
    label: "Confirmed",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: CheckCircle2,
  },
  processing: {
    key: "processing",
    label: "Processing",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Package,
  },
  shipped: {
    key: "shipped",
    label: "Shipped",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Truck,
  },

  delivered: {
    key: "delivered",
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
};

const timelineSteps = [
  { id: "pending", label: "Order Placed", icon: FileText },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const { data: order, isLoading, error } = useTrackOrder(orderNumber);
  const { data: themeResponse } = useThemeQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#4F46E5", // Default indigo-600
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(orderNumber, searchQuery.trim());
      router.push(newPath);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
            style={{
              borderColor: theme.colors.primary,
              borderTopColor: "transparent",
            }}
          ></div>
          <p className="animate-pulse font-medium text-slate-500">
            Fetching order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/50"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Order Not Found
          </h1>
          <p className="mb-8 text-slate-500">
            We couldn&apos;t find an order with the number{" "}
            <span className="font-semibold text-slate-700">{orderNumber}</span>.
            Please check and try again.
          </p>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute top-1/4 ml-2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter order number (e.g. ORD-F7E6C855)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Track Order
            </button>
          </form>

          <button
            onClick={() => router.back()}
            className="mx-auto mt-6 flex items-center justify-center gap-2 font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const orderItems = order.order_items || order.items || [];
  const normalizedStatus = order.status?.toLowerCase() || "pending";
  const currentStatusIndex = timelineSteps.findIndex(
    step => step.id === normalizedStatus
  );
  const statusInfo = statusConfig[normalizedStatus] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const subtotal =
    Number(order.total_amount) - Number(order.delivery_charge || 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-10 border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Track
              <span
                className="text-indigo-600"
                style={{ color: theme.colors.primary }}
              >
                Order
              </span>
            </span>
          </div>
          <div className="hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Track another order..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Order Header & Timeline & Products */}
          <div className="space-y-8 lg:col-span-2">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-slate-900">
                    Order Tracking
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      Order Number:{" "}
                      <span className="text-slate-900">
                        {order.order_number}
                      </span>
                    </span>
                    <span className="hidden text-slate-300 sm:block">•</span>
                    <span className="flex items-center gap-1.5">
                      Placed on:{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-full border px-4 py-2 ${statusInfo.color} flex items-center gap-2 self-start sm:self-center`}
                >
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-wider ">
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="mt-12 overflow-hidden px-2">
                <div className="relative">
                  {/* Progress Line Background */}
                  <div className="absolute top-5 left-0 hidden h-1 w-full rounded-full bg-slate-100 sm:block"></div>

                  {/* Active Progress Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max(0, currentStatusIndex / (timelineSteps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-5 left-0 hidden h-1 rounded-full bg-indigo-600 sm:block"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></motion.div>

                  <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:gap-0">
                    {timelineSteps.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const StepIcon = step.icon;

                      return (
                        <div
                          key={step.id}
                          className="group relative flex items-center gap-4 sm:flex-col sm:gap-3"
                        >
                          <div
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${isCompleted ? "text-white shadow-lg" : "border-2 border-slate-200 bg-white text-slate-400"} `}
                            style={
                              isCurrent
                                ? {
                                    backgroundColor: "green",
                                    boxShadow:
                                      "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                                  }
                                : isCompleted
                                  ? {
                                      backgroundColor: theme.colors.primary,
                                      boxShadow: `0 10px 15px -3px ${theme.colors.primary}33`,
                                    }
                                  : {}
                            }
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <StepIcon className="h-5 w-5" />
                            )}

                            {/* Vertical Line for Mobile */}
                            {index < timelineSteps.length - 1 && (
                              <div
                                className={`absolute top-10 left-1/2 h-8 w-0.5 -translate-x-1/2 sm:hidden ${isCompleted ? "bg-indigo-600" : "bg-slate-100"}`}
                                style={
                                  isCompleted
                                    ? { backgroundColor: theme.colors.primary }
                                    : {}
                                }
                              ></div>
                            )}
                          </div>
                          <div className="flex flex-col sm:items-center">
                            <span
                              className={`text-sm font-bold transition-colors ${index <= currentStatusIndex ? "text-slate-900" : "text-slate-400"}`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="mt-0.5 text-[10px] font-bold tracking-widest text-green-600">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-50 p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Package
                    className="h-5 w-5 text-indigo-600"
                    style={{ color: theme.colors.primary }}
                  />
                  Items Ordered
                </h2>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                  {orderItems.length}{" "}
                  {orderItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 ">
                        Product
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-500 ">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-500 ">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 ">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orderItems.map((item: any) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-50/30"
                      >
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                              <Image
                                src={
                                  item.variant?.image ||
                                  item.product?.thumbnail_image ||
                                  "/fallback/image-not-found.png"
                                }
                                alt={item.product?.name || "Product"}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="leading-tight font-bold text-slate-900">
                                {item.product?.name || "Unnamed Product"}
                              </p>
                              {item.variant && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {item.variant.option_values?.map(
                                    (opt: any) => (
                                      <span
                                        key={opt.id}
                                        className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
                                      >
                                        {opt.value}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center font-medium text-slate-600">
                          Rs. {Number(item.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right font-bold text-slate-900">
                          Rs.{" "}
                          {(
                            Number(item.price) * item.quantity
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Map Section */}
            {order.latitude && order.longitude && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="border-b border-slate-50 p-6 sm:p-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <MapPin
                      className="h-5 w-5 text-indigo-600"
                      style={{ color: theme.colors.primary }}
                    />
                    Delivery Location
                  </h2>
                </div>
                <div className="relative flex aspect-video items-center justify-center bg-slate-50">
                  <div className="p-8 text-center">
                    <MapPin
                      className="mx-auto mb-4 h-12 w-12 animate-bounce text-indigo-400"
                      style={{ color: theme.colors.primary }}
                    />
                    <p className="font-mono text-sm font-medium text-slate-500">
                      Lat: {order.latitude}, Lng: {order.longitude}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Map view would be integrated here
                    </p>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 bg-indigo-600/5"
                    style={{ backgroundColor: `${theme.colors.primary}0D` }}
                  ></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Customer Info & Summary */}
          <div className="space-y-8">
            {/* Customer Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="border-b border-slate-50 p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 ">
                  <User
                    className="h-4 w-4 text-indigo-600"
                    style={{ color: theme.colors.primary }}
                  />
                  Customer Details
                </h2>
              </div>
              <div className="space-y-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-slate-400 ">
                        Name
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {order.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-slate-400 ">
                        Email
                      </p>
                      <p className="max-w-[180px] truncate text-sm font-bold text-slate-900">
                        {order.customer_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-slate-400 ">
                        Phone
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {order.customer_phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-6">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-900 ">
                    <Truck
                      className="h-3.5 w-3.5 text-indigo-600"
                      style={{ color: theme.colors.primary }}
                    />
                    Shipping Address
                  </h3>
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm leading-relaxed text-slate-700">
                      {order.shipping_address || order.customer_address}
                      <br />
                      {order.city && (
                        <>
                          <span className="font-bold text-slate-900">
                            {order.city}
                          </span>
                          <br />
                        </>
                      )}
                      Nepal
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="border-b border-slate-50 p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-900 ">
                  <FileText
                    className="h-4 w-4 text-indigo-600"
                    style={{ color: theme.colors.primary }}
                  />
                  Order Summary
                </h2>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">Subtotal</span>
                  <span className="font-bold text-slate-900">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">
                    Delivery Charge
                  </span>
                  <span className="font-bold text-slate-900">
                    Rs. {Number(order.delivery_charge || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span
                    className="text-xl font-black text-indigo-600"
                    style={{ color: theme.colors.primary }}
                  >
                    Rs. {Number(order.total_amount).toLocaleString()}
                  </span>
                </div>

                <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
                  <h3 className="mb-4 text-[10px] font-bold tracking-widest text-slate-400 ">
                    Payment Information
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Method</span>
                    <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-900 ">
                      {order.payment_type || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status</span>
                    <span
                      className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-widest  ${order.is_paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {order.is_paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  {order.transaction_id && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Transaction ID</span>
                      <span className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-400">
                        {order.transaction_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Additional Info Card */}
            {((order as any).promo_code || order.note) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="space-y-6">
                  {(order as any).promo_code && (
                    <div>
                      <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 ">
                        Promo Code
                      </p>
                      <p
                        className="inline-block rounded-xl px-3 py-1.5 text-sm font-bold"
                        style={{
                          backgroundColor: `${theme.colors.primary}1A`,
                          color: theme.colors.primary,
                        }}
                      >
                        {(order as any).promo_code}
                      </p>
                    </div>
                  )}
                  {order.note && (
                    <div>
                      <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 ">
                        Order Note
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600 italic">
                        &quot;{order.note}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
