"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface FacebookContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectFacebook: () => Promise<void>;
  disconnectFacebook: () => void;
}

const FacebookContext = createContext<FacebookContextType | undefined>(
  undefined
);

export const FacebookProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already connected to Facebook
    const checkConnection = async () => {
      try {
        // Here you would typically check your backend to see if the user has connected their Facebook account
        // For now, we'll just check if the page access token exists in localStorage
        const token = localStorage.getItem("facebook_page_token");
        setIsConnected(!!token);
      } catch (err) {
        console.error("Error checking Facebook connection:", err);
        setError("Failed to check Facebook connection");
      }
    };

    checkConnection();
  }, []);

  const connectFacebook = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Redirect to Facebook OAuth URL
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || ""
      );
      const scope = encodeURIComponent(
        "pages_manage_engagement,pages_messaging,pages_read_engagement"
      );

      const authUrl = `https://www.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v17.0"}/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

      // Store the current URL to redirect back after authentication
      localStorage.setItem("returnUrl", window.location.pathname);

      // Redirect to Facebook OAuth
      window.location.href = authUrl;
    } catch (err) {
      console.error("Error connecting to Facebook:", err);
      setError("Failed to connect to Facebook");
      setIsLoading(false);
    }
  };

  const disconnectFacebook = async () => {
    try {
      // Here you would typically call your backend to revoke the token
      // For now, we'll just remove it from localStorage
      localStorage.removeItem("facebook_page_token");
      setIsConnected(false);
    } catch (err) {
      console.error("Error disconnecting from Facebook:", err);
      setError("Failed to disconnect from Facebook");
    }
  };

  return (
    <FacebookContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        connectFacebook,
        disconnectFacebook,
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
