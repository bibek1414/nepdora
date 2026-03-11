import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getAuthToken } from "@/utils/auth";
import { handleApiError } from "@/utils/api-error";
import { Skill, CreateSkill } from "@/types/owner-site/admin/skill";

export const skillApi = {
  getSkills: async (): Promise<Skill[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/skills/`, {
      method: "GET",
      headers: createHeaders(),
    });

    await handleApiError(response);
    const data = await response.json();
    return data.results || data;
  },

  createSkill: async (skillData: CreateSkill): Promise<Skill> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/skills/`, {
      method: "POST",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(skillData),
    });

    await handleApiError(response);
    return response.json();
  },

  updateSkill: async (id: number, skillData: CreateSkill): Promise<Skill> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/skills/${id}/`, {
      method: "PATCH",
      headers: {
        ...createHeaders(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(skillData),
    });

    await handleApiError(response);
    return response.json();
  },

  deleteSkill: async (id: number): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/skills/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    await handleApiError(response);
  },
};
