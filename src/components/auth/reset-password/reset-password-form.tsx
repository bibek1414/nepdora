"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { resetPassword } from "@/services/auth/api";
import { toast } from "sonner";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  uid: string;
  token: string;
}

export function ResetPasswordForm({
  uid,
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      await resetPassword({
        uid,
        token,
        password: data.password,
      });

      setIsSuccess(true);
      toast.success("Password reset successful!", {
        description: "You can now login with your new password.",
      });

      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        "Failed to reset password. Please try again.";

      toast.error("Password reset failed", {
        description: errorMessage,
      });
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success state
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
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Password reset successful!
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Your password has been successfully reset.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  // Show reset password form
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
            New password
          </h1>
          <p className="text-sm text-gray-600">Please choose a new password</p>
        </div>

        <div className={cn("space-y-6", className)} {...props}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="relative">
                <FloatingInput
                  id="password"
                  type="password"
                  disabled={isLoading}
                  className={cn(
                    "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                    errors.password &&
                      "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                  {...register("password")}
                />
                <FloatingLabel htmlFor="password">
                  <Lock className="mr-2 h-4 w-4" />
                  New Password
                </FloatingLabel>
                {errors.password && (
                  <p className="mt-2 flex items-center text-xs text-red-500">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <FloatingInput
                  id="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  className={cn(
                    "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                    errors.confirmPassword &&
                      "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                  {...register("confirmPassword")}
                />
                <FloatingLabel htmlFor="confirmPassword">
                  <Lock className="mr-2 h-4 w-4" />
                  Confirm Password
                </FloatingLabel>
                {errors.confirmPassword && (
                  <p className="mt-2 flex items-center text-xs text-red-500">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "mt-2 flex w-full justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none",
                  isLoading && "cursor-not-allowed opacity-60"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
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
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Login
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
