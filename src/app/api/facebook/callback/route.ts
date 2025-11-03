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

export async function GET(request: Request) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔵 [CALLBACK] Facebook Login for Business callback");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");
  const configId = searchParams.get("config_id");

  console.log("🔍 [CALLBACK] Query params received:", {
    hasCode: !!code,
    codePreview: code ? code.substring(0, 20) + "..." : "None",
    hasConfigId: !!configId,
    configId: configId || "None",
    error: error || "None",
    errorReason: errorReason || "None",
    errorDescription: errorDescription || "None",
  });

  // Handle OAuth errors from Facebook
  if (error) {
    console.error("❌ [CALLBACK] Facebook OAuth error:", {
      error,
      errorReason,
      errorDescription,
    });

    const user = await getServerUser();
    const baseUrl = user?.subDomain
      ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
      : process.env.NEXT_PUBLIC_BASE_URL;

    return NextResponse.redirect(
      `${baseUrl}/admin/settings/integrations?error=${encodeURIComponent(
        errorDescription || "Facebook authentication failed"
      )}`
    );
  }

  // Handle successful OAuth callback with code
  if (code) {
    try {
      console.log(
        "✅ [CALLBACK] Authorization code received for Facebook Login for Business"
      );

      const user = await getServerUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("👤 [CALLBACK] User info:", {
        id: user.id,
        subdomain: user.subDomain || "none",
      });

      // Get JWT token from cookies
      const cookieStore = await cookies();
      const authToken = cookieStore.get("authToken")?.value;

      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      console.log(
        "🔑 [CALLBACK] Auth token found:",
        authToken.substring(0, 20) + "..."
      );

      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback`;

      console.log("📋 [CALLBACK] Facebook Login for Business Configuration:", {
        appId: appId ? `${appId.substring(0, 10)}...` : "MISSING",
        appSecret: appSecret ? "SET" : "MISSING",
        configId: configId || "Not provided",
        redirectUri,
      });

      if (!appId || !appSecret) {
        throw new Error("Facebook App ID or App Secret is not configured");
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 [CALLBACK] Step 1: Exchanging code for access token");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Exchange authorization code for access token
      const tokenUrl = `https://graph.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/oauth/access_token`;

      const tokenResponse = await axios.get(tokenUrl, {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      console.log("✅ [CALLBACK] Token exchange successful:", {
        status: tokenResponse.status,
        hasAccessToken: !!tokenResponse.data?.access_token,
        tokenType: tokenResponse.data?.token_type,
        expiresIn: tokenResponse.data?.expires_in,
      });

      const { access_token: accessToken, token_type: tokenType } =
        tokenResponse.data;

      if (!accessToken) {
        throw new Error("No access token received from Facebook");
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(
        "🔄 [CALLBACK] Step 2: Determining token type and fetching business data"
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // For Business Integration System User tokens, we need to handle differently
      if (tokenType === "SystemUser" || configId) {
        console.log(
          "🔧 [CALLBACK] Business Integration System User token detected"
        );
        await handleBusinessIntegrationToken(accessToken, user, authToken);
      } else {
        console.log(
          "👤 [CALLBACK] User access token detected - fetching pages"
        );
        await handleUserAccessToken(accessToken, user, authToken);
      }

      // Build success redirect URL
      const redirectBaseUrl = user.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      const successUrl = `${redirectBaseUrl}/admin/settings/integrations?success=facebook_business_connected`;

      console.log(
        "✅ [CALLBACK] Facebook Login for Business completed successfully"
      );
      console.log("🔗 [CALLBACK] Redirecting to:", successUrl);

      return NextResponse.redirect(successUrl);
    } catch (error: unknown) {
      console.error(
        "❌ [CALLBACK] Error during Facebook Login for Business:",
        error
      );

      const user = await getServerUser();
      const redirectBaseUrl = user?.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";

      return NextResponse.redirect(
        `${redirectBaseUrl}/admin/settings/integrations?error=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
  }

  // No code or error parameter
  console.error("❌ [CALLBACK] Invalid callback - no code or error");

  const user = await getServerUser();
  const redirectBaseUrl = user?.subDomain
    ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
    : process.env.NEXT_PUBLIC_BASE_URL;

  return NextResponse.redirect(
    `${redirectBaseUrl}/admin/settings/integrations?error=${encodeURIComponent(
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
  console.log(
    "🏢 [CALLBACK] Processing Business Integration System User token"
  );

  try {
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
    console.log("✅ [CALLBACK] Client Business ID:", clientBusinessId);

    if (!clientBusinessId) {
      throw new Error("No client business ID found in token");
    }

    // Get business pages and assets
    console.log("📡 [CALLBACK] Fetching owned pages...");
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
    console.log(
      `📄 [CALLBACK] Found ${pages.length} business pages:`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pages.map((p: any) => ({ id: p.id, name: p.name }))
    );

    // Save integration to your backend
    await saveBusinessIntegration({
      accessToken,
      clientBusinessId,
      pages,
      user,
      authToken,
    });
  } catch (error) {
    console.error(
      "❌ [CALLBACK] Error handling business integration token:",
      error
    );
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
  console.log("👤 [CALLBACK] Processing User Access Token");

  try {
    // Get user's pages
    console.log("📡 [CALLBACK] Fetching user pages...");
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
    console.log(
      `📄 [CALLBACK] Found ${pages.length} user pages:`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pages.map((p: any) => ({ id: p.id, name: p.name }))
    );

    // Save integration to your backend
    await saveUserIntegration({
      accessToken,
      pages,
      user,
      authToken,
    });
  } catch (error) {
    console.error("❌ [CALLBACK] Error handling user access token:", error);
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

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💾 [CALLBACK] Saving business integration to backend");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 [CALLBACK] Backend URL:", backendUrl);
  console.log("👤 [CALLBACK] User:", {
    id: user.id,
    subdomain: user.subDomain,
  });

  const results = [];

  for (const page of pages) {
    try {
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

      console.log(`🔍 [CALLBACK] Processing page: ${page.name} (${page.id})`);

      // Check if integration exists
      console.log(`📡 [CALLBACK] Checking for existing integrations...`);
      const existingResponse = await fetch(`${backendUrl}/api/facebook/`, {
        method: "GET",
        headers: authenticatedHeaders,
      });

      console.log(
        `📊 [CALLBACK] Existing integrations response status: ${existingResponse.status}`
      );

      let existingIntegrations = [];
      if (existingResponse.ok) {
        existingIntegrations = await existingResponse.json();
        console.log(
          `📋 [CALLBACK] Found ${existingIntegrations.length} existing integrations`
        );
      } else {
        const errorText = await existingResponse.text();
        console.error(
          `❌ [CALLBACK] Failed to fetch existing integrations:`,
          errorText
        );
      }

      const existingIntegration = existingIntegrations.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any) => i.page_id === page.id
      );

      let saveResponse;
      if (existingIntegration) {
        // Update existing
        console.log(
          `🔄 [CALLBACK] Updating existing integration ID: ${existingIntegration.id}`
        );
        saveResponse = await fetch(
          `${backendUrl}/api/facebook/${existingIntegration.id}/`,
          {
            method: "PATCH",
            headers: authenticatedHeaders,
            body: JSON.stringify(integrationData),
          }
        );
      } else {
        // Create new
        console.log(`🆕 [CALLBACK] Creating new integration`);
        saveResponse = await fetch(`${backendUrl}/api/facebook/`, {
          method: "POST",
          headers: authenticatedHeaders,
          body: JSON.stringify(integrationData),
        });
      }

      console.log(`📡 [CALLBACK] Save response status: ${saveResponse.status}`);

      if (saveResponse.ok) {
        const savedData = await saveResponse.json();
        console.log(`✅ [CALLBACK] Successfully saved "${page.name}":`, {
          id: savedData.id,
          page_id: savedData.page_id,
          page_name: savedData.page_name,
          is_enabled: savedData.is_enabled,
        });
        results.push({ success: true, page: page.name, data: savedData });
      } else {
        const errorText = await saveResponse.text();
        console.error(`❌ [CALLBACK] Failed to save "${page.name}":`, {
          status: saveResponse.status,
          statusText: saveResponse.statusText,
          error: errorText,
        });
        results.push({ success: false, page: page.name, error: errorText });
      }
    } catch (pageError) {
      console.error(
        `❌ [CALLBACK] Exception saving page "${page.name}":`,
        pageError
      );
      results.push({
        success: false,
        page: page.name,
        error:
          pageError instanceof Error ? pageError.message : String(pageError),
      });
    }
  }

  // Summary log
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `📊 [CALLBACK] Save summary: ${successful} successful, ${failed} failed`
  );

  // Verify the integration was actually saved
  console.log("🔍 [CALLBACK] Verifying saved integrations...");
  try {
    const verifyResponse = await fetch(`${backendUrl}/api/facebook/`, {
      method: "GET",
      headers: authenticatedHeaders,
    });

    if (verifyResponse.ok) {
      const finalIntegrations = await verifyResponse.json();
      console.log(
        `✅ [CALLBACK] Verification: Found ${finalIntegrations.length} total integrations after save`
      );
      console.log(
        `📋 [CALLBACK] Integration details:`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        finalIntegrations.map((i: any) => ({
          id: i.id,
          page: i.page_name,
          page_id: i.page_id,
          enabled: i.is_enabled,
        }))
      );
    } else {
      console.error(
        `❌ [CALLBACK] Verification failed: ${verifyResponse.status}`
      );
    }
  } catch (verifyError) {
    console.error(`❌ [CALLBACK] Verification error:`, verifyError);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return results;
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

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💾 [CALLBACK] Saving user integration to backend");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 [CALLBACK] Backend URL:", backendUrl);
  console.log("👤 [CALLBACK] User:", {
    id: user.id,
    subdomain: user.subDomain,
  });

  const results = [];

  for (const page of pages) {
    try {
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

      console.log(`🔍 [CALLBACK] Processing page: ${page.name} (${page.id})`);

      // Check if integration exists
      console.log(`📡 [CALLBACK] Checking for existing integrations...`);
      const existingResponse = await fetch(`${backendUrl}/api/facebook/`, {
        method: "GET",
        headers: authenticatedHeaders,
      });

      console.log(
        `📊 [CALLBACK] Existing integrations response status: ${existingResponse.status}`
      );

      let existingIntegrations = [];
      if (existingResponse.ok) {
        existingIntegrations = await existingResponse.json();
        console.log(
          `📋 [CALLBACK] Found ${existingIntegrations.length} existing integrations`
        );
      } else {
        const errorText = await existingResponse.text();
        console.error(
          `❌ [CALLBACK] Failed to fetch existing integrations:`,
          errorText
        );
      }

      const existingIntegration = existingIntegrations.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any) => i.page_id === page.id
      );

      let saveResponse;
      if (existingIntegration) {
        // Update existing
        console.log(
          `🔄 [CALLBACK] Updating existing integration ID: ${existingIntegration.id}`
        );
        saveResponse = await fetch(
          `${backendUrl}/api/facebook/${existingIntegration.id}/`,
          {
            method: "PATCH",
            headers: authenticatedHeaders,
            body: JSON.stringify(integrationData),
          }
        );
      } else {
        // Create new
        console.log(`🆕 [CALLBACK] Creating new integration`);
        saveResponse = await fetch(`${backendUrl}/api/facebook/`, {
          method: "POST",
          headers: authenticatedHeaders,
          body: JSON.stringify(integrationData),
        });
      }

      console.log(`📡 [CALLBACK] Save response status: ${saveResponse.status}`);

      if (saveResponse.ok) {
        const savedData = await saveResponse.json();
        console.log(`✅ [CALLBACK] Successfully saved "${page.name}":`, {
          id: savedData.id,
          page_id: savedData.page_id,
          page_name: savedData.page_name,
          is_enabled: savedData.is_enabled,
        });
        results.push({ success: true, page: page.name, data: savedData });
      } else {
        const errorText = await saveResponse.text();
        console.error(`❌ [CALLBACK] Failed to save "${page.name}":`, {
          status: saveResponse.status,
          statusText: saveResponse.statusText,
          error: errorText,
        });
        results.push({ success: false, page: page.name, error: errorText });
      }
    } catch (pageError) {
      console.error(
        `❌ [CALLBACK] Exception saving page "${page.name}":`,
        pageError
      );
      results.push({
        success: false,
        page: page.name,
        error:
          pageError instanceof Error ? pageError.message : String(pageError),
      });
    }
  }

  // Summary log
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `📊 [CALLBACK] Save summary: ${successful} successful, ${failed} failed`
  );

  // Verify the integration was actually saved
  console.log("🔍 [CALLBACK] Verifying saved integrations...");
  try {
    const verifyResponse = await fetch(`${backendUrl}/api/facebook/`, {
      method: "GET",
      headers: authenticatedHeaders,
    });

    if (verifyResponse.ok) {
      const finalIntegrations = await verifyResponse.json();
      console.log(
        `✅ [CALLBACK] Verification: Found ${finalIntegrations.length} total integrations after save`
      );
      console.log(
        `📋 [CALLBACK] Integration details:`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        finalIntegrations.map((i: any) => ({
          id: i.id,
          page: i.page_name,
          page_id: i.page_id,
          enabled: i.is_enabled,
        }))
      );
    } else {
      console.error(
        `❌ [CALLBACK] Verification failed: ${verifyResponse.status}`
      );
    }
  } catch (verifyError) {
    console.error(`❌ [CALLBACK] Verification error:`, verifyError);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return results;
}
