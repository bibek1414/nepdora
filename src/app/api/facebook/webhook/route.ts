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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("🎯 WEBHOOK CALLED - Checking if message is being processed");
    console.log("📦 Raw webhook body:", JSON.stringify(body, null, 2));

    if (body.object === "page") {
      console.log("✅ Valid page object detected");

      for (const entry of body.entry) {
        console.log(`📄 Processing entry: ${entry.id}`);

        for (const event of entry.messaging || []) {
          console.log(
            "💬 Processing messaging event:",
            JSON.stringify(event, null, 2)
          );

          const senderId = event.sender?.id;
          const recipientId = event.recipient?.id;
          const message = event.message?.text;
          const messageId = event.message?.mid;
          const timestamp = event.timestamp;

          console.log("🔍 Extracted values:");
          console.log(`   senderId: ${senderId}`);
          console.log(`   recipientId: ${recipientId}`);
          console.log(`   message: "${message}"`);
          console.log(`   messageId: ${messageId}`);
          console.log(`   timestamp: ${timestamp}`);

          if (!message) {
            console.log("⏩ SKIPPING - No text message found in event");
            continue;
          }

          if (!senderId || !recipientId) {
            console.log("⏩ SKIPPING - Missing senderId or recipientId");
            continue;
          }

          // 🎯 CRITICAL: Check conversation ID construction
          const conversationId = `t_${recipientId}_${senderId}`;
          const alternativeConversationId = `t_${recipientId}_${senderId}`;

          console.log("🏷️ Conversation IDs:");
          console.log(`   Primary: ${conversationId}`);
          console.log(`   Alternative: ${alternativeConversationId}`);
          console.log(
            `   From your logs: t_122170001792604595 (expected: t_775429945664166_32173745775573579)`
          );

          // Format timestamp properly
          const formattedTimestamp = timestamp
            ? new Date(timestamp * 1000).toISOString()
            : new Date().toISOString();

          // Note: Sender name will be fetched when conversations are loaded
          // For webhook, we use a placeholder - the conversation list will have proper names
          const messageData = {
            id:
              messageId ||
              `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: conversationId,
            message: message,
            from: {
              id: senderId,
              name: "Facebook User", // Will be updated when conversation is loaded
              profile_pic: undefined,
            },
            created_time: formattedTimestamp,
            pageId: recipientId,
            senderId: senderId,
          };

          console.log("💾 Attempting to store message:");
          console.log(JSON.stringify(messageData, null, 2));

          try {
            // Store the message
            messageStore.addMessage(messageData);
            console.log("✅ SUCCESS: Message stored in messageStore");

            // Verify storage
            const storedMessages = messageStore.getMessages(conversationId);
            console.log(
              `📋 Verification: Found ${storedMessages.length} messages for conversation ${conversationId}`
            );

            if (storedMessages.length > 0) {
              console.log(
                "📝 Latest stored message:",
                storedMessages[storedMessages.length - 1]
              );
            }
          } catch (storeError) {
            console.error("❌ FAILED to store message:", storeError);
          }

          // Also try the alternative conversation ID format
          const alternativeData = {
            ...messageData,
            conversationId: alternativeConversationId,
          };

          console.log("🔄 Also storing with alternative conversation ID:");
          messageStore.addMessage(alternativeData);

          const altStoredMessages = messageStore.getMessages(
            alternativeConversationId
          );
          console.log(
            `📋 Alternative verification: Found ${altStoredMessages.length} messages for ${alternativeConversationId}`
          );

          console.log("📊 Final message store stats:", messageStore.getStats());
        }
      }
    } else {
      console.log("❌ Not a page object - webhook structure may be different");
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (err) {
    console.error("💥 CRITICAL ERROR in webhook:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
