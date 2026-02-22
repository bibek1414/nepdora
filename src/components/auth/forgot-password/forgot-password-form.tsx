"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Mail, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { requestPasswordReset } from "@/services/auth/api";
import { toast } from "sonner";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      await requestPasswordReset({ email: data.email });

      setIsSuccess(true);
      toast.success("Password reset email sent!", {
        description: "Please check your inbox for the reset link.",
      });
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to send password reset email";

      toast.error("Failed to send reset email", {
        description: errorMessage,
      });
      console.error("Password reset request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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
        </div>

        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Check your email
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-gray-900">
              {getValues("email")}
            </span>
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Click the link in the email to reset your password. If you
            don&apos;t see it, check your spam folder.
          </p>
          <Link href="/admin/login">
            <Button className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white transition-colors hover:bg-gray-800">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Forgot password?
          </h1>
          <p className="text-sm text-gray-600">
            Enter the email used for your account and we&apos;ll send you a link
            to reset your password
          </p>
        </div>

        <div className={cn("space-y-6", className)} {...props}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="relative">
                <FloatingInput
                  id="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className={cn(
                    "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                    errors.email &&
                      "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                  {...register("email")}
                />
                <FloatingLabel htmlFor="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Address
                </FloatingLabel>
                {errors.email && (
                  <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "flex w-full justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none",
                  isLoading ? "cursor-not-allowed opacity-70" : ""
                )}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Reset password"
                )}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/admin/login"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <div className="flex items-center justify-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Login
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
