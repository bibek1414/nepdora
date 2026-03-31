import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import {
  Video,
  Videos,
  CreateVideoData,
  UpdateVideoData,
} from "@/types/owner-site/admin/videos";
import { createHeaders, createHeadersTokenOnly } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const videosAPI = {
  // Get all videos
  getVideos: async (): Promise<Videos> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/`);

    const response = await apiFetch(url.toString(), {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();
    return data;
  },

  // Create new video
  createVideo: async (data: CreateVideoData): Promise<Video> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/`);

    const response = await apiFetch(url.toString(), {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const video = await response.json();
    return video;
  },

  // Update video
  updateVideo: async (id: number, data: UpdateVideoData): Promise<Video> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/${id}/`);

    const response = await apiFetch(url.toString(), {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    await handleApiError(response);
    const video = await response.json();
    return video;
  },

  // Delete video
  deleteVideo: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/videos/${id}/`);

    const response = await apiFetch(url.toString(), {
      method: "DELETE",
      headers: createHeaders(),
    });

    await handleApiError(response);
  },
};
