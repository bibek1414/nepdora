const FACEBOOK_API_VERSION =
  process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0";

export interface FacebookUser {
  id: string;
  name: string;
  profile_pic?: string;
}

export interface FacebookMessage {
  id: string;
  from: FacebookUser;
  message: string;
  created_time: string;
}

export interface FacebookConversation {
  id: string;
  participants: {
    data: FacebookUser[];
  };
  updated_time: string;
  unread_count?: number;
  messages: {
    data: FacebookMessage[];
    paging: {
      previous?: string;
      next?: string;
    };
  };
}

interface FacebookApiResponse<T> {
  data: T;
  paging?: {
    previous?: string;
    next?: string;
    cursors?: {
      before?: string;
      after?: string;
    };
  };
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

/**
 * Verify the Page Access Token has required permissions
 */
export async function verifyTokenPermissions(pageAccessToken: string): Promise<{
  valid: boolean;
  permissions: string[];
  error?: string;
}> {
  if (!pageAccessToken) {
    return {
      valid: false,
      permissions: [],
      error: "No access token provided",
    };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/permissions?access_token=${pageAccessToken}`
    );
    const data = await response.json();

    if (data.error) {
      return { valid: false, permissions: [], error: data.error.message };
    }

    interface Permission {
      permission: string;
      status: "granted" | "declined";
    }

    const grantedPermissions = (data.data as Permission[])
      .filter(p => p.status === "granted")
      .map(p => p.permission);

    const requiredPermissions = [
      "pages_messaging",
      "pages_manage_metadata",
      "pages_read_engagement",
    ];

    const missingPermissions = requiredPermissions.filter(
      (p: string) => !grantedPermissions.includes(p)
    );

    return {
      valid: missingPermissions.length === 0,
      permissions: grantedPermissions,
      error:
        missingPermissions.length > 0
          ? `Missing permissions: ${missingPermissions.join(", ")}`
          : undefined,
    };
  } catch (error) {
    console.error("Error verifying token permissions:", error);
    return { valid: false, permissions: [], error: String(error) };
  }
}

/**
 * Get page information to verify the Page ID and token
 */
export async function getPageInfo(
  pageId: string,
  pageAccessToken: string
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (!pageAccessToken || !pageId) {
    throw new Error("Facebook credentials not provided");
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}?fields=id,name,access_token,category,tasks&access_token=${pageAccessToken}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Error getting page info:", error);
    throw error;
  }
}

/**
 * Get conversations for the Facebook Page
 */
export async function getConversations(
  pageId: string,
  pageAccessToken: string
): Promise<FacebookConversation[]> {
  if (!pageAccessToken || !pageId) {
    throw new Error("Facebook Page Access Token or Page ID is not configured");
  }

  try {
    // Build the URL with proper fields - ADD picture() to get profile pics
    const fields = [
      "id",
      "participants",
      "updated_time",
      "unread_count",
      "link",
      "message_count",
      "messages.limit(10){id,message,from{id,name,email,picture},created_time,attachments}",
    ].join(",");

    const conversationsUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/conversations?fields=${encodeURIComponent(
      fields
    )}&platform=messenger&access_token=${pageAccessToken}`;

    console.log("Fetching conversations from:", `${pageId}/conversations`);

    const response = await fetch(conversationsUrl);
    const data: FacebookApiResponse<FacebookConversation[]> =
      await response.json();

    if (!response.ok) {
      console.error("Facebook API error response:", data);

      // Handle specific error codes
      if (data.error) {
        switch (data.error.code) {
          case 100:
            throw new Error(
              `Invalid field or permissions error: ${data.error.message}. Make sure your Page Access Token has 'pages_messaging' and 'pages_read_engagement' permissions.`
            );
          case 190:
            throw new Error(
              `Invalid access token: ${data.error.message}. Please regenerate your Page Access Token.`
            );
          case 200:
            throw new Error(
              `Missing permissions: ${data.error.message}. Required: pages_messaging, pages_read_engagement, pages_manage_metadata`
            );
          default:
            throw new Error(
              data.error.message ||
                `Facebook API error: ${response.status} ${response.statusText}`
            );
        }
      }

      throw new Error(
        `Facebook API error: ${response.status} ${response.statusText}`
      );
    }

    if (!data.data) {
      console.warn("No conversations data returned from Facebook API");
      return [];
    }

    // Fetch profile pictures for participants
    const conversationsWithPics = await Promise.all(
      data.data.map(async conv => {
        const participantsWithPics = await Promise.all(
          conv.participants.data.map(async participant => {
            if (participant.id === pageId) {
              return participant; // Skip page itself
            }
            try {
              const profilePic = await getUserProfilePicture(
                participant.id,
                pageAccessToken
              );
              return { ...participant, profile_pic: profilePic };
            } catch (error) {
              console.error(
                `Error fetching profile pic for ${participant.id}:`,
                error
              );
              return participant;
            }
          })
        );

        return {
          ...conv,
          participants: { data: participantsWithPics },
        };
      })
    );

    console.log(
      "Successfully fetched conversations:",
      conversationsWithPics.length
    );
    return conversationsWithPics;
  } catch (error) {
    console.error("Error in getConversations:", error);
    throw error;
  }
}

/**
 * Get user profile picture
 */
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
    console.error("Error fetching profile picture:", error);
  }
  return undefined;
}

