"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
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
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      {/* Floating Icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 animate-bounce text-4xl text-gray-400 opacity-20"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div
          className="absolute top-40 right-20 animate-bounce text-4xl text-yellow-400 opacity-20"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z"></path>
          </svg>
        </div>
        <div
          className="absolute bottom-32 left-32 animate-bounce text-4xl text-gray-400 opacity-20"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl",
          className
        )}
      >
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            An activation link has been sent to your email address. Please click
            it to verify your account.
          </p>

          {/* Email display */}
          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Sent to:
            </p>
            <p className="mt-1 font-semibold break-all text-gray-900">
              {email}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-start rounded-lg border border-red-100 bg-red-50/50 p-4 text-sm text-red-600">
              <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="text-left">{error}</span>
            </div>
          )}

          {/* Action section */}
          <div className="space-y-4">
            <Link href="/admin/login" className="block w-full">
              <Button className="w-60 rounded-lg bg-gray-900 py-3 font-semibold text-white transition-all hover:bg-gray-800">
                Continue to Login
              </Button>
            </Link>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">
                  Didn&apos;t get the email?
                </span>
              </div>
            </div>

            <Button
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0}
              variant="ghost"
              className="h-auto w-60 border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                <span className="flex items-center justify-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend verification email
                </span>
              )}
            </Button>

            <div className="mt-6 flex items-center justify-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
