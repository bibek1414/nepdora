import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";

// Set the runtime to edge for better streaming support
export const runtime = "edge";
export const dynamic = "force-dynamic";

// Keep track of active connections
const activeConnections = new Map<
  string,
  Set<ReadableStreamDefaultController>
>();

// Clean up function to remove dead connections
function cleanupConnection(
  conversationId: string,
  controller: ReadableStreamDefaultController
) {
  const connections = activeConnections.get(conversationId);
  if (connections) {
    connections.delete(controller);
    if (connections.size === 0) {
      activeConnections.delete(conversationId);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  // Ensure params are properly awaited/destructured
  const { conversationId } = params;

  if (!conversationId) {
    return new Response(JSON.stringify({ error: "Missing conversationId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a new SSE stream
  const stream = new ReadableStream({
    start(controller) {
      console.log(`📡 SSE stream opened for conversation: ${conversationId}`);

      // Add this connection to active connections
      if (!activeConnections.has(conversationId)) {
        activeConnections.set(conversationId, new Set());
      }
      activeConnections.get(conversationId)?.add(controller);

      // Send a keep-alive ping every 25 seconds
      const keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(`:keepalive\n\n`);
        } catch (e) {
          console.error("Failed to send keepalive:", e);
          clearInterval(keepAliveInterval);
        }
      }, 25000);

      // Send existing messages initially
      try {
        const existing = messageStore.getMessages(conversationId);
        const initialData = JSON.stringify({
          type: "initial",
          messages: existing,
          timestamp: new Date().toISOString(),
        });
        controller.enqueue(`data: ${initialData}\n\n`);
      } catch (error) {
        console.error("Error sending initial messages:", error);
      }

      // Listen for new messages
      const messageListener = (message: any) => {
        if (message.conversationId === conversationId) {
          try {
            const messageData = JSON.stringify({
              type: "new",
              message,
              timestamp: new Date().toISOString(),
            });
            controller.enqueue(`data: ${messageData}\n\n`);
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      };

      messageStore.on("newMessage", messageListener);

      // Handle client disconnect or error
      const closeStream = () => {
        console.log(`❌ SSE stream closed for conversation: ${conversationId}`);
        clearInterval(keepAliveInterval);
        messageStore.removeListener("newMessage", messageListener);
        cleanupConnection(conversationId, controller);
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
