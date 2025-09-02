"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { AlertCircle, Mail, RefreshCw } from "lucide-react";
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

      // Update the form error to show success message
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

      // Check if email verification is needed
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

      // Set field-specific errors based on error type
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
      // Clear specific field error
      if (errors[field]) {
        clearErrors(field);
      }
    };

  const showSecurityMessage = attemptCount >= 3;

  return (
    <div className="bg-card flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white p-8">
          <div className={cn("grid gap-6", className)} {...props}>
            {formError && (
              <div
                className={cn(
                  "mb-4 flex items-start rounded-lg border p-4 text-sm",
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
              <div className="mb-4 flex items-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>
                  For security reasons, please double-check your credentials. If
                  you&apos;ve forgotten your password, consider resetting it.
                </span>
              </div>
            )}

            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className={cn(
                      errors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-primary border-gray-300"
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
                  <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className={cn(
                      errors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-primary border-gray-300"
                    )}
                    {...register("password")}
                    onChange={handleInputChange("password")}
                  />
                  {errors.password && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none",
                    isLoading
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-primary hover:bg-primary focus:ring-primary"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
