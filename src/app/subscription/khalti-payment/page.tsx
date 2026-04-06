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
import { AlertCircle, Info, ArrowLeft, Lock } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/* Brand Header */}
      <div className="mb-4 flex w-full max-w-md items-center justify-start">
        <img
          src="/nepdora-logooo.svg"
          alt="Nepdora"
          className="h-8 w-auto opacity-90 md:h-10"
        />
      </div>

      <Card className="w-full max-w-md overflow-hidden border-zinc-200/60 shadow-xl">
        <div className="h-2 w-full bg-[#5d2e8e]" />
        <CardHeader className="bg-zinc-50/50 pt-6 pb-8">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
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
                Complete your subscription payment securely
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handlePayment}>
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

            <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="productName"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Subscription Plan
                </Label>
                <div className="font-medium text-zinc-900">
                  {productName || "Loading inline..."}
                </div>
                <Input
                  id="productName"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="hidden"
                />
              </div>

              <div className="space-y-1.5 border-t border-zinc-100 pt-3">
                <Label
                  htmlFor="amount"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Total Amount
                </Label>
                <div className="flex items-baseline gap-1 text-3xl font-bold text-zinc-900">
                  <span className="text-xl">NPR</span>
                  <span>
                    {Number(amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pb-6">
            <Button
              type="submit"
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
        </form>
      </Card>

      <p className="mt-8 flex items-center gap-1.5 text-sm text-zinc-400">
        <Lock className="h-3.5 w-3.5" /> Payments are secure and encrypted
      </p>
    </div>
  );
}
