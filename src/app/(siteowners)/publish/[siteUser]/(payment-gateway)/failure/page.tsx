"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, AlertCircle, RefreshCw } from "lucide-react";
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

function PaymentFailureContent() {
  const searchParams = useSearchParams();

  // Extract URL parameters for both Khalti and eSewa
  const method = searchParams.get("method");
  const status = searchParams.get("status");
  const transactionId =
    searchParams.get("transaction_id") || searchParams.get("txn");
  const amount = searchParams.get("amount");
  const totalAmount = searchParams.get("total_amount");
  const purchaseOrderId = searchParams.get("purchase_order_id");
  const purchaseOrderName = searchParams.get("purchase_order_name");
  const pidx = searchParams.get("pidx");

  // eSewa specific parameters
  const transactionUuid = searchParams.get("transaction_uuid");
  const errorCode = searchParams.get("error_code");
  const errorMessage = searchParams.get("error_message");

  // Check if this is an eSewa callback with data parameter (but failed)
  const esewaData = searchParams.get("data");

  useEffect(() => {
    // Log failure parameters for debugging
    console.log("Payment failure callback received:", {
      method,
      status,
      transactionId,
      transactionUuid,
      amount,
      totalAmount,
      purchaseOrderId,
      purchaseOrderName,
      pidx,
      errorCode,
      errorMessage,
      hasEsewaData: !!esewaData,
    });

    // If there's eSewa data, try to decode it for better error understanding
    if (method === "esewa" && esewaData) {
      try {
        const decoded = JSON.parse(
          Buffer.from(esewaData, "base64").toString("utf-8")
        );
        console.log("Decoded eSewa failure data:", decoded);
      } catch (error) {
        console.error("Failed to decode eSewa data:", error);
      }
    }
  }, [
    method,
    status,
    transactionId,
    transactionUuid,
    amount,
    totalAmount,
    purchaseOrderId,
    purchaseOrderName,
    pidx,
    errorCode,
    errorMessage,
    esewaData,
  ]);

  const getFailureReason = () => {
    // Handle eSewa specific errors
    if (method === "esewa") {
      // If we have error message from eSewa
      if (errorMessage) {
        return {
          title: "eSewa Payment Failed",
          message: errorMessage,
          suggestion: "Please check your eSewa account details and try again.",
        };
      }

      // If we have eSewa data but still failed, decode and check
      if (esewaData) {
        try {
          const decoded = JSON.parse(
            Buffer.from(esewaData, "base64").toString("utf-8")
          );

          switch (decoded.status?.toUpperCase()) {
            case "CANCELED":
            case "CANCELLED":
              return {
                title: "Payment Canceled",
                message: "You canceled the eSewa payment process.",
                suggestion:
                  "You can try again by clicking the retry button below.",
              };
            case "PENDING":
              return {
                title: "Payment Incomplete",
                message: "The eSewa payment was not completed in time.",
                suggestion: "Please complete the payment or try again.",
              };
            case "AMBIGUOUS":
              return {
                title: "Payment Status Unclear",
                message: "The eSewa payment status could not be determined.",
                suggestion:
                  "Please contact support or check your eSewa transaction history.",
              };
            default:
              return {
                title: "eSewa Payment Failed",
                message: `Payment failed with status: ${decoded.status}`,
                suggestion:
                  "Please try again or contact support if the problem persists.",
              };
          }
        } catch (error) {
          console.error("Failed to decode eSewa failure data:", error);
        }
      }

      // Handle status-based errors
      switch (status?.toLowerCase()) {
        case "canceled":
        case "cancelled":
          return {
            title: "Payment Canceled",
            message: "You canceled the eSewa payment process.",
            suggestion: "You can try again by clicking the retry button below.",
          };
        case "expired":
        case "not_found":
          return {
            title: "Payment Session Expired",
            message: "The eSewa payment session has expired or was not found.",
            suggestion: "Please start a new payment process.",
          };
        case "pending":
          return {
            title: "Payment Incomplete",
            message: "The eSewa payment was not completed.",
            suggestion: "Please complete the payment or try again.",
          };
        case "ambiguous":
          return {
            title: "Payment Status Unknown",
            message: "The eSewa payment status is unclear.",
            suggestion:
              "Please contact support or check your eSewa transaction history.",
          };
        case "timeout":
          return {
            title: "Payment Timeout",
            message: "The eSewa payment session has timed out.",
            suggestion: "Please try again with a new payment session.",
          };
        default:
          return {
            title: "eSewa Payment Failed",
            message: "Something went wrong during the eSewa payment process.",
            suggestion:
              "Please try again or contact support if the problem persists.",
          };
      }
    }

    // Handle Khalti specific errors (unchanged)
    if (method === "khalti") {
      switch (status?.toLowerCase()) {
        case "user canceled":
        case "user cancelled":
          return {
            title: "Payment Canceled",
            message: "You canceled the Khalti payment process.",
            suggestion: "You can try again by clicking the retry button below.",
          };
        case "expired":
          return {
            title: "Payment Expired",
            message: "The Khalti payment session has expired.",
            suggestion: "Please start a new payment process.",
          };
        case "failed":
          return {
            title: "Payment Failed",
            message: "The Khalti payment could not be processed.",
            suggestion: "Please check your payment details and try again.",
          };
        default:
          return {
            title: "Khalti Payment Failed",
            message: "Something went wrong during the Khalti payment process.",
            suggestion:
              "Please try again or contact support if the problem persists.",
          };
      }
    }

    // Generic failure handling
    return {
      title: "Payment Failed",
      message: "Something went wrong during the payment process.",
      suggestion:
        "Please try again or contact support if the problem persists.",
    };
  };

  const failureInfo = getFailureReason();

  const getRetryUrl = () => {
    switch (method) {
      case "khalti":
        return "/khalti-payment";
      case "esewa":
        return "/esewa-payment";
      default:
        return "/";
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
              <XCircle className="h-16 w-16 text-red-500" />
            </motion.div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-red-700">
            {failureInfo.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{failureInfo.message}</AlertDescription>
          </Alert>

          <div className="text-center text-gray-600">
            <p className="mb-4">{failureInfo.suggestion}</p>
          </div>

          {/* Display failure details */}
          <div className="space-y-3">
            {method && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold capitalize">{method}</span>
              </div>
            )}

            {(amount || totalAmount) && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">
                  Rs. {amount || totalAmount}
                </span>
              </div>
            )}

            {status && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-red-600 capitalize">
                  {status}
                </span>
              </div>
            )}

            {/* Display appropriate transaction ID based on method */}
            {method === "khalti" && transactionId && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm">{transactionId}</span>
              </div>
            )}

            {method === "esewa" && transactionUuid && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Transaction UUID:</span>
                <span className="font-mono text-sm">{transactionUuid}</span>
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

            {pidx && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-sm">{pidx}</span>
              </div>
            )}

            {errorCode && (
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-gray-600">Error Code:</span>
                <span className="font-mono text-sm text-red-600">
                  {errorCode}
                </span>
              </div>
            )}
          </div>

          {/* Common reasons for failure based on payment method */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-semibold">
              Common reasons for {method || "payment"} failure:
            </h4>
            <ul className="space-y-1 text-xs text-gray-600">
              {method === "esewa" ? (
                <>
                  <li>• Insufficient balance in eSewa wallet</li>
                  <li>• Network connection issues during payment</li>
                  <li>• Incorrect eSewa credentials or PIN</li>
                  <li>• Payment session timeout (5 minutes)</li>
                  <li>• eSewa server maintenance or downtime</li>
                  <li>• Invalid OTP or verification token</li>
                </>
              ) : method === "khalti" ? (
                <>
                  <li>• Insufficient balance in Khalti wallet</li>
                  <li>• Network connection issues</li>
                  <li>• Incorrect Khalti PIN or credentials</li>
                  <li>• Payment session timeout</li>
                  <li>• Khalti server downtime</li>
                </>
              ) : (
                <>
                  <li>• Insufficient balance in payment account</li>
                  <li>• Network connection issues</li>
                  <li>• Incorrect payment credentials</li>
                  <li>• Payment session timeout</li>
                  <li>• Payment gateway server downtime</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href={getRetryUrl()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Payment Again
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>

          <p className="text-center text-xs text-gray-500">
            If you continue to experience issues, please contact our support
            team with the transaction details above.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentFailure() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}
