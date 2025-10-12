"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { AlertCircle, Mail, RefreshCw, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "@/schemas/login.form";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse, FormErrorState } from "@/types/auth/error.types";
import { resendVerificationEmail } from "@/services/auth/api";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login, isLoading } = useAuth();
  const [formError, setFormError] = useState<FormErrorState | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const getErrorIcon = (type: FormErrorState["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="mr-2 h-5 w-5" />;
      case "warning":
        return <Mail className="mr-2 h-5 w-5" />;
      case "info":
        return <Mail className="mr-2 h-5 w-5" />;
      default:
        return <AlertCircle className="mr-2 h-5 w-5" />;
    }
  };

  const getErrorStyles = (type: FormErrorState["type"]) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-800";
      default:
        return "border-red-200 bg-red-50 text-red-800";
    }
  };

  const handleResendVerification = async () => {
    const email = getValues("email");

    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsResendingVerification(true);

    try {
      await resendVerificationEmail({ email });

      toast.success("Verification email sent!", {
        description: "Please check your inbox and spam folder.",
      });

      setFormError({
        message:
          "Verification email has been sent! Please check your inbox and click the verification link.",
        type: "info",
      });
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      const errorMessage =
        errorResponse.response?.data?.error?.message ||
        errorResponse.message ||
        "Failed to resend verification email";

      toast.error("Failed to resend verification email", {
        description: errorMessage,
      });
      console.error("Resend verification error:", error);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setFormError(null);
      clearErrors();

      await login(data);
      setAttemptCount(0);
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse;
      setAttemptCount(prev => prev + 1);

      if (AuthErrorHandler.isEmailVerificationNeeded(errorResponse)) {
        setFormError({
          message:
            "Your email address is not verified yet. Please check your email and click the verification link to complete your account setup.",
          type: "warning",
          action: {
            label: "Resend verification email",
            href: "#",
            onClick: handleResendVerification,
          },
        });
        return;
      }

      const parsedError = AuthErrorHandler.parseAuthError(errorResponse);
      setFormError(parsedError);

      if (
        parsedError.message.includes("Invalid email or password") ||
        parsedError.message.includes("credentials")
      ) {
        setError("email", {
          type: "manual",
          message: "Please verify your email address",
        });
        setError("password", {
          type: "manual",
          message: "Please verify your password",
        });
      } else if (parsedError.message.includes("Account not found")) {
        setError("email", {
          type: "manual",
          message: "Email not found in our system",
        });
      }

      console.error("Login error:", error);
    }
  };

  const handleInputChange =
    (field: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      register(field).onChange(e);
      if (formError) {
        setFormError(null);
      }
      if (errors[field]) {
        clearErrors(field);
      }
    };

  const showSecurityMessage = attemptCount >= 3;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Left side - 4 Images Grid */}
            <div className="hidden w-full bg-gradient-to-br from-purple-100 to-blue-100 p-6 md:block md:w-1/2">
              <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
                <div className="row-span-2 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80"
                    alt="Web design workspace"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&q=80"
                    alt="Creative coding"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80"
                    alt="Designer at work"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Sign in form */}
            <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:p-12">
              <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Sign in to{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Nepdora
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    Welcome back! Enter your details to access your website
                    builder dashboard.
                  </p>
                </div>

                <div className={cn("space-y-6", className)} {...props}>
                  {formError && (
                    <div
                      className={cn(
                        "flex items-start rounded-lg border p-4 text-sm",
                        getErrorStyles(formError.type)
                      )}
                    >
                      {getErrorIcon(formError.type)}
                      <div className="flex-1">
                        <span>{formError.message}</span>
                        {formError.action && (
                          <div className="mt-2">
                            {formError.action.onClick ? (
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 font-medium underline hover:no-underline"
                                onClick={formError.action.onClick}
                                disabled={isResendingVerification}
                              >
                                {isResendingVerification ? (
                                  <>
                                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  formError.action.label
                                )}
                              </Button>
                            ) : formError.action.href ? (
                              <Link
                                href={formError.action.href}
                                className="font-medium underline hover:no-underline"
                              >
                                {formError.action.label}
                              </Link>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {showSecurityMessage && (
                    <div className="flex items-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      <span>
                        For security reasons, please double-check your
                        credentials. If you&apos;ve forgotten your password,
                        consider resetting it.
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-gray-900"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          className={cn(
                            "block w-full rounded-md border px-4 py-3 text-sm focus:ring-2 focus:outline-none",
                            errors.email
                              ? "border-red-300 focus:ring-red-500"
                              : "border-gray-300 focus:ring-purple-600"
                          )}
                          {...register("email")}
                          onChange={handleInputChange("email")}
                        />
                        {errors.email && (
                          <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="mb-2 block text-sm font-medium text-gray-900"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isLoading}
                            className={cn(
                              "block w-full rounded-md border px-4 py-3 pr-10 text-sm focus:ring-2 focus:outline-none",
                              errors.password
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-purple-600"
                            )}
                            {...register("password")}
                            onChange={handleInputChange("password")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff
                                size={18}
                                className="transition-colors hover:text-gray-700"
                              />
                            ) : (
                              <Eye
                                size={18}
                                className="transition-colors hover:text-gray-700"
                              />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href="/admin/forgot-password"
                          className="text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          Forgot the password?
                        </Link>
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
                            Signing in...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Login
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 flex-shrink text-sm text-gray-500">
                      OR
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Don&apos;t have an account?
                      <Link
                        href="/admin/signup"
                        className="ml-1 font-medium text-purple-600 hover:text-purple-700"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
