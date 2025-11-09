import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Track active connections by pageId
const activeConnections = new Map<
  string,
  Set<ReadableStreamDefaultController>
>();

function cleanupConnection(
  pageId: string,
  controller: ReadableStreamDefaultController
) {
  const connections = activeConnections.get(pageId);
  if (connections) {
    connections.delete(controller);
    if (connections.size === 0) {
      activeConnections.delete(pageId);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return new Response(JSON.stringify({ error: "Missing pageId parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`📡 SSE stream opened for pageId: ${pageId}`);

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Add connection to active connections
      if (!activeConnections.has(pageId)) {
        activeConnections.set(pageId, new Set());
      }
      activeConnections.get(pageId)?.add(controller);

      // Listen for new messages for this page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messageListener = (message: any) => {
        if (message.pageId === pageId) {
          try {
            console.log(
              `📩 [SSE] Broadcasting message update for pageId: ${pageId}`,
              message
            );
            const messageData = JSON.stringify({
              type: "message_update",
              message,
              timestamp: new Date().toISOString(),
            });
            controller.enqueue(`data: ${messageData}\n\n`);
          } catch (error) {
            console.error("Error sending message via SSE:", error);
          }
        }
      };

      // Listen for conversation updates for this page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conversationUpdateListener = (update: any) => {
        if (update.pageId === pageId) {
          try {
            console.log(
              `💬 [SSE] Broadcasting conversation update for pageId: ${pageId}`,
              update
            );
            const updateData = JSON.stringify({
              type: "conversation_update",
              update,
              timestamp: new Date().toISOString(),
            });
            controller.enqueue(`data: ${updateData}\n\n`);
          } catch (error) {
            console.error("Error sending conversation update via SSE:", error);
          }
        }
      };

      messageStore.on("newMessage", messageListener);
      messageStore.on("conversationUpdate", conversationUpdateListener);

      // Handle cleanup
      const closeStream = () => {
        console.log(`❌ SSE stream closed for pageId: ${pageId}`);
        messageStore.removeListener("newMessage", messageListener);
        messageStore.removeListener(
          "conversationUpdate",
          conversationUpdateListener
        );
        cleanupConnection(pageId, controller);
        try {
          controller.close();
        } catch (e) {
          console.error("Error closing controller:", e);
        }
      };

      request.signal.addEventListener("abort", closeStream);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "X-Accel-Buffering": "no",
    },
  });
}
