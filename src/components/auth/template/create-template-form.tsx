"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  templateAccountSchema,
  TemplateAccountFormValues,
} from "@/schemas/template-account.form";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse, FormErrorState } from "@/types/auth/error.types";
import { createTemplateAccount } from "@/services/auth/api";
import { toast } from "sonner";

export function CreateTemplateAccountForm({
  className,
  onSuccess,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<FormErrorState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm<TemplateAccountFormValues>({
    resolver: zodResolver(templateAccountSchema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const getErrorIcon = (type: FormErrorState["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="mr-2 h-5 w-5" />;
      case "warning":
        return <AlertCircle className="mr-2 h-5 w-5" />;
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

  const onSubmit = async (data: TemplateAccountFormValues) => {
    try {
      setIsLoading(true);
      setFormError(null);
      clearErrors();

      await createTemplateAccount({
        email: data.email,
        password: data.password,
        store_name: data.store_name,
        phone: data.phone,
        template_name: data.template_name,
      });

      toast.success("Template Account Created", {
        description: `Template "${data.template_name}" has been created successfully.`,
      });

      // Reset form
      reset();

      // Call onSuccess callback to close dialog and refresh list
      if (onSuccess) {
        onSuccess();
      }
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
      const templateNameError = AuthErrorHandler.getFieldError(
        "template_name",
        errorResponse
      );

      if (emailError) {
        setError("email", { type: "manual", message: emailError });
      }
      if (storeNameError) {
        setError("store_name", { type: "manual", message: storeNameError });
      }
      if (phoneError) {
        setError("phone", { type: "manual", message: phoneError });
      }
      if (templateNameError) {
        setError("template_name", {
          type: "manual",
          message: templateNameError,
        });
      }

      toast.error("Template Creation Failed", {
        description: parsedError.message,
      });

      console.error("Template account creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof TemplateAccountFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      register(field).onChange(e);
      if (formError) {
        setFormError(null);
      }
      if (errors[field]) {
        clearErrors(field);
      }
    };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {formError && (
        <div
          className={cn(
            "mb-4 flex items-start rounded-lg border p-4 text-sm",
            getErrorStyles(formError.type)
          )}
        >
          {getErrorIcon(formError.type)}
          <div className="flex-1">
            <span>{formError.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Template Account
          </h2>
          <p className="mt-2 text-gray-600">
            Set up a new template with its own account and store.
          </p>
        </div>

        {/* Template Name - New Field */}
        <div>
          <Input
            id="template_name"
            type="text"
            label="Template Name"
            placeholder="e.g. Summer Campaign Template"
            disabled={isLoading}
            className={cn(
              errors.template_name
                ? "border-red-300 focus:ring-red-500"
                : "focus:ring-primary border-gray-300"
            )}
            {...register("template_name")}
            onChange={handleInputChange("template_name")}
          />
          {errors.template_name && (
            <p className="mt-2 flex items-center text-sm font-medium text-red-500">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.template_name.message}
            </p>
          )}
        </div>

        {/* Store Name */}
        <div>
          <Input
            id="store_name"
            type="text"
            label="Store Name"
            placeholder="Enter store name for this template"
            disabled={isLoading}
            className={cn(
              errors.store_name
                ? "border-red-300 focus:ring-red-500"
                : "focus:ring-primary border-gray-300"
            )}
            {...register("store_name")}
            onChange={handleInputChange("store_name")}
          />
          {errors.store_name && (
            <p className="mt-2 flex items-center text-sm font-medium text-red-500">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.store_name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="template@example.com"
            autoComplete="email"
            disabled={isLoading}
            className={cn(
              errors.email
                ? "border-red-300 focus:ring-red-500"
                : "focus:ring-primary border-gray-300"
            )}
            {...register("email")}
            onChange={handleInputChange("email")}
          />
          {errors.email && (
            <p className="mt-2 flex items-center text-sm font-medium text-red-500">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="1234567890"
            disabled={isLoading}
            className={cn(
              errors.phone
                ? "border-red-300 focus:ring-red-500"
                : "focus:ring-primary border-gray-300"
            )}
            {...register("phone")}
            onChange={handleInputChange("phone")}
          />
          {errors.phone && (
            <p className="mt-2 flex items-center text-sm font-medium text-red-500">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={isLoading}
            className={cn(
              errors.password
                ? "border-red-300 focus:ring-red-500"
                : "focus:ring-primary border-gray-300"
            )}
            {...register("password")}
            onChange={handleInputChange("password")}
          />
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
                  password.length >= 8 ? "text-green-600" : "text-gray-500"
                )}
              >
                <CheckCircle
                  className={cn(
                    "mr-1 h-3 w-3",
                    password.length >= 8 ? "text-green-600" : "text-gray-400"
                  )}
                />
                At least 8 characters
              </div>
              <div
                className={cn(
                  "flex items-center",
                  /[a-z]/.test(password) ? "text-green-600" : "text-gray-500"
                )}
              >
                <CheckCircle
                  className={cn(
                    "mr-1 h-3 w-3",
                    /[a-z]/.test(password) ? "text-green-600" : "text-gray-400"
                  )}
                />
                One lowercase letter
              </div>
              <div
                className={cn(
                  "flex items-center",
                  /[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"
                )}
              >
                <CheckCircle
                  className={cn(
                    "mr-1 h-3 w-3",
                    /[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"
                  )}
                />
                One uppercase letter
              </div>
              <div
                className={cn(
                  "flex items-center",
                  /[0-9]/.test(password) ? "text-green-600" : "text-gray-500"
                )}
              >
                <CheckCircle
                  className={cn(
                    "mr-1 h-3 w-3",
                    /[0-9]/.test(password) ? "text-green-600" : "text-gray-400"
                  )}
                />
                One number
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={isLoading}
            className={cn(
              errors.confirmPassword
                ? "border-red-300 focus:ring-red-500"
                : "focus:ring-primary border-gray-300"
            )}
            {...register("confirmPassword")}
            onChange={handleInputChange("confirmPassword")}
          />
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

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none",
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-primary hover:bg-primary/90 focus:ring-primary"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                Creating Template Account...
              </div>
            ) : (
              "Create Template Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
