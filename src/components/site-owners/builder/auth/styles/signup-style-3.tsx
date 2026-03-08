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
import { signupSchema, SignupFormValues } from "@/schemas/customer/signup.form";
import { useAuth } from "@/hooks/customer/use-auth";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface SignupStyle3Props {
  data: AuthFormData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AuthFormData>) => void;
}

export const SignupStyle3: React.FC<SignupStyle3Props> = ({
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
  const { signup, isLoading } = useAuth();
  const { data: localData, handleTextUpdate } = useBuilderLogic(data, onUpdate);
  const [error, setError] = useState<string | null>(null);

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
    setError: setFieldError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formData: SignupFormValues) => {
    if (isEditable) return;

    try {
      setError(null);
      await signup(formData);
    } catch (err: any) {
      console.error("Signup style 3 error:", err);
      const errorData = err.response?.data?.error;

      if (errorData?.params?.field_errors) {
        Object.entries(errorData.params.field_errors).forEach(
          ([field, messages]) => {
            setFieldError(field as any, {
              type: "manual",
              message: (messages as string[])[0],
            });
          }
        );
      } else {
        setError(
          errorData?.message || "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex min-h-[700px] w-full items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full max-w-md md:w-1/2">
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-10 text-center">
              <EditableText
                as="h2"
                value={title}
                onChange={handleTextUpdate("title")}
                isEditable={isEditable}
                className="text-4xl font-extrabold tracking-tight text-gray-900"
              />
              <EditableText
                as="p"
                value={subtitle}
                onChange={handleTextUpdate("subtitle")}
                isEditable={isEditable}
                className="mt-3 text-lg text-gray-500"
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    id="fname-3"
                    type="text"
                    label="First Name"
                    className={cn(
                      "focus:border-primary h-12 border-gray-200",
                      errors.first_name && "border-red-500"
                    )}
                    disabled={isEditable || isLoading}
                    {...register("first_name")}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    id="lname-3"
                    type="text"
                    label="Last Name"
                    className={cn(
                      "focus:border-primary h-12 border-gray-200",
                      errors.last_name && "border-red-500"
                    )}
                    disabled={isEditable || isLoading}
                    {...register("last_name")}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  id="email-signup-3"
                  type="email"
                  label="Email"
                  className={cn(
                    "focus:border-primary h-12 border-gray-200",
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
                  id="phone-signup-3"
                  type="tel"
                  label="Phone"
                  className={cn(
                    "focus:border-primary h-12 border-gray-200",
                    errors.phone && "border-red-500"
                  )}
                  disabled={isEditable || isLoading}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="pass-signup-3"
                  type="password"
                  label="Password"
                  className={cn(
                    "focus:border-primary h-12 border-gray-200",
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

              <div>
                <Input
                  id="confirm-pass-signup-3"
                  type="password"
                  label="Confirm Password"
                  className={cn(
                    "focus:border-primary h-12 border-gray-200",
                    errors.confirmPassword && "border-red-500"
                  )}
                  disabled={isEditable || isLoading}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isEditable || isLoading}
                  className="h-14 w-full rounded-2xl text-lg font-bold shadow-xl transition-all hover:opacity-90 hover:shadow-2xl active:scale-[0.99]"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.body,
                    boxShadow: `0 20px 25px -5px ${theme.colors.primary}40, 0 8px 10px -6px ${theme.colors.primary}40`,
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      Registering...
                    </div>
                  ) : (
                    buttonText
                  )}
                </Button>
              </div>

              <div className="mt-8 text-center">
                <p className="font-medium text-gray-500">
                  Already a member?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      /* Link handling is already done in generateLinkHref */
                    }}
                    style={{
                      color: theme.colors.primary,
                    }}
                    className="font-bold hover:underline"
                  >
                    <Link
                      href={generateLinkHref(
                        "/login",
                        siteUser,
                        pathname,
                        isEditable,
                        false
                      )}
                    >
                      Log in
                    </Link>
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden w-full flex-col items-center justify-center p-8 md:flex md:w-1/2">
          <div className="relative w-full max-w-md">
            <EditableImage
              src={imageUrl || ""}
              alt={imageAlt || "Signup image"}
              onImageChange={handleImageUpdate}
              onAltChange={handleAltUpdate}
              isEditable={isEditable}
              className="h-auto w-full rounded-2xl drop-shadow-2xl"
              width={800}
              height={800}
              placeholder={{
                width: 800,
                height: 800,
                text: "Click to set signup image",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
