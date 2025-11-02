// app/api/facebook/callback/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state"); // JSON string with tenant and redirect_uri
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Parse state to get tenant and the original redirect_uri used in OAuth request
  let state: string = "";
  let redirectUri = `${requestUrl.origin}${requestUrl.pathname}`;

  try {
    if (stateParam) {
      const stateData = JSON.parse(decodeURIComponent(stateParam));
      state = stateData.tenant || "";
      redirectUri = stateData.redirect_uri || redirectUri;
    }
  } catch (e) {
    // Fallback for old format where state was just tenant slug
    state = stateParam || "";
    redirectUri = `${requestUrl.origin}${requestUrl.pathname}`;
  }

  // Get base URL for redirects (use request origin if env var not set)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;

  console.log("Callback redirect_uri:", redirectUri);
  console.log("Callback request URL:", request.url);
  console.log("State parsed:", { state, redirectUri });

  if (error) {
    console.error("Facebook OAuth error:", { error, errorDescription });
    const tenantPath = state ? `${state}/` : "";
    return NextResponse.redirect(
      `${baseUrl}/${tenantPath}admin/settings/integrations?error=${encodeURIComponent(
        errorDescription || "Facebook connection failed"
      )}`
    );
  }

  if (!code) {
    const tenantPath = state ? `${state}/` : "";
    return NextResponse.redirect(
      `${baseUrl}/${tenantPath}admin/settings/integrations?error=${encodeURIComponent(
        "Missing code from Facebook OAuth"
      )}`
    );
  }

  try {
    // Exchange code for user access token
    // Use the exact redirect_uri that matches the OAuth request
    console.log("Exchanging code with redirect_uri:", redirectUri);
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/oauth/access_token`,
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: redirectUri,
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
      { params: { access_token: userAccessToken } }
    );

    const pages = pagesResponse.data.data;

    if (!pages || pages.length === 0) {
      throw new Error("No Facebook pages found for this account");
    }

    const firstPage = pages[0];

    const integrationData = {
      tenant: state, // store tenant info
      user_token: userAccessToken,
      app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
      app_secret: process.env.FACEBOOK_APP_SECRET || "",
      page_id: firstPage.id,
      page_access_token: firstPage.access_token,
      page_name: firstPage.name,
      is_enabled: true,
    };

    // Save integration in backend
    const API_BASE_URL = getApiBaseUrl();
    const existingResponse = await fetch(
      `${API_BASE_URL}/api/facebook/?tenant=${state}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );
    const integrations = await existingResponse.json();

    if (integrations.length > 0) {
      const existingId = integrations[0].id;
      await fetch(`${API_BASE_URL}/api/facebook/${existingId}/`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(integrationData),
      });
    } else {
      await fetch(`${API_BASE_URL}/api/facebook/`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(integrationData),
      });
    }

    // Redirect to admin Messenger page
    return NextResponse.redirect(
      `${baseUrl}/admin/messenger?success=facebook_connected`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(
      "Facebook OAuth callback failed:",
      err.response?.data || err.message || err
    );
    const tenantPath = state ? `${state}/` : "";
    return NextResponse.redirect(
      `${baseUrl}/${tenantPath}admin/settings/integrations?error=${encodeURIComponent(
        err.response?.data?.error?.message ||
          err.message ||
          "Facebook connection failed"
      )}`
    );
  }
}
