import { NextResponse } from "next/server";

const FACEBOOK_API_VERSION =
  process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0";
const PAGE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ACCESS_TOKEN;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const conversationId = params.conversationId;

    if (!PAGE_ACCESS_TOKEN) {
      throw new Error("Facebook Page Access Token is not configured");
    }

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${conversationId}/messages` +
        `?fields=id,message,created_time,from` +
        `&access_token=${PAGE_ACCESS_TOKEN}`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Facebook API error:", error);
      throw new Error(error.error?.message || "Failed to fetch messages");
    }

    const data = await response.json();
    return NextResponse.json({ messages: data.data });
  } catch (error) {
    console.error("Error in messages API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
