import { getApiBaseUrl } from "@/config/site";
const publishSiteApi = async () => {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/publish-all/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // empty payload
    });

    if (!response.ok) {
      throw new Error("Failed to publish site");
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
};

export default publishSiteApi;
