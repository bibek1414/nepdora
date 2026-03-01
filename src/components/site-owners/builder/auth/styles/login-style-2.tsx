"use client";

import React from "react";
import { AuthFormData } from "@/types/owner-site/components/auth-form-map";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/schemas/customer/login.form";
import { useAuth } from "@/hooks/customer/use-auth";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";

interface LoginStyle2Props {
  data: AuthFormData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AuthFormData>) => void;
}

export const LoginStyle2: React.FC<LoginStyle2Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const pathname = usePathname();
  const { login, isLoading } = useAuth();
  const { data: localData, handleTextUpdate } = useBuilderLogic(data, onUpdate);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { title = "", subtitle = "", buttonText = "" } = localData;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormValues) => {
    if (isEditable) return;

    try {
      setLoginError(null);
      await login(formData);
    } catch (err: any) {
      console.error("Login style 2 error:", err);
      const errorData = err.response?.data?.error;

      if (errorData?.params?.field_errors) {
        Object.entries(errorData.params.field_errors).forEach(
          ([field, messages]) => {
            setError(field as any, {
              type: "manual",
              message: (messages as string[])[0],
            });
          }
        );
      } else {
        setLoginError(
          errorData?.message || "Invalid email or password. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex min-h-[600px] w-full items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Left Side - Image/Decoration */}
        <div className="bg-primary hidden w-1/2 flex-col justify-center p-12 text-white lg:flex">
          <h2 className="mb-6 text-4xl font-bold">Join Our Community</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Experience the best shopping experience with our premium selection
            of products.
          </p>
          <div className="mt-12">
            <div className="h-1 w-20 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full p-8 sm:p-12 lg:w-1/2">
          <div className="mb-10 text-center lg:text-left">
            <EditableText
              as="h1"
              value={title}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              className="text-3xl font-bold text-gray-900"
            />
            <EditableText
              as="p"
              value={subtitle}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              className="mt-2 text-gray-600"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginError && (
              <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <div>
              <Input
                id="email-2"
                type="email"
                label="Email"
                placeholder="hello@example.com"
                className={cn(
                  "border-gray-200 bg-gray-50 focus:bg-white",
                  errors.email && "border-red-500"
                )}
                disabled={isEditable || isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                id="password-2"
                type="password"
                label="Password"
                placeholder="••••••••"
                className={cn(
                  "border-gray-200 bg-gray-50 focus:bg-white",
                  errors.password && "border-red-500"
                )}
                disabled={isEditable || isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  disabled={isEditable || isLoading}
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-primary font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isEditable || isLoading}
              className="bg-primary hover:bg-primary/90 shadow-primary/20 w-full rounded-xl py-6 text-lg font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                buttonText
              )}
            </Button>

            <div className="mt-8 rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <Link
                  href={generateLinkHref(
                    "/signup",
                    siteUser,
                    pathname,
                    isEditable,
                    false
                  )}
                  className="text-primary font-bold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
