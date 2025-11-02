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
  const { connectFacebook, disconnectFacebook, isLoading, isConnected } =
    useFacebook();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      onClick={isConnected ? disconnectFacebook : connectFacebook}
      disabled={isLoading}
    >
      <Facebook className="h-4 w-4" />
      {isLoading ? "Processing..." : isConnected ? "Disconnect Facebook" : text}
    </Button>
  );
}
