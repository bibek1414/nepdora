import { NextResponse } from "next/server";
import axios from "axios";
import { getApiBaseUrl } from "@/config/site";
import { getServerUser } from "@/hooks/use-jwt-server";
import { cookies } from "next/headers";

// Helper to create authenticated headers for server-side requests
function createServerHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Helper to subscribe to webhook for a Facebook page
async function subscribeToWebhook(pageId: string, pageAccessToken: string) {
  try {
    console.log(
      `[Webhook Subscribe] Starting subscription for page: ${pageId}`
    );

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: pageAccessToken }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(`[Webhook Subscribe] SUCCESS for page ${pageId}:`, data);
    } else {
      console.error(`[Webhook Subscribe] FAILED for page ${pageId}:`, data);
    }

    return data;
  } catch (error) {
    console.error(`[Webhook Subscribe] ERROR for page ${pageId}:`, error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");
  const configId = searchParams.get("config_id");

  // Handle OAuth errors from Facebook
  if (error) {
    console.error("[Facebook OAuth] Error received:", {
      error,
      errorReason,
      errorDescription,
    });

    const user = await getServerUser();
    const baseUrl = user?.subDomain
      ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
      : process.env.NEXT_PUBLIC_BASE_URL;

    return NextResponse.redirect(
      `${baseUrl}/admin/facebook?error=${encodeURIComponent(
        errorDescription || "Facebook authentication failed"
      )}`
    );
  }

  // Handle successful OAuth callback with code
  if (code) {
    try {
      console.log("[Facebook OAuth] Authorization code received");

      const user = await getServerUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("[Facebook OAuth] User authenticated:", user.id);

      // Get JWT token from cookies
      const cookieStore = await cookies();
      const authToken = cookieStore.get("authToken")?.value;

      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback`;

      if (!appId || !appSecret) {
        throw new Error("Facebook App ID or App Secret is not configured");
      }

      // Exchange authorization code for access token
      const tokenUrl = `https://graph.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/oauth/access_token`;

      console.log("[Facebook OAuth] Exchanging code for access token");

      const tokenResponse = await axios.get(tokenUrl, {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      const { access_token: accessToken, token_type: tokenType } =
        tokenResponse.data;

      if (!accessToken) {
        throw new Error("No access token received from Facebook");
      }

      console.log(
        "[Facebook OAuth] Access token received, type:",
        tokenType || "user"
      );

      // For Business Integration System User tokens, we need to handle differently
      if (tokenType === "SystemUser" || configId) {
        await handleBusinessIntegrationToken(accessToken, user, authToken);
      } else {
        await handleUserAccessToken(accessToken, user, authToken);
      }

      // Build success redirect URL
      const redirectBaseUrl = user.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      const successUrl = `${redirectBaseUrl}/admin/facebook?success=facebook_connected`;

      console.log("[Facebook OAuth] Integration completed successfully");

      return NextResponse.redirect(successUrl);
    } catch (error: unknown) {
      console.error("[Facebook OAuth] Error during callback:", error);

      const user = await getServerUser();
      const redirectBaseUrl = user?.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";

      return NextResponse.redirect(
        `${redirectBaseUrl}/admin/facebook?error=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
  }

  // No code or error parameter
  console.error(
    "[Facebook OAuth] Invalid callback - missing authorization code"
  );

  const user = await getServerUser();
  const redirectBaseUrl = user?.subDomain
    ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
    : process.env.NEXT_PUBLIC_BASE_URL;

  return NextResponse.redirect(
    `${redirectBaseUrl}/admin/facebook?error=${encodeURIComponent(
      "Invalid callback - missing authorization code"
    )}`
  );
}

/**
 * Handle Business Integration System User Access Token
 */
async function handleBusinessIntegrationToken(
  accessToken: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  authToken: string
) {
  try {
    console.log("[Business Integration] Fetching client business ID");

    // Get client business ID from the token
    const meResponse = await axios.get(
      `https://graph.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"}/me`,
      {
        params: {
          fields: "client_business_id",
          access_token: accessToken,
        },
      }
    );

    const clientBusinessId = meResponse.data.client_business_id;

    if (!clientBusinessId) {
      throw new Error("No client business ID found in token");
    }

    console.log("[Business Integration] Client Business ID:", clientBusinessId);

    // Get business pages and assets
    const businessResponse = await axios.get(
      `https://graph.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"}/${clientBusinessId}/owned_pages`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,access_token,tasks",
        },
      }
    );

    const pages = businessResponse.data.data;
    console.log(`[Business Integration] Found ${pages.length} pages`);

    // Save integration to your backend
    await saveBusinessIntegration({
      accessToken,
      clientBusinessId,
      pages,
      user,
      authToken,
    });
  } catch (error) {
    console.error("[Business Integration] Error:", error);
    throw error;
  }
}

/**
 * Handle User Access Token (standard flow)
 */
async function handleUserAccessToken(
  accessToken: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  authToken: string
) {
  try {
    console.log("[User Integration] Fetching user pages");

    // Get user's pages
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"}/me/accounts`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,access_token,tasks",
        },
      }
    );

    const pages = pagesResponse.data.data;
    console.log(`[User Integration] Found ${pages.length} pages`);

    // Save integration to your backend
    await saveUserIntegration({
      accessToken,
      pages,
      user,
      authToken,
    });
  } catch (error) {
    console.error("[User Integration] Error:", error);
    throw error;
  }
}

