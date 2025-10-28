import { NextResponse } from "next/server";
import { witApi } from "@/services/api/owner-sites/admin/wit";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const extracted = await witApi.extract(message);
    return NextResponse.json({ success: true, extracted });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
