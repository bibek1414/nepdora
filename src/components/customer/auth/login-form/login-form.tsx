"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/customer/use-auth";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { loginSchema, LoginFormValues } from "@/schemas/customer/login.form";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Clear previous errors
      setLoginError(null);
      clearErrors();

      await login(data);

      // Reset attempt count on successful login
      setAttemptCount(0);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Increment attempt count
      setAttemptCount(prev => prev + 1);

      // Get the error response data
      const errorData = error.response?.data;
      const errorCode = errorData?.errors?.[0]?.code;
      const errorMessage = errorData?.errors?.[0]?.message;

      // Handle specific error codes from backend
      if (errorCode === "too_many_login_attempts") {
        setLoginError(
          "Too many failed login attempts. Please wait a few minutes before trying again."
        );
      } else if (
        errorCode === "invalid_credentials" ||
        errorMessage?.includes("email address and/or password") ||
        errorMessage?.includes("not correct")
      ) {
        setLoginError(
          "The email address and/or password you specified are not correct."
        );

        // Set field-specific errors for wrong credentials
        setError("email", {
          type: "manual",
          message: "Please verify your email address",
        });
        setError("password", {
          type: "manual",
          message: "Please verify your password",
        });
      } else if (errorCode === "user_not_found") {
        setLoginError("Account not found. Please check your email or sign up.");
        setError("email", {
          type: "manual",
          message: "Email not found in our system",
        });
      } else if (errorCode === "account_disabled") {
        setLoginError(
          "Your account has been disabled. Please contact support for assistance."
        );
      } else if (error.response?.status === 401) {
        setLoginError(
          "Invalid email or password. Please check your credentials."
        );

        // Set field-specific errors for wrong credentials
        setError("email", {
          type: "manual",
          message: "Please verify your email address",
        });
        setError("password", {
          type: "manual",
          message: "Please verify your password",
        });
      } else if (error.response?.status === 429) {
        setLoginError(
          "Too many login attempts. Please wait before trying again."
        );
      } else if (error.response?.status === 404) {
        setLoginError("Account not found. Please check your email or sign up.");
        setError("email", {
          type: "manual",
          message: "Email not found in our system",
        });
      } else {
        // Use the error message from backend if available, otherwise use a generic message
        setLoginError(errorMessage || "Login failed. Please try again.");
      }

      // Log detailed error information for debugging
      console.error("Login error details:", {
        status: error.response?.status,
        errorCode,
        errorMessage,
        fullError: error.response?.data,
      });
    }
  };

  // Handle signup link click to redirect to preview signup page
  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Extract siteUser from the current pathname
    const pathSegments = window.location.pathname.split("/");
    const isPreview = window.location.pathname.startsWith("/preview");
    const isPublish = window.location.pathname.startsWith("/publish");

    let siteUser = null;
    if (isPreview) {
      siteUser = pathSegments[2];
    } else if (isPublish) {
      siteUser = pathSegments[2];
    }

    const redirect = searchParams.get("redirect");
    let signupPath = "/signup";

    if (isPreview && siteUser) {
      signupPath = `/preview/${siteUser}/signup`;
    } else if (isPublish && siteUser) {
      signupPath = `/signup`;
    }

    if (redirect) {
      signupPath += `?redirect=${encodeURIComponent(redirect)}`;
    }

    router.push(signupPath);
  };

  // Show additional security message after multiple failed attempts
  const showSecurityMessage = attemptCount >= 3;

  return (
    <div className="bg-background flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white p-8">
          <div className={cn("grid gap-6", className)} {...props}>
            {/* General Login Error Alert */}
            {loginError && (
              <div className="mb-4 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Security Message for Multiple Failed Attempts */}
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
                    onChange={e => {
                      register("email").onChange(e);
                      // Clear login error when user starts typing
                      if (loginError) {
                        setLoginError(null);
                      }
                    }}
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
                    disabled={isLoading}
                    className={cn(
                      errors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "focus:ring-primary border-gray-300"
                    )}
                    {...register("password")}
                    onChange={e => {
                      register("password").onChange(e);
                      // Clear login error when user starts typing
                      if (loginError) {
                        setLoginError(null);
                      }
                    }}
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
                  variant="default"
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
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={handleSignupClick}
                className="text-primary hover:text-primary cursor-pointer font-medium underline"
                style={{
                  color: theme.colors.primary,
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
