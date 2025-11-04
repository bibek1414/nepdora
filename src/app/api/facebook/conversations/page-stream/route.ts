// app/api/facebook/conversations/page-stream/route.ts - SSE endpoint for page-level conversation updates
import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";
import { ConversationIdManager } from "@/lib/facebook-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return new Response("Missing pageId", { status: 400 });
  }

  console.log(`🎯 Page Stream Request for pageId: ${pageId}`);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: object) => {
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
          console.log(`📤 Page SSE sent: ${JSON.stringify(data)}`);
        } catch (error) {
          console.error("Error sending SSE data:", error);
        }
      };

      // Send connection confirmation
      send({
        type: "connected",
        pageId,
        timestamp: new Date().toISOString(),
      });

      // Listen for new messages from any conversation on this page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onNewMessage = (message: any) => {
        console.log(`🎯 New message event for page: ${message.pageId}`);
        console.log(`🎯 Target page: ${pageId}`);

        // Check if this message belongs to this page
        if (message.pageId === pageId) {
          console.log(`✅ Page match! Sending conversation update via SSE`);

          // Normalize conversation ID
          const normalizedConversationId =
            ConversationIdManager.normalizeConversationId(
              message.conversationId,
              message.pageId,
              message.senderId
            );

          // Get the latest message for this conversation
          const latestMessage = messageStore.getLatestMessage(
            normalizedConversationId
          );

          if (latestMessage) {
            send({
              type: "conversation_update",
              data: {
                conversationId: normalizedConversationId,
                pageId: message.pageId,
                lastMessage: latestMessage.message,
                created_time: latestMessage.created_time,
                from: latestMessage.from,
                senderId: latestMessage.senderId,
              },
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          console.log(`❌ Page mismatch: ${message.pageId} !== ${pageId}`);
        }
      };

      // Subscribe to message store events
      messageStore.on("newMessage", onNewMessage);
      console.log(
        `✅ Subscribed to page-level message store events for ${pageId}`
      );

      // Cleanup function
      const cleanup = () => {
        console.log(`🧹 Cleaning up page SSE for ${pageId}`);
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
