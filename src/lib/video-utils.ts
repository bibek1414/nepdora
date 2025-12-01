export type VideoPlatform =
  | "youtube"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "other";

export interface VideoInfo {
  platform: VideoPlatform;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

export const extractVideoInfo = (url: string): VideoInfo => {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  // TikTok patterns
  const tiktokPatterns = [
    /tiktok\.com\/@[\w.]+\/video\/(\d+)/,
    /data-video-id="(\d+)"/,
    /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
  ];

  // Instagram patterns
  const instagramPatterns = [
    /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
    /instagr\.am\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
  ];

  // Facebook patterns
  const facebookPatterns = [
    /facebook\.com\/reel\/(\d+)/,
    /facebook\.com\/share\/r\/([a-zA-Z0-9]+)/,
    /facebook\.com\/.*\/videos\/(\d+)/,
    /fb\.watch\/([a-zA-Z0-9_-]+)/,
    /facebook\.com\/watch\/?\?v=(\d+)/,
  ];

  // Check YouTube
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        platform: "youtube",
        id: match[1],
        embedUrl: getVideoEmbedUrl("youtube", match[1], url),
        thumbnailUrl: getVideoThumbnail("youtube", match[1]),
      };
    }
  }

  // Check TikTok
  for (const pattern of tiktokPatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        platform: "tiktok",
        id: match[1],
        embedUrl: getVideoEmbedUrl("tiktok", match[1], url),
        thumbnailUrl: getVideoThumbnail("tiktok", match[1]),
      };
    }
  }

  // Check Instagram
  for (const pattern of instagramPatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        platform: "instagram",
        id: match[1],
        embedUrl: getVideoEmbedUrl("instagram", match[1], url),
        thumbnailUrl: getVideoThumbnail("instagram", match[1]),
      };
    }
  }

  // Check Facebook
  for (const pattern of facebookPatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        platform: "facebook",
        id: match[1],
        embedUrl: getVideoEmbedUrl("facebook", match[1], url),
        thumbnailUrl: getVideoThumbnail("facebook", match[1]),
      };
    }
  }

  return {
    platform: "other",
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
  };
};

export const getVideoEmbedUrl = (
  platform: VideoPlatform,
  id: string | null,
  originalUrl: string
): string | null => {
  if (!id) return null;

  switch (platform) {
    case "youtube":
      return `https://www.youtube.com/embed/${id}?rel=0`;
    case "facebook":
      if (originalUrl.includes("/share/r/")) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalUrl)}&show_text=false`;
      }
      if (originalUrl.includes("/reel/")) {
        return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${id}&show_text=false`;
      }
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${id}&show_text=false`;
    case "instagram":
      return `https://www.instagram.com/p/${id}/embed`;
    case "tiktok":
      return `https://www.tiktok.com/video/${id}`;
    default:
      return null;
  }
};

export const getVideoThumbnail = (
  platform: VideoPlatform,
  id: string | null
): string | null => {
  if (!id) return null;

  switch (platform) {
    case "youtube":
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    case "facebook":
    case "instagram":
    case "tiktok":
      return null; // UI should show a placeholder or platform icon
    default:
      return null;
  }
};
