import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Nepdora",
  description: "Create a new password for your Nepdora account",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ uid?: string; token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const uid = params.uid || "";
  const token = params.token || "";

  // If uid or token is missing, show an error message
  if (!uid || !token) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-3 text-2xl font-semibold text-gray-900">
              Invalid Reset Link
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              The password reset link is invalid or incomplete. Please request a
              new one.
            </p>
            <a
              href="/admin/forgot-password"
              className="bg-primary hover:bg-primary inline-block rounded-lg px-6 py-3 text-sm font-medium text-white"
            >
              Request New Reset Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm uid={uid} token={token} />;
}
