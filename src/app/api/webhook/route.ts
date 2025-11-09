import { NextRequest, NextResponse } from "next/server";
import { messageStore } from "@/lib/message-store";

const VERIFY_TOKEN =
  process.env.FACEBOOK_VERIFY_TOKEN || "nepdora_verify_token";

// ✅ Facebook webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}

// ✅ Receive webhook data from backend
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 🎯 LOG THE RECEIVED WEBHOOK DATA
    console.log("=".repeat(80));
    console.log("📩 WEBHOOK DATA RECEIVED");
    console.log("=".repeat(80));
    console.log(JSON.stringify(body, null, 2));
    console.log("=".repeat(80));

    // Handle new_message webhook from backend
    if (body.type === "new_message" && body.data) {
      const webhookData = body.data;
      console.log("📩 Processing new message webhook:", {
        conversation_id: webhookData.conversation_id,
        page_id: webhookData.page_id,
        sender_id: webhookData.sender_id,
        message_type: webhookData.message_type,
      });

      // Extract message data - message can be an object with id, message, etc.
      let messageId: string;
      let messageText: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let attachments: any[] = [];

      if (
        typeof webhookData.message === "object" &&
        webhookData.message !== null
      ) {
        // Message is an object (from backend) - extract from message object
        messageId =
          webhookData.message.id ||
          `msg_${Date.now()}_${webhookData.sender_id}`;
        messageText =
          webhookData.message.message ||
          webhookData.message.text ||
          webhookData.snippet ||
          "";
        attachments = webhookData.message.attachments || [];
      } else {
        // Message is text string or use snippet
        messageId = `msg_${Date.now()}_${webhookData.sender_id}`;
        messageText =
          typeof webhookData.message === "string"
            ? webhookData.message
            : webhookData.snippet || "";
      }

      // Use snippet for conversation display (snippet is the preview text)
      const conversationSnippet = webhookData.snippet || messageText;

      // Create message data structure
      const messageData = {
        id: messageId,
        conversationId: webhookData.conversation_id,
        message: messageText,
        from: {
          id: webhookData.sender_id,
          name: webhookData.sender_name,
          profile_pic: undefined, // Will be filled from participants if available
        },
        created_time: webhookData.timestamp || new Date().toISOString(),
        pageId: webhookData.page_id,
        senderId: webhookData.sender_id,
        attachments: attachments,
      };

      // Create conversation update data
      const conversationUpdate = {
        conversationId: webhookData.conversation_id,
        pageId: webhookData.page_id,
        snippet: conversationSnippet,
        updated_time: webhookData.timestamp || new Date().toISOString(),
        sender_name: webhookData.sender_name,
        sender_id: webhookData.sender_id,
      };

      try {
        console.log("💾 Storing message and conversation update");
        console.log("📨 Message Data:", JSON.stringify(messageData, null, 2));
        console.log(
          "💬 Conversation Update:",
          JSON.stringify(conversationUpdate, null, 2)
        );

        // Store message and emit conversation update
        messageStore.addMessage(messageData);
        messageStore.emit("conversationUpdate", conversationUpdate);
        console.log("✅ Successfully stored and emitted updates");
      } catch (error) {
        console.error("❌ Failed to store message:", error);
      }

      return NextResponse.json({ status: "processed" });
    }

    console.log("⚠️ Unknown webhook type or missing data");
    return NextResponse.json({ status: "ignored" }, { status: 200 });
  } catch (err) {
    console.error("❌ CRITICAL ERROR in webhook:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
