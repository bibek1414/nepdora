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
import { ApiResponse, PaymentState } from "@/types/payment";
import { useOrder } from "@/hooks/owner-site/admin/use-orders";

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

      setPaymentState({
        isLoading: false,
        error: null,
        success: true,
        paymentUrl: khaltiPaymentUrl,
        transactionId: pidx,
      });

      // Store transaction ID in session storage for later use
      sessionStorage.setItem(`khalti_transaction_${order.id}`, pidx);
      sessionStorage.setItem(`order_id_${pidx}`, order.id.toString());

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-purple-500"></span>
            Khalti Payment
          </CardTitle>
          <CardDescription>
            Complete your payment securely with Khalti
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
                Payment session created successfully! You will be redirected to
                Khalti.
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

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Address:</span>
                <span className="max-w-[200px] text-right font-medium">
                  {order.shipping_address}
                </span>
              </div>

              <div className="mt-2 border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Total Amount:
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    NPR {parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {orderItems.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Items ({orderItems.length})
                </h4>
                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {orderItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.product?.name || `Product ${item.product_id}`} x{" "}
                        {item.quantity}
                      </span>
                      <span className="font-medium">
                        NPR{" "}
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded bg-blue-50 p-3 text-sm text-gray-500">
            <Info className="mr-2 inline h-4 w-4" />
            You will be redirected to Khalti&apos;s secure payment gateway to
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
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            disabled={paymentState.isLoading}
          >
            {paymentState.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay with Khalti"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
