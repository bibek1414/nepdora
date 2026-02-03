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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter old password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
