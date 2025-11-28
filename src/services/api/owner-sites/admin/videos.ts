import { getApiBaseUrl } from "@/config/site";
import {
  Video,
  Videos,
  CreateVideoData,
  UpdateVideoData,
} from "@/types/owner-site/admin/videos";

export const videosAPI = {
  // Get all videos
  getVideos: async (): Promise<Videos> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch  videos: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },

  // Create new video
  createVideo: async (data: CreateVideoData): Promise<Video> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create  video: ${response.status}`);
    }

    const video = await response.json();
    return video;
  },

  // Update video
  updateVideo: async (id: number, data: UpdateVideoData): Promise<Video> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/${id}/`);

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update  video: ${response.status}`);
    }

    const video = await response.json();
    return video;
  },

  // Delete video
  deleteVideo: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/${id}/`);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete  video: ${response.status}`);
    }
  },
};
