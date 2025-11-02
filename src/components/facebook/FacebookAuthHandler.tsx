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
        console.log("🔍 [FacebookAuthHandler] Checking URL parameters...");

        // Log all search params
        const allParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          allParams[key] =
            key.includes("token") || key.includes("secret")
              ? `${value.substring(0, 10)}...`
              : value;
        });

        console.log("📋 [FacebookAuthHandler] All URL params:", allParams);

        // Check for success parameter from callback
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        console.log("📊 [FacebookAuthHandler] Auth status params:", {
          success,
          error,
        });

        if (
          success === "facebook_connected" ||
          success === "facebook_page_connected"
        ) {
          console.log(
            "✅ [FacebookAuthHandler] Success callback detected:",
            success
          );

          // Refresh integration data from backend
          console.log(
            "🔄 [FacebookAuthHandler] Refreshing integration from backend..."
          );
          await refreshIntegration();

          console.log("✅ [FacebookAuthHandler] Integration refreshed");
          toast.success("Successfully connected to Facebook!");

          // Clean up URL
          console.log("🧹 [FacebookAuthHandler] Cleaning up URL...");
          router.replace("/admin/settings/integrations");
          return;
        }

        if (error) {
          console.error("❌ [FacebookAuthHandler] Error in callback:", {
            error: decodeURIComponent(error),
          });
          toast.error(`Connection failed: ${decodeURIComponent(error)}`);

          // Clean up URL
          console.log(
            "🧹 [FacebookAuthHandler] Cleaning up URL after error..."
          );
          router.replace("/admin/settings/integrations");
          return;
        }

        // Legacy handling for client-side flow (if still used)
        const accessToken = searchParams.get("access_token");
        const expiresIn = searchParams.get("expires_in");
        const pageAccessToken = searchParams.get("page_access_token");
        const pageId = searchParams.get("page_id");

        console.log("🔍 [FacebookAuthHandler] Checking legacy params:", {
          hasAccessToken: !!accessToken,
          hasExpiresIn: !!expiresIn,
          hasPageAccessToken: !!pageAccessToken,
          hasPageId: !!pageId,
        });

        if (accessToken) {
          console.log(
            "⚠️ [FacebookAuthHandler] Legacy client-side flow detected"
          );
          console.log(
            "💾 [FacebookAuthHandler] Storing tokens in localStorage..."
          );

          localStorage.setItem("facebook_access_token", accessToken);
          console.log("✅ [FacebookAuthHandler] User access token stored");

          if (expiresIn) {
            const expiryTime = new Date();
            expiryTime.setSeconds(
              expiryTime.getSeconds() + parseInt(expiresIn)
            );
            localStorage.setItem(
              "facebook_token_expiry",
              expiryTime.toISOString()
            );
            console.log(
              "✅ [FacebookAuthHandler] Token expiry stored:",
              expiryTime.toISOString()
            );
          }

          console.log("↗️ [FacebookAuthHandler] Redirecting to messenger...");
          router.replace("/admin/messenger?success=facebook_connected");
          toast.success("Successfully connected to Facebook!");
        } else if (pageAccessToken && pageId) {
          console.log(
            "⚠️ [FacebookAuthHandler] Legacy page token flow detected"
          );
          console.log(
            "💾 [FacebookAuthHandler] Storing page tokens in localStorage..."
          );

          localStorage.setItem("facebook_page_token", pageAccessToken);
          localStorage.setItem("facebook_page_id", pageId);

          console.log("✅ [FacebookAuthHandler] Page tokens stored:", {
            pageId: pageId.substring(0, 10) + "...",
          });

          console.log("↗️ [FacebookAuthHandler] Redirecting to messenger...");
          router.replace("/admin/messenger?success=facebook_page_connected");
          toast.success("Successfully connected to Facebook Page!");
        } else {
          console.log(
            "ℹ️ [FacebookAuthHandler] No auth parameters found, normal page load"
          );
        }
      } catch (error) {
        console.error("❌ [FacebookAuthHandler] Error handling auth:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        toast.error("Failed to complete Facebook connection");
        router.replace("/admin/settings/integrations?error=auth_failed");
      }
    };

    handleAuth();
  }, [router, searchParams, refreshIntegration]);

  console.log("🎨 [FacebookAuthHandler] Rendering loading state...");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg">Completing Facebook connection...</span>
    </div>
  );
}
