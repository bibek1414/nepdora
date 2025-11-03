"use client";

import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useFacebook } from "@/contexts/FacebookContext";

interface FacebookLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  text?: string;
}

export function FacebookLoginButton({
  className = "",
  variant = "default",
  size = "default",
  text = "Connect to Facebook",
}: FacebookLoginButtonProps) {
  const {
    connectFacebook,
    disconnectFacebook,
    isLoading,
    isConnected,
    integration,
  } = useFacebook();

  console.log("🎨 [FacebookLoginButton] Render state:", {
    isConnected,
    isLoading,
    hasIntegration: !!integration,
    integrationId: integration?.id,
    integrationPageName: integration?.page_name,
    integrationEnabled: integration?.is_enabled,
  });

  const handleClick = async () => {
    console.log("🖱️ [FacebookLoginButton] Button clicked:", {
      currentState: isConnected ? "connected" : "disconnected",
      action: isConnected ? "disconnect" : "connect",
    });

    try {
      if (isConnected) {
        await disconnectFacebook();
      } else {
        await connectFacebook();
      }
    } catch (error) {
      console.error("❌ [FacebookLoginButton] Error during action:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const buttonText = isLoading
    ? "Processing..."
    : isConnected
      ? "Disconnect Facebook"
      : text;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Facebook className="h-4 w-4" />
      {buttonText}
    </Button>
  );
}
