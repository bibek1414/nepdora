"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { signupSchema, SignupFormValues } from "@/schemas/signup.form";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse, FormErrorState } from "@/types/auth/error.types";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";
import { useAuth } from "@/hooks/use-auth";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import { GoogleSignupDialog } from "@/components/auth/signup/google-signup-form-dialog";
import { useSearchParams } from "next/navigation";

const GOOGLE_AUTH_ERROR_COOKIE = "google_auth_error";

export function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { signup, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const oauthErrorParam = searchParams?.get("error");
  const [formError, setFormError] = useState<FormErrorState | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedWebsiteType, setSelectedWebsiteType] = useState<
    "ecommerce" | "service" | null
  >(null);
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getCookieValue = (name: string): string | null => {
      const cookies = document.cookie?.split(";") ?? [];
      for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(`${name}=`)) {
          return trimmed.substring(name.length + 1);
        }
      }
      return null;
    };

    const decodeMessage = (value: string) => {
      let result = value.replace(/\+/g, " ");
      for (let i = 0; i < 2; i += 1) {
        try {
          const decoded = decodeURIComponent(result);
          if (decoded === result) {
            break;
          }
          result = decoded;
        } catch {
          break;
        }
      }
      return result;
    };

    const googleAuthError = getCookieValue(GOOGLE_AUTH_ERROR_COOKIE);

    if (googleAuthError) {
      setFormError({
        message: decodeMessage(googleAuthError),
        type: "error",
      });
      document.cookie = `${GOOGLE_AUTH_ERROR_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      return;
    }

    if (oauthErrorParam === "OAuthCallback") {
      setFormError({
        message:
          "Google sign-in failed. Please try again or complete your email signup first.",
        type: "error",
      });
    }
  }, [oauthErrorParam, setFormError]);

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

  const handleGoogleSignup = () => {
    const existingStoreName = watch("store_name");
    const existingPhone = watch("phone");
    setIsGoogleDialogOpen(true);
  };

  return (
    <>
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
            <div className="mt-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                Build and manage websites
              </h2>
              <p className="text-sm text-gray-600">
                Create, customize, and grow your online presence with smart
                tools.
              </p>
            </div>
            <div className="relative w-full max-w-md">
              <img
                src="/images/illustration-dashboard-login.webp"
                alt="Dashboard"
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md md:w-1/3">
            <div className="rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Get started absolutely free
                </h3>
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/admin/login"
                    className="font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {formError && (
                <div
                  className={`mb-4 flex items-start rounded-lg border p-4 text-sm ${getErrorStyles(formError.type)}`}
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* ... rest of your form fields remain the same ... */}
                <div className="relative">
                  <FloatingInput
                    id="store_name"
                    type="text"
                    disabled={isLoading}
                    className={cn(
                      "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                      errors.store_name &&
                        "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                    {...register("store_name")}
                    onChange={handleInputChange("store_name")}
                  />
                  <FloatingLabel htmlFor="store_name">
                    <User className="mr-2 h-4 w-4" />
                    Store Name
                  </FloatingLabel>
                  {errors.store_name && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.store_name.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <FloatingInput
                    id="email"
                    type="email"
                    autoComplete="email"
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
                  <FloatingInput
                    id="phone"
                    type="tel"
                    disabled={isLoading}
                    className={cn(
                      "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                      errors.phone &&
                        "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                    {...register("phone")}
                    onChange={handleInputChange("phone")}
                  />
                  <FloatingLabel htmlFor="phone">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone Number
                  </FloatingLabel>
                  {errors.phone && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <label className="text-xs font-medium text-gray-500">
                    Website Type
                  </label>
                  <div className="grid grid-cols-2 gap-3 py-0">
                    <label
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50",
                        selectedWebsiteType === "ecommerce"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      <input
                        type="radio"
                        value="ecommerce"
                        {...register("website_type")}
                        className="hidden"
                        onChange={e => {
                          setSelectedWebsiteType("ecommerce");
                          handleInputChange("website_type")(e);
                        }}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          selectedWebsiteType === "ecommerce"
                            ? "text-emerald-700"
                            : "text-gray-700"
                        )}
                      >
                        E-commerce
                      </span>
                    </label>

                    <label
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50",
                        selectedWebsiteType === "service"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      <input
                        type="radio"
                        value="service"
                        {...register("website_type")}
                        className="hidden"
                        onChange={e => {
                          setSelectedWebsiteType("service");
                          handleInputChange("website_type")(e);
                        }}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          selectedWebsiteType === "service"
                            ? "text-emerald-700"
                            : "text-gray-700"
                        )}
                      >
                        Service
                      </span>
                    </label>
                  </div>

                  {errors.website_type && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.website_type.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <div className="relative">
                    <FloatingInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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

                <div className="relative">
                  <FloatingInput
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className={cn(
                      "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                      errors.confirmPassword &&
                        "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                    {...register("confirmPassword")}
                    onChange={handleInputChange("confirmPassword")}
                  />
                  <FloatingLabel htmlFor="confirmPassword">
                    <Lock className="mr-2 h-4 w-4" />
                    Confirm Password
                  </FloatingLabel>
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-gray-800",
                    isLoading ? "cursor-not-allowed opacity-50" : ""
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
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
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 flex-shrink text-sm text-gray-500">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <GoogleLoginButton
                  onClick={handleGoogleSignup}
                  isRegister={true}
                />

                <div className="text-center text-sm text-gray-600">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <GoogleSignupDialog
        isOpen={isGoogleDialogOpen}
        onOpenChange={setIsGoogleDialogOpen}
        initialStoreName={watch("store_name")}
        initialPhone={watch("phone")}
      />
    </>
  );
}
