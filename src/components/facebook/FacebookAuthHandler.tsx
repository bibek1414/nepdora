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

          // Wait a bit for the backend to process
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Refresh the integration data
          await refreshIntegration();

          toast.success("Successfully connected to Facebook!");

          // Clean URL without reloading the page
          const cleanUrl = window.location.pathname;
          window.history.replaceState(null, "", cleanUrl);
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

  return null; // This component doesn't render anything
}
