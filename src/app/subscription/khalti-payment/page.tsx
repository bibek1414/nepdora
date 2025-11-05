"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle, Info, ArrowLeft } from "lucide-react";
import { ApiResponse, PaymentState } from "@/types/payment";

interface KhaltiPaymentData {
  khaltiPaymentUrl: string;
  pidx: string;
  expires_at: string;
  expires_in: number;
}

export default function KhaltiPayment() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");

  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    // Load data from sessionStorage
    const storedData = sessionStorage.getItem("subscription_payment_data");

    if (storedData) {
      try {
        const paymentData = JSON.parse(storedData);

        if (paymentData.payment_method !== "khalti") {
          toast.error("Invalid payment method");
          router.push("/subscription");
          return;
        }

        setAmount(paymentData.amount);
        setProductName(paymentData.plan_name);
        setPlanId(paymentData.plan_id);

        // Generate unique transaction ID
        const txnId = `SUB-${paymentData.plan_id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setTransactionId(txnId);

        toast.success("Payment details loaded successfully!");
      } catch (error) {
        console.error("Error loading payment data:", error);
        toast.error("Failed to load payment details");
        router.push("/subscription");
      }
    } else {
      toast.error("No payment data found");
      router.push("/subscription");
    }
  }, [router]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!amount || parseFloat(amount) <= 0) {
      errors.push("Valid amount is required");
    } else if (parseFloat(amount) < 10) {
      errors.push("Amount must be at least Rs. 10");
    }

    if (!productName.trim()) {
      errors.push("Product name is required");
    }

    if (!transactionId.trim()) {
      errors.push("Transaction ID is required");
    }

    if (errors.length > 0) {
      setPaymentState(prev => ({
        ...prev,
        error: errors.join(", "),
      }));
      return false;
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setPaymentState({
      isLoading: true,
      error: null,
      success: false,
    });

    try {
      const response = await fetch("/api/subscription/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "khalti",
          amount,
          productName,
          transactionId,
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

      toast.success("Payment session created! Redirecting to Khalti...");

      // Store transaction details for verification later
      sessionStorage.setItem(
        "khalti_transaction",
        JSON.stringify({
          pidx: pidx,
          amount: amount,
          plan_id: planId,
        })
      );

      // Show expiry info
      const expiryTime = new Date(expires_at).toLocaleString();
      toast.info(`Payment expires at: ${expiryTime}`, { duration: 5000 });

      // Redirect to Khalti payment page
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

  const handleBack = () => {
    router.push("/subscription");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={paymentState.isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <CardTitle className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-purple-500"></span>
            Khalti Payment
          </CardTitle>
          <CardDescription>
            Complete your subscription payment via Khalti
          </CardDescription>
        </CardHeader>

        <form onSubmit={handlePayment}>
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
                  Payment session created successfully! You will be redirected
                  to Khalti.
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Payment Details</h3>

              <div className="space-y-2">
                <Label htmlFor="productName">Subscription Plan</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  required
                  placeholder="Enter product name"
                  maxLength={100}
                  disabled={paymentState.isLoading}
                  readOnly
                />
                <div className="text-sm text-gray-500">
                  Your selected subscription plan
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (NPR)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  min="10"
                  step="0.01"
                  placeholder="Enter amount (minimum Rs. 10)"
                  disabled={paymentState.isLoading}
                  readOnly
                />
                <div className="text-sm text-gray-500">
                  Total subscription amount
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  required
                  placeholder="Enter unique transaction ID"
                  maxLength={50}
                  disabled={paymentState.isLoading}
                  readOnly
                />
                <div className="text-sm text-gray-500">
                  Unique transaction reference
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={paymentState.isLoading}
            >
              {paymentState.isLoading ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                "Pay with Khalti"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
