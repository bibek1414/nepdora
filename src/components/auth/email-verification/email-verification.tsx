"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { resendVerificationEmail } from "@/services/auth/api";
import { ErrorResponse } from "@/types/auth/error.types";

interface EmailVerificationProps {
  email: string;
  className?: string;
}

export function EmailVerification({
  email,
  className,
}: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    if (lastSentTime && countdown > 0) {
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      await resendVerificationEmail({ email });

      setLastSentTime(new Date());
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success("Verification email sent!", {
        description: "Please check your inbox and spam folder.",
      });
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      const errorMessage =
        errorResponse.response?.data?.error?.message ||
        errorResponse.message ||
        "Failed to resend verification email";

      setError(errorMessage);
      toast.error("Failed to resend email", {
        description: errorMessage,
      });
      console.error("Resend email error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        <div className={cn("bg-card relative rounded-2xl p-8", className)}>
          <div className="text-center">
            {/* Icon */}
            <div className="bg-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <Mail className="text-primary-foreground h-10 w-10" />
            </div>

            {/* Header */}
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Verify Your Email
            </h2>
            <p className="text-muted-foreground mb-6">
              Account activation link has been sent to the email address you
              provided.
            </p>

            {/* Email display */}
            <div className="bg-muted mb-6 rounded-lg border p-4">
              <p className="text-muted-foreground text-sm font-medium">
                Email sent to:
              </p>
              <p className="text-primary font-semibold break-all">{email}</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 flex items-start rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Resend section */}
            <div className="border-t pt-6">
              <p className="text-muted-foreground mb-4 text-sm">
                Didn&apos;t get the email?
              </p>

              <Button
                onClick={handleResendEmail}
                disabled={isResending || countdown > 0}
                variant="outline"
                className="hover:border-primary hover:text-primary mb-4 inline-flex items-center justify-center px-4 py-2 disabled:opacity-50"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </div>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <div className="text-primary flex items-center justify-center text-sm font-bold">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Send it again
                  </div>
                )}
              </Button>

              <div className="text-muted-foreground space-y-1 text-xs">
                <p>• Check your spam folder</p>
                <p>• Wait a few minutes before requesting again</p>
                <p>• Make sure the email address is correct</p>
              </div>
            </div>

            {/* Login link */}
            <div className="mt-8 border-t pt-6">
              <p className="text-muted-foreground mb-4 text-sm">
                Already verified your email?
              </p>
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
