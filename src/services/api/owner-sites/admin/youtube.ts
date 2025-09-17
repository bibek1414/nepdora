import { getApiBaseUrl } from "@/config/site";
import {
  YouTubeVideo,
  YouTubeVideos,
  CreateYouTubeVideoData,
  UpdateYouTubeVideoData,
} from "@/types/owner-site/admin/youtube";

export const youtubeAPI = {
  // Get all videos
  getVideos: async (): Promise<YouTubeVideos> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/youtube/`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube videos: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },

  // Create new video
  createVideo: async (data: CreateYouTubeVideoData): Promise<YouTubeVideo> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/youtube/`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create YouTube video: ${response.status}`);
    }

    const video = await response.json();
    return video;
  },

  // Update video
  updateVideo: async (
    id: number,
    data: UpdateYouTubeVideoData
  ): Promise<YouTubeVideo> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/youtube/${id}/`);

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update YouTube video: ${response.status}`);
    }

    const video = await response.json();
    return video;
  },

  // Delete video
  deleteVideo: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/youtube/${id}/`);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete YouTube video: ${response.status}`);
    }
  },
};
