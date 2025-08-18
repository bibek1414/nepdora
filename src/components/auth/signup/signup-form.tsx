"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signupSchema, SignupFormValues } from "@/schemas/signup.form";

export function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { signup, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data);
      // The signup function will now handle the redirect to /signup/verify
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-card flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full">
        <div className="bg-white rounded-lg p-8 ">
          <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create New Account
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter your details to create an account.
                </p>
              </div>

              <div>
                <Input
                  id="store_name"
                  type="text"
                  label="Store Name"
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-primary"
                  {...register("store_name")}
                />
                {errors.store_name && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.store_name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  autoComplete="email"
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-primary"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-primary"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
                {password && password.length < 8 && !errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-primary"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {confirmPassword &&
                  password &&
                  password !== confirmPassword &&
                  !errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary focus:ring-primary"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:text-primary"
                  >
                    Login
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary font-medium transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary font-medium transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
