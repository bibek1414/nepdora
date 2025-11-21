"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { resetPassword, validatePasswordResetKey } from "@/services/auth/api";
import { toast } from "sonner";

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
  resetKey: string;
}

export function ResetPasswordForm({
  resetKey,
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(true);
  const [keyValidationError, setKeyValidationError] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Validate the reset key when component mounts
  useEffect(() => {
    const validateKey = async () => {
      try {
        setIsValidatingKey(true);
        await validatePasswordResetKey(resetKey);
        setKeyValidationError(null);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.errors?.[0]?.message ||
          error.message ||
          "Invalid or expired password reset link";

        setKeyValidationError(errorMessage);
        toast.error("Invalid Reset Link", {
          description: errorMessage,
        });
      } finally {
        setIsValidatingKey(false);
      }
    };

    validateKey();
  }, [resetKey]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      await resetPassword({
        key: resetKey,
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

  // Show loading state while validating key
  if (isValidatingKey) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
            <h1 className="mb-3 text-2xl font-semibold text-gray-900">
              Validating reset link...
            </h1>
            <p className="text-sm text-gray-600">
              Please wait while we verify your password reset link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if key validation failed
  if (keyValidationError) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mb-3 text-2xl font-semibold text-gray-900">
              Invalid Reset Link
            </h1>
            <p className="mb-6 text-sm text-gray-600">{keyValidationError}</p>
            <Link
              href="/admin/forgot-password"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-3 text-2xl font-semibold text-gray-900">
              Password reset successful!
            </h1>
            <p className="mb-4 text-sm text-gray-600">
              Your password has been successfully reset.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
              New password
            </h1>
            <p className="text-sm text-gray-600">
              Please choose a new password
            </p>
          </div>

          <div className={cn("space-y-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      disabled={isLoading}
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none",
                        errors.password &&
                          "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 flex items-center text-xs text-red-500">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      disabled={isLoading}
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none",
                        errors.confirmPassword &&
                          "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...register("confirmPassword")}
                    />
                  </div>
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
                    "mt-2 flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
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
                className="text-sm text-gray-600 hover:text-gray-900"
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
