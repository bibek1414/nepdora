import { getSmartThemeColors } from "@/services/api/owner-sites/components/theme-server";
import { SmartTopLoaderClient } from "./smart-top-loader-client";

/**
 * SmartTopLoader - Server Side Data Fetching
 * This component fetches theme colors on the server to avoid any initial flicker.
 * The path-dependent logic (Preview vs Published) remains in a client-side wrapper.
 */
export default async function SmartTopLoader() {
  try {
    const { previewColor, publishedColor } = await getSmartThemeColors();
    return (
      <SmartTopLoaderClient
        previewColor={previewColor || "#4b74f5"}
        publishedColor={publishedColor || "#4b74f5"}
      />
    );
  } catch (error) {
    console.error("SmartTopLoader error:", error);
    return <SmartTopLoaderClient previewColor="#4b74f5" publishedColor="#4b74f5" />;
  }
}
