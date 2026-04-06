"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { createHeaders } from "@/utils/headers";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "upgrading"
  >("loading");
  const [message, setMessage] = useState<string>("");
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [verificationData, setVerificationData] = useState<any>(null);

  useEffect(() => {
    const verifyAndUpgrade = async () => {
      const method = searchParams.get("method");

      if (!method || !["esewa", "khalti"].includes(method)) {
        setStatus("error");
        setMessage("Invalid payment method");
        toast.error("Invalid payment method");
        return;
      }

      try {
        // Prevent duplicate verification on page reload
        if (
          sessionStorage.getItem("verified_subscription_payment") === "true"
        ) {
          setStatus("success");
          setMessage("Your subscription has been activated successfully!");
          setTimeout(() => {
            router.push("/admin");
          }, 3000);
          return;
        }

        // Step 1: Verify the payment
        setMessage("Verifying your payment...");
        const verificationResponse = await verifyPayment(method);

        if (!verificationResponse.success) {
          throw new Error(
            verificationResponse.error || "Payment verification failed"
          );
        }

        setVerificationData(verificationResponse.data);
        setMessage("Payment verified successfully!");
        toast.success("Payment verified!");

        // Step 2: Get stored transaction data
        const transactionKey =
          method === "esewa" ? "esewa_transaction" : "khalti_transaction";
        const storedTransaction = sessionStorage.getItem(transactionKey);

        if (!storedTransaction) {
          throw new Error("Transaction data not found");
        }

        const transactionData = JSON.parse(storedTransaction);

        // Step 3: Upgrade subscription on backend
        setStatus("upgrading");
        setMessage("Activating your subscription...");

        const upgradeResponse = await upgradeSubscription({
          plan_id: transactionData.plan_id,
          transaction_id:
            method === "esewa"
              ? verificationResponse.data.transaction_uuid
              : verificationResponse.data.pidx,
          payment_type: method,
        });

        if (!upgradeResponse.success) {
          throw new Error(
            upgradeResponse.error || "Subscription upgrade failed"
          );
        }

        // Step 4: Success
        setStatus("success");
        setMessage("Your subscription has been activated successfully!");
        toast.success("Subscription activated!");

        // Clean up sessionStorage
        sessionStorage.removeItem(transactionKey);
        sessionStorage.removeItem("subscription_payment_data");
        sessionStorage.setItem("verified_subscription_payment", "true");

        // Force clear subscription status cache to ensure fresh data on redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("nepdora-subscription-status");
        }

        // Redirect to admin after 5 seconds

        setTimeout(
          () => {
            router.push("/admin");
          },
          1000 * 5 + 1000
        );
      } catch (error) {
        console.error("Payment processing error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while processing your payment"
        );
        toast.error("Payment processing failed");
      }
    };

    verifyAndUpgrade();
  }, [searchParams, router]);

  const verifyPayment = async (method: string) => {
    if (method === "esewa") {
      return verifyEsewaPayment();
    } else if (method === "khalti") {
      return verifyKhaltiPayment();
    }
    throw new Error("Invalid payment method");
  };

  const verifyEsewaPayment = async () => {
    // First try to get from searchParams
    let data = searchParams.get("data");

    // If not found, try to extract from URL manually (handles &?data= format)
    if (!data) {
      const currentUrl = window.location.href;
      const dataMatch = currentUrl.match(/[&?]data=([^&]+)/);
      if (dataMatch) {
        data = dataMatch[1];
      }
    }

    if (!data) {
      throw new Error("eSewa response data not found");
    }

    const transactionKey = "esewa_transaction";
    const storedTransaction =
      typeof window !== "undefined"
        ? sessionStorage.getItem(transactionKey)
        : null;
    const products_purchased = storedTransaction
      ? [JSON.parse(storedTransaction)]
      : [];

    const response = await fetch("/api/subscription/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "esewa",
        data: data,
        products_purchased: products_purchased,
        order_id: products_purchased[0]?.plan_id,
      }),
    });

    return await response.json();
  };

  const verifyKhaltiPayment = async () => {
    const pidx = searchParams.get("pidx");

    if (!pidx) {
      throw new Error("Khalti payment identifier not found");
    }

    const transactionKey = "khalti_transaction";
    const storedTransaction =
      typeof window !== "undefined"
        ? sessionStorage.getItem(transactionKey)
        : null;
    const products_purchased = storedTransaction
      ? [JSON.parse(storedTransaction)]
      : [];

    const response = await fetch("/api/subscription/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "khalti",
        pidx: pidx,
        products_purchased: products_purchased,
        order_id: products_purchased[0]?.plan_id,
      }),
    });

    return await response.json();
  };

  const upgradeSubscription = async (data: {
    plan_id: string;
    transaction_id: string;
    payment_type: string;
  }) => {
    try {
      const response = await fetch(
        "https://nepdora.baliyoventures.com/api/upgrade/",
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify({
            plan_id: data.plan_id,
            transaction_id: data.transaction_id,
            payment_type: data.payment_type,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return {
        success: true,
        data: await response.json(),
      };
    } catch (error) {
      console.error("Upgrade API error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upgrade subscription",
      };
    }
  };

  const handleRetry = () => {
    router.push("/admin");
  };

  const handleGoToAdmin = () => {
    router.push("/admin");
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
        <div className="h-2 w-full bg-blue-500" />
        <CardHeader className="bg-zinc-50/50 pt-6 pb-6">
          <CardTitle className="mb-2 flex items-center justify-center gap-2 p-4 pt-2 pb-0">
            {status === "loading" && (
              <div className="mt-2 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <span className="text-xl">Verifying Payment</span>
              </div>
            )}
            {status === "upgrading" && (
              <div className="mt-2 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <span className="text-xl">Activating Subscription</span>
              </div>
            )}
            {status === "success" && (
              <div className="mt-2 flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="h-12 w-12 rounded-full bg-green-50 text-green-500" />
                <span className="text-xl">Payment Successful</span>
              </div>
            )}
            {status === "error" && (
              <div className="mt-2 flex flex-col items-center justify-center space-y-4">
                <XCircle className="h-12 w-12 rounded-full bg-red-50 text-red-500" />
                <span className="text-xl text-red-600">Payment Failed</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {status === "loading" || status === "upgrading" ? (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800">
                {message}
              </AlertDescription>
            </Alert>
          ) : status === "success" ? (
            <>
              <Alert className="border-green-200 bg-green-50">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>

              {verificationData && (
                <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-5 text-sm">
                  <h4 className="border-b border-zinc-200 pb-2 font-semibold text-zinc-900">
                    Payment Details
                  </h4>
                  {verificationData.transaction_uuid && (
                    <div className="flex items-center justify-between text-zinc-700">
                      <span className="text-zinc-500">Transaction ID</span>
                      <span className="font-mono text-xs">
                        {verificationData.transaction_uuid}
                      </span>
                    </div>
                  )}
                  {verificationData.pidx && (
                    <div className="flex items-center justify-between text-zinc-700">
                      <span className="text-zinc-500">Payment ID</span>
                      <span className="font-mono text-xs">
                        {verificationData.pidx}
                      </span>
                    </div>
                  )}
                  {verificationData.total_amount && (
                    <div className="flex items-center justify-between text-zinc-700">
                      <span className="text-zinc-500">Amount</span>
                      <span className="text-base font-semibold text-zinc-900">
                        Rs.{" "}
                        {Number(
                          verificationData.total_amount?.toString().replace(/,/g, "")
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {verificationData.products_purchased &&
                    verificationData.products_purchased.length > 0 && (
                      <div className="mt-4 border-t border-zinc-200 pt-3">
                        <span className="mb-2 block text-xs font-medium tracking-wider text-zinc-500 uppercase">
                          Subscription Plan
                        </span>
                        <ul className="space-y-1">
                          {verificationData.products_purchased.map(
                            (item: any, idx: number) => (
                              <li
                                key={idx}
                                className="font-medium text-zinc-900"
                              >
                                {item.name ||
                                  item.plan_name ||
                                  "Subscription Plan"}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-zinc-500">
                Redirecting to your dashboard in 5 seconds...
              </p>

              <Button
                onClick={handleGoToAdmin}
                className="mt-4 h-11 w-full text-base shadow-sm"
                variant="default"
              >
                Go to Dashboard Now
              </Button>
            </>
          ) : (
            <>
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 text-red-900"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {message}
                </AlertDescription>
              </Alert>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleRetry}
                  className="h-11 w-full shadow-sm"
                  variant="default"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleGoToAdmin}
                  className="h-11 w-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  variant="outline"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
