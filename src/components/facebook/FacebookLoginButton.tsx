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
  text = "Continue with Facebook",
}: FacebookLoginButtonProps) {
  const { connectFacebook, isLoading } = useFacebook();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      onClick={connectFacebook}
      disabled={isLoading}
    >
      <Facebook className="h-4 w-4" />
      {text}
    </Button>
  );
}
