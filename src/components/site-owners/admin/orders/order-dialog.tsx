"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Order } from "@/types/owner-site/admin/orders";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Package2,
  Printer,
  Truck,
  X,
} from "lucide-react";
import { useUpdateOrderStatus } from "@/hooks/owner-site/admin/use-orders";
import { toast } from "sonner";
import { WhatsAppOrderButton } from "@/components/ui/whatsapp-order-button";
import { SMSOrderButton } from "@/components/ui/sms-order-button";
import { LocationLinkButton } from "@/lib/location-widget";
import { getApiBaseUrl } from "@/config/site";

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

const PIPELINE_STEPS = [
  { value: "pending", label: "Ordered" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
  open: "bg-blue-50 text-blue-700",
};

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  cod: "COD",
  esewa: "eSewa",
  khalti: "Khalti",
  card: "Card",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatMoney = (value: string | number | undefined | null) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getStatusClassName = (status: string) =>
  STATUS_BADGE_STYLES[status?.toLowerCase()] || "bg-slate-100 text-slate-700";

const getStatusBadge = (status: string) => (
  <Badge
    variant="secondary"
    className={`rounded-full border-0 px-3 py-1 text-[12px] font-medium shadow-none ${getStatusClassName(
      status
    )}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

const getPaymentBadge = (isPaid: boolean | undefined) => (
  <Badge
    variant="secondary"
    className={`rounded-full border-0 px-3 py-1 text-[12px] font-medium shadow-none ${
      isPaid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}
  >
    {isPaid ? "Paid" : "Unpaid"}
  </Badge>
);

const getPaymentTypeLabel = (paymentType: string | undefined) =>
  PAYMENT_TYPE_LABELS[paymentType || ""] || paymentType || "Unknown";

const getStepProgress = (status: string) => {
  const currentIndex = PIPELINE_STEPS.findIndex(
    step => step.value === status.toLowerCase()
  );

  if (currentIndex <= 0) {
    return 0;
  }

  if (currentIndex >= PIPELINE_STEPS.length - 1) {
    return 100;
  }

  return (currentIndex / (PIPELINE_STEPS.length - 1)) * 100;
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
  const apiBaseUrl = getApiBaseUrl();

  useEffect(() => {
    if (!currentOrderId || orders.length === 0) {
      setCurrentOrder(null);
      return;
    }

    const orderIndex = orders.findIndex(order => order.id === currentOrderId);
    if (orderIndex !== -1) {
      setCurrentOrder(orders[orderIndex]);
      setCurrentIndex(orderIndex);
    }
  }, [currentOrderId, orders]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || orders.length <= 1) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (currentIndex <= 0) {
          return;
        }

        const newOrder = orders[currentIndex - 1];
        setCurrentOrder(newOrder);
        setCurrentIndex(currentIndex - 1);
        onOrderChange(newOrder.id);
      }

      if (event.key === "ChevronRight") {
        event.preventDefault();
        if (currentIndex >= orders.length - 1) {
          return;
        }

        const newOrder = orders[currentIndex + 1];
        setCurrentOrder(newOrder);
        setCurrentIndex(currentIndex + 1);
        onOrderChange(newOrder.id);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, onOrderChange, orders]);

  const handlePrevious = () => {
    if (currentIndex <= 0) {
      return;
    }

    const newOrder = orders[currentIndex - 1];
    setCurrentOrder(newOrder);
    setCurrentIndex(currentIndex - 1);
    onOrderChange(newOrder.id);
  };

  const handleNext = () => {
    if (currentIndex >= orders.length - 1) {
      return;
    }

    const newOrder = orders[currentIndex + 1];
    setCurrentOrder(newOrder);
    setCurrentIndex(currentIndex + 1);
    onOrderChange(newOrder.id);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!currentOrder) {
      return;
    }

    try {
      await updateOrderStatus.mutateAsync({
        id: currentOrder.id,
        statusData: { status: newStatus },
      });

      setCurrentOrder(prev => (prev ? { ...prev, status: newStatus } : null));
      toast.success("Order status updated successfully");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handlePrimaryAction = async () => {
    if (!currentOrder) {
      return;
    }

    const nextStatus =
      currentOrder.status === "shipped" ? "delivered" : "shipped";

    await handleStatusChange(nextStatus);
  };

  const handlePrintLabel = () => {
    window.print();
  };

  if (!currentOrder) {
    return null;
  }

  const orderItems = currentOrder.order_items || currentOrder.items || [];
  const stepProgress = getStepProgress(currentOrder.status);
  const subtotal =
    Number(currentOrder.total_amount) -
    Number(currentOrder.delivery_charge || 0);
  const canAdvanceDelivery =
    currentOrder.status !== "cancelled" && currentOrder.status !== "delivered";

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed top-0 right-0 left-auto h-dvh w-full max-w-[480px] translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 border-l border-gray-200 bg-white p-0 shadow-2xl sm:max-w-[480px]"
      >
        <DialogTitle className="sr-only">
          Order details for {currentOrder.order_number}
        </DialogTitle>

        {/* Main container with flex column and full height */}
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header - Fixed at top */}
          <div className="flex flex-shrink-0 items-start justify-between border-b border-gray-100 px-8 pt-8 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  #{currentOrder.order_number}
                </h2>
                {getStatusBadge(currentOrder.status)}
              </div>
              <p className="mt-1 text-[14px] text-gray-500">
                Processed {formatDate(currentOrder.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {orders.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="h-10 w-10 cursor-pointer rounded-full border-gray-200 text-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    disabled={currentIndex === orders.length - 1}
                    className="h-10 w-10 cursor-pointer rounded-full border-gray-200 text-gray-600"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 cursor-pointer rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content - Takes remaining space */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8">
              <div className="relative mt-8 mb-10 px-2">
                <div className="absolute top-[5px] right-[10%] left-[10%] h-[2px] bg-gray-100">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {PIPELINE_STEPS.map((step, index) => {
                    const isActive = index * 25 <= stepProgress;

                    return (
                      <button
                        key={step.value}
                        type="button"
                        onClick={() => handleStatusChange(step.value)}
                        disabled={updateOrderStatus.isPending}
                        className="flex flex-1 cursor-pointer flex-col items-center text-center disabled:cursor-not-allowed"
                      >
                        <span
                          className={`relative z-10 h-[10px] w-[10px] rounded-full outline-[6px] outline-white transition-all ${
                            isActive ? "scale-110 bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                        <span
                          className={`mt-3 block text-[12px] ${
                            isActive
                              ? "font-semibold text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 border-t border-gray-100 py-8">
                <div>
                  <h3 className="mb-1.5 text-[13px] font-semibold text-gray-900">
                    Customer
                  </h3>
                  <p className="text-[14px] font-medium text-gray-900 capitalize">
                    {currentOrder.customer_name || "Walk-in Customer"}
                  </p>
                  <p className="mt-1 text-[13px] text-gray-500">
                    {currentOrder.customer_email || "No email provided"}
                  </p>
                  <p className="mt-0.5 text-[13px] text-gray-500">
                    {currentOrder.customer_phone || "No phone provided"}
                  </p>
                </div>

                <div>
                  <h3 className="mb-1.5 text-[13px] font-semibold text-gray-900">
                    Payment
                  </h3>
                  <div>{getPaymentBadge(currentOrder.is_paid)}</div>
                  <p className="mt-2 text-[13px] text-gray-500">
                    {getPaymentTypeLabel(currentOrder.payment_type)}
                  </p>
                  {currentOrder.transaction_id && (
                    <p className="mt-0.5 text-[13px] text-gray-500">
                      Txn: {currentOrder.transaction_id}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <h3 className="mb-1.5 text-[13px] font-semibold text-gray-900">
                    Shipping address
                  </h3>
                  <p className="text-[14px] text-gray-600">
                    {currentOrder.shipping_address ||
                      currentOrder.customer_address}
                    {currentOrder.city ? ` • ${currentOrder.city}` : ""}
                  </p>

                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-gray-50 p-3">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {currentOrder.latitude && currentOrder.longitude ? (
                        <div className="text-[13px] text-gray-600">
                          <p>
                            Lat {currentOrder.latitude.toFixed(6)}, Lng{" "}
                            {currentOrder.longitude.toFixed(6)}
                          </p>
                          {currentOrder.location_accuracy && (
                            <p className="mt-0.5 text-[12px] text-gray-500">
                              Accuracy ±
                              {Math.round(currentOrder.location_accuracy)}m
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[13px] text-gray-600">
                          Location not confirmed.
                        </p>
                      )}
                    </div>

                    {currentOrder.latitude && currentOrder.longitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${currentOrder.latitude},${currentOrder.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
                      >
                        View map
                      </a>
                    ) : (
                      <LocationLinkButton
                        orderId={currentOrder.id.toString()}
                        confirmPageUrl={`${window.location.origin}/location/confirm`}
                        callbackUrl={`${apiBaseUrl}/api/order/${currentOrder.id}/`}
                        redirectUrl={`${window.location.origin}/admin/orders`}
                        className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
                        label="Get link"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 py-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-[13px] font-semibold text-gray-900">
                    Items ordered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <WhatsAppOrderButton
                      order={currentOrder}
                      size="sm"
                      className="cursor-pointer rounded-full border-0 bg-green-600 px-4 text-[12px] text-white hover:bg-green-700"
                    />
                    <SMSOrderButton
                      order={currentOrder}
                      size="sm"
                      onSuccess={onClose}
                      className="cursor-pointer rounded-full border-0 bg-gray-900 px-4 text-[12px] text-white hover:bg-black"
                    />
                  </div>
                </div>

                {orderItems.length > 0 ? (
                  <div className="space-y-4">
                    {orderItems.map((item, index) => {
                      const displayImage =
                        item.variant?.image || item.product?.thumbnail_image;
                      const displayName =
                        item.variant?.product?.name ||
                        item.product?.name ||
                        `Product #${item.product_id}`;
                      const itemTotal = Number(item.price) * item.quantity;

                      return (
                        <div
                          key={item.id || index}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                              {displayImage ? (
                                <Image unoptimized
                                  src={displayImage}
                                  alt={displayName}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package2 className="h-5 w-5 text-gray-300" />
                              )}
                            </div>

                            <div>
                              <p className="text-[14px] font-medium text-gray-900">
                                {displayName}
                              </p>
                              <p className="mt-0.5 text-[13px] text-gray-500">
                                Qty {item.quantity} • Rs.{" "}
                                {formatMoney(item.price)} each
                              </p>
                              {item.variant?.option_values?.length ? (
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {item.variant.option_values.map(option => (
                                    <Badge
                                      key={option.id}
                                      variant="secondary"
                                      className="rounded-full border-0 bg-gray-100 text-[11px] font-medium text-gray-600"
                                    >
                                      {option.value}
                                    </Badge>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <p className="text-[14px] font-medium text-gray-900">
                            Rs. {formatMoney(itemTotal)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center text-gray-500">
                    <Package2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm">No items found for this order</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-100 py-8">
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>Subtotal</span>
                  <span>Rs. {formatMoney(subtotal)}</span>
                </div>
                {Number(currentOrder.delivery_charge || 0) > 0 && (
                  <div className="flex justify-between text-[14px] text-gray-500">
                    <span>Delivery charge</span>
                    <span>Rs. {formatMoney(currentOrder.delivery_charge)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-[16px] font-semibold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {formatMoney(currentOrder.total_amount)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 py-8">
                <h3 className="mb-3 text-[13px] font-semibold text-gray-900">
                  Status control
                </h3>
                <Select
                  value={currentOrder.status}
                  onValueChange={handleStatusChange}
                  disabled={updateOrderStatus.isPending}
                >
                  <SelectTrigger className="h-11 w-full rounded-2xl border-gray-200 bg-white text-sm">
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
              </div>

              {/* Add bottom padding to ensure content doesn't get hidden behind footer */}
              <div className="h-6" />
            </div>
          </div>

          {/* Sticky Footer - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white p-6 shadow-lg">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrintLabel}
                className="h-12 flex-1 cursor-pointer rounded-full border-gray-200 bg-white text-[14px] font-medium text-gray-900 hover:bg-gray-50"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print label
              </Button>
              <Button
                type="button"
                onClick={handlePrimaryAction}
                disabled={!canAdvanceDelivery || updateOrderStatus.isPending}
                className="h-12 flex-[1.5] cursor-pointer rounded-full bg-blue-600 text-[14px] font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {currentOrder.status === "shipped" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Mark delivered
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Send for delivery
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
