import { VideoPlatform } from "@/lib/video-utils";

export interface Video {
  id: number;
  url: string;
  title?: string;
  description?: string;
  platform?: VideoPlatform;
  created_at: string;
  updated_at: string;
}

export type Videos = Video[];

export interface CreateVideoData {
  url: string;
  title?: string;
  description?: string;
}

export interface UpdateVideoData {
  url?: string;
  title?: string;
  description?: string;
}
