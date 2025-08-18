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
      // The signup function will now handle the redirect to /signup/verify
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

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
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
