import { NextResponse } from "next/server";
import axios from "axios";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { getServerUser } from "@/hooks/use-jwt-server";

export async function GET(request: Request) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔵 [CALLBACK] Route hit - Facebook OAuth callback initiated");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  console.log("🔍 [CALLBACK] Query params received:", {
    hasCode: !!code,
    codePreview: code ? code.substring(0, 20) + "..." : "None",
    codeLength: code?.length || 0,
    error: error || "None",
    errorReason: errorReason || "None",
    errorDescription: errorDescription || "None",
  });

  // Handle OAuth errors from Facebook
  if (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ [CALLBACK] Facebook OAuth error detected");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("🔴 [CALLBACK] Error details:", {
      error,
      errorReason,
      errorDescription,
    });

    // Get user to redirect to correct subdomain
    console.log("👤 [CALLBACK] Fetching user for redirect...");
    const user = await getServerUser();
    console.log("👤 [CALLBACK] User info:", {
      hasUser: !!user,
      subDomain: user?.subDomain || "None",
    });

    const baseUrl = user?.subDomain
      ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
      : process.env.NEXT_PUBLIC_BASE_URL;

    console.log("↗️ [CALLBACK] Redirecting to error page:", {
      baseUrl,
      fullUrl: `${baseUrl}/admin/settings/integrations?error=...`,
    });

    return NextResponse.redirect(
      `${baseUrl}/admin/settings/integrations?error=${encodeURIComponent(
        errorDescription || "Failed to connect to Facebook"
      )}`
    );
  }

  // Handle successful OAuth callback with code
  if (code) {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ [CALLBACK] Authorization code received");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 [CALLBACK] Starting OAuth flow...");

      // Get user from JWT to get subdomain
      console.log("👤 [CALLBACK] Fetching authenticated user...");
      const user = await getServerUser();

      if (!user) {
        console.error("❌ [CALLBACK] No authenticated user found");
        throw new Error("User not authenticated. Please login again.");
      }

      console.log("✅ [CALLBACK] User authenticated:", {
        subDomain: user.subDomain || "None",
        storeName: user.storeName || "Unknown",
        userId: user.id || "Unknown",
      });

      // Log the configuration for debugging
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/facebook/callback`;

      console.log("📋 [CALLBACK] Facebook OAuth Configuration:", {
        appId: appId ? `${appId.substring(0, 10)}... (SET)` : "MISSING ❌",
        appSecret: appSecret ? "SET ✅" : "MISSING ❌",
        redirectUri,
        codeLength: code.length,
        apiVersion:
          process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0 (default)",
      });

      // Validate required environment variables
      if (!appId || !appSecret) {
        console.error("❌ [CALLBACK] Missing required environment variables");
        throw new Error("Facebook App ID or App Secret is not configured");
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 [CALLBACK] Step 1: Exchanging code for access token");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const tokenUrl = `https://graph.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/oauth/access_token`;

      console.log("🌐 [CALLBACK] Token exchange request:", {
        url: tokenUrl,
        params: {
          client_id: appId.substring(0, 10) + "...",
          redirect_uri: redirectUri,
          code: code.substring(0, 10) + "...",
        },
      });

      // Exchange code for access token
      const tokenResponse = await axios.get(tokenUrl, {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      console.log("📊 [CALLBACK] Token response:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        hasAccessToken: !!tokenResponse.data?.access_token,
        tokenType: tokenResponse.data?.token_type || "Unknown",
      });

      const { access_token: userAccessToken } = tokenResponse.data;

      if (!userAccessToken) {
        console.error("❌ [CALLBACK] No access token in response");
        throw new Error("No access token received from Facebook");
      }

      console.log("✅ [CALLBACK] User access token obtained:", {
        tokenLength: userAccessToken.length,
        tokenPreview: userAccessToken.substring(0, 20) + "...",
      });

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 [CALLBACK] Step 2: Fetching user's Facebook Pages");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const pagesUrl = `https://graph.facebook.com/${
        process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0"
      }/me/accounts`;

      console.log("🌐 [CALLBACK] Pages request:", {
        url: pagesUrl,
        fields: "id,name,access_token,tasks",
      });

      // Get user's pages
      const pagesResponse = await axios.get(pagesUrl, {
        params: {
          access_token: userAccessToken,
          fields: "id,name,access_token,tasks",
        },
      });

      console.log("📊 [CALLBACK] Pages response:", {
        status: pagesResponse.status,
        dataLength: pagesResponse.data?.data?.length || 0,
      });

      interface FacebookPage {
        id: string;
        access_token: string;
        name: string;
        tasks?: string[];
      }

      const pages = pagesResponse.data.data as FacebookPage[];

      if (pages.length === 0) {
        console.error("❌ [CALLBACK] No Facebook pages found");
        throw new Error(
          "No Facebook pages found for this account. Please make sure you have a Facebook Page."
        );
      }

      console.log(`✅ [CALLBACK] Found ${pages.length} Facebook page(s):`);
      pages.forEach((page, index) => {
        console.log(`   ${index + 1}. Page:`, {
          id: page.id,
          name: page.name,
          hasTasks: !!page.tasks,
          tasks: page.tasks || [],
          hasAccessToken: !!page.access_token,
        });
      });

      const firstPage = pages[0];
      console.log("✅ [CALLBACK] Using first page:", {
        id: firstPage.id,
        name: firstPage.name,
      });

      // Verify page has necessary permissions
      if (firstPage.tasks && !firstPage.tasks.includes("MANAGE")) {
        console.warn(
          "⚠️ [CALLBACK] WARNING: Page may not have MANAGE permission"
        );
        console.warn("⚠️ [CALLBACK] Available tasks:", firstPage.tasks);
      } else if (firstPage.tasks?.includes("MANAGE")) {
        console.log("✅ [CALLBACK] Page has MANAGE permission");
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

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📦 [CALLBACK] Integration data prepared");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📦 [CALLBACK] Data to save:", {
        page_id: firstPage.id,
        page_name: firstPage.name,
        app_id: appId.substring(0, 10) + "...",
        is_enabled: true,
        hasUserToken: !!userAccessToken,
        hasAppSecret: !!appSecret,
        hasPageAccessToken: !!firstPage.access_token,
        userTokenLength: userAccessToken.length,
        pageTokenLength: firstPage.access_token.length,
      });

      // Build the correct API URL with subdomain
      const API_BASE_URL = getApiBaseUrl();
      const backendUrl = user.subDomain
        ? API_BASE_URL.replace(
            "nepdora.baliyoventures.com",
            `${user.subDomain}.nepdora.baliyoventures.com`
          )
        : API_BASE_URL;

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 [CALLBACK] Step 3: Saving to backend");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔍 [CALLBACK] Backend URLs:", {
        API_BASE_URL,
        backendUrl,
        fullEndpoint: `${backendUrl}/api/facebook/`,
        hasSubdomain: !!user.subDomain,
        subdomain: user.subDomain || "None",
      });

      console.log("🔍 [CALLBACK] Checking for existing integrations...");

      const existingResponse = await fetch(`${backendUrl}/api/facebook/`, {
        method: "GET",
        headers: createHeaders(),
      });

      console.log("📊 [CALLBACK] Existing integrations check:", {
        status: existingResponse.status,
        statusText: existingResponse.statusText,
        ok: existingResponse.ok,
        contentType: existingResponse.headers.get("content-type"),
      });

      let integrations = [];

      if (existingResponse.ok) {
        integrations = await existingResponse.json();
        console.log("✅ [CALLBACK] Existing integrations found:", {
          count: integrations.length,
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          integrations: integrations.map((i: any) => ({
            id: i.id,
            page_id: i.page_id,
            page_name: i.page_name,
            is_enabled: i.is_enabled,
            created_at: i.created_at,
            updated_at: i.updated_at,
          })),
        });
      } else {
        const errorText = await existingResponse.text();
        console.warn("⚠️ [CALLBACK] Could not fetch existing integrations:", {
          status: existingResponse.status,
          statusText: existingResponse.statusText,
          body: errorText.substring(0, 200),
        });
        console.warn("⚠️ [CALLBACK] Proceeding to create new integration...");
      }

      // Create or update integration
      let saveResponse;
      if (integrations.length > 0) {
        const existingId = integrations[0].id;
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(
          `🔄 [CALLBACK] Updating existing integration ID: ${existingId}`
        );
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🌐 [CALLBACK] PATCH request:", {
          url: `${backendUrl}/api/facebook/${existingId}/`,
          method: "PATCH",
          dataKeys: Object.keys(integrationData),
        });

        saveResponse = await fetch(
          `${backendUrl}/api/facebook/${existingId}/`,
          {
            method: "PATCH",
            headers: createHeaders(),
            body: JSON.stringify(integrationData),
          }
        );
      } else {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔄 [CALLBACK] Creating new integration");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🌐 [CALLBACK] POST request:", {
          url: `${backendUrl}/api/facebook/`,
          method: "POST",
          dataKeys: Object.keys(integrationData),
        });

        saveResponse = await fetch(`${backendUrl}/api/facebook/`, {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(integrationData),
        });
      }

      console.log("📊 [CALLBACK] Save operation response:", {
        status: saveResponse.status,
        statusText: saveResponse.statusText,
        ok: saveResponse.ok,
        contentType: saveResponse.headers.get("content-type"),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error("❌ [CALLBACK] Failed to save integration:");
        console.error("🔴 [CALLBACK] Error details:", {
          status: saveResponse.status,
          statusText: saveResponse.statusText,
          body: errorText,
        });
        throw new Error(`Failed to save integration: ${errorText}`);
      }

      const savedData = await saveResponse.json();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ [CALLBACK] Integration saved successfully!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📦 [CALLBACK] Saved integration data:", {
        id: savedData.data?.id || savedData.id,
        page_id: savedData.data?.page_id || savedData.page_id,
        page_name: savedData.data?.page_name || savedData.page_name,
        is_enabled: savedData.data?.is_enabled || savedData.is_enabled,
        created_at: savedData.data?.created_at || savedData.created_at,
        updated_at: savedData.data?.updated_at || savedData.updated_at,
        fullResponse: JSON.stringify(savedData, null, 2),
      });

      // Build redirect URL with subdomain
      const redirectBaseUrl = user.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      const successUrl = `${redirectBaseUrl}/admin/settings/integrations?success=facebook_connected`;

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🎉 [CALLBACK] OAuth flow completed successfully!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("↗️ [CALLBACK] Redirecting to success page:", {
        redirectBaseUrl,
        fullUrl: successUrl,
      });

      return NextResponse.redirect(successUrl);
    } catch (error: unknown) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌❌❌ [CALLBACK] Error during OAuth callback");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Get user for redirect
      const user = await getServerUser();
      const redirectBaseUrl = user?.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("🔴 [CALLBACK] Axios error detected:");
        console.error("🔴 [CALLBACK] Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: JSON.stringify(error.response?.data, null, 2),
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
          },
        });

        const fbError = error.response?.data?.error;
        const errorMessage = fbError?.message || error.message;

        console.error(
          "↗️ [CALLBACK] Redirecting to error page with message:",
          errorMessage
        );

        return NextResponse.redirect(
          `${redirectBaseUrl}/admin/settings/integrations?error=${encodeURIComponent(
            `Facebook API Error: ${errorMessage}`
          )}`
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("🔴 [CALLBACK] General error:", {
        message: errorMessage,
        type: error?.constructor?.name || "Unknown",
        error: error,
        stack: error instanceof Error ? error.stack : undefined,
      });

      console.error("↗️ [CALLBACK] Redirecting to error page");

      return NextResponse.redirect(
        `${redirectBaseUrl}/admin/settings/integrations?error=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
  }

  // No code or error parameter
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("❌ [CALLBACK] Invalid callback - no code or error");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔴 [CALLBACK] Missing required parameters in URL");

  const user = await getServerUser();
  const redirectBaseUrl = user?.subDomain
    ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
    : process.env.NEXT_PUBLIC_BASE_URL;

  console.log("↗️ [CALLBACK] Redirecting to error page");

  return NextResponse.redirect(
    `${redirectBaseUrl}/admin/settings/integrations?error=${encodeURIComponent(
      "Invalid callback - missing authorization code"
    )}`
  );
}
