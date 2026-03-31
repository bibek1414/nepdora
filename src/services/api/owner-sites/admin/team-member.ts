import { apiFetch } from "@/lib/api-client";
import { getApiBaseUrl } from "@/config/site";
import { Members, TEAM } from "@/types/owner-site/admin/team-member";
import { createHeaders, createHeadersTokenOnly } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

export const teamAPI = {
  getTeamMembers: async (): Promise<Members> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/team-member/`);

      const response = await apiFetch(url.toString(), {
        method: "GET",
        headers: createHeaders(),
      });

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch team members");
    }
  },

  createTeamMember: async (memberData: FormData): Promise<TEAM> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/team-member/`);

      const response = await apiFetch(url.toString(), {
        method: "POST",
        body: memberData,
        headers: createHeadersTokenOnly(),
      }).catch(fetchError => {
        // Handle network errors
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create team member error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create team member");
    }
  },

  updateTeamMember: async (id: number, memberData: FormData): Promise<TEAM> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/team-member/${id}/`);

      const response = await apiFetch(url.toString(), {
        method: "PATCH",
        body: memberData,
        headers: createHeadersTokenOnly(),
      }).catch(fetchError => {
        // Handle network errors
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update team member error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update team member");
    }
  },

  deleteTeamMember: async (id: number): Promise<void> => {
    try {
      const BASE_API_URL = getApiBaseUrl();
      const url = new URL(`${BASE_API_URL}/api/team-member/${id}/`);

      const response = await apiFetch(url.toString(), {
        method: "DELETE",
        headers: createHeaders(),
      }).catch(fetchError => {
        // Handle network errors
        console.error("Network error:", fetchError);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      });

      if (!response) {
        throw new Error("No response from server");
      }

      await handleApiError(response);
    } catch (error) {
      console.error("Delete team member error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete team member");
    }
  },
};
