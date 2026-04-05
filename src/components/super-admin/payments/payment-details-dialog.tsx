"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Package2,
  X,
  ShieldCheck,
  Info,
  Building2,
} from "lucide-react";
import { CentralPaymentHistory } from "@/types/super-admin/payment";
import { cn } from "@/lib/utils";

const formatTenantName = (name?: string) => {
  if (!name) return "";
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

interface PaymentDetailsDialogProps {
  payments: CentralPaymentHistory[];
  currentPaymentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentChange: (paymentId: number) => void;
}

export const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  payments,
  currentPaymentId,
  isOpen,
  onClose,
  onPaymentChange,
}) => {
  const [currentPayment, setCurrentPayment] =
    useState<CentralPaymentHistory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentPaymentId && payments.length > 0) {
      const paymentIndex = payments.findIndex(p => p.id === currentPaymentId);
      if (paymentIndex !== -1) {
        setCurrentPayment(payments[paymentIndex]);
        setCurrentIndex(paymentIndex);
      }
    }
  }, [currentPaymentId, payments]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || payments.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ChevronRight":
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
  }, [isOpen, currentIndex, payments.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newPayment = payments[newIndex];
      setCurrentIndex(newIndex);
      setCurrentPayment(newPayment);
      onPaymentChange(newPayment.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < payments.length - 1) {
      const newIndex = currentIndex + 1;
      const newPayment = payments[newIndex];
      setCurrentIndex(newIndex);
      setCurrentPayment(newPayment);
      onPaymentChange(newPayment.id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentPayment) return null;

  const products = currentPayment.products_purchased || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-visible bg-black/80 p-0 backdrop-blur-sm">
        {/* Navigation Arrows */}
        {payments.length > 1 && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === payments.length - 1}
              className="absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </>
        )}

        <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white shadow">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold text-[#003d79] capitalize">
                {currentPayment.payment_type} Transaction details
              </h2>
              {payments.length > 1 && (
                <div className="text-xs text-gray-500">
                  {currentIndex + 1} of {payments.length}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Payment Summary Header */}
            <div className="mb-6 flex flex-col items-center justify-center border-b pb-6 text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Rs. {Number(currentPayment.pay_amount).toLocaleString("en-IN")}
              </h3>
              <p className="text-sm text-gray-500">
                Transaction{" "}
                {currentPayment.status === "transferred"
                  ? "Transferred"
                  : "Pending"}
              </p>
            </div>

            {/* Transaction Details Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Tenant
                  </label>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    {formatTenantName(currentPayment.tenant) || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Transaction ID
                  </label>
                  <p className="mt-1 font-mono text-gray-900">
                    {currentPayment.transaction_id || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Payment Gateway
                  </label>
                  <p className="mt-1 font-medium text-gray-900 capitalize">
                    {currentPayment.payment_type || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Date & Time
                  </label>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(currentPayment.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={cn(
                        "font-medium",
                        currentPayment.status === "transferred"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                      )}
                    >
                      {currentPayment.status}
                    </Badge>
                  </div>
                </div>
                {currentPayment.additional_info?.is_fallback !== undefined && (
                  <div>
                    <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Gateway Type
                    </label>
                    <p className="mt-1 text-gray-900">
                      {currentPayment.additional_info.is_fallback ? (
                        <span className="flex items-center gap-1 font-medium text-blue-600">
                          <Info className="h-3 w-3" /> Nepdora Gateway
                        </span>
                      ) : (
                        "Own Gateway"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Products Section */}
            <div className="border-t pt-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                <Package2 className="h-4 w-4" />
                Purchased Products
              </h4>

              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((item: any, index: number) => {
                    const product = item.product || {};
                    const displayImage = product.thumbnail_image;

                    return (
                      <div
                        key={item.id || index}
                        className="flex gap-4 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white">
                          {displayImage ? (
                            <Image
                              src={displayImage}
                              alt={product.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-50">
                              <Package2 className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-center">
                          <h5 className="line-clamp-1 text-sm font-semibold text-gray-900">
                            {product.name || "Unknown Product"}
                          </h5>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × Rs.{" "}
                              {Number(item.price).toLocaleString("en-IN")}
                            </p>
                            <p className="text-sm font-bold text-[#003d79]">
                              Rs.{" "}
                              {(
                                Number(item.price) * (item.quantity || 1)
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Total Summary for Products */}
                  <div className="mt-6 flex justify-end border-t pt-4">
                    <div className="w-full max-w-[200px] space-y-2">
                      <div className="flex justify-between text-base font-bold text-gray-900">
                        <span>Grand Total</span>
                        <span>
                          Rs.{" "}
                          {Number(currentPayment.pay_amount).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-100 py-10">
                  <Package2 className="h-10 w-10 text-gray-200" />
                  <p className="mt-2 text-sm text-gray-400">
                    No product details available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
