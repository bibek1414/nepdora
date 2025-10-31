import { NextResponse } from "next/server";
import { verifyTokenPermissions, getPageInfo } from "@/lib/facebook";

export async function GET() {
  try {
    const pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
    const hasToken = !!process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ACCESS_TOKEN;
    const apiVersion = process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0";

    console.log("=== Facebook Debug Info ===");
    console.log("Page ID:", pageId);
    console.log("Has Token:", hasToken);
    console.log("API Version:", apiVersion);

    if (!hasToken || !pageId) {
      return NextResponse.json(
        {
          error: "Missing credentials",
          pageId: pageId || "NOT SET",
          hasToken,
        },
        { status: 400 }
      );
    }

    // Check token permissions
    console.log("Checking token permissions...");
    const permissionCheck = await verifyTokenPermissions();
    console.log("Permissions:", permissionCheck);

    // Get page info
    console.log("Fetching page info...");
    const pageInfo = await getPageInfo();
    console.log("Page Info:", pageInfo);

    return NextResponse.json({
      success: true,
      credentials: {
        pageId,
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
