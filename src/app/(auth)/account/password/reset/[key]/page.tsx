import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";
import type { Metadata } from "next";
import { use } from "react";
export const metadata: Metadata = {
  title: "Reset Password | Nepdora",
  description: "Create a new password for your Nepdora account",
};

interface ResetPasswordPageProps {
  params: Promise<{ key: string }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { key } = use(params);
  const verificationKey = key;

  return <ResetPasswordForm resetKey={verificationKey} />;
}
