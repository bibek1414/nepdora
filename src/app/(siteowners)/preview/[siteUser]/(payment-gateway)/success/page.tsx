"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";
import { toast } from "sonner";
import { ApiResponse, PaymentVerification } from "@/types/payment";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<PaymentVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract URL parameters for both Khalti and eSewa
  const method = searchParams.get("method");
  const pidx = searchParams.get("pidx"); // Khalti
  const status = searchParams.get("status");
  const transactionId =
    searchParams.get("transaction_id") || searchParams.get("txnId");
  const amount = searchParams.get("amount");
  const totalAmount = searchParams.get("total_amount");
  const purchaseOrderId = searchParams.get("purchase_order_id");
  const purchaseOrderName = searchParams.get("purchase_order_name");
  const mobile = searchParams.get("mobile");

  // eSewa specific parameters - handle the URL parsing issue with &?data
  let esewaData = searchParams.get("data"); // Base64 encoded response from eSewa

  // If data is not found normally, try to extract it from the URL manually
  if (!esewaData && method === "esewa") {
    const currentUrl = window.location.href;
    const dataMatch = currentUrl.match(/[&?]data=([^&]+)/);
    if (dataMatch) {
      esewaData = dataMatch[1];
      console.log("Extracted eSewa data from URL manually:", esewaData);
    }
  }

  // Function to decode and display eSewa data for debugging
  const decodeEsewaData = (encodedData: string) => {
    try {
      // Handle both browser and Node.js environments
      let decodedString: string;

      if (typeof window !== "undefined") {
        // Browser environment - use atob
        decodedString = atob(encodedData);
      } else {
        // Node.js environment - use Buffer
        decodedString = Buffer.from(encodedData, "base64").toString("utf-8");
      }

      const decoded = JSON.parse(decodedString);
      console.log("Decoded eSewa data:", decoded);
      return decoded;
    } catch (error) {
      console.error("Failed to decode eSewa data:", error);
      return null;
    }
  };

  const verifyKhaltiPayment = async (paymentId: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pidx: paymentId,
          method: "khalti",
        }),
      });

      const apiResponse: ApiResponse<PaymentVerification> =
        await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Payment verification failed");
      }

      setVerificationResult(apiResponse.data);

      if (apiResponse.data.is_success) {
        toast.success("Payment verified successfully!");
      } else {
        toast.warning("Payment verification completed with issues");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      setError(errorMessage);
      toast.error(`Verification failed: ${errorMessage}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyEsewaPayment = async (encodedData: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      console.log("Sending verification request to API...");

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "esewa",
          data: encodedData,
        }),
      });

      console.log("Verification response status:", response.status);

      const apiResponse: ApiResponse<PaymentVerification> =
        await response.json();

      console.log("Verification API response:", apiResponse);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Payment verification failed");
      }

      setVerificationResult(apiResponse.data);

      if (apiResponse.data.is_success) {
        toast.success("eSewa payment verified successfully!");
      } else {
        toast.warning("eSewa payment verification completed with issues");
      }
    } catch (error) {
      console.error("eSewa verification error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      setError(errorMessage);
      toast.error(`eSewa verification failed: ${errorMessage}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const checkEsewaStatus = async (
    productCode: string,
    totalAmt: string,
    transactionUuid: string
  ) => {
    try {
      const queryParams = new URLSearchParams({
        product_code: productCode,
        total_amount: totalAmt,
        transaction_uuid: transactionUuid,
      });

      const response = await fetch(`/api/esewa-status?${queryParams}`);
      const apiResponse: ApiResponse<PaymentVerification> =
        await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Status check failed");
      }

      setVerificationResult(apiResponse.data);
      toast.success("eSewa payment status updated!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Status check failed";
      setError(errorMessage);
      toast.error(`Status check failed: ${errorMessage}`);
    }
  };

  useEffect(() => {
    // Log all search params for debugging
    const allParams = Object.fromEntries(searchParams.entries());
    console.log("All URL parameters:", allParams);

    // Handle eSewa success callback
    if (method === "esewa") {
      console.log("Processing eSewa payment callback");
      console.log("eSewa data parameter:", esewaData);

      if (esewaData) {
        // Try to decode and show the data first
        const decodedData = decodeEsewaData(esewaData);
        if (decodedData) {
          console.log("Decoded eSewa response:", decodedData);

          // Validate required fields
          if (!decodedData.transaction_code || !decodedData.status) {
            setError("Invalid eSewa response - missing required fields");
            toast.error("Invalid eSewa response format");
            return;
          }

          // Set initial data from decoded response
          setVerificationResult({
            transaction_code: decodedData.transaction_code,
            transaction_uuid: decodedData.transaction_uuid,
            status: decodedData.status,
            total_amount: decodedData.total_amount?.toString(),
            is_success: decodedData.status === "COMPLETE",
            should_provide_service: decodedData.status === "COMPLETE",
            ref_id: decodedData.transaction_code, // Use transaction_code as ref_id
          });

          // Show appropriate message based on status
          if (decodedData.status === "COMPLETE") {
            toast.success("eSewa payment completed successfully!");
          } else if (decodedData.status === "PENDING") {
            toast.info("Payment is pending. Please wait for confirmation.");
          } else {
            toast.warning(`Payment status: ${decodedData.status}`);
          }

          // Always verify the payment to ensure integrity
          console.log("Starting eSewa payment verification...");
          verifyEsewaPayment(esewaData);
        } else {
          setError("Failed to decode eSewa response data");
          toast.error("Invalid eSewa response format");
        }
      } else {
        // No data parameter, this might be an error case
        setError("No payment data received from eSewa");
        toast.error("eSewa payment data missing");
      }
    }

    // Handle Khalti success callback
    else if (method === "khalti" && pidx && status === "Completed") {
      verifyKhaltiPayment(pidx);
    }
  }, [method, pidx, status, esewaData]);

  const getStatusColor = (paymentStatus?: string) => {
    switch (paymentStatus?.toLowerCase()) {
      case "completed":
      case "complete":
        return "text-green-600";
      case "pending":
      case "initiated":
        return "text-yellow-600";
      case "expired":
      case "user canceled":
      case "refunded":
      case "canceled":
      case "full_refund":
      case "partial_refund":
      case "ambiguous":
      case "not_found":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    if (isVerifying) {
      return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
    }

    if (error) {
      return <AlertCircle className="h-16 w-16 text-red-500" />;
    }

    // Check for success statuses
    if (
      verificationResult?.is_success ||
      verificationResult?.status === "COMPLETE" ||
      status === "Completed"
    ) {
      return <CheckCircle className="h-16 w-16 text-green-500" />;
    }

    // Check for pending statuses
    if (verificationResult?.status === "PENDING" || status === "Pending") {
      return <Loader2 className="h-16 w-16 animate-spin text-yellow-500" />;
    }

    // Check for failure/error statuses
    if (
      verificationResult?.status === "FULL_REFUND" ||
      verificationResult?.status === "PARTIAL_REFUND" ||
      verificationResult?.status === "AMBIGUOUS" ||
      verificationResult?.status === "NOT_FOUND" ||
      verificationResult?.status === "CANCELED" ||
      status === "Expired" ||
      status === "User canceled"
    ) {
      return <AlertCircle className="h-16 w-16 text-red-500" />;
    }

    return <AlertCircle className="h-16 w-16 text-yellow-500" />;
  };

  const getTitle = () => {
    if (isVerifying) return "Verifying Payment...";
    if (error) return "Verification Failed";

    // Check for success statuses
    if (
      verificationResult?.is_success ||
      verificationResult?.status === "COMPLETE" ||
      status === "Completed"
    )
      return "Payment Successful!";

    // Check for pending statuses
    if (verificationResult?.status === "PENDING" || status === "Pending")
      return "Payment Pending";

    // Check for failure/error statuses
    if (
      verificationResult?.status === "FULL_REFUND" ||
      verificationResult?.status === "PARTIAL_REFUND" ||
      verificationResult?.status === "AMBIGUOUS" ||
      verificationResult?.status === "NOT_FOUND" ||
      verificationResult?.status === "CANCELED" ||
      status === "Expired" ||
      status === "User canceled"
    )
      return "Payment Failed";

    return "Payment Status Update";
  };

  const getTitleColor = () => {
    if (isVerifying) return "text-blue-700";
    if (error) return "text-red-700";

    // Check for success statuses
    if (
      verificationResult?.is_success ||
      verificationResult?.status === "COMPLETE" ||
      status === "Completed"
    )
      return "text-green-700";

    // Check for pending statuses
    if (verificationResult?.status === "PENDING" || status === "Pending")
      return "text-yellow-700";

    // Check for failure/error statuses
    if (
      verificationResult?.status === "FULL_REFUND" ||
      verificationResult?.status === "PARTIAL_REFUND" ||
      verificationResult?.status === "AMBIGUOUS" ||
      verificationResult?.status === "NOT_FOUND" ||
      verificationResult?.status === "CANCELED" ||
      status === "Expired" ||
      status === "User canceled"
    )
      return "text-red-700";

    return "text-yellow-700";
  };

  const retryVerification = () => {
    if (method === "khalti" && pidx) {
      verifyKhaltiPayment(pidx);
    } else if (method === "esewa" && esewaData) {
      verifyEsewaPayment(esewaData);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              {getStatusIcon()}
            </motion.div>
          </div>
          <CardTitle
            className={`text-center text-2xl font-bold ${getTitleColor()}`}
          >
            {getTitle()}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isVerifying && (
            <div className="space-y-3">
              {method && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">{method}</span>
                </div>
              )}

              {/* Test eSewa success callback for debugging
              {method === "esewa" && !esewaData && (
                <div className="bg-blue-100 p-3 rounded text-xs">
                  <div className="font-semibold mb-2">Test eSewa Response:</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Simulate a test eSewa response
                      const testResponse = {
                        transaction_code: "000TEST",
                        status: "COMPLETE",
                        total_amount: "100.0",
                        transaction_uuid: "test-123",
                        product_code: "EPAYTEST",
                        signed_field_names:
                          "transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names",
                        signature: "test-signature",
                      };

                      const encodedData = btoa(JSON.stringify(testResponse));
                      const testUrl = `${window.location.origin}/success?method=esewa&data=${encodedData}`;
                      window.location.href = testUrl;
                    }}
                    className="w-full"
                  >
                    Test eSewa Success Response
                  </Button>
                </div>
              )} */}

              {(verificationResult?.total_amount || totalAmount || amount) && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    Rs.{" "}
                    {verificationResult?.total_amount || totalAmount || amount}
                  </span>
                </div>
              )}

              {(verificationResult?.status || status) && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold ${getStatusColor(
                      verificationResult?.status ?? status ?? undefined
                    )}`}
                  >
                    {verificationResult?.status || status}
                  </span>
                </div>
              )}

              {/* Display transaction ID based on method */}
              {method === "khalti" &&
                (verificationResult?.transaction_id || transactionId) && (
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">
                      {verificationResult?.transaction_id || transactionId}
                    </span>
                  </div>
                )}

              {method === "esewa" && verificationResult?.transaction_code && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Transaction Code:</span>
                  <span className="font-mono text-sm">
                    {verificationResult.transaction_code}
                  </span>
                </div>
              )}

              {method === "esewa" && verificationResult?.transaction_uuid && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Transaction UUID:</span>
                  <span className="font-mono text-sm">
                    {verificationResult.transaction_uuid}
                  </span>
                </div>
              )}

              {purchaseOrderId && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm">{purchaseOrderId}</span>
                </div>
              )}

              {purchaseOrderName && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-semibold">{purchaseOrderName}</span>
                </div>
              )}

              {verificationResult?.fee &&
                parseFloat(verificationResult.fee) > 0 && (
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-gray-600">Fee:</span>
                    <span className="text-sm">
                      Rs. {verificationResult.fee}
                    </span>
                  </div>
                )}

              {mobile && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Payer Mobile:</span>
                  <span className="font-mono text-sm">{mobile}</span>
                </div>
              )}

              {verificationResult?.ref_id && (
                <div className="flex items-center justify-between border-b py-2">
                  <span className="text-gray-600">Reference ID:</span>
                  <span className="font-mono text-sm">
                    {verificationResult.ref_id}
                  </span>
                </div>
              )}
            </div>
          )}

          {isVerifying && (
            <div className="py-4 text-center text-gray-600">
              <p className="mb-2">
                Please wait while we verify your payment...
              </p>
              <p className="text-sm text-gray-500">
                This may take a few seconds.
              </p>
            </div>
          )}

          {/* Show success message for eSewa COMPLETE status */}
          {method === "esewa" &&
            verificationResult?.status === "COMPLETE" &&
            !isVerifying &&
            !error && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your eSewa payment has been completed successfully! You can
                  now enjoy your purchase.
                </AlertDescription>
              </Alert>
            )}

          {/* Show pending message for eSewa PENDING status */}
          {method === "esewa" &&
            verificationResult?.status === "PENDING" &&
            !isVerifying &&
            !error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your payment is currently pending. Please wait for
                  confirmation or use the Check Payment Status button below to
                  verify the current status.
                </AlertDescription>
              </Alert>
            )}

          {/* Show failure message for eSewa failure statuses */}
          {method === "esewa" &&
            (verificationResult?.status === "FULL_REFUND" ||
              verificationResult?.status === "PARTIAL_REFUND" ||
              verificationResult?.status === "AMBIGUOUS" ||
              verificationResult?.status === "NOT_FOUND" ||
              verificationResult?.status === "CANCELED") &&
            !isVerifying &&
            !error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment{" "}
                  {verificationResult.status.toLowerCase().replace(/_/g, " ")}.
                  Please contact support if you believe this is an error.
                </AlertDescription>
              </Alert>
            )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {((pidx && method === "khalti") ||
            (esewaData && method === "esewa")) &&
            !isVerifying && (
              <Button
                variant="outline"
                onClick={retryVerification}
                className="w-full"
                disabled={isVerifying}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Verify Payment Again
              </Button>
            )}

          {/* Show status check button for pending eSewa payments */}
          {method === "esewa" &&
            verificationResult?.status === "PENDING" &&
            verificationResult?.transaction_uuid &&
            !isVerifying && (
              <Button
                variant="outline"
                onClick={() => {
                  if (
                    verificationResult.transaction_uuid &&
                    verificationResult.total_amount
                  ) {
                    // Extract product_code from the decoded data
                    const decodedData = decodeEsewaData(esewaData || "");
                    if (decodedData?.product_code) {
                      checkEsewaStatus(
                        decodedData.product_code,
                        verificationResult.total_amount,
                        verificationResult.transaction_uuid
                      );
                    }
                  }
                }}
                className="w-full"
                disabled={isVerifying}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Payment Status
              </Button>
            )}

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
            <p>Loading payment details...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
