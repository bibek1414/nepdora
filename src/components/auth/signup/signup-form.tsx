"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ChangeEvent, FormEvent } from "react";
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
import {
  signupSchema,
  SignupFormValues,
  storeNameSchema,
  phoneNumberSchema,
} from "@/schemas/signup.form";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse, FormErrorState } from "@/types/auth/error.types";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { signIn } from "next-auth/react";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GoogleWebsiteType = "ecommerce" | "service";

export function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { signup, isLoading } = useAuth();
  const { isRedirecting, isLoading: isCheckingAuth } =
    useAuthRedirect("/admin");
  const [formError, setFormError] = useState<FormErrorState | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [googleStoreName, setGoogleStoreName] = useState("");
  const [googleStoreError, setGoogleStoreError] = useState<string | null>(null);
  const [googlePhone, setGooglePhone] = useState("");
  const [googlePhoneError, setGooglePhoneError] = useState<string | null>(null);
  const [googleWebsiteType, setGoogleWebsiteType] =
    useState<GoogleWebsiteType>("ecommerce");
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const websiteTypeOptions: { value: GoogleWebsiteType; label: string }[] = [
    { value: "ecommerce", label: "E-commerce" },
    { value: "service", label: "Service" },
  ];

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

  const handleGoogleDialogOpenChange = (open: boolean) => {
    if (isGoogleSubmitting) {
      return;
    }
    if (!open) {
      setGoogleStoreError(null);
      setGooglePhoneError(null);
    }
    setIsGoogleDialogOpen(open);
  };

  const handleGoogleSignup = () => {
    const existingStoreName = watch("store_name");
    setGoogleStoreName(existingStoreName || "");
    const existingPhone = watch("phone");
    setGooglePhone(existingPhone || "");
    setGoogleStoreError(null);
    setGooglePhoneError(null);
    setIsGoogleDialogOpen(true);
  };

  const handleGoogleStoreNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (googleStoreError) {
      setGoogleStoreError(null);
    }
    setGoogleStoreName(event.target.value);
  };

  const closeGoogleDialog = () => {
    if (isGoogleSubmitting) {
      return;
    }
    setIsGoogleDialogOpen(false);
    setGoogleStoreError(null);
    setGooglePhoneError(null);
  };

  const persistGoogleSignupMetadata = (
    storeName: string,
    phone?: string,
    websiteType: GoogleWebsiteType = googleWebsiteType
  ) => {
    if (typeof document === "undefined") {
      return;
    }

    const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
    document.cookie = `google_store_name=${encodeURIComponent(storeName)}; expires=${expires}; path=/; SameSite=Lax`;

    const phoneValue = phone ?? watch("phone");
    if (phoneValue) {
      document.cookie = `google_phone_number=${encodeURIComponent(
        phoneValue
      )}; expires=${expires}; path=/; SameSite=Lax`;
    } else {
      document.cookie = `google_phone_number=; expires=${new Date(
        0
      ).toUTCString()}; path=/; SameSite=Lax`;
    }

    const websiteTypeValue = websiteType || googleWebsiteType;
    document.cookie = `google_website_type=${encodeURIComponent(
      websiteTypeValue
    )}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const handleGoogleDialogSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const trimmedStoreName = googleStoreName.trim();
    const validationResult = storeNameSchema.safeParse(trimmedStoreName);
    const trimmedPhone = googlePhone.trim();
    const phoneValidationResult = phoneNumberSchema.safeParse(trimmedPhone);

    if (!validationResult.success) {
      setGoogleStoreError(
        validationResult.error.issues[0]?.message || "Invalid store name."
      );
      return;
    }

    if (!phoneValidationResult.success) {
      setGooglePhoneError(
        phoneValidationResult.error.issues[0]?.message ||
          "Invalid phone number."
      );
      return;
    }

    setGoogleStoreError(null);
    setGooglePhoneError(null);
    setIsGoogleSubmitting(true);

    try {
      persistGoogleSignupMetadata(
        validationResult.data,
        trimmedPhone,
        googleWebsiteType
      );
      await signIn("google", {
        callbackUrl: "/admin",
        store_name: validationResult.data,
      });
    } catch (error) {
      console.error("Google signup error:", error);
      setGoogleStoreError("Something went wrong. Please try again.");
    } finally {
      setIsGoogleSubmitting(false);
    }
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

      <Dialog
        open={isGoogleDialogOpen}
        onOpenChange={handleGoogleDialogOpenChange}
      >
        <DialogContent
          className="rounded-2xl bg-white p-6 shadow-2xl sm:max-w-lg sm:p-8"
          showCloseButton={!isGoogleSubmitting}
        >
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Add your store name
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              We use this to personalize your workspace before connecting your
              Google account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGoogleDialogSubmit} className="space-y-5">
            <div className="relative">
              <FloatingInput
                id="google_store_name"
                type="text"
                value={googleStoreName}
                autoComplete="organization"
                disabled={isGoogleSubmitting}
                onChange={handleGoogleStoreNameChange}
                className={cn(
                  "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                  googleStoreError &&
                    "border-red-300 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <FloatingLabel htmlFor="google_store_name">
                <User className="mr-2 h-4 w-4" />
                Store Name
              </FloatingLabel>
              {googleStoreError && (
                <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {googleStoreError}
                </p>
              )}
            </div>

            <div className="relative">
              <FloatingInput
                id="google_phone"
                type="tel"
                value={googlePhone}
                autoComplete="tel"
                disabled={isGoogleSubmitting}
                onChange={event => {
                  if (googlePhoneError) {
                    setGooglePhoneError(null);
                  }
                  setGooglePhone(event.target.value);
                }}
                className={cn(
                  "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                  googlePhoneError &&
                    "border-red-300 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <FloatingLabel htmlFor="google_phone">
                <Phone className="mr-2 h-4 w-4" />
                Phone Number
              </FloatingLabel>
              {googlePhoneError && (
                <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {googlePhoneError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                Website type
              </p>
              <p className="text-xs text-gray-500">
                Choose the experience that fits your business.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {websiteTypeOptions.map(option => {
                  const isSelected = googleWebsiteType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                        isSelected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      )}
                      onClick={() => setGoogleWebsiteType(option.value)}
                      disabled={isGoogleSubmitting}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={closeGoogleDialog}
                disabled={isGoogleSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  "w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-gray-800 sm:w-auto",
                  isGoogleSubmitting ? "cursor-not-allowed opacity-80" : ""
                )}
                disabled={isGoogleSubmitting}
              >
                {isGoogleSubmitting ? (
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
                    Connecting...
                  </div>
                ) : (
                  "Continue with Google"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
