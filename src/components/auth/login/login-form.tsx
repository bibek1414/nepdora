"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Mail, RefreshCw, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "@/schemas/login.form";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse, FormErrorState } from "@/types/auth/error.types";
import { resendVerificationEmail } from "@/services/auth/api";
import { toast } from "sonner";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login, isLoading } = useAuth();
  const { isRedirecting, isLoading: isCheckingAuth } =
    useAuthRedirect("/admin");
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

  // Show loading state while checking authentication
  if (isCheckingAuth || isRedirecting) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-12 w-12 animate-spin text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        <div
          className="absolute right-10 bottom-20 animate-bounce text-4xl text-gray-500 opacity-20"
          style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 7.5h5v2h-5zm0 7h5v2h-5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM11 6H6v5h5V6zm-1 4H7V7h3v3zm1 3H6v5h5v-5zm-1 4H7v-3h3v3z"></path>
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-8 md:flex-row">
        {/* Left Side - Illustration */}
        <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Hey there, good to see you again!
          </h2>
          <p className="text-sm text-gray-600">
            Pick up right where you left off — your work is waiting.
          </p>
          <div className="relative w-full max-w-md">
            <img
              src="/images/illustration-dashboard-login.webp"
              alt="Dashboard"
              className="h-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md md:w-1/2">
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Sign in to your account
              </h3>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/admin/signup"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Get started
                </Link>
              </p>
            </div>

            {formError && (
              <div
                className={`mb-4 flex items-start rounded-lg border p-4 text-sm ${getErrorStyles(formError.type)}`}
              >
                <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <span>{formError.message}</span>
                  {formError.action && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="font-medium underline hover:no-underline"
                        onClick={formError.action.onClick}
                        disabled={isResendingVerification}
                      >
                        {isResendingVerification ? (
                          <>
                            <RefreshCw className="mr-1 inline h-3 w-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          formError.action.label
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {showSecurityMessage && (
              <div className="mb-4 flex items-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>
                  For security reasons, please double-check your credentials.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  onChange={handleInputChange("email")}
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

              <div className="relative">
                <div className="relative">
                  <FloatingInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    className={cn(
                      "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 pr-12 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                      errors.password &&
                        "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                    {...register("password")}
                    onChange={handleInputChange("password")}
                  />
                  <FloatingLabel htmlFor="password">
                    <Lock className="mr-2 h-4 w-4" />
                    Password
                  </FloatingLabel>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="transition-colors" />
                    ) : (
                      <Eye size={18} className="transition-colors" />
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
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Forgot the password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-gray-800",
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 flex-shrink text-sm text-gray-500">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
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

              <div className="mt-4 text-center text-sm text-gray-600">
                By signing up, I agree to{" "}
                <Link href="/terms" className="text-gray-900 hover:underline">
                  Terms of service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-gray-900 hover:underline"
                >
                  Privacy policy
                </Link>
                .
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
