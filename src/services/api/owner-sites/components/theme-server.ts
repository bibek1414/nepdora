import { cache } from "react";
import { useThemeApi } from "./theme";
import { GetThemeResponse } from "@/types/owner-site/components/theme";
import { getTenantDomain } from "@/config/site";

export const getCachedThemes = cache(
  async (siteUser: string): Promise<GetThemeResponse> => {
    return await useThemeApi.getThemes("preview", {
      next: {
        revalidate: 300,
        tags: [`tenant:${siteUser}:theme:preview`],
      },
    });
  }
);

export const getCachedThemesPublished = cache(
  async (siteUser: string): Promise<GetThemeResponse> => {
    return await useThemeApi.getThemesPublished({
      next: {
        revalidate: 300,
        tags: [`tenant:${siteUser}:theme`],
      },
    });
  }
);

export async function getSmartThemeColors() {
  const tenantDomain = await getTenantDomain();
  if (!tenantDomain)
    return { previewColor: "#4b74f5", publishedColor: "#4b74f5" };

  // Extract siteUser from tenantDomain (e.g., "bibek.nepdora.com" -> "bibek")
  const siteUser = tenantDomain.split(".")[0];

  try {
    const [previewTheme, publishedTheme] = await Promise.all([
      getCachedThemes(siteUser),
      getCachedThemesPublished(siteUser),
    ]);

    const previewColor =
      previewTheme?.data?.[0]?.data?.theme?.colors?.primary || "#4b74f5";
    const publishedColor =
      publishedTheme?.data?.[0]?.data?.theme?.colors?.primary || "#4b74f5";

    return { previewColor, publishedColor };
  } catch (error) {
    console.error("Error fetching smart theme colors:", error);
    return { previewColor: "#4b74f5", publishedColor: "#4b74f5" };
  }
}
