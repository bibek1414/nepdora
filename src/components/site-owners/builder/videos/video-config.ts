import { Youtube, Instagram, Facebook, VideoIcon } from "lucide-react";

export const DIMENSIONS = {
  CARD: {
    WIDTH: 288,
    HEIGHT: 512,
  },
  EMBED: {
    WIDTH: 288,
    HEIGHT: 512,
  },
  THUMBNAIL: {
    WIDTH: 288,
    HEIGHT: 512,
  },
} as const;

export const PLATFORM_CONFIG = {
  youtube: {
    icon: Youtube,
    color: "bg-red-600",
    gradient: "from-red-600/20 to-red-600/5",
    textColor: "text-red-400",
    name: "YouTube",
  },
  instagram: {
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
    gradient: "from-purple-600/20 to-pink-600/5",
    textColor: "text-pink-400",
    name: "Instagram",
  },
  facebook: {
    icon: Facebook,
    color: "bg-blue-600",
    gradient: "from-blue-600/20 to-blue-600/5",
    textColor: "text-blue-400",
    name: "Facebook",
  },
  tiktok: {
    icon: VideoIcon,
    color: "bg-black",
    gradient: "from-gray-900/20 to-gray-800/5",
    textColor: "text-gray-400",
    name: "TikTok",
  },
  other: {
    icon: VideoIcon,
    color: "bg-gray-600",
    gradient: "from-gray-600/20 to-gray-600/5",
    textColor: "text-gray-400",
    name: "Video",
  },
} as const;
