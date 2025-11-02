import { NextResponse } from "next/server";

const FACEBOOK_API_VERSION =
  process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0";

export interface FacebookMessage {
  id: string;
  message: string;
  created_time: string;
  from: {
    id: string;
    name: string;
  };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await context.params;
    const { searchParams } = new URL(request.url);
    const pageAccessToken = searchParams.get("pageAccessToken");

    if (!pageAccessToken) {
      return NextResponse.json(
        { error: "Page access token is required" },
        { status: 400 }
      );
    }

    console.log("Fetching messages for conversation:", conversationId);

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${conversationId}/messages` +
        `?fields=id,message,created_time,from` +
        `&access_token=${pageAccessToken}`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Facebook API error:", error);
      throw new Error(error.error?.message || "Failed to fetch messages");
    }

    const data = await response.json();

    console.log(`Successfully fetched ${data.data?.length || 0} messages`);

    return NextResponse.json({ messages: data.data || [] });
  } catch (error) {
    console.error("Error in messages API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}
