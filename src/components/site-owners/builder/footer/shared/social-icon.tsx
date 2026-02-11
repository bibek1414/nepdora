import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Globe,
  LucideIcon,
} from "lucide-react";

interface SocialIconProps {
  platform: string;
  className?: string;
}

// Map platform names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  LinkedIn: Linkedin, // Handle alternative casing/spelling
  Youtube,
  YouTube: Youtube,
  Tiktok: Music2, // Using Music2 for TikTok as per existing patterns
  TikTok: Music2,
  Music2,
  Globe,
};

export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  className,
}) => {
  // normalize platform name to title case or match keys
  // For now, simple lookup. We can make it case-insensitive if needed.

  // Try direct match
  let Icon = iconMap[platform];

  // Try case-insensitive match if not found directly
  if (!Icon) {
    const lowerPlatform = platform.toLowerCase();
    const foundKey = Object.keys(iconMap).find(
      k => k.toLowerCase() === lowerPlatform
    );
    if (foundKey) {
      Icon = iconMap[foundKey];
    }
  }

  // Default to Globe or just render nothing/null if strictly required,
  // but Globe is a safe generic web icon.
  if (!Icon) {
    return <Globe className={className} />;
  }

  return <Icon className={className} />;
};
