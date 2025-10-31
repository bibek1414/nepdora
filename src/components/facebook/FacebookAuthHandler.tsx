"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function FacebookAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check for access token in URL parameters
        const accessToken = searchParams.get("access_token");
        const expiresIn = searchParams.get("expires_in");
        const pageAccessToken = searchParams.get("page_access_token");
        const pageId = searchParams.get("page_id");

        if (accessToken) {
          // Store the user access token
          localStorage.setItem("facebook_access_token", accessToken);

          if (expiresIn) {
            const expiryTime = new Date();
            expiryTime.setSeconds(
              expiryTime.getSeconds() + parseInt(expiresIn)
            );
            localStorage.setItem(
              "facebook_token_expiry",
              expiryTime.toISOString()
            );
          }

          // Redirect to clean up the URL
          router.replace("/admin/messenger?success=facebook_connected");
          toast.success("Successfully connected to Facebook!");
        }
        // Handle page access token from server-side flow
        else if (pageAccessToken && pageId) {
          localStorage.setItem("facebook_page_token", pageAccessToken);
          localStorage.setItem("facebook_page_id", pageId);

          // Redirect to clean up the URL
          router.replace("/admin/messenger?success=facebook_page_connected");
          toast.success("Successfully connected to Facebook Page!");
        }
      } catch (error) {
        console.error("Error handling Facebook auth:", error);
        toast.error("Failed to complete Facebook connection");
        router.replace("/admin/settings/integrations?error=auth_failed");
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg">Completing Facebook connection...</span>
    </div>
  );
}
