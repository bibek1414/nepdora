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
            <span className="h-4 w-4 rounded-full bg-green-500"></span>
            eSewa Payment
          </CardTitle>
          <CardDescription>
            Complete your subscription payment via eSewa
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
                  eSewa payment session created successfully! You will be
                  redirected to eSewa for secure payment processing.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="productName">Subscription Plan</Label>
              <Input
                id="productName"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                required
                placeholder="Enter product or service name"
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
                placeholder="Enter unique transaction identifier"
                maxLength={50}
                disabled={paymentState.isLoading}
                readOnly
              />
              <div className="text-sm text-gray-500">
                Unique transaction reference
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={
                paymentState.isLoading ||
                !amount ||
                !productName ||
                !transactionId
              }
            >
              {paymentState.isLoading ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Creating Payment Session...
                </>
              ) : (
                "Pay with eSewa"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
