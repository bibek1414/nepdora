"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SmsPaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Something went wrong during your transaction. Your payment was not
            successful, and no credits have been added.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            If any amount was deducted from your account, it will be refunded
            according to your payment provider's policy.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/admin/sms")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
