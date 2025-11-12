// app/api/short-url/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store (use Redis or database in production)
const urlStore = new Map();

export async function POST(request: NextRequest) {
  const { orderId, callbackUrl, redirectUrl, extraParams } =
    await request.json();

  const shortId = Math.random().toString(36).substring(2, 10);
  urlStore.set(shortId, {
    orderId,
    callbackUrl,
    redirectUrl,
    extraParams,
    createdAt: Date.now(),
  });

  // Clean up old entries (optional)
  setTimeout(() => urlStore.delete(shortId), 24 * 60 * 60 * 1000); // 24 hours

  return NextResponse.json({ shortId });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shortId = searchParams.get("id");

  if (!shortId || !urlStore.has(shortId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = urlStore.get(shortId);
  return NextResponse.json(data);
}
