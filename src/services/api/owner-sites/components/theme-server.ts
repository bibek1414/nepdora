import { cache } from "react";
import { useThemeApi } from "./theme";
import { GetThemeResponse } from "@/types/owner-site/components/theme";
import { getTenantDomain } from "@/config/site";

export const getCachedThemes = cache(async (): Promise<GetThemeResponse> => {
  return await useThemeApi.getThemes();
});

export const getCachedThemesPublished = cache(
  async (): Promise<GetThemeResponse> => {
    return await useThemeApi.getThemesPublished();
  }
);

export async function getSmartThemeColors() {
  const tenantDomain = await getTenantDomain();
  if (!tenantDomain)
    return { previewColor: "#4b74f5", publishedColor: "#4b74f5" };

  try {
    const [previewTheme, publishedTheme] = await Promise.all([
      getCachedThemes(),
      getCachedThemesPublished(),
    ]);

    const previewColor =
      previewTheme?.data?.[0]?.data?.theme?.colors?.primary || "#4b74f5";
    const publishedColor =
      publishedTheme?.data?.[0]?.data?.theme?.colors?.primary || "#4b74f5";

    return { previewColor, publishedColor };
  } catch (error) {
    return { previewColor: "#4b74f5", publishedColor: "#4b74f5" };
  }
}