/**
 * Save Business Integration to Backend
 */
async function saveBusinessIntegration({
  accessToken,
  clientBusinessId,
  pages,
  user,
  authToken,
}: {
  accessToken: string;
  clientBusinessId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  authToken: string;
}) {
  const API_BASE_URL = getApiBaseUrl();
  const backendUrl = user.subDomain
    ? API_BASE_URL.replace(
        "nepdora.baliyoventures.com",
        `${user.subDomain}.nepdora.baliyoventures.com`
      )
    : API_BASE_URL;

  const authenticatedHeaders = createServerHeaders(authToken);

  console.log(`[Save Business Integration] Processing ${pages.length} pages`);

  for (const page of pages) {
    try {
      console.log(
        `[Save Business Integration] Processing page: ${page.name} (${page.id})`
      );

      const integrationData = {
        user_token: accessToken,
        app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        app_secret: process.env.FACEBOOK_APP_SECRET,
        page_id: page.id,
        page_access_token: page.access_token,
        page_name: page.name,
        client_business_id: clientBusinessId,
        is_enabled: true,
        token_type: "business_integration",
      };

      // Check if integration exists
      const existingResponse = await fetch(`${backendUrl}/api/facebook/`, {
        method: "GET",
        headers: authenticatedHeaders,
      });

      let existingIntegrations = [];
      if (existingResponse.ok) {
        existingIntegrations = await existingResponse.json();
      }

      const existingIntegration = existingIntegrations.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any) => i.page_id === page.id
      );

      if (existingIntegration) {
        console.log(
          `[Save Business Integration] Updating existing integration for page ${page.id}`
        );
        // Update existing
        await fetch(`${backendUrl}/api/facebook/${existingIntegration.id}/`, {
          method: "PATCH",
          headers: authenticatedHeaders,
          body: JSON.stringify(integrationData),
        });
      } else {
        console.log(
          `[Save Business Integration] Creating new integration for page ${page.id}`
        );
        // Create new
        await fetch(`${backendUrl}/api/facebook/`, {
          method: "POST",
          headers: authenticatedHeaders,
          body: JSON.stringify(integrationData),
        });
      }

      // Subscribe to webhook after saving
      console.log(
        `[Save Business Integration] Subscribing to webhook for page ${page.id}`
      );
      await subscribeToWebhook(page.id, page.access_token);
    } catch (pageError) {
      console.error(
        `[Save Business Integration] Error processing page ${page.id}:`,
        pageError
      );
      // Continue with other pages even if one fails
      continue;
    }
  }

  console.log("[Save Business Integration] Completed processing all pages");
}

/**
 * Save User Integration to Backend
 */
async function saveUserIntegration({
  accessToken,
  pages,
  user,
  authToken,
}: {
  accessToken: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  authToken: string;
}) {
  const API_BASE_URL = getApiBaseUrl();
  const backendUrl = user.subDomain
    ? API_BASE_URL.replace(
        "nepdora.baliyoventures.com",
        `${user.subDomain}.nepdora.baliyoventures.com`
      )
    : API_BASE_URL;

  const authenticatedHeaders = createServerHeaders(authToken);

  console.log(`[Save User Integration] Processing ${pages.length} pages`);

  for (const page of pages) {
    try {
      console.log(
        `[Save User Integration] Processing page: ${page.name} (${page.id})`
      );

      const integrationData = {
        user_token: accessToken,
        app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        app_secret: process.env.FACEBOOK_APP_SECRET,
        page_id: page.id,
        page_access_token: page.access_token,
        page_name: page.name,
        is_enabled: true,
        token_type: "user",
      };

      // Check if integration exists
      const existingResponse = await fetch(`${backendUrl}/api/facebook/`, {
        method: "GET",
        headers: authenticatedHeaders,
      });

      let existingIntegrations = [];
      if (existingResponse.ok) {
        existingIntegrations = await existingResponse.json();
      }

      const existingIntegration = existingIntegrations.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any) => i.page_id === page.id
      );

      if (existingIntegration) {
        console.log(
          `[Save User Integration] Updating existing integration for page ${page.id}`
        );
        // Update existing
        await fetch(`${backendUrl}/api/facebook/${existingIntegration.id}/`, {
          method: "PATCH",
          headers: authenticatedHeaders,
          body: JSON.stringify(integrationData),
        });
      } else {
        console.log(
          `[Save User Integration] Creating new integration for page ${page.id}`
        );
        // Create new
        await fetch(`${backendUrl}/api/facebook/`, {
          method: "POST",
          headers: authenticatedHeaders,
          body: JSON.stringify(integrationData),
        });
      }

      // Subscribe to webhook after saving
      console.log(
        `[Save User Integration] Subscribing to webhook for page ${page.id}`
      );
      await subscribeToWebhook(page.id, page.access_token);
    } catch (pageError) {
      console.error(
        `[Save User Integration] Error processing page ${page.id}:`,
        pageError
      );
      // Continue with other pages even if one fails
      continue;
    }
  }

  console.log("[Save User Integration] Completed processing all pages");
}
