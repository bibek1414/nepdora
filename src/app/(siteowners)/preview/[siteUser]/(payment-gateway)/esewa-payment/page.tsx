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
import { AlertCircle, Info, Loader2 } from "lucide-react";
import {
  ApiResponse,
  EsewaInitiateResponse,
  PaymentState,
} from "@/types/payment";
import { useOrder } from "@/hooks/owner-site/admin/use-orders";
import { OrderItem } from "@/types/owner-site/admin/orders";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function EsewaPayment() {
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
          method: "esewa",
          amount: order.total_amount,
          productName: `Order #${order.order_number}`,
          transactionId: order.order_number,
          orderId: order.id,
        }),
      });
      const apiResponse: ApiResponse<{
        amount: string;
        esewaConfig: EsewaInitiateResponse;
        transactionId: string;
      }> = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Payment initiation failed");
      }

      const { esewaConfig } = apiResponse.data;

      setPaymentState({
        isLoading: false,
        error: null,
        success: true,
      });

      toast.success("eSewa payment session created! Redirecting...");

      // Create and submit the form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = esewaConfig.payment_url;

      const esewaPayload = {
        amount: esewaConfig.amount,
        tax_amount: esewaConfig.tax_amount,
        total_amount: esewaConfig.total_amount,
        transaction_uuid: esewaConfig.transaction_uuid,
        product_code: esewaConfig.product_code,
        product_service_charge: esewaConfig.product_service_charge,
        product_delivery_charge: esewaConfig.product_delivery_charge,
        success_url: esewaConfig.success_url,
        failure_url: esewaConfig.failure_url,
        signed_field_names: esewaConfig.signed_field_names,
        signature: esewaConfig.signature,
      };

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);

      setTimeout(() => {
        form.submit();
        document.body.removeChild(form);
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("eSewa payment error:", errorMessage);

      setPaymentState({
        isLoading: false,
        error: errorMessage,
        success: false,
      });

      toast.error(`eSewa payment initiation failed: ${errorMessage}`);
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
                    className="bg-green-50 text-xs text-green-700 capitalize"
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
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-green-600" />
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-green-500"></span>
            eSewa Payment
          </CardTitle>
          <CardDescription>
            Complete your payment securely with eSewa
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentState.error}</AlertDescription>
            </Alert>
          )}

          {paymentState.success && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                eSewa payment session created successfully! You will be
                redirected to eSewa for secure payment processing.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{order.order_number}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{order.customer_email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>

              {order.shipping_address && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Address:</span>
                  <span className="max-w-[200px] text-right font-medium">
                    {order.shipping_address}
                  </span>
                </div>
              )}
            </div>

            {orderItems.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Items ({orderItems.length})
                </h4>
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-md bg-white p-2">
                  {orderItems.map((item, index) =>
                    renderOrderItem(item, index)
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  NPR{" "}
                  {(
                    parseFloat(order.total_amount) -
                    (order.delivery_charge
                      ? parseFloat(order.delivery_charge)
                      : 0)
                  ).toFixed(2)}
                </span>
              </div>

              {order.delivery_charge &&
                parseFloat(order.delivery_charge) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge:</span>
                    <span className="font-medium">
                      NPR {parseFloat(order.delivery_charge).toFixed(2)}
                    </span>
                  </div>
                )}

              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-semibold text-gray-700">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-green-600">
                  NPR {parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded bg-blue-50 p-3 text-sm text-gray-600">
            <Info className="mr-2 inline h-4 w-4" />
            You will be redirected to eSewa&apos;s secure payment gateway to
            complete the transaction.
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={paymentState.isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={paymentState.isLoading}
          >
            {paymentState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay with eSewa"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
