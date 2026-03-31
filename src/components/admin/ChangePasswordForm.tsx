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
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      disabled={isPending}
                      className={cn(
                        "h-11 rounded-[12px] border-[#e2e8f0] bg-white px-4 pr-10 text-[13px] transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 focus:outline-none",
                        form.formState.errors.old_password && "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7a91] hover:text-[#0d1117] transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Min 8 characters"
                        disabled={isPending}
                        className={cn(
                          "h-11 rounded-[12px] border-[#e2e8f0] bg-white px-4 pr-10 text-[13px] transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 focus:outline-none",
                          form.formState.errors.new_password && "border-red-300 focus:border-red-500 focus:ring-red-500"
                        )}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7a91] hover:text-[#0d1117] transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  {newPassword && newPassword.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <div className={cn("flex items-center text-[10px] font-semibold uppercase tracking-wider", newPassword.length >= 8 ? "text-green-600" : "text-gray-400")}>
                        <CheckCircle className="mr-1.5 h-3 w-3" />
                        8+ Chars
                      </div>
                      <div className={cn("flex items-center text-[10px] font-semibold uppercase tracking-wider", /[A-Z]/.test(newPassword) ? "text-green-600" : "text-gray-400")}>
                        <CheckCircle className="mr-1.5 h-3 w-3" />
                        Uppercase
                      </div>
                      <div className={cn("flex items-center text-[10px] font-semibold uppercase tracking-wider", /[0-9]/.test(newPassword) ? "text-green-600" : "text-gray-400")}>
                        <CheckCircle className="mr-1.5 h-3 w-3" />
                        Number
                      </div>
                    </div>
                  )}
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat new password"
                        disabled={isPending}
                        className={cn(
                          "h-11 rounded-[12px] border-[#e2e8f0] bg-white px-4 pr-10 text-[13px] transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 focus:outline-none",
                          form.formState.errors.confirmPassword && "border-red-300 focus:border-red-500 focus:ring-red-500"
                        )}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7a91] hover:text-[#0d1117] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 rounded-full bg-blue-600 px-8 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-all min-w-[160px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
