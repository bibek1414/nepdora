"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/customer/use-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupSchema, SignupFormValues } from "@/schemas/customer/signup.form";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

export function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { signup, isLoading } = useAuth();
  const router = useRouter();
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

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
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  // Handle login link click to redirect to preview login page
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Extract siteUser from the current pathname
    const pathSegments = window.location.pathname.split("/");
    const siteUser = pathSegments[2] || "guest";

    router.push(`/preview/${siteUser}/login`);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        <div className="rounded-lg bg-white p-8">
          <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create New Account
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter your details to create an account.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="first_name"
                    type="text"
                    label="First Name"
                    disabled={isLoading}
                    className="focus:ring-primary border-gray-300"
                    {...register("first_name")}
                  />
                  {errors.first_name && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    id="last_name"
                    type="text"
                    label="Last Name"
                    disabled={isLoading}
                    className="focus:ring-primary border-gray-300"
                    {...register("last_name")}
                  />
                  {errors.last_name && (
                    <p className="mt-2 text-sm font-medium text-red-500">
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
                  autoComplete="email"
                  disabled={isLoading}
                  className="focus:ring-primary border-gray-300"
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
                  className="focus:ring-primary border-gray-300"
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
                  id="address"
                  type="text"
                  label="Address"
                  disabled={isLoading}
                  className="focus:ring-primary border-gray-300"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.address.message}
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
                  className="focus:ring-primary border-gray-300"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
                {password && password.length < 8 && !errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-600">
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
                  className="focus:ring-primary border-gray-300"
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
                    <p className="mt-2 text-sm font-medium text-red-600">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="default"
                  className={cn(
                    "w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none",
                    isLoading
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-primary hover:bg-primary focus:ring-primary"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
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
                  <button
                    onClick={handleLoginClick}
                    className="text-primary hover:text-primary cursor-pointer font-medium underline"
                    style={{
                      color: theme.colors.primary,
                    }}
                  >
                    Login
                  </button>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary font-medium transition-colors duration-200"
                    style={{
                      color: theme.colors.primary,
                    }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary font-medium transition-colors duration-200"
                    style={{
                      color: theme.colors.primary,
                    }}
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
