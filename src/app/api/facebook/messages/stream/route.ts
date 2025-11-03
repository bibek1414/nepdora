import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";

// Ensure Node.js runtime and disable static optimization for streaming
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-Sent Events endpoint for real-time message streaming
 * Clients subscribe to this endpoint to receive new messages as they arrive via webhook
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  const pageId = searchParams.get("pageId");
  const senderId = searchParams.get("senderId"); // Optional: for fallback matching

  if (!conversationId || !pageId) {
    return new Response("Missing conversationId or pageId", { status: 400 });
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error("Error sending SSE data:", error);
        }
      };

      // Send connection confirmation
      send(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

      // Helper to check if a message matches this subscription
      const messageMatches = (message: {
        conversationId: string;
        pageId: string;
        senderId?: string;
      }): boolean => {
        // Exact conversation ID match
        if (
          message.conversationId === conversationId &&
          message.pageId === pageId
        ) {
          return true;
        }

        // Fallback: match by sender ID if conversation ID was constructed differently
        if (
          senderId &&
          message.senderId === senderId &&
          message.pageId === pageId
        ) {
          return true;
        }

        // Also check if webhook conversation ID matches (constructed format)
        const webhookConversationId = `t_${pageId}_${message.senderId}`;
        if (
          webhookConversationId === message.conversationId &&
          message.pageId === pageId
        ) {
          return true;
        }

        return false;
      };

      // Listen for new messages
      const onNewMessage = (message: {
        conversationId: string;
        pageId: string;
        senderId?: string;
      }) => {
        // Check if message matches this subscription
        if (messageMatches(message)) {
          // Try to get message by conversation ID first, then by constructed ID
          let latestMessage = messageStore.getLatestMessage(conversationId);

          // If not found and we have senderId, try constructed ID
          if (!latestMessage && senderId) {
            const constructedId = `t_${pageId}_${senderId}`;
            latestMessage = messageStore.getLatestMessage(constructedId);
          }

          if (latestMessage) {
            send(
              `data: ${JSON.stringify({ type: "message", data: latestMessage })}\n\n`
            );
          }
        }
      };

      // Subscribe to message store events
      messageStore.on("newMessage", onNewMessage);

      // Send initial messages if any exist for both conversation ID and constructed ID
      const sendLatestForId = (id: string) => {
        const existingMessages = messageStore.getMessages(id);
        if (existingMessages.length > 0) {
          const latestMessage = existingMessages[existingMessages.length - 1];
          send(
            `data: ${JSON.stringify({ type: "message", data: latestMessage })}\n\n`
          );
        }
      };

      sendLatestForId(conversationId);
      if (senderId) {
        sendLatestForId(`t_${pageId}_${senderId}`);
      }

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        messageStore.removeListener("newMessage", onNewMessage);
        try {
          controller.close();
        } catch (error) {
          // Stream may already be closed
        }
      });

      // Send periodic heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          send(`data: ${JSON.stringify({ type: "heartbeat" })}\n\n`);
        } catch (error) {
          clearInterval(heartbeatInterval);
          messageStore.removeListener("newMessage", onNewMessage);
        }
      }, 30000); // Every 30 seconds

      // Cleanup on abort
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering in nginx
    },
  });
}
