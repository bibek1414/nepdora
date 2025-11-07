"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  adminEmail: string;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  adminEmail: "",
  isAuthenticated: false,
});

// Export this hook for child components to use
export const useAuthContext = () => useContext(AuthContext);

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/superadmin", "/superadmin/login"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (isPublicPath) {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
          setAdminEmail(data.user?.email || "");
        } else {
          router.replace("/superadmin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/superadmin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname, isPublicPath]);

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

  if (!isAuthenticated) {
    return null;
  }

  // Provide auth context to all child components
  return (
    <AuthContext.Provider value={{ adminEmail, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
