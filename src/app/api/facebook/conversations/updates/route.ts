import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { messageStore } from "@/lib/message-store";

// Keep track of active connections
const activeConnections = new Map<
  string,
  Set<ReadableStreamDefaultController>
>();

// Clean up connection when client disconnects
const cleanupConnection = (
  pageId: string,
  controller: ReadableStreamDefaultController
) => {
  const connections = activeConnections.get(pageId);
  if (connections) {
    connections.delete(controller);
    if (connections.size === 0) {
      activeConnections.delete(pageId);
    }
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return new Response(JSON.stringify({ error: "Missing pageId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a new SSE stream
  const stream = new ReadableStream({
    start(controller) {
      console.log(`📡 SSE stream opened for page: ${pageId}`);

      // Add this connection to active connections
      if (!activeConnections.has(pageId)) {
        activeConnections.set(pageId, new Set());
      }
      activeConnections.get(pageId)?.add(controller);

      // Send a keep-alive ping every 25 seconds
      const keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(`:keepalive\n\n`);
        } catch (e) {
          console.error("Failed to send keepalive:", e);
          clearInterval(keepAliveInterval);
        }
      }, 25000);

      // Handle new messages
      const messageListener = (message: any) => {
        console.log("📨 New message received in messageStore:", message);
        if (message.pageId === pageId) {
          try {
            const messageData = {
              type: "newMessage",
              conversation: {
                conversation_id: message.conversationId,
                updated_time: message.created_time || new Date().toISOString(),
                snippet: message.message,
                participants: [
                  {
                    id: message.from?.id || "unknown",
                    name: message.from?.name || "Unknown User",
                  },
                ],
                // Include additional fields that might be needed
                id: message.conversationId,
                page: pageId,
                page_name: "Facebook Page",
                messages: [message],
              },
              message: message, // Include the full message
              timestamp: new Date().toISOString(),
            };

            console.log("📤 Sending SSE update:", messageData);
            controller.enqueue(`data: ${JSON.stringify(messageData)}\n\n`);
          } catch (error) {
            console.error("Error sending message update:", error);
          }
        }
      };

      // Listen for new messages
      messageStore.on("newMessage", messageListener);

      // Handle client disconnect or error
      const closeStream = () => {
        console.log(`❌ SSE stream closed for page: ${pageId}`);
        clearInterval(keepAliveInterval);
        messageStore.removeListener("newMessage", messageListener);
        cleanupConnection(pageId, controller);
        try {
          controller.close();
        } catch (e) {
          console.error("Error closing controller:", e);
        }
      };

      // Set up cleanup on client disconnect
      request.signal.addEventListener("abort", closeStream);
    },
  });

  // Return the SSE response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "X-Accel-Buffering": "no", // Disable buffering for nginx
    },
  });
}
