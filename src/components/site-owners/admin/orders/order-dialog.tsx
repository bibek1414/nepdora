"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Order } from "@/types/owner-site/admin/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight, Package2, X } from "lucide-react";
import { useUpdateOrderStatus } from "@/hooks/owner-site/admin/use-orders";
import { toast } from "sonner";
import { WhatsAppOrderButton } from "@/components/ui/whatsapp-order-button";
import { SMSOrderButton } from "@/components/ui/sms-order-button";

interface OrderDialogProps {
  orders: Order[];
  currentOrderId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderChange: (orderId: number) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800",
    },
    confirmed: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800",
    },
    processing: {
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800",
    },
    shipped: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800",
    },
    delivered: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800",
    },
    cancelled: {
      variant: "destructive" as const,
      className: "",
    },
    open: {
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getPaymentBadge = (isPaid: boolean | undefined) => {
  return isPaid ? (
    <Badge variant="secondary" className="bg-green-100 text-green-800">
      Paid
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-red-100 text-red-800">
      Unpaid
    </Badge>
  );
};

const getPaymentTypeBadge = (paymentType: string | undefined) => {
  const paymentTypeConfig = {
    cod: { label: "COD", color: "bg-blue-100 text-blue-800" },
    esewa: { label: "eSewa", color: "bg-purple-100 text-purple-800" },
    khalti: { label: "Khalti", color: "bg-purple-100 text-purple-800" },
    card: { label: "Card", color: "bg-gray-100 text-gray-800" },
  };

  const config = paymentTypeConfig[
    paymentType as keyof typeof paymentTypeConfig
  ] || { label: paymentType || "Unknown", color: "bg-gray-100 text-gray-800" };

  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
};

const getStatusPipeline = (currentStatus: string) => {
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];
  const currentIndex = statuses.indexOf(currentStatus.toLowerCase());

  return statuses.map((status, index) => ({
    label:
      status === "pending"
        ? "Ordered"
        : status === "confirmed"
          ? "Confirmed"
          : status === "shipped"
            ? "Shipped"
            : status === "delivered"
              ? "Delivered"
              : "Processing",
    number: index + 1,
    active: index <= currentIndex,
    isLast: index === statuses.length - 1,
  }));
};

export const OrderDialog: React.FC<OrderDialogProps> = ({
  orders,
  currentOrderId,
  isOpen,
  onClose,
  onOrderChange,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const updateOrderStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (currentOrderId && orders.length > 0) {
      const orderIndex = orders.findIndex(order => order.id === currentOrderId);
      if (orderIndex !== -1) {
        setCurrentOrder(orders[orderIndex]);
        setCurrentIndex(orderIndex);
      }
    }
  }, [currentOrderId, orders]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || orders.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, orders.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newOrder = orders[newIndex];
      setCurrentIndex(newIndex);
      setCurrentOrder(newOrder);
      onOrderChange(newOrder.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < orders.length - 1) {
      const newIndex = currentIndex + 1;
      const newOrder = orders[newIndex];
      setCurrentIndex(newIndex);
      setCurrentOrder(newOrder);
      onOrderChange(newOrder.id);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!currentOrder) return;

    try {
      await updateOrderStatus.mutateAsync({
        id: currentOrder.id,
        statusData: { status: newStatus },
      });

      setCurrentOrder(prev => (prev ? { ...prev, status: newStatus } : null));
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!currentOrder) return null;

  const orderItems = currentOrder.order_items || currentOrder.items || [];
  const pipeline = getStatusPipeline(currentOrder.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-visible bg-black/80 p-0 backdrop-blur-sm">
        {/* Navigation Arrows - Positioned outside the dialog */}
        {orders.length > 1 && (
          <>
            {/* Left Arrow */}
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </Button>

            {/* Right Arrow */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === orders.length - 1}
              className="absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </>
        )}

        <div className="relative max-h-[95vh] w-full overflow-y-auto rounded-lg bg-white shadow">
          {/* Header with navigation indicator */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold">
                Order #{currentOrder.order_number}
              </h2>
              {orders.length > 1 && (
                <div className="text-xs text-gray-500">
                  {currentIndex + 1} of {orders.length}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <WhatsAppOrderButton order={currentOrder} size="sm" />
              <SMSOrderButton order={currentOrder} size="sm" />
              <Select
                value={currentOrder.status}
                onValueChange={handleStatusChange}
                disabled={updateOrderStatus.isPending}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Status Pipeline */}
            <div className="mb-6 flex items-center justify-between">
              {pipeline.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-1 items-center">
                    <div className="flex items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                          step.active
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.number}
                      </div>
                      <span
                        className={`ml-2 ${step.active ? "font-medium text-gray-900" : "text-gray-600"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!step.isLast && (
                      <div
                        className={`mx-2 h-0.5 flex-1 ${step.active ? "bg-black" : "bg-gray-200"}`}
                      ></div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Order Info Grid */}
            <div className="mb-3 grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
              <div>
                <p className="text-gray-500">Order date</p>
                <p className="font-medium">
                  {formatDate(currentOrder.created_at)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium capitalize">
                  {currentOrder.customer_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{currentOrder.customer_email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{currentOrder.customer_phone}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500">Payment status</p>
                {getPaymentBadge(currentOrder.is_paid)}
              </div>
              <div>
                <p className="text-gray-500">Payment type</p>
                {getPaymentTypeBadge(currentOrder.payment_type)}
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Shipping address</p>
                <p className="font-medium capitalize">
                  {currentOrder.shipping_address}
                </p>
              </div>
              {currentOrder.transaction_id && (
                <div className="md:col-span-2">
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-medium">{currentOrder.transaction_id}</p>
                </div>
              )}
            </div>

            {/* Items Ordered */}
            <div className="border-t pt-4">
              <h3 className="mb-3 text-base font-semibold">Items Ordered</h3>
              {orderItems.length > 0 ? (
                <ul className="divide-y text-sm">
                  {orderItems.map(item => (
                    <li key={item.id} className="flex justify-between py-2">
                      <div className="flex flex-1 items-center gap-3">
                        {item.product?.thumbnail_image && (
                          <Image
                            src={item.product.thumbnail_image}
                            alt={
                              item.product.thumbnail_alt_description ||
                              item.product.name
                            }
                            width={40}
                            height={40}
                            className="rounded border object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-xs font-medium">
                            {item.product?.name ||
                              `Product #${item.product_id}`}
                          </div>
                          {item.variant && item.variant.option_values && (
                            <div className="mt-1 text-xs text-gray-500">
                              Variant:{" "}
                              {item.variant.option_values
                                .map(option => option.value)
                                .join(", ")}
                            </div>
                          )}
                          <div className="mt-1 text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Rs.{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Package2 className="mx-auto h-12 w-12 text-gray-300" />
                  <p>No items found for this order</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="mt-4 border-t pt-4">
              <h3 className="mb-3 text-base font-semibold">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>
                    Rs.
                    {Number(currentOrder.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Rs.0.00</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>
                    {" "}
                    Rs.{" "}
                    {Number(currentOrder.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
