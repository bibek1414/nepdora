import { NextResponse } from "next/server";
import axios from "axios";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";

export async function GET(request: Request) {
  function parseHashParams(hash: string): Record<string, string> {
    return hash
      .substring(1)
      .split("&")
      .reduce((acc: Record<string, string>, item) => {
        const [key, value] = item.split("=");
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {});
  }

  const { searchParams, hash } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  if (hash) {
    const hashParams = parseHashParams(hash);
    if (hashParams.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback?` +
          `access_token=${encodeURIComponent(hashParams.access_token)}` +
          `&expires_in=${hashParams.expires_in || ""}` +
          `&data_access_expiration_time=${
            hashParams.data_access_expiration_time || ""
          }`
      );
    }
  }

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

  if (code) {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.get(
        `https://graph.facebook.com/${
          process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
        }/oauth/access_token`,
        {
          params: {
            client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback`,
            code,
          },
        }
      );

      const { access_token: userAccessToken } = tokenResponse.data;

      // Get user's pages
      const pagesResponse = await axios.get(
        `https://graph.facebook.com/${
          process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
        }/me/accounts`,
        {
          params: { access_token: userAccessToken },
        }
      );

      interface FacebookPage {
        id: string;
        access_token: string;
        name: string;
      }

      const pages = pagesResponse.data.data as FacebookPage[];

      if (pages.length === 0) {
        throw new Error("No Facebook pages found for this account");
      }

      const firstPage = pages[0];

      const integrationData = {
        user_token: userAccessToken,
        app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
        app_secret: process.env.FACEBOOK_APP_SECRET || "",
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

      const integrations = await existingResponse.json();

      // Create or update integration
      if (integrations.length > 0) {
        // Update existing integration (PATCH)
        const existingId = integrations[0].id;
        await fetch(`${API_BASE_URL}/api/facebook/${existingId}/`, {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(integrationData),
        });
      } else {
        // Create new integration (POST)
        await fetch(`${API_BASE_URL}/api/facebook/`, {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(integrationData),
        });
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?success=facebook_connected`
      );
    } catch (error: unknown) {
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

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/settings/integrations?error=${encodeURIComponent(
      "Invalid request parameters"
    )}`
  );
}
