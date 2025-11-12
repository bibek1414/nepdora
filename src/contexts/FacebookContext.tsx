"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FacebookIntegration } from "@/types/owner-site/admin/facebook";
import { toast } from "sonner";
import {
  getFacebookIntegrations,
  deleteFacebookIntegration,
} from "@/lib/actions/facebook-actions";

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
    console.log("🔄 [FacebookContext] Starting refreshIntegration...");

    try {
      console.log(
        "📡 [FacebookContext] Calling Server Action to fetch integrations..."
      );
      const data = await getFacebookIntegrations();

      console.log("📊 [FacebookContext] Server Action Response:", {
        totalIntegrations: data.length,
        rawData: JSON.stringify(data, null, 2),
      });

      if (data.length > 0) {
        const activeIntegration = data.find(i => i.is_enabled);

        console.log("🔍 [FacebookContext] Processing integrations:", {
          totalFound: data.length,
          activeIntegration: activeIntegration
            ? {
                id: activeIntegration.id,
                page_id: activeIntegration.page_id,
                page_name: activeIntegration.page_name,
                is_enabled: activeIntegration.is_enabled,
                created_at: activeIntegration.created_at,
                updated_at: activeIntegration.updated_at,
              }
            : "None",
          fallbackIntegration: data[0]
            ? {
                id: data[0].id,
                page_id: data[0].page_id,
                page_name: data[0].page_name,
                is_enabled: data[0].is_enabled,
              }
            : "None",
        });

        const selectedIntegration = activeIntegration || data[0];
        setIntegration(selectedIntegration);
        setIsConnected(!!activeIntegration);

        console.log("✅ [FacebookContext] State updated:", {
          isConnected: !!activeIntegration,
          integrationSet: !!selectedIntegration,
          integrationId: selectedIntegration?.id,
        });
      } else {
        console.log("⚠️ [FacebookContext] No integrations found");
        setIntegration(null);
        setIsConnected(false);
      }
    } catch (err) {
      console.error("❌ [FacebookContext] Error fetching integration:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError("Failed to fetch integration data");
    }
  };

  useEffect(() => {
    console.log(
      "🚀 [FacebookContext] Provider mounted, fetching initial data..."
    );
    refreshIntegration();
  }, []);

  const connectFacebook = async () => {
    console.log("🔵 [FacebookContext] connectFacebook called");
    setIsLoading(true);
    setError(null);

    try {
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      console.log("🔍 [FacebookContext] Environment variables:", {
        appId: appId ? `${appId.substring(0, 10)}...` : "MISSING",
        baseUrl: baseUrl || "MISSING",
      });

      if (!appId) {
        throw new Error("Facebook App ID is not configured");
      }

      if (!baseUrl) {
        throw new Error("Base URL is not configured");
      }

      // Use Facebook Login for Business with config_id
      const configId = process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID;

      if (!configId) {
        throw new Error("Facebook Configuration ID is not configured");
      }

      const redirectUri = `${baseUrl}/api/facebook/callback`;
      const encodedRedirectUri = encodeURIComponent(redirectUri);

      // For Business Integration System User tokens (recommended for automation)
      const authUrl = `https://www.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirectUri}&config_id=${configId}&response_type=code&override_default_response_type=true`;

      console.log(
        "🌐 [FacebookContext] Facebook Login for Business Configuration:",
        {
          appId,
          configId,
          redirectUri,
          authUrlLength: authUrl.length,
          authUrlPreview: authUrl.substring(0, 100) + "...",
        }
      );

      console.log(
        "↗️ [FacebookContext] Redirecting to Facebook Login for Business..."
      );
      window.location.href = authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ [FacebookContext] Error connecting to Facebook:", {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(errorMessage);
      setIsLoading(false);
      toast.error(`Failed to connect: ${errorMessage}`);
    }
  };

  const disconnectFacebook = async () => {
    console.log("🔴 [FacebookContext] disconnectFacebook called");

    try {
      if (!integration?.id) {
        console.error(
          "❌ [FacebookContext] No integration found to disconnect"
        );
        throw new Error("No integration found");
      }

      console.log("🔍 [FacebookContext] Current integration:", {
        id: integration.id,
        page_id: integration.page_id,
        page_name: integration.page_name,
        is_enabled: integration.is_enabled,
      });

      setIsLoading(true);

      console.log(
        "📡 [FacebookContext] Calling Server Action to delete integration..."
      );
      const response = await deleteFacebookIntegration(integration.id);

      console.log("✅ [FacebookContext] Server Action Response:", {
        response: JSON.stringify(response, null, 2),
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      setIntegration(null);
      setIsConnected(false);

      console.log("✅ [FacebookContext] State updated: disconnected");
      toast.success("Disconnected from Facebook");
    } catch (err) {
      console.error("❌ [FacebookContext] Error disconnecting:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error(`Failed to disconnect: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      console.log("🏁 [FacebookContext] disconnectFacebook completed");
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
