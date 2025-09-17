import { getApiBaseUrl } from "@/config/site";
import { Members, TEAM } from "@/types/owner-site/admin/team-member";

export const teamAPI = {
  getTeamMembers: async (): Promise<Members> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/team-member/`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  createTeamMember: async (memberData: FormData): Promise<TEAM> => {
    const BASE_API_URL = getApiBaseUrl();

    const url = new URL(`${BASE_API_URL}/api/team-member/`);
    const response = await fetch(url.toString(), {
      method: "POST",

      body: memberData,
    });
    if (!response.ok) {
      throw new Error(`Failed to create team member: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  updateTeamMember: async (id: number, memberData: FormData): Promise<TEAM> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/team-member/${id}/`);
    const response = await fetch(url.toString(), {
      method: "PUT",

      body: memberData,
    });
    if (!response.ok) {
      throw new Error(`Failed to update team member: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  deleteTeamMember: async (id: number): Promise<void> => {
    const BASE_API_URL = getApiBaseUrl();
    const url = new URL(`${BASE_API_URL}/api/team-member/${id}/`);
    const response = await fetch(url.toString(), {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete team member: ${response.status}`);
    }
  },
};
