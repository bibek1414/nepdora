"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Handles OAuth redirect success/error messages and displays toasts
 * This component should be rendered at the top of the Facebook admin page
 */
export function FacebookToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "facebook_connected") {
      // Show success toast
      toast.success("Facebook page connected successfully!");

      // Clean up URL without causing a re-render
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.hash = ""; // Also remove the #_=_ that Facebook adds
      router.replace(url.pathname + url.search, { scroll: false });
    }

    if (error) {
      // Show error toast
      toast.error(decodeURIComponent(error));

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      url.hash = "";
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}
