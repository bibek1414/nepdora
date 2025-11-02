import { NextResponse } from "next/server";
import { getConversations } from "@/lib/facebook";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");
    const pageAccessToken = searchParams.get("pageAccessToken");

    if (!pageId || !pageAccessToken) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          details: "pageId and pageAccessToken are required",
        },
        { status: 400 }
      );
    }

    console.log("Fetching conversations for page:", pageId);

    const conversations = await getConversations(pageId, pageAccessToken);

    console.log(`Successfully fetched ${conversations.length} conversations`);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
      },
      { status: 500 }
    );
  }
}
