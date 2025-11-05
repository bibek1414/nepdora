"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
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

    const response = await fetch("/api/subscription/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "esewa",
        data: data,
      }),
    });

    return await response.json();
  };

  const verifyKhaltiPayment = async () => {
    const pidx = searchParams.get("pidx");

    if (!pidx) {
      throw new Error("Khalti payment identifier not found");
    }

    const response = await fetch("/api/subscription/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "khalti",
        pidx: pidx,
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
    router.push("/subscription");
  };

  const handleGoToAdmin = () => {
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "loading" && (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span>Verifying Payment</span>
              </>
            )}
            {status === "upgrading" && (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                <span>Activating Subscription</span>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Payment Successful</span>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span>Payment Failed</span>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "loading" || status === "upgrading" ? (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : status === "success" ? (
            <>
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>

              {verificationData && (
                <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                  <h4 className="font-semibold">Payment Details</h4>
                  {verificationData.transaction_uuid && (
                    <p>
                      <span className="text-gray-600">Transaction ID:</span>{" "}
                      <span className="font-mono">
                        {verificationData.transaction_uuid}
                      </span>
                    </p>
                  )}
                  {verificationData.pidx && (
                    <p>
                      <span className="text-gray-600">Payment ID:</span>{" "}
                      <span className="font-mono">{verificationData.pidx}</span>
                    </p>
                  )}
                  {verificationData.total_amount && (
                    <p>
                      <span className="text-gray-600">Amount:</span> Rs.{" "}
                      {verificationData.total_amount}
                    </p>
                  )}
                </div>
              )}

              <p className="text-center text-sm text-gray-600">
                Redirecting to admin in 5 seconds...
              </p>

              <Button
                onClick={handleGoToAdmin}
                className="w-full"
                variant="default"
              >
                Go to Admin Now
              </Button>
            </>
          ) : (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button
                  onClick={handleRetry}
                  className="w-full"
                  variant="default"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleGoToAdmin}
                  className="w-full"
                  variant="outline"
                >
                  Go to Admin
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
