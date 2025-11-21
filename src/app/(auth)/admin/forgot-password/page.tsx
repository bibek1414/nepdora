import { ForgotPasswordForm } from "@/components/auth/forgot-password/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Nepdora",
  description: "Reset your Nepdora account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
