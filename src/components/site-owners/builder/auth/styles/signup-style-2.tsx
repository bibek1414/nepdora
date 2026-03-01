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

interface SignupStyle2Props {
  data: AuthFormData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<AuthFormData>) => void;
}

export const SignupStyle2: React.FC<SignupStyle2Props> = ({
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
      console.error("Signup style 2 error:", err);
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
    <div className="relative flex min-h-[700px] w-full items-center justify-center overflow-hidden bg-white">
      {/* Decorative Blur Elements */}
      <div className="bg-primary/5 absolute top-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative w-full max-w-sm px-4">
        <div className="mb-10 text-center">
          <div className="bg-primary/10 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl">
            <svg
              className="text-primary h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
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
                id="fname-2"
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
                id="lname-2"
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
              id="email-signup-2"
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
              id="phone-signup-2"
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
              id="pass-signup-2"
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
              id="confirm-pass-signup-2"
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
              className="h-14 w-full rounded-2xl bg-gray-900 text-lg font-bold text-white shadow-xl transition-all hover:bg-black hover:shadow-2xl active:scale-[0.99]"
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
                className="text-primary font-bold hover:underline"
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
  );
};
