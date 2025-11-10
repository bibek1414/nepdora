// app/api/facebook/messages/stream/route.ts
import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return new Response("Missing pageId", { status: 400 });
  }

  console.log(`📡 SSE stream opened for pageId: ${pageId}`);

  const encoder = new TextEncoder();
  let isClosed = false;
  let keepAliveInterval: NodeJS.Timeout;

  // Create handlers that will persist
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  let messageHandler: ((event: any) => void) | null = null;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  let conversationHandler: ((event: any) => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message immediately
      try {
        const connectMsg = `data: ${JSON.stringify({ type: "connected", pageId })}\n\n`;
        controller.enqueue(encoder.encode(connectMsg));
        console.log(`✅ Sent connection message for pageId: ${pageId}`);
      } catch (err) {
        console.error("Failed to send connection message:", err);
      }

      // Define message handler
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      messageHandler = (event: { pageId: string; message: any }) => {
        if (isClosed) {
          console.log("⏸️ Handler called but stream is closed");
          return;
        }

        if (event.pageId === pageId) {
          console.log(
            `📤 [SSE] Sending message update for pageId: ${pageId}, messageId: ${event.message.id}`
          );
          const data = `data: ${JSON.stringify({
            type: "message_update",
            message: event.message,
          })}\n\n`;

          try {
            controller.enqueue(encoder.encode(data));
            console.log(`✅ [SSE] Message sent successfully`);
          } catch (err) {
            console.error("❌ [SSE] Error enqueueing message:", err);
            isClosed = true;
          }
        }
      };

      // Define conversation handler
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      conversationHandler = (event: { pageId: string; update: any }) => {
        if (isClosed) {
          console.log("⏸️ Handler called but stream is closed");
          return;
        }

        if (event.pageId === pageId) {
          console.log(
            `📤 [SSE] Sending conversation update for pageId: ${pageId}`
          );
          const data = `data: ${JSON.stringify({
            type: "conversation_update",
            update: event.update,
          })}\n\n`;

          try {
            controller.enqueue(encoder.encode(data));
            console.log(`✅ [SSE] Conversation update sent successfully`);
          } catch (err) {
            console.error(
              "❌ [SSE] Error enqueueing conversation update:",
              err
            );
            isClosed = true;
          }
        }
      };

      // Register event listeners
      messageStore.on("message_update", messageHandler);
      messageStore.on("conversation_update", conversationHandler);

      console.log(`🎧 Registered SSE listeners for pageId: ${pageId}`);
      console.log(`📊 Current store stats:`, messageStore.getStats());

      // Keep-alive ping every 15 seconds
      keepAliveInterval = setInterval(() => {
        if (isClosed) {
          clearInterval(keepAliveInterval);
          return;
        }

        try {
          const ping = `: keepalive ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(ping));
          console.log(`💓 Sent keepalive for pageId: ${pageId}`);
        } catch (err) {
          console.error("❌ Error sending keepalive:", err);
          clearInterval(keepAliveInterval);
          isClosed = true;
        }
      }, 15000);

      // Cleanup function
      const cleanup = () => {
        if (isClosed) return;
        isClosed = true;

        console.log(`🔌 SSE stream closing for pageId: ${pageId}`);

        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
        }

        if (messageHandler) {
          messageStore.off("message_update", messageHandler);
        }

        if (conversationHandler) {
          messageStore.off("conversation_update", conversationHandler);
        }

        console.log(`🧹 Cleaned up listeners for pageId: ${pageId}`);
        console.log(`📊 Store stats after cleanup:`, messageStore.getStats());

        try {
          controller.close();
        } catch (err) {
          // Stream might already be closed
          console.log("Stream already closed");
        }
      };

      // Listen for client disconnect
      req.signal.addEventListener("abort", () => {
        console.log(`🚫 Client aborted connection for pageId: ${pageId}`);
        cleanup();
      });
    },

    cancel() {
      console.log(`❌ Stream cancelled for pageId: ${pageId}`);
      isClosed = true;
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      if (messageHandler) messageStore.off("message_update", messageHandler);
      if (conversationHandler)
        messageStore.off("conversation_update", conversationHandler);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
