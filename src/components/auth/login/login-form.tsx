"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
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
import { signIn } from "next-auth/react";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import { useSearchParams } from "next/navigation";
import { useUserStatus, useRecoverUser } from "@/hooks/use-user";

const GOOGLE_AUTH_ERROR_COOKIE = "google_auth_error";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login, isLoading } = useAuth();
  const { isRedirecting } = useAuthRedirect("/admin");
  const searchParams = useSearchParams();
  const oauthErrorParam = searchParams?.get("error");
  const [formError, setFormError] = useState<FormErrorState | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: checkStatus } = useUserStatus();
  const { mutateAsync: recoverAccount } = useRecoverUser();

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
      setFormError({ message: decodeMessage(googleAuthError), type: "error" });
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
  }, [oauthErrorParam]);

  const handleResendVerification = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setIsResendingVerification(true);
    try {
      await resendVerificationEmail({ email });
      setFormError({
        message: "Verification email has been sent! Please check your inbox.",
        type: "info",
      });
    } catch (error: any) {
      toast.error("Failed to resend verification email");
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleRecoverAccount = async (userId: number) => {
    try {
      await recoverAccount(userId);
      toast.success("Account recovered successfully.");
      setFormError({
        message: "Account recovered. You can now sign in.",
        type: "info",
      });
    } catch (error: any) {
      toast.error("Failed to recover account.");
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setFormError(null);
      clearErrors();

      const statusData = await checkStatus(data.email);
      if (statusData.is_deleted) {
        setFormError({
          message: "This account was deleted. Click below to recover it.",
          type: "warning",
          action: {
            label: "Recover my account",
            href: "#",
            onClick: () => handleRecoverAccount(statusData.id!),
          },
        });
        return;
      }

      await login(data);
    } catch (error: any) {
      const errorResponse = error as ErrorResponse;
      if (AuthErrorHandler.isEmailVerificationNeeded(errorResponse)) {
        setFormError({
          message: "Email not verified. Please check your inbox.",
          type: "warning",
          action: {
            label: "Resend verification email",
            href: "#",
            onClick: handleResendVerification,
          },
        });
        return;
      }
      setFormError(AuthErrorHandler.parseAuthError(errorResponse));
    }
  };

  const handleInputChange =
    (field: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      register(field).onChange(e);
      if (formError) setFormError(null);
      if (errors[field]) clearErrors(field);
    };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-white px-6 pt-16 pb-12 md:pt-24">
      <div className="w-full max-w-[400px] transition-all">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm">
            Welcome back, please enter your details.
          </p>
        </div>

        {formError && (
          <div
            className={cn(
              "mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm transition-all",
              formError.type === "error"
                ? "border-red-100 bg-red-50 text-red-800"
                : formError.type === "warning"
                  ? "border-amber-100 bg-amber-50 text-amber-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
            )}
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p>{formError.message}</p>
              {formError.action && (
                <button
                  type="button"
                  className="mt-2 text-xs font-medium underline underline-offset-2 hover:opacity-80"
                  onClick={formError.action.onClick}
                >
                  {isResendingVerification
                    ? "Sending..."
                    : formError.action.label}
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
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
          </div>

          <div className="flex justify-center pt-1">
            <Link
              href="/admin/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="pt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/admin/signup"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Get started
            </Link>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="mx-4 text-[11px] text-slate-400">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <GoogleLoginButton
            onClick={() =>
              signIn("google", { callbackUrl: "/auth/google/callback" })
            }
            isRegister={false}
          />
        </form>
      </div>
    </div>
  );
}
