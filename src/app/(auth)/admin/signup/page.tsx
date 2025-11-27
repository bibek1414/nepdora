import { SignupForm } from "@/components/auth/signup/signup-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create an Account | Nepdora Signup",
  description:
    "Register your free Nepdora account to access exclusive features, tools, and services.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