/**
 * Get messages for a specific conversation
 */
export async function getConversationMessages(
  conversationId: string,
  pageAccessToken: string,
  limit: number = 50
): Promise<FacebookMessage[]> {
  if (!pageAccessToken) {
    throw new Error("Facebook Page Access Token is not configured");
  }

  try {
    // ADD from{id,name,email,picture} to get profile pics in messages
    const fields =
      "id,message,from{id,name,email,picture},created_time,attachments";
    const url = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${conversationId}/messages?fields=${fields}&limit=${limit}&access_token=${pageAccessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching messages:", data);
      throw new Error(data.error?.message || "Failed to fetch messages");
    }

    // Fetch profile pictures for message senders
    const messagesWithPics = await Promise.all(
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.data || []).map(async (msg: any) => {
        if (!msg.from) return msg;

        try {
          const profilePic = await getUserProfilePicture(
            msg.from.id,
            pageAccessToken
          );
          return {
            ...msg,
            from: { ...msg.from, profile_pic: profilePic },
          };
        } catch (error) {
          console.error(
            `Error fetching profile pic for ${msg.from.id}:`,
            error
          );
          return msg;
        }
      })
    );

    return messagesWithPics;
  } catch (error) {
    console.error("Error in getConversationMessages:", error);
    throw error;
  }
}

/**
 * Send a message to a user
 */
export async function sendMessage(
  recipientId: string,
  message: string,
  pageAccessToken: string
): Promise<void> {
  if (!pageAccessToken) {
    throw new Error("Facebook Page Access Token is not configured");
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/messages?access_token=${pageAccessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
          messaging_type: "RESPONSE",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error sending message:", data);
      throw new Error(
        data.error?.message || `Failed to send message: ${JSON.stringify(data)}`
      );
    }

    console.log("Message sent successfully:", data);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
}

/**
 * Get user profile information
 */
export async function getUserProfile(
  userId: string,
  pageAccessToken: string
): Promise<FacebookUser> {
  if (!pageAccessToken) {
    throw new Error("Facebook Page Access Token is not configured");
  }

  try {
    const profilePic = await getUserProfilePicture(userId, pageAccessToken);

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${userId}?fields=id,name&access_token=${pageAccessToken}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get user profile");
    }

    return { ...data, profile_pic: profilePic };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
}

/**
 * Format timestamp to readable date and time
 */
export function formatTimestamp(timestamp: string): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", timestamp);
    return "";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date to readable format
 */
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
}
