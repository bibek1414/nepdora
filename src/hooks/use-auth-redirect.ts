import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function useAuthRedirect(redirectTo: string = "/admin") {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're done loading and user is authenticated
    if (!isLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  // Return loading state so component can show a loader if needed
  return { isRedirecting: !isLoading && !!user, isLoading };
}
