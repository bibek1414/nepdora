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
      const tenantSlug = window.location.hostname.split(".")[0]; // get subdomain
      const data = await useFacebookApi.getFacebookIntegrations({
        tenant: tenantSlug,
      });

      if (data.length > 0) {
        const data: FacebookIntegration[] =
          await useFacebookApi.getFacebookIntegrations({ tenant: tenantSlug });
        const activeIntegration = data.find(
          (i: FacebookIntegration) => i.is_enabled
        );

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

      // Use current origin to ensure redirect_uri matches exactly with callback route
      // The callback route constructs redirect_uri from request.origin + request.pathname
      // So we use window.location.origin to match what the server will receive
      const redirectUri = `${window.location.origin}/api/facebook/callback`;

      console.log("OAuth request redirect_uri:", redirectUri);

      // Pass tenant slug and redirect_uri in state as JSON to ensure exact match
      const tenantSlug = window.location.hostname.split(".")[0];
      const stateData = JSON.stringify({
        tenant: tenantSlug,
        redirect_uri: redirectUri,
      });
      const encodedState = encodeURIComponent(stateData);
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      const scope = encodeURIComponent(
        "pages_manage_engagement,pages_messaging,pages_read_engagement,pages_show_list"
      );

      const authUrl = `https://www.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirectUri}&scope=${scope}&response_type=code&state=${encodedState}`;

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
      if (!integration?.id) throw new Error("No integration found");

      setIsLoading(true);
      await useFacebookApi.updateFacebookIntegration(String(integration.id), {
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
  if (!context)
    throw new Error("useFacebook must be used within a FacebookProvider");
  return context;
};
