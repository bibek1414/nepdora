"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { requestPasswordReset } from "@/services/auth/api";
import { toast } from "sonner";

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
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Check your email
              </h1>
              <p className="mb-6 text-sm text-gray-600">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium">{getValues("email")}</span>
              </p>
              <p className="mb-6 text-sm text-gray-600">
                Click the link in the email to reset your password. If you
                don&apos;t see it, check your spam folder.
              </p>
              <Link href="/admin/login">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Forgot password?
            </h1>
            <p className="text-sm text-gray-600">
              Enter the email used for your account and we&apos;ll send you a
              link to reset your password
            </p>
          </div>

          <div className={cn("space-y-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      className={cn(
                        "block w-full rounded-md border py-3 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none",
                        errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-600"
                      )}
                      {...register("email")}
                    />
                  </div>
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
                    "flex w-full justify-center rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:from-purple-700 hover:to-blue-700",
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
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
