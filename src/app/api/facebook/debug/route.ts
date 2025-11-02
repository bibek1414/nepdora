import { NextResponse } from "next/server";
import { verifyTokenPermissions, getPageInfo } from "@/lib/facebook";
import { useFacebookApi } from "@/services/api/owner-sites/admin/facebook";

export async function GET() {
  try {
    const apiVersion = process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0";

    console.log("=== Facebook Debug Info ===");
    console.log("API Version:", apiVersion);
    console.log("Fetching Facebook integration from backend...");

    // Fetch integration from backend
    const integrations = await useFacebookApi.getFacebookIntegrations();

    if (integrations.length === 0) {
      return NextResponse.json(
        {
          error: "No Facebook integration found",
          message: "Please connect your Facebook page first",
          integrations: [],
        },
        { status: 404 }
      );
    }

    const activeIntegration =
      integrations.find(i => i.is_enabled) || integrations[0];

    if (!activeIntegration) {
      return NextResponse.json(
        {
          error: "No active integration found",
          message: "Please enable a Facebook integration",
          integrations: integrations.map(i => ({
            id: i.id,
            page_name: i.page_name,
            is_enabled: i.is_enabled,
          })),
        },
        { status: 404 }
      );
    }

    const pageId = activeIntegration.page_id;
    const pageAccessToken = activeIntegration.page_access_token;
    const hasToken = !!pageAccessToken;

    console.log("Integration found:", {
      id: activeIntegration.id,
      pageId,
      pageName: activeIntegration.page_name,
      hasToken,
      isEnabled: activeIntegration.is_enabled,
    });

    if (!hasToken || !pageId) {
      return NextResponse.json(
        {
          error: "Invalid integration credentials",
          pageId: pageId || "NOT SET",
          hasToken,
          integrationId: activeIntegration.id,
        },
        { status: 400 }
      );
    }

    // Check token permissions
    console.log("Checking token permissions...");
    const permissionCheck = await verifyTokenPermissions(pageAccessToken);
    console.log("Permissions:", permissionCheck);

    // Get page info
    console.log("Fetching page info...");
    const pageInfo = await getPageInfo(pageId, pageAccessToken);
    console.log("Page Info:", pageInfo);

    return NextResponse.json({
      success: true,
      integration: {
        id: activeIntegration.id,
        pageId: activeIntegration.page_id,
        pageName: activeIntegration.page_name,
        isEnabled: activeIntegration.is_enabled,
        hasToken,
        apiVersion,
      },
      permissions: permissionCheck,
      pageInfo: {
        id: pageInfo.id,
        name: pageInfo.name,
        category: pageInfo.category,
        tasks: pageInfo.tasks,
      },
      allIntegrations: integrations.map(i => ({
        id: i.id,
        page_name: i.page_name,
        page_id: i.page_id,
        is_enabled: i.is_enabled,
      })),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Debug error:", error);

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          error instanceof Error
            ? error.stack
            : "No additional error details available",
      },
      { status: 500 }
    );
  }
}
