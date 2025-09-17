export interface YouTubeVideo {
  id: number;
  url: string;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type YouTubeVideos = YouTubeVideo[];

export interface CreateYouTubeVideoData {
  url: string;
  title?: string;
  description?: string;
}

export interface UpdateYouTubeVideoData {
  url?: string;
  title?: string;
  description?: string;
}
