import { LoginForm } from "@/components/auth/login/login-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In to Nepdora | Access Your Dashboard",
  description:
    "Log in securely to your Nepdora account to manage your websites, projects, and tools all in one place.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
