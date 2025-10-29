// app/api/webhook/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  console.log("Mode:", mode);
  console.log("Token from Facebook:", token);
  console.log("Challenge:", challenge);
  console.log("VERIFY_TOKEN (env):", VERIFY_TOKEN);

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WEBHOOK_VERIFIED");
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Bad Request", { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("📩 Received Webhook Event:", JSON.stringify(body, null, 2));
  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}
