import { getApiBaseUrl } from "@/config/site";

const API_BASE_URL = getApiBaseUrl();
export const ResetUi = async () => {
  const response = await fetch(`${API_BASE_URL}/api/reset-ui/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
