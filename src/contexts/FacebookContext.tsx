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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      if (!appId) {
        throw new Error("Facebook App ID is not configured");
      }

      if (!baseUrl) {
        throw new Error("Base URL is not configured");
      }

      // Construct redirect URI from base URL
      const redirectUri = `${baseUrl}/api/facebook/callback`;

      console.log("Facebook OAuth Config:", {
        appId,
        redirectUri,
        baseUrl,
      });

      const encodedRedirectUri = encodeURIComponent(redirectUri);
      const scope = encodeURIComponent(
        "pages_manage_engagement,pages_messaging,pages_read_engagement,pages_show_list"
      );

      // Use response_type=code for server-side flow (more secure)
      const authUrl = `https://www.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirectUri}&scope=${scope}&response_type=code`;

      console.log("Redirecting to Facebook OAuth...");

      window.location.href = authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error connecting to Facebook:", err);
      setError(errorMessage);
      setIsLoading(false);
      toast.error(`Failed to connect: ${errorMessage}`);
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
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error(`Failed to disconnect: ${errorMessage}`);
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
