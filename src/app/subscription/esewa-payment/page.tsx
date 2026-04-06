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
import {
  ApiResponse,
  EsewaInitiateResponse,
  PaymentState,
} from "@/types/payment";

export default function EsewaPayment() {
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

        if (paymentData.payment_method !== "esewa") {
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

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
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
          method: "esewa",
          amount,
          productName,
          transactionId,
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

      // Store transaction details for verification later
      sessionStorage.setItem(
        "esewa_transaction",
        JSON.stringify({
          transaction_uuid: esewaConfig.transaction_uuid,
          amount: amount,
          plan_id: planId,
        })
      );

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

      console.log("eSewa payload:", esewaPayload);

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // Small delay to show the success message before redirect
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
        <div className="h-2 w-full bg-[#60bb46]" />
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
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Secure Checkout
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative h-16 w-32 overflow-hidden rounded-lg border border-zinc-100 bg-white p-2 shadow-sm">
              <img
                src="/images/payment-gateway/esewa.png"
                alt="eSewa"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">eSewa Payment</CardTitle>
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
              <Alert className="border-green-200 bg-green-50 text-green-900">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Payment session created! Redirecting to eSewa...
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
              className="h-12 w-full bg-[#60bb46] text-base font-semibold text-white shadow-md transition-all hover:bg-[#509c3a] active:scale-[0.98]"
              disabled={
                paymentState.isLoading ||
                !amount ||
                !productName ||
                !transactionId
              }
            >
              {paymentState.isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></span>
                  Processing...
                </div>
              ) : (
                "Pay with eSewa"
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
