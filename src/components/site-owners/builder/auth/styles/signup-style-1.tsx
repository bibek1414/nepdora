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
import { signupSchema, SignupFormValues } from "@/schemas/customer/signup.form";
import { useAuth } from "@/hooks/customer/use-auth";
import { useState } from "react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";

interface SignupStyle1Props {
  data: AuthFormData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AuthFormData>) => void;
}

export const SignupStyle1: React.FC<SignupStyle1Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const pathname = usePathname();
  const { signup, isLoading } = useAuth();
  const { data: localData, handleTextUpdate } = useBuilderLogic(data, onUpdate);
  const [error, setError] = useState<string | null>(null);

  const { title = "", subtitle = "", buttonText = "" } = localData;

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
      console.error("Signup style 1 error:", err);
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
    <div className="bg-background flex min-h-[700px] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="grid gap-6">
            <div className="mb-8 text-center">
              <EditableText
                as="h2"
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
              {error && (
                <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="first_name"
                    type="text"
                    label="First Name"
                    className={cn(
                      "focus:ring-primary border-gray-300",
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
                    id="last_name"
                    type="text"
                    label="Last Name"
                    className={cn(
                      "focus:ring-primary border-gray-300",
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
                  id="email"
                  type="email"
                  label="Email Address"
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
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  className={cn(
                    "focus:ring-primary border-gray-300",
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
                  id="password"
                  type="password"
                  label="Password"
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

              <div>
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  className={cn(
                    "focus:ring-primary border-gray-300",
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

              <Button
                type="submit"
                variant="default"
                disabled={isEditable || isLoading}
                className="bg-primary hover:bg-primary/90 w-full rounded-lg px-4 py-3 font-medium text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Signing up...
                  </div>
                ) : (
                  buttonText
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href={generateLinkHref(
                    "/login",
                    siteUser,
                    pathname,
                    isEditable,
                    false
                  )}
                  className="text-primary cursor-pointer font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
