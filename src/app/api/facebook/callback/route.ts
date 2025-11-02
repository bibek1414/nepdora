import { NextResponse } from "next/server";
import axios from "axios";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors from Facebook
  if (error) {
    console.error("Facebook OAuth error:", {
      error,
      errorReason,
      errorDescription,
    });
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(
        errorDescription || "Failed to connect to Facebook"
      )}`
    );
  }

  // Handle successful OAuth callback with code
  if (code) {
    try {
      // Log the configuration for debugging
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback`;

      console.log("Facebook OAuth Config:", {
        appId: appId ? "SET" : "MISSING",
        appSecret: appSecret ? "SET" : "MISSING",
        redirectUri,
        codeLength: code.length,
      });

      // Validate required environment variables
      if (!appId || !appSecret) {
        throw new Error("Facebook App ID or App Secret is not configured");
      }

      // Exchange code for access token
      const tokenResponse = await axios.get(
        `https://graph.facebook.com/${
          process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
        }/oauth/access_token`,
        {
          params: {
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
          },
        }
      );

      const { access_token: userAccessToken } = tokenResponse.data;

      if (!userAccessToken) {
        throw new Error("No access token received from Facebook");
      }

      console.log("Successfully obtained user access token");

      // Get user's pages
      const pagesResponse = await axios.get(
        `https://graph.facebook.com/${
          process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
        }/me/accounts`,
        {
          params: {
            access_token: userAccessToken,
            fields: "id,name,access_token,tasks",
          },
        }
      );

      interface FacebookPage {
        id: string;
        access_token: string;
        name: string;
        tasks?: string[];
      }

      const pages = pagesResponse.data.data as FacebookPage[];

      if (pages.length === 0) {
        throw new Error(
          "No Facebook pages found for this account. Please make sure you have a Facebook Page."
        );
      }

      console.log(`Found ${pages.length} Facebook page(s)`);

      const firstPage = pages[0];

      // Verify page has necessary permissions
      if (firstPage.tasks && !firstPage.tasks.includes("MANAGE")) {
        console.warn("Page may not have MANAGE permission");
      }

      const integrationData = {
        user_token: userAccessToken,
        app_id: appId,
        app_secret: appSecret,
        page_id: firstPage.id,
        page_access_token: firstPage.access_token,
        page_name: firstPage.name,
        is_enabled: true,
      };

      // Check if integration exists
      const API_BASE_URL = getApiBaseUrl();
      const existingResponse = await fetch(`${API_BASE_URL}/api/facebook/`, {
        method: "GET",
        headers: createHeaders(),
      });

      if (!existingResponse.ok) {
        throw new Error(
          `Failed to check existing integrations: ${existingResponse.status}`
        );
      }

      const integrations = await existingResponse.json();

      // Create or update integration
      let saveResponse;
      if (integrations.length > 0) {
        // Update existing integration (PATCH)
        const existingId = integrations[0].id;
        console.log(`Updating existing integration ${existingId}`);
        saveResponse = await fetch(
          `${API_BASE_URL}/api/facebook/${existingId}/`,
          {
            method: "PATCH",
            headers: createHeaders(),
            body: JSON.stringify(integrationData),
          }
        );
      } else {
        // Create new integration (POST)
        console.log("Creating new integration");
        saveResponse = await fetch(`${API_BASE_URL}/api/facebook/`, {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(integrationData),
        });
      }

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error("Failed to save integration:", errorData);
        throw new Error(
          `Failed to save integration: ${JSON.stringify(errorData)}`
        );
      }

      console.log("✅ Facebook integration saved successfully");

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?success=facebook_connected`
      );
    } catch (error: unknown) {
      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            params: error.config?.params,
          },
        });

        const fbError = error.response?.data?.error;
        const errorMessage = fbError?.message || error.message;

        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(
            `Facebook API Error: ${errorMessage}`
          )}`
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during Facebook OAuth callback:", error);

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
  }

  // No code or error parameter
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(
      "Invalid callback - missing authorization code"
    )}`
  );
}
