"use client";

import React from "react";
import { AuthFormData } from "@/types/owner-site/components/auth-form-map";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
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
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface LoginStyle1Props {
  data: AuthFormData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AuthFormData>) => void;
}

export const LoginStyle1: React.FC<LoginStyle1Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
    },
  };

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
      console.error("Login style 1 error:", err);
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
    <div className="bg-background flex min-h-[600px] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="grid gap-6">
            <div className="mb-8 text-center">
              <EditableText
                as="h3"
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {loginError && (
                <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              <div>
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  className={cn(
                    "focus:ring-primary border-gray-300",
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
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  className={cn(
                    "focus:ring-primary border-gray-300",
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

              <Button
                type="submit"
                variant="default"
                disabled={isEditable || isLoading}
                className="w-full rounded-lg px-4 py-3 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                  fontFamily: theme.fonts.body,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  buttonText
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href={generateLinkHref(
                  "/signup",
                  siteUser,
                  pathname,
                  isEditable,
                  false
                )}
                className="cursor-pointer font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
