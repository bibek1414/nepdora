"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import OnboardingModal from "@/components/on-boarding/admin/on-boarding-component";

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated, redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // If onboarding is already complete AND not first login, redirect to admin
      if (user.is_onboarding_complete && !user.first_login) {
        router.push("/admin");
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingModal
      userData={{
        storeName: user.store_name || "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
      }}
      isOverlay={false}
    />
  );
}
