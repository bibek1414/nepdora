// app/api/facebook/conversations/stream/route.ts - SSE endpoint for real-time message streaming
import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";
import { ConversationIdManager } from "@/lib/facebook-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawConversationId = searchParams.get("conversationId");
  const pageId = searchParams.get("pageId");
  const senderId = searchParams.get("senderId");

  console.log("🎯 SSE Stream Request:");
  console.log(`   Raw conversationId: ${rawConversationId}`);
  console.log(`   PageId: ${pageId}`);
  console.log(`   SenderId: ${senderId}`);

  if (!rawConversationId || !pageId) {
    return new Response("Missing conversationId or pageId", { status: 400 });
  }

  // Normalize the conversation ID
  const conversationId = ConversationIdManager.normalizeConversationId(
    rawConversationId,
    pageId,
    senderId || undefined
  );

  console.log(`🎯 Normalized conversation ID: ${conversationId}`);

  // Check what messages exist
  const existingMessages = messageStore.getMessages(conversationId);
  console.log(
    `📋 Found ${existingMessages.length} existing messages for ${conversationId}`
  );

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: object) => {
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
          console.log(`📤 SSE sent: ${JSON.stringify(data)}`);
        } catch (error) {
          console.error("Error sending SSE data:", error);
        }
      };

      // Send connection confirmation
      send({
        type: "connected",
        originalConversationId: rawConversationId,
        normalizedConversationId: conversationId,
        pageId,
        senderId,
        timestamp: new Date().toISOString(),
      });

      // Listen for new messages
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onNewMessage = (message: any) => {
        console.log(`🎯 New message event for: ${message.conversationId}`);
        console.log(`🎯 Our target: ${conversationId}`);

        // Check if this message belongs to our conversation
        const messageConversationId =
          ConversationIdManager.normalizeConversationId(
            message.conversationId,
            message.pageId,
            message.senderId
          );

        if (messageConversationId === conversationId) {
          console.log(`✅ Match! Sending message via SSE`);
          send({
            type: "new_message",
            data: message,
            timestamp: new Date().toISOString(),
          });
        } else {
          console.log(
            `❌ No match: ${messageConversationId} !== ${conversationId}`
          );
        }
      };

      // Subscribe to message store events
      messageStore.on("newMessage", onNewMessage);
      console.log(`✅ Subscribed to message store events`);

      // Send initial existing messages
      if (existingMessages.length > 0) {
        console.log(`📨 Sending ${existingMessages.length} initial messages`);
        existingMessages.forEach(message => {
          send({
            type: "existing_message",
            data: message,
            timestamp: new Date().toISOString(),
          });
        });
      } else {
        console.log(`📭 No existing messages to send`);
        send({ type: "no_existing_messages" });
      }

      // Cleanup function
      const cleanup = () => {
        console.log(`🧹 Cleaning up SSE for ${conversationId}`);
        messageStore.removeListener("newMessage", onNewMessage);
        clearInterval(heartbeatInterval);
        try {
          controller.close();
        } catch (error) {
          // Stream may already be closed
        }
      };

      request.signal.addEventListener("abort", cleanup);

      // Heartbeat
      const heartbeatInterval = setInterval(() => {
        try {
          send({ type: "heartbeat", timestamp: new Date().toISOString() });
        } catch (error) {
          cleanup();
        }
      }, 30000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no",
    },
  });
}
