import {
  extractVideoInfo,
  getVideoEmbedUrl,
  getVideoThumbnail,
} from "@/lib/video-utils";

export interface VideosData {
  component_id?: string;
  component_type: "videos";
  style: "videos-1" | "videos-2" | "videos-3";

  title: string;
  subtitle?: string;
  order?: number;
}

export interface VideosComponentData {
  id: string | number;
  component_id: string;
  component_type: "videos";
  data: VideosData;
  order?: number;
  page?: string;
}

export const defaultVideosData: VideosData = {
  component_type: "videos",
  style: "videos-1",
  title: "Our Videos",
  subtitle: "Watch our latest content and updates",
};

export const DEFAULT_VIDEOS_MAP: Record<VideosData["style"], VideosData> = {
  "videos-1": { ...defaultVideosData, style: "videos-1" },
  "videos-2": { ...defaultVideosData, style: "videos-2" },
  "videos-3": { ...defaultVideosData, style: "videos-3" },
};

// Re-export utilities for backward compatibility or convenience
export { extractVideoInfo, getVideoEmbedUrl, getVideoThumbnail };

// Deprecated exports for backward compatibility during migration
export const extractYouTubeVideoId = (url: string) => extractVideoInfo(url).id;
export const getYouTubeThumbnail = (videoId: string, quality?: string) =>
  getVideoThumbnail("youtube", videoId) || "";
export const getYouTubeEmbedUrl = (
  videoId: string,
  autoplay?: boolean,
  mute?: boolean
) => getVideoEmbedUrl("youtube", videoId, "") || "";
