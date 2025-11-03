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

    const user = await getServerUser();
    const baseUrl = user?.subDomain
      ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
      : process.env.NEXT_PUBLIC_BASE_URL;

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

      // Get JWT token from cookies - matching AuthContext cookie names
      const cookieStore = await cookies();
      const authToken = cookieStore.get("authToken")?.value;

      console.log("🔍 [CALLBACK] Cookie inspection:", {
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length || 0,
        allCookies: Array.from(cookieStore.getAll()).map(c => c.name),
      });

      if (!authToken) {
        console.error("❌ [CALLBACK] No JWT token found in cookies");
        console.error(
          "💡 [CALLBACK] Available cookies:",
          Array.from(cookieStore.getAll())
            .map(c => c.name)
            .join(", ")
        );
        throw new Error("Authentication token not found. Please login again.");
      }

      console.log("✅ [CALLBACK] JWT token retrieved from authToken cookie:", {
        tokenLength: authToken.length,
        tokenPreview: authToken.substring(0, 20) + "...",
      });

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

      // Build the correct API URL with subdomain
      const API_BASE_URL = getApiBaseUrl();
      const backendUrl = user.subDomain
        ? API_BASE_URL.replace(
            "nepdora.baliyoventures.com",
            `${user.subDomain}.nepdora.baliyoventures.com`
          )
        : API_BASE_URL;

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 [CALLBACK] Step 3: Saving integrations to backend");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔍 [CALLBACK] Backend URLs:", {
        API_BASE_URL,
        backendUrl,
        fullEndpoint: `${backendUrl}/api/facebook/`,
        hasSubdomain: !!user.subDomain,
        subdomain: user.subDomain || "None",
      });

      // Create headers with JWT token from authToken cookie
      const authenticatedHeaders = createServerHeaders(authToken);

      console.log("🔍 [CALLBACK] Request headers prepared:", {
        hasContentType: !!authenticatedHeaders["Content-Type"],
        hasAuthorization: !!authenticatedHeaders["Authorization"],
        authPreview:
          authenticatedHeaders["Authorization"].substring(0, 30) + "...",
      });

      console.log("🔍 [CALLBACK] Checking for existing integrations...");

      const existingResponse = await fetch(`${backendUrl}/api/facebook/`, {
        method: "GET",
        headers: authenticatedHeaders,
      });

      let existingIntegrations = [];

      if (existingResponse.ok) {
        existingIntegrations = await existingResponse.json();
        console.log("✅ [CALLBACK] Existing integrations found:", {
          count: existingIntegrations.length,
        });
      } else {
        const errorText = await existingResponse.text();
        console.error("❌ [CALLBACK] Failed to fetch existing integrations:", {
          status: existingResponse.status,
          statusText: existingResponse.statusText,
          error: errorText,
        });
      }

      // Track results for all pages
      const results = {
        created: [] as string[],
        updated: [] as string[],
        failed: [] as { page: string; error: string }[],
      };

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`🔄 [CALLBACK] Processing ${pages.length} page(s)...`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Process each page
      for (const page of pages) {
        try {
          console.log(
            `\n📄 [CALLBACK] Processing page: ${page.name} (${page.id})`
          );

          // Check if page has MANAGE permission
          if (page.tasks && !page.tasks.includes("MANAGE")) {
            console.warn(
              `⚠️ [CALLBACK] WARNING: Page "${page.name}" may not have MANAGE permission`
            );
            console.warn("⚠️ [CALLBACK] Available tasks:", page.tasks);
          } else if (page.tasks?.includes("MANAGE")) {
            console.log(
              `✅ [CALLBACK] Page "${page.name}" has MANAGE permission`
            );
          }

          const integrationData = {
            user_token: userAccessToken,
            app_id: appId,
            app_secret: appSecret,
            page_id: page.id,
            page_access_token: page.access_token,
            page_name: page.name,
            is_enabled: true,
          };

          console.log("📦 [CALLBACK] Integration data prepared:", {
            page_id: page.id,
            page_name: page.name,
            app_id: appId.substring(0, 10) + "...",
            is_enabled: true,
            hasUserToken: !!userAccessToken,
            hasAppSecret: !!appSecret,
            hasPageAccessToken: !!page.access_token,
          });

          // Check if integration already exists for this page
          const existingIntegration = existingIntegrations.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (i: any) => i.page_id === page.id
          );

          let saveResponse;

          if (existingIntegration) {
            console.log(
              `🔄 [CALLBACK] Updating existing integration ID: ${existingIntegration.id} for page: ${page.name}`
            );

            saveResponse = await fetch(
              `${backendUrl}/api/facebook/${existingIntegration.id}/`,
              {
                method: "PATCH",
                headers: authenticatedHeaders,
                body: JSON.stringify(integrationData),
              }
            );

            if (saveResponse.ok) {
              results.updated.push(page.name);
              console.log(
                `✅ [CALLBACK] Updated integration for: ${page.name}`
              );
            } else {
              const errorText = await saveResponse.text();
              results.failed.push({
                page: page.name,
                error: `Update failed (${saveResponse.status}): ${errorText}`,
              });
              console.error(`❌ [CALLBACK] Failed to update "${page.name}":`, {
                status: saveResponse.status,
                statusText: saveResponse.statusText,
                error: errorText,
              });
            }
          } else {
            console.log(
              `🆕 [CALLBACK] Creating new integration for page: ${page.name}`
            );

            saveResponse = await fetch(`${backendUrl}/api/facebook/`, {
              method: "POST",
              headers: authenticatedHeaders,
              body: JSON.stringify(integrationData),
            });

            if (saveResponse.ok) {
              results.created.push(page.name);
              console.log(
                `✅ [CALLBACK] Created integration for: ${page.name}`
              );
            } else {
              const errorText = await saveResponse.text();
              results.failed.push({
                page: page.name,
                error: `Creation failed (${saveResponse.status}): ${errorText}`,
              });
              console.error(`❌ [CALLBACK] Failed to create "${page.name}":`, {
                status: saveResponse.status,
                statusText: saveResponse.statusText,
                error: errorText,
              });
            }
          }

          if (saveResponse?.ok) {
            const savedData = await saveResponse.json();
            console.log(`📦 [CALLBACK] Saved data for "${page.name}":`, {
              id: savedData.data?.id || savedData.id,
              page_id: savedData.data?.page_id || savedData.page_id,
              page_name: savedData.data?.page_name || savedData.page_name,
            });
          }
        } catch (pageError) {
          const errorMessage =
            pageError instanceof Error ? pageError.message : "Unknown error";
          results.failed.push({ page: page.name, error: errorMessage });
          console.error(
            `❌ [CALLBACK] Error processing page "${page.name}":`,
            errorMessage
          );
        }
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🎉 [CALLBACK] Batch processing completed!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 [CALLBACK] Summary:", {
        created: results.created.length,
        updated: results.updated.length,
        failed: results.failed.length,
        details: {
          created: results.created,
          updated: results.updated,
          failed: results.failed,
        },
      });

      // Build redirect URL with subdomain
      const redirectBaseUrl = user.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      // Build success message with details
      const totalProcessed = results.created.length + results.updated.length;
      let successMessage = `facebook_connected&total=${totalProcessed}`;

      if (results.created.length > 0) {
        successMessage += `&created=${results.created.length}`;
      }
      if (results.updated.length > 0) {
        successMessage += `&updated=${results.updated.length}`;
      }
      if (results.failed.length > 0) {
        successMessage += `&failed=${results.failed.length}`;
      }

      const successUrl = `${redirectBaseUrl}/admin/settings/integrations?success=${successMessage}`;

      console.log("↗️ [CALLBACK] Redirecting to success page:", {
        redirectBaseUrl,
        fullUrl: successUrl,
      });

      return NextResponse.redirect(successUrl);
    } catch (error: unknown) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌❌❌ [CALLBACK] Error during OAuth callback");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const user = await getServerUser();
      const redirectBaseUrl = user?.subDomain
        ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", `${user.subDomain}.localhost:3000`)}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      if (axios.isAxiosError(error)) {
        console.error("🔴 [CALLBACK] Axios error detected:");
        console.error("🔴 [CALLBACK] Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: JSON.stringify(error.response?.data, null, 2),
        });

        const fbError = error.response?.data?.error;
        const errorMessage = fbError?.message || error.message;

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
        stack: error instanceof Error ? error.stack : undefined,
      });

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
