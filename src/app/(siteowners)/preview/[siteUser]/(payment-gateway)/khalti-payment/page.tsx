"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle, Info, Loader2, ArrowLeft, Lock } from "lucide-react";
import { ApiResponse, PaymentState } from "@/types/payment";
import { useOrder } from "@/hooks/owner-site/admin/use-orders";
import { OrderItem } from "@/types/owner-site/admin/orders";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface KhaltiPaymentData {
  khaltiPaymentUrl: string;
  pidx: string;
  expires_at: string;
  expires_in: number;
}

export default function KhaltiPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useOrder(orderId ? parseInt(orderId) : 0);

  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const handlePayment = async () => {
    if (!order) {
      toast.error("Order data not available");
      return;
    }

    setPaymentState({
      isLoading: true,
      error: null,
      success: false,
    });

    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "khalti",
          amount: order.total_amount,
          productName: `Order #${order.order_number}`,
          transactionId: order.order_number,
          orderId: order.id,
          customerInfo: {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
          },
        }),
      });

      const apiResponse: ApiResponse<KhaltiPaymentData> = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Payment initiation failed");
      }

      const { khaltiPaymentUrl, pidx, expires_at, expires_in } =
        apiResponse.data;

      if (!khaltiPaymentUrl) {
        throw new Error("Payment URL not received from Khalti");
      }

      // Store order ID in session storage for verification later
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`order_id_${pidx}`, String(order.id));
        sessionStorage.setItem(`customer_name_${pidx}`, order.customer_name);
        sessionStorage.setItem(`mobile_number_${pidx}`, order.customer_phone);
        sessionStorage.setItem(
          `products_${pidx}`,
          JSON.stringify(order.items || order.order_items || [])
        );
        console.log(
          `Stored order ID ${order.id}, customer name, and products for pidx ${pidx}`
        );
      }

      setPaymentState({
        isLoading: false,
        error: null,
        success: true,
        paymentUrl: khaltiPaymentUrl,
        transactionId: pidx,
      });

      toast.success("Payment session created! Redirecting to Khalti...");

      const expiryTime = new Date(expires_at).toLocaleString();
      toast.info(`Payment expires at: ${expiryTime}`, { duration: 5000 });

      setTimeout(() => {
        window.location.href = khaltiPaymentUrl;
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Payment initiation error:", errorMessage);

      setPaymentState({
        isLoading: false,
        error: errorMessage,
        success: false,
      });

      toast.error(`Payment initiation failed: ${errorMessage}`);
    }
  };

  // Helper function to render order items with variants
  const renderOrderItem = (item: OrderItem, index: number) => {
    // Use variant data if available, otherwise use product data
    const displayImage = item.variant?.image || item.product?.thumbnail_image;
    const displayName =
      item.variant?.product?.name ||
      item.product?.name ||
      `Product ${item.product_id}`;
    const itemPrice = parseFloat(item.price);
    const itemTotal = itemPrice * item.quantity;

    return (
      <div
        key={item.id || index}
        className="flex gap-3 border-b border-gray-200 py-3 last:border-b-0"
      >
        {/* Product/Variant Image */}
        {displayImage && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
            <Image
              src={displayImage}
              alt={displayName}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {displayName}
            </div>

            {/* Display variant options as badges if variant exists */}
            {item.variant && item.variant.option_values && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.variant.option_values.map(option => (
                  <Badge
                    key={option.id}
                    variant="secondary"
                    className="bg-purple-50 text-xs text-purple-700 capitalize"
                  >
                    {option.value}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-1 text-xs text-gray-500">
              NPR {itemPrice.toFixed(2)} × {item.quantity}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              NPR {itemTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="mx-4 w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Order ID is missing. Please return to checkout.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="mx-4 w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-purple-600" />
            <p className="text-gray-600">Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="mx-4 w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load order details. Please try again."}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Get order items from either items or order_items
  const orderItems = order.items || order.order_items || [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md overflow-hidden border-zinc-200/60 shadow-xl">
        <div className="h-2 w-full bg-[#5d2e8e]" />
        <CardHeader className="bg-zinc-50/50 pt-6 pb-6">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              disabled={paymentState.isLoading}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Secure Checkout
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative h-16 w-32 overflow-hidden rounded-lg border border-zinc-100 bg-white p-2 shadow-sm">
              <img
                src="/images/payment-gateway/khalti.png"
                alt="Khalti"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">Khalti Payment</CardTitle>
              <CardDescription className="mt-1.5">
                Complete your order securely with Khalti
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {paymentState.error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 text-red-900"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentState.error}</AlertDescription>
            </Alert>
          )}

          {paymentState.success && (
            <Alert className="border-purple-200 bg-purple-50 text-purple-900">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription>
                Payment session created! Redirecting to Khalti...
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-5">
            <h3 className="border-b border-zinc-200 pb-2 text-sm font-semibold text-zinc-900">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-zinc-700">
                <span className="text-zinc-500">Order Number</span>
                <span className="font-medium text-zinc-900">
                  {order.order_number}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-700">
                <span className="text-zinc-500">Customer</span>
                <span className="font-medium text-zinc-900">
                  {order.customer_name}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-700">
                <span className="text-zinc-500">Email</span>
                <span className="font-medium text-zinc-900">
                  {order.customer_email}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-700">
                <span className="text-zinc-500">Phone</span>
                <span className="font-medium text-zinc-900">
                  {order.customer_phone}
                </span>
              </div>

              {order.shipping_address && (
                <div className="mt-2 flex items-start justify-between text-zinc-700">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="max-w-[180px] rounded border border-zinc-200 bg-white px-2 py-1 text-right text-xs text-zinc-800">
                    {order.shipping_address}
                  </span>
                </div>
              )}
            </div>

            {orderItems.length > 0 && (
              <div className="mt-4 border-t border-zinc-200 pt-4">
                <h4 className="mb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                  Order Items
                </h4>
                <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
                  {orderItems.map((item, index) =>
                    renderOrderItem(item, index)
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium text-zinc-900">
                  NPR{" "}
                  {(
                    parseFloat(order.total_amount) -
                    (order.delivery_charge
                      ? parseFloat(order.delivery_charge)
                      : 0)
                  ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {order.delivery_charge &&
                parseFloat(order.delivery_charge) > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Delivery Charge</span>
                    <span className="font-medium text-zinc-900">
                      NPR{" "}
                      {parseFloat(order.delivery_charge).toLocaleString(
                        "en-IN",
                        { minimumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                )}

              <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
                <span className="font-semibold text-zinc-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold tracking-tight text-zinc-900">
                  <span className="mr-1 text-base font-medium text-zinc-500">
                    NPR
                  </span>
                  {parseFloat(order.total_amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pb-6">
          <Button
            onClick={handlePayment}
            className="h-12 w-full bg-[#5d2e8e] text-base font-semibold text-white shadow-md transition-all hover:bg-[#4a2571] active:scale-[0.98]"
            disabled={paymentState.isLoading}
          >
            {paymentState.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></span>
                Processing...
              </div>
            ) : (
              "Pay with Khalti"
            )}
          </Button>
        </CardFooter>
      </Card>

      <p className="mt-8 flex items-center gap-1.5 text-sm text-zinc-400">
        <Lock className="h-3.5 w-3.5" /> Payments are secure and encrypted
      </p>
    </div>
  );
}
