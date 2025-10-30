import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN =
  process.env.MESSENGER_VERIFY_TOKEN || "nepdora_verify_token";

// ✅ 1. Facebook verifies your webhook
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

// ✅ 2. Facebook sends messages here
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Received webhook event:", JSON.stringify(body, null, 2));

    // If this is a message
    if (body.object === "page") {
      for (const entry of body.entry) {
        for (const event of entry.messaging || []) {
          const senderId = event.sender.id;
          const message = event.message?.text;
          if (message) {
            console.log(`💬 Message from ${senderId}: ${message}`);

            // Optional: Send auto-reply
            await fetch(
              `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recipient: { id: senderId },
                  message: { text: "Hello 👋, this is Nepdora Messenger bot!" },
                }),
              }
            );
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (err) {
    console.error("❌ Error in webhook:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
