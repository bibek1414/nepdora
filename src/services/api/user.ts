import { getApiBaseUrl } from "@/config/site";
import {
  UserProfile,
  UpdateUserProfile,
  ChangePasswordRequest,
} from "@/types/user";
import { handleApiError } from "@/utils/api-error";

export const userAPI = {
  getProfile: async (accessToken?: string): Promise<UserProfile> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = `${BASE_API_URL}/api/users/me/`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      await handleApiError(response);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Failed to fetch user profile");
    }
  },

  updateProfile: async (
    data: UpdateUserProfile,
    accessToken?: string
  ): Promise<UserProfile> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = `${BASE_API_URL}/api/users/me/`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      });

      await handleApiError(response);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Failed to update user profile");
    }
  },

  changePassword: async (
    data: ChangePasswordRequest,
    accessToken?: string
  ): Promise<any> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = `${BASE_API_URL}/api/change-password/`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      await handleApiError(response);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Failed to change password");
    }
  },
};
