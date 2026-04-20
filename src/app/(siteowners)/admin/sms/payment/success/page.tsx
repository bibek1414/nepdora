"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function SmsPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const verificationAttempted = useRef(false);

  const PAYMENT_LOGOS: Record<string, string> = {
    esewa: "/images/payment-gateway/esewa.png",
    khalti: "/images/payment-gateway/khalti.png",
  };

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const verifyPayment = async () => {
      let method = searchParams.get("method");
      let data = searchParams.get("data");
      const pidx = searchParams.get("pidx");

      // Handle cases where eSewa appends ?data instead of &data or creates &?data
      if (!data && searchParams.has("?data")) {
        data = searchParams.get("?data");
      }

      // Handle case where method might contain the rest of the query string (e.g. method=esewa?data=...)
      if (method && method.includes("?")) {
        const [actualMethod, queryString] = method.split("?");
        method = actualMethod;
        if (!data) {
          const urlParams = new URLSearchParams(queryString);
          data = urlParams.get("data");
        }
      }

      const storedDetails = sessionStorage.getItem("sms_payment_pending");
      if (!storedDetails) {
        toast.error("No pending payment details found");
        setIsVerifying(false);
        return;
      }

      const { amount, transaction_id } = JSON.parse(storedDetails);

      try {
        const response = await fetch("/api/sms/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method,
            pidx,
            data,
            amount,
            transaction_id,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setIsSuccess(true);
          setPaymentData(result.data);
          sessionStorage.removeItem("sms_payment_pending");
          toast.success("SMS credits added successfully!");
        } else {
          toast.error(result.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("An error occurred during verification");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="-lg w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            {isVerifying ? (
              <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            ) : isSuccess ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-slate-300" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isVerifying
              ? "Verifying Payment..."
              : isSuccess
                ? "Payment Successful!"
                : "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            {isVerifying
              ? "Please wait while we verify your transaction with the payment gateway."
              : isSuccess
                ? "Your SMS credits have been added to your account. You can now start sending SMS notifications."
                : "We couldn't verify your payment. If amount was deducted, please contact support."}
          </p>

          {isSuccess && paymentData && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">
                  Credits Added
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {paymentData.amount}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">
                  Amount Paid
                </span>
                <span className="text-lg font-bold text-blue-600">
                  Rs. {Number(paymentData.price).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">
                  Payment Method
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded bg-white p-0.5 shadow-sm">
                    <img
                      src={
                        PAYMENT_LOGOS[paymentData.payment_type.toLowerCase()] ||
                        ""
                      }
                      alt={paymentData.payment_type}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900 capitalize">
                    {paymentData.payment_type}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Transaction ID
                </span>
                <span className="rounded-lg border border-slate-100 bg-white p-2 font-mono text-xs font-semibold break-all text-slate-600">
                  {paymentData.transaction_id}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 px-8 pb-8">
          <Button
            onClick={() => router.push("/admin/sms")}
            className="h-12 w-full bg-blue-600 text-base font-bold shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
            disabled={isVerifying}
          >
            Go to SMS Dashboard
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          {!isVerifying && !isSuccess && (
            <Button
              variant="outline"
              onClick={() => router.push("/admin/sms")}
              className="h-12 w-full border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Contact Support
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
