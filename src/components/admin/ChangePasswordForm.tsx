"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/schemas/change-password";
import { useChangePassword } from "@/hooks/use-user";
import { Card, CardContent } from "@/components/ui/card";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("new_password");

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword(
      {
        old_password: data.old_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          form.reset();
        },
        onError: error => {
          toast.error(
            error instanceof Error ? error.message : "Failed to change password"
          );
        },
      }
    );
  };

  return (
    <Card className="mx-auto w-full max-w-md border-none shadow-none">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="relative">
                    <FloatingInput
                      id="old_password"
                      type={showOldPassword ? "text" : "password"}
                      disabled={isPending}
                      className={cn(
                        "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                        form.formState.errors.old_password &&
                          "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...field}
                    />
                    <FloatingLabel htmlFor="old_password">
                      <Lock className="mr-2 h-4 w-4" />
                      Old Password
                    </FloatingLabel>
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="text-muted-foreground absolute top-1/2 right-3 z-10 -translate-y-1/2"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.old_password && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {form.formState.errors.old_password.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="relative">
                    <FloatingInput
                      id="new_password"
                      type={showNewPassword ? "text" : "password"}
                      disabled={isPending}
                      className={cn(
                        "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                        form.formState.errors.new_password &&
                          "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...field}
                    />
                    <FloatingLabel htmlFor="new_password">
                      <Lock className="mr-2 h-4 w-4" />
                      New Password
                    </FloatingLabel>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-muted-foreground absolute top-1/2 right-3 z-10 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {newPassword && newPassword.length > 0 && (
                    <div className="mt-2 space-y-1 text-xs">
                      <div
                        className={cn(
                          "flex items-center",
                          newPassword.length >= 8
                            ? "text-green-600"
                            : "text-gray-500"
                        )}
                      >
                        <CheckCircle
                          className={cn(
                            "mr-1 h-3 w-3",
                            newPassword.length >= 8
                              ? "text-green-600"
                              : "text-gray-400"
                          )}
                        />
                        At least 8 characters
                      </div>
                      <div
                        className={cn(
                          "flex items-center",
                          /[a-z]/.test(newPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                        )}
                      >
                        <CheckCircle
                          className={cn(
                            "mr-1 h-3 w-3",
                            /[a-z]/.test(newPassword)
                              ? "text-green-600"
                              : "text-gray-400"
                          )}
                        />
                        One lowercase letter
                      </div>
                      <div
                        className={cn(
                          "flex items-center",
                          /[A-Z]/.test(newPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                        )}
                      >
                        <CheckCircle
                          className={cn(
                            "mr-1 h-3 w-3",
                            /[A-Z]/.test(newPassword)
                              ? "text-green-600"
                              : "text-gray-400"
                          )}
                        />
                        One uppercase letter
                      </div>
                      <div
                        className={cn(
                          "flex items-center",
                          /[0-9]/.test(newPassword)
                            ? "text-green-600"
                            : "text-gray-500"
                        )}
                      >
                        <CheckCircle
                          className={cn(
                            "mr-1 h-3 w-3",
                            /[0-9]/.test(newPassword)
                              ? "text-green-600"
                              : "text-gray-400"
                          )}
                        />
                        One number
                      </div>
                    </div>
                  )}
                  {form.formState.errors.new_password && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {form.formState.errors.new_password.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="relative">
                    <FloatingInput
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isPending}
                      className={cn(
                        "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                        form.formState.errors.confirmPassword &&
                          "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...field}
                    />
                    <FloatingLabel htmlFor="confirmPassword">
                      <Lock className="mr-2 h-4 w-4" />
                      Confirm New Password
                    </FloatingLabel>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-muted-foreground absolute top-1/2 right-3 z-10 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "flex w-full justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none",
                isPending ? "cursor-not-allowed opacity-70" : ""
              )}
            >
              {isPending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
