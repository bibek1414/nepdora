"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't need authentication
  const publicPaths = ["/superadmin", "/superadmin/login"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // If it's a public path, render without auth check
    if (isPublicPath) {
      setIsLoading(false);
      setIsAuthenticated(true); // Allow rendering for public paths
      return;
    }

    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem("adminAuthenticated");
        const authTime = localStorage.getItem("adminAuthTime");
        const currentTime = Date.now();
        const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

        const isValidAuth =
          authStatus === "true" &&
          authTime !== null &&
          currentTime - parseInt(authTime) < SESSION_TIMEOUT;

        if (!isValidAuth) {
          // Clear invalid/expired auth
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminAuthTime");
          localStorage.removeItem("adminUser");

          // Redirect to login
          router.replace("/superadmin/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/superadmin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname, isPublicPath]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // For public paths, render without sidebar
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Render the authenticated content
  return <>{children}</>;
}
