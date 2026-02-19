"use client";

import { ProfileForm } from "@/components/customer/profile/ProfileForm";
import { useProfile } from "@/hooks/customer/use-customer-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

export const ProfilePageContent = () => {
  const { data: profile, isLoading } = useProfile();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
    },
  };
  return (
    <div className="bg-card border-border/50 rounded-3xl border p-6 md:p-10">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Profile Sidebar/Summary */}
        <div className="border-border/50 border-b pb-8 md:w-1/3 md:border-r md:border-b-0 md:pr-10 md:pb-0">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 shadow-inner">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                <span
                  style={{
                    color: theme.colors.primary,
                  }}
                  className="text-primary text-5xl font-black italic"
                >
                  {profile?.first_name?.[0]?.toUpperCase() || "S"}
                </span>
              )}
            </div>
            <h2 className="text-foreground text-xl font-bold">
              {isLoading ? (
                <Skeleton className="mx-auto h-7 w-32" />
              ) : (
                `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
                "Account Settings"
              )}
            </h2>
            <p className="mt-1 text-sm">
              {isLoading ? (
                <Skeleton className="mx-auto mt-2 h-4 w-40" />
              ) : (
                profile?.email || "Keep your profile up to date"
              )}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:w-2/3">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};
