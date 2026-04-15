"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff, Check } from "lucide-react";
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

  // Set E-commerce as default
  const [selectedWebsiteType, setSelectedWebsiteType] = useState<
    "ecommerce" | "service"
  >("ecommerce");

  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      website_type: "ecommerce",
    },
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
          if (decoded === result) break;
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

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setFormError(null);
      clearErrors();
      await signup(data);
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const parsedError = AuthErrorHandler.parseAuthError(errorResponse);
      setFormError(parsedError);
      ["email", "store_name", "phone"].forEach(field => {
        const msg = AuthErrorHandler.getFieldError(
          field === "store_name" ? "store_name" : (field as any),
          errorResponse
        );
        if (msg) setError(field as any, { type: "manual", message: msg });
      });
    }
  };

  const handleInputChange =
    (field: keyof SignupFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      register(field).onChange(e);
      if (formError) setFormError(null);
      if (errors[field]) clearErrors(field);
    };

  const handleGoogleSignup = () => setIsGoogleDialogOpen(true);

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center justify-start bg-white px-6 pt-12 pb-12 md:pt-20">
        <div className="w-full max-w-[400px] transition-all">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm">
              Join our platform to manage your business with ease.
            </p>
          </div>

          {formError && (
            <div
              className={cn(
                "mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm transition-all",
                formError.type === "error"
                  ? "border-red-100 bg-red-50 text-red-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
              )}
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{formError.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Website type selection - Row Toggle */}
            <div className="flex gap-2 pb-2">
              {["ecommerce", "service"].map(type => (
                <label
                  key={type}
                  className={cn(
                    "flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border text-sm transition-all duration-200",
                    selectedWebsiteType === type
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm shadow-blue-50"
                      : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"
                  )}
                >
                  <input
                    type="radio"
                    value={type}
                    checked={selectedWebsiteType === type}
                    className="hidden"
                    onChange={() => {
                      const val = type as "ecommerce" | "service";
                      setSelectedWebsiteType(val);
                      setValue("website_type", val);
                      if (formError) setFormError(null);
                    }}
                  />
                  {type === "ecommerce" ? "E-commerce" : "Service"}
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <FloatingInput
                  id="store_name"
                  className="rounded-xl border-slate-200 px-4 py-6 focus:border-blue-500 focus:ring-0"
                  {...register("store_name")}
                  onChange={handleInputChange("store_name")}
                />
                <FloatingLabel htmlFor="store_name">Store name</FloatingLabel>
                {errors.store_name && (
                  <p className="mt-1 px-1 text-[11px] text-red-500">
                    {errors.store_name.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <FloatingInput
                  id="email"
                  type="email"
                  className="rounded-xl border-slate-200 px-4 py-6 focus:border-blue-500 focus:ring-0"
                  {...register("email")}
                  onChange={handleInputChange("email")}
                />
                <FloatingLabel htmlFor="email">Email address</FloatingLabel>
                {errors.email && (
                  <p className="mt-1 px-1 text-[11px] text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <FloatingInput
                  id="phone"
                  type="tel"
                  className="rounded-xl border-slate-200 px-4 py-6 focus:border-blue-500 focus:ring-0"
                  {...register("phone")}
                  onChange={handleInputChange("phone")}
                />
                <FloatingLabel htmlFor="phone">Phone number</FloatingLabel>
                {errors.phone && (
                  <p className="mt-1 px-1 text-[11px] text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <FloatingInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="rounded-xl border-slate-200 px-4 py-6 pr-10 focus:border-blue-500 focus:ring-0"
                  {...register("password")}
                  onChange={handleInputChange("password")}
                />
                <FloatingLabel htmlFor="password">Password</FloatingLabel>
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="mt-1 px-1 text-[11px] text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <FloatingInput
                  id="confirmPassword"
                  type="password"
                  className="rounded-xl border-slate-200 px-4 py-6 focus:border-blue-500 focus:ring-0"
                  {...register("confirmPassword")}
                  onChange={handleInputChange("confirmPassword")}
                />
                <FloatingLabel htmlFor="confirmPassword">
                  Confirm password
                </FloatingLabel>
                {errors.confirmPassword && (
                  <p className="mt-1 px-1 text-[11px] text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3 py-1 pt-2">
              <div className="relative mt-0.5 flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-200 transition-all checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                />
                <Check className="pointer-events-none absolute left-0.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
              </div>
              <label
                htmlFor="terms"
                className="cursor-pointer text-xs leading-normal text-slate-500 select-none"
              >
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 underline-offset-2 hover:underline"
                >
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 underline-offset-2 hover:underline"
                >
                  privacy policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <p className="pt-2 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/admin/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="mx-4 text-[11px] text-slate-400">
                Or sign up with
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <GoogleLoginButton onClick={handleGoogleSignup} isRegister={true} />
          </form>
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
