// app/api/facebook/conversations/stream/route.ts
import { NextRequest } from "next/server";
import { messageStore } from "@/lib/message-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        const send = (data: any) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        // Subscribe to store updates
        const unsubscribe = messageStore.on("newMessage", (message: any) => {
          if (!conversationId || message.conversationId === conversationId) {
            send(message);
          }
        });

        req.signal.addEventListener("abort", () => {
          unsubscribe;
          controller.close();
        });
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}
