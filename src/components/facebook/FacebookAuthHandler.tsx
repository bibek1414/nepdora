"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useFacebook } from "@/contexts/FacebookContext";

export function FacebookAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshIntegration } = useFacebook();

  useEffect(() => {
    console.log("🎯 [FacebookAuthHandler] Component mounted");

    const handleAuth = async () => {
      try {
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        console.log("🔍 [FacebookAuthHandler] URL parameters:", {
          success,
          error,
          fullUrl: window.location.href,
        });

        // Handle Facebook Login for Business success
        if (success === "facebook_business_connected") {
          console.log(
            "✅ [FacebookAuthHandler] Facebook Business connection successful"
          );

          // CRITICAL FIX: Wait longer and retry multiple times
          // Backend might still be processing the save
          let retryCount = 0;
          const maxRetries = 5;
          const retryDelay = 1500; // 1.5 seconds between retries

          const attemptRefresh = async (): Promise<boolean> => {
            console.log(
              `🔄 [FacebookAuthHandler] Refresh attempt ${retryCount + 1}/${maxRetries}`
            );
            await refreshIntegration();

            // Check if integration was found (you'll need to expose this from context)
            // For now, we'll just retry multiple times
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryCount++;

            return retryCount >= maxRetries;
          };

          // Initial delay before first attempt
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Retry loop
          while (retryCount < maxRetries) {
            const shouldStop = await attemptRefresh();
            if (shouldStop) break;
          }

          toast.success("Successfully connected to Facebook!");

          // Clean URL without reloading the page
          const cleanUrl = window.location.pathname;
          window.history.replaceState(null, "", cleanUrl);

          // Force a page reload to ensure fresh data
          router.refresh();
          return;
        }

        // Handle errors
        if (error) {
          console.error("❌ [FacebookAuthHandler] Connection error:", error);
          toast.error(
            `Facebook connection failed: ${decodeURIComponent(error)}`
          );

          // Clean URL
          const cleanUrl = window.location.pathname;
          window.history.replaceState(null, "", cleanUrl);
          return;
        }
      } catch (error) {
        console.error("❌ [FacebookAuthHandler] Error handling auth:", error);
        toast.error("Failed to complete Facebook connection");
      }
    };

    handleAuth();
  }, [router, searchParams, refreshIntegration]);

  return null;
}
