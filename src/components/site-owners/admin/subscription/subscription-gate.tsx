"use client";

import { useSubscription } from "@/contexts/SubscriptionContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { isActive, isLoading } = useSubscription();
  const { user, isLoading: authLoading } = useAuth();

  // If the user is a super admin, we bypass the subscription check
  const isSuperAdmin = user?.role === "super_admin";

  // While loading, we show a skeleton to avoid a flash of content
  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <div className="w-full max-w-6xl space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="col-span-1 h-[80vh]" />
            <Skeleton className="col-span-3 h-[80vh]" />
          </div>
        </div>
      </div>
    );
  }

  // If not active and not a super admin, we return null.
  // The SubscriptionBlocker (rendered in the parent) will show the modal.
  if (!isActive && !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
