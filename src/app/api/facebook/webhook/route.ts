import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("Webhook verification failed");
  return new NextResponse("Verification token mismatch", { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received webhook event:", JSON.stringify(body, null, 2));

    // Handle different types of updates
    if (body.object === "page") {
      for (const entry of body.entry) {
        // Handle messages
        if (entry.messaging) {
          for (const event of entry.messaging) {
            console.log("Received message event:", event);
            // Here you would typically:
            // 1. Process the incoming message
            // 2. Update your database
            // 3. Send a response if needed
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
