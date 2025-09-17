export interface YouTubeData {
  component_id?: string;
  component_type: "youtube";
  style: "grid" | "carousel" | "playlist";
  title: string;
  subtitle?: string;
  order?: number;
}

export interface YouTubeComponentData {
  id: string | number;
  component_id: string;
  component_type: "youtube";
  data: YouTubeData;
  order?: number;
  page?: string;
}

export const defaultYouTubeData: YouTubeData = {
  component_type: "youtube",
  style: "grid",
  title: "Our Videos",
  subtitle: "Watch our latest content and updates",
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

// Generate YouTube thumbnail URL
export const getYouTubeThumbnail = (
  videoId: string,
  quality: "default" | "medium" | "high" | "standard" | "maxres" = "high"
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality === "high" ? "hqdefault" : quality === "medium" ? "mqdefault" : quality === "maxres" ? "maxresdefault" : quality === "standard" ? "sddefault" : "default"}.jpg`;
};

// Generate YouTube embed URL
export const getYouTubeEmbedUrl = (
  videoId: string,
  autoplay = false,
  mute = false
): string => {
  const params = new URLSearchParams();
  if (autoplay) params.append("autoplay", "1");
  if (mute) params.append("mute", "1");
  params.append("rel", "0"); // Don't show related videos

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};
