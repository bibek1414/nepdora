"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useFacebookApi } from "@/services/api/owner-sites/admin/facebook";
import { FacebookIntegration } from "@/types/owner-site/admin/facebook";
import { toast } from "sonner";

interface FacebookContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  integration: FacebookIntegration | null;
  connectFacebook: () => Promise<void>;
  disconnectFacebook: () => Promise<void>;
  refreshIntegration: () => Promise<void>;
}

const FacebookContext = createContext<FacebookContextType | undefined>(
  undefined
);

export const FacebookProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [integration, setIntegration] = useState<FacebookIntegration | null>(
    null
  );

  const refreshIntegration = async () => {
    try {
      const data = await useFacebookApi.getFacebookIntegrations();

      if (data.length > 0) {
        const activeIntegration = data.find(i => i.is_enabled);
        setIntegration(activeIntegration || data[0]);
        setIsConnected(!!activeIntegration);
      } else {
        setIntegration(null);
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Error fetching Facebook integration:", err);
      setError("Failed to fetch integration data");
    }
  };

  useEffect(() => {
    refreshIntegration();
  }, []);

  const connectFacebook = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

      // Support both NEXT_PUBLIC_FACEBOOK_REDIRECT_URI and NEXT_PUBLIC_BASE_URL
      let redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

      if (!redirectUri) {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        redirectUri = `${baseUrl}/api/facebook/callback`;
      }

      console.log("Facebook OAuth Config:", {
        appId,
        redirectUri,
      });

      const encodedRedirectUri = encodeURIComponent(redirectUri);
      const scope = encodeURIComponent(
        "pages_manage_engagement,pages_messaging,pages_read_engagement,pages_show_list"
      );

      // Use response_type=code for server-side flow (more secure)
      const authUrl = `https://www.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirectUri}&scope=${scope}&response_type=code`;

      console.log("Redirecting to:", authUrl);

      window.location.href = authUrl;
    } catch (err) {
      console.error("Error connecting to Facebook:", err);
      setError("Failed to connect to Facebook");
      setIsLoading(false);
      toast.error("Failed to connect to Facebook");
    }
  };

  const disconnectFacebook = async () => {
    try {
      if (!integration?.id) {
        throw new Error("No integration found");
      }

      setIsLoading(true);
      await useFacebookApi.updateFacebookIntegration(integration.id, {
        is_enabled: false,
      });

      setIntegration(null);
      setIsConnected(false);
      toast.success("Disconnected from Facebook");
    } catch (err) {
      console.error("Error disconnecting from Facebook:", err);
      setError("Failed to disconnect from Facebook");
      toast.error("Failed to disconnect from Facebook");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FacebookContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        integration,
        connectFacebook,
        disconnectFacebook,
        refreshIntegration,
      }}
    >
      {children}
    </FacebookContext.Provider>
  );
};

export const useFacebook = (): FacebookContextType => {
  const context = useContext(FacebookContext);
  if (context === undefined) {
    throw new Error("useFacebook must be used within a FacebookProvider");
  }
  return context;
};
