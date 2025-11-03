import { NextRequest, NextResponse } from "next/server";
import { messageStore } from "@/lib/message-store";

// Ensure Node.js runtime and disable static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
const FACEBOOK_API_VERSION =
  process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v18.0";

/**
 * Get conversation ID from sender ID and page ID
 * In Facebook Messenger, conversation ID format is typically t_{pageId}_{userId}
 */
async function getConversationId(
  senderId: string,
  pageId: string,
  pageAccessToken: string
): Promise<string | null> {
  try {
    // Try to find the conversation by getting conversations and matching sender
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/conversations?fields=id,participants&platform=messenger&access_token=${pageAccessToken}&limit=100`
    );

    if (!response.ok) {
      console.error("Failed to fetch conversations for conversation ID lookup");
      // Fallback: construct conversation ID
      return `t_${pageId}_${senderId}`;
    }

    const data = await response.json();

    if (data.data) {
      // Find conversation where sender is a participant
      const conversation = data.data.find(
        (conv: { participants: { data: Array<{ id: string }> } }) => {
          return conv.participants.data.some(
            (p: { id: string }) => p.id === senderId
          );
        }
      );

      if (conversation) {
        return conversation.id;
      }
    }

    // Fallback: construct conversation ID
    return `t_${pageId}_${senderId}`;
  } catch (error) {
    console.error("Error getting conversation ID:", error);
    // Fallback: construct conversation ID
    return `t_${pageId}_${senderId}`;
  }
}

/**
 * Get sender name from Facebook API
 */
async function getSenderName(
  senderId: string,
  pageAccessToken: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${senderId}?fields=name&access_token=${pageAccessToken}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.name || "Unknown User";
    }
  } catch (error) {
    console.error(`Error fetching sender name for ${senderId}:`, error);
  }
  return "Unknown User";
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("Webhook verification failed");
  return new NextResponse("Verification token mismatch", { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received webhook event:", JSON.stringify(body, null, 2));

    // Handle different types of updates
    if (body.object === "page") {
      for (const entry of body.entry) {
        const pageId = entry.id; // Page ID from webhook

        // Handle messages
        if (entry.messaging) {
          for (const event of entry.messaging) {
            console.log("Received message event:", event);

            // Only process messages (not postbacks, deliveries, etc.)
            if (event.message && event.message.text) {
              const senderId = event.sender?.id;
              const recipientId = event.recipient?.id; // This should be the page ID
              const messageText = event.message.text;
              const messageId = event.message.mid;
              const timestamp = event.timestamp
                ? new Date(event.timestamp).toISOString()
                : new Date().toISOString();

              if (!senderId || !recipientId || !messageId) {
                console.warn(
                  "Missing required fields in message event:",
                  event
                );
                continue;
              }

              // Skip if message is from the page itself
              if (senderId === recipientId || senderId === pageId) {
                continue;
              }

              // Get conversation ID and sender name asynchronously
              // We'll need the page access token - but webhook doesn't provide it
              // For now, we'll use a fallback approach
              const conversationId = `t_${recipientId}_${senderId}`;

              // Try to get sender name (this might fail without access token)
              // In production, you'd want to store page access tokens per page ID
              const senderName = "Unknown User";

              // Store the message in the message store
              messageStore.addMessage({
                id: messageId,
                conversationId,
                message: messageText,
                from: {
                  id: senderId,
                  name: senderName,
                },
                created_time: timestamp,
                pageId: recipientId,
                senderId: senderId, // Store for mapping
              });

              console.log(
                `Stored new message: ${messageId} for conversation: ${conversationId}`
              );
            }
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
