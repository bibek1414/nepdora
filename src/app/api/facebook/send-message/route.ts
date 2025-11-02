// src/app/api/facebook/send-message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { facebookService } from "@/services/facebook/facebook.service";
import { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    const { recipientId, message, pageAccessToken } = await request.json();

    if (!recipientId || !message || !pageAccessToken) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          details: "recipientId, message, and pageAccessToken are required",
        },
        { status: 400 }
      );
    }

    console.log("Sending message to recipient:", recipientId);

    // Send the message using the provided pageAccessToken
    const result = await facebookService.sendMessage(
      recipientId,
      message,
      pageAccessToken,
      "RESPONSE"
    );

    console.log("Message sent successfully:", result);

    return NextResponse.json({
      success: true,
      messageId: result.message_id,
      recipientId: result.recipient_id,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error sending message:", error);

    // Check if it's an Axios error
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAxiosError = (error: any): error is AxiosError => {
      return error.isAxiosError === true;
    };

    const errorResponse = isAxiosError(error)
      ? {
          error: errorMessage,
          details: error.response?.data || {},
        }
      : {
          error: errorMessage,
          details: {},
        };

    return NextResponse.json(errorResponse, {
      status: isAxiosError(error) ? error.response?.status || 500 : 500,
    });
  }
}
