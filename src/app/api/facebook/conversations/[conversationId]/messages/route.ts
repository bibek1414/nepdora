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
    picture?: {
      data: {
        height: number;
        width: number;
        is_silhouette: boolean;
        url: string;
      };
    };
  };
}

async function getUserProfilePicture(
  userId: string,
  pageAccessToken: string
): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${userId}/picture?redirect=false&type=normal&access_token=${pageAccessToken}`
    );
    const data = await response.json();

    if (data.data && data.data.url) {
      return data.data.url;
    }
  } catch (error) {
    console.error(`Error fetching profile picture for ${userId}:`, error);
  }
  return undefined;
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

    // First, get the messages without pictures
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${conversationId}/messages` +
        `?fields=id,message,created_time,from{id,name}` +
        `&access_token=${pageAccessToken}`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Facebook API error:", error);
      throw new Error(error.error?.message || "Failed to fetch messages");
    }

    const data = await response.json();

    // Get unique user IDs (excluding pages)
    const userIds = [
      ...new Set(
        (data.data || [])
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((msg: any) => msg.from?.id)
          .filter((id: string) => id && !id.startsWith("1049"))
      ),
    ] as string[];

    // Fetch profile pictures for all unique users
    const profilePics = new Map<string, string>();
    await Promise.all(
      userIds.map(async (userId: string) => {
        const pic = await getUserProfilePicture(userId, pageAccessToken);
        if (pic) {
          profilePics.set(userId, pic);
        }
      })
    );

    // Transform the data to include profile pictures
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = (data.data || []).map((msg: any) => {
      const profilePic = profilePics.get(msg.from?.id);

      return {
        ...msg,
        from: {
          id: msg.from?.id,
          name: msg.from?.name,
          profile_pic: profilePic,
        },
      };
    });

    return NextResponse.json({ messages });
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
