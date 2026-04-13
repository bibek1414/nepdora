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
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface LoginStyle3Props {
  data: AuthFormData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AuthFormData>) => void;
}

export const LoginStyle3: React.FC<LoginStyle3Props> = ({
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

  const {
    title = "",
    subtitle = "",
    buttonText = "",
    imageUrl = "",
    imageAlt = "",
  } = localData;

  const handleImageUpdate = (newUrl: string, newAlt?: string) => {
    if (onUpdate) {
      onUpdate({
        imageUrl: newUrl,
        ...(newAlt ? { imageAlt: newAlt } : {}),
      });
    }
  };

  const handleAltUpdate = (newAlt: string) => {
    if (onUpdate) {
      onUpdate({ imageAlt: newAlt });
    }
  };

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
      console.error("Login style 3 error:", err);
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
    <div className="flex min-h-[600px] w-full items-center justify-center p-4 sm:p-8">
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full max-w-md rounded-2xl border md:w-1/2">
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 text-center">
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
                  id="email-3"
                  type="email"
                  label="Email"
                  placeholder="hello@example.com"
                  className={cn(
                    "border-gray-200 focus:bg-white",
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
                  id="password-3"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  className={cn(
                    "border-gray-200 focus:bg-white",
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
                disabled={isEditable || isLoading}
                className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                  fontFamily: theme.fonts.body,
                  boxShadow: `0 10px 15px -3px ${theme.colors.primary}33`,
                }}
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

              <div className="mt-8 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                  New here?{" "}
                  <Link
                    href={generateLinkHref(
                      "/admin/signup",
                      siteUser,
                      pathname,
                      isEditable,
                      false
                    )}
                    className="font-bold hover:underline"
                    style={{ color: theme.colors.primary }}
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="ml-auto hidden w-full flex-col items-center justify-center p-8 md:flex md:w-1/2">
          <div className="relative w-full max-w-sm">
            <EditableImage
              src={imageUrl || ""}
              alt={imageAlt || "Login image"}
              onImageChange={handleImageUpdate}
              onAltChange={handleAltUpdate}
              isEditable={isEditable}
              className="h-auto w-full rounded-2xl drop-shadow-2xl"
              width={800}
              height={800}
              placeholder={{
                width: 800,
                height: 800,
                text: "Click to set login image",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
