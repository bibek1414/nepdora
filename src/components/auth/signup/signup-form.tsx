"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import { signupSchema, SignupFormValues } from "@/schemas/signup.form";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse, FormErrorState } from "@/types/auth/error.types";

export function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { signup, isLoading } = useAuth();
  const [formError, setFormError] = useState<FormErrorState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const getErrorIcon = (type: FormErrorState["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="mr-2 h-5 w-5" />;
      case "warning":
        return <Info className="mr-2 h-5 w-5" />;
      case "info":
        return <CheckCircle className="mr-2 h-5 w-5" />;
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

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setFormError(null);
      clearErrors();

      await signup(data);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const parsedError = AuthErrorHandler.parseAuthError(errorResponse);
      setFormError(parsedError);

      // Set field-specific errors
      const emailError = AuthErrorHandler.getFieldError("email", errorResponse);
      const storeNameError = AuthErrorHandler.getFieldError(
        "store_name",
        errorResponse
      );
      const phoneError = AuthErrorHandler.getFieldError("phone", errorResponse);

      if (emailError) {
        setError("email", {
          type: "manual",
          message: emailError,
        });
      }

      if (storeNameError) {
        setError("store_name", {
          type: "manual",
          message: storeNameError,
        });
      }

      if (phoneError) {
        setError("phone", {
          type: "manual",
          message: phoneError,
        });
      }

      console.error("Signup error:", error);
    }
  };

  const handleInputChange =
    (field: keyof SignupFormValues) =>
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

  return (
    <div className="bg-card flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Left */}
      <div className="from-primary to-secondary pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr opacity-50 blur-3xl"></div>

      {/* Top Right */}
      <div className="from-primary to-secondary pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr opacity-50 blur-3xl"></div>

      {/* Bottom Left */}
      <div className="from-primary to-secondary pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr opacity-50 blur-3xl"></div>

      {/* Bottom Right */}
      <div className="from-primary to-secondary pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-gradient-to-tr opacity-50 blur-3xl"></div>

      <div className="relative w-full max-w-md">
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
                      <Link
                        href={formError.action.href}
                        className="font-medium underline hover:no-underline"
                      >
                        {formError.action.label}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create New Account
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter your details to create an account.
                </p>
              </div>

              <div>
                <Input
                  id="store_name"
                  type="text"
                  label="Store Name"
                  placeholder="Enter your store name"
                  disabled={isLoading}
                  className={cn(
                    errors.store_name
                      ? "border-red-300 focus:ring-red-500"
                      : "focus:ring-primary border-gray-300"
                  )}
                  {...register("store_name")}
                  onChange={handleInputChange("store_name")}
                />
                {errors.store_name && (
                  <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {errors.store_name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  autoComplete="email"
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
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="1234567890"
                  disabled={isLoading}
                  className={cn(
                    errors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "focus:ring-primary border-gray-300"
                  )}
                  {...register("phone")}
                  onChange={handleInputChange("phone")}
                />
                {errors.phone && (
                  <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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
                {password && password.length > 0 && !errors.password && (
                  <div className="mt-2 space-y-1 text-xs">
                    <div
                      className={cn(
                        "flex items-center",
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          "mr-1 h-3 w-3",
                          password.length >= 8
                            ? "text-green-600"
                            : "text-gray-400"
                        )}
                      />
                      At least 8 characters
                    </div>
                    <div
                      className={cn(
                        "flex items-center",
                        /[a-z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          "mr-1 h-3 w-3",
                          /[a-z]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        )}
                      />
                      One lowercase letter
                    </div>
                    <div
                      className={cn(
                        "flex items-center",
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          "mr-1 h-3 w-3",
                          /[A-Z]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        )}
                      />
                      One uppercase letter
                    </div>
                    <div
                      className={cn(
                        "flex items-center",
                        /[0-9]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          "mr-1 h-3 w-3",
                          /[0-9]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        )}
                      />
                      One number
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={cn(
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "focus:ring-primary border-gray-300"
                  )}
                  {...register("confirmPassword")}
                  onChange={handleInputChange("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {errors.confirmPassword.message}
                  </p>
                )}
                {confirmPassword &&
                  password &&
                  password !== confirmPassword &&
                  !errors.confirmPassword && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-600">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      Passwords do not match
                    </p>
                  )}
                {confirmPassword &&
                  password &&
                  password === confirmPassword &&
                  !errors.confirmPassword && (
                    <p className="mt-2 flex items-center text-sm font-medium text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Passwords match
                    </p>
                  )}
              </div>

              <div>
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
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
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
                Sign up with Google
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/admin/login"
                    className="text-primary hover:text-primary font-medium"
                  >
                    Login
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary font-medium transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary font-medium transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
