"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SmsPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const verifyPayment = async () => {
      const method = searchParams.get("method");
      const pidx = searchParams.get("pidx"); // Khalti
      const data = searchParams.get("data"); // eSewa

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
      <Card className="w-full max-w-md text-center shadow-lg">
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
            {isVerifying ? "Verifying Payment..." : isSuccess ? "Payment Successful!" : "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            {isVerifying
              ? "Please wait while we verify your transaction with the payment gateway."
              : isSuccess
              ? "Your SMS credits have been added to your account. You can now start sending SMS notifications."
              : "We couldn't verify your payment. If amount was deducted, please contact support."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push("/admin/sms")}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isVerifying}
          >
            Go to SMS Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
