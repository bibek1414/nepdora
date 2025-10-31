import { NextRequest, NextResponse } from "next/server";
import { facebookService } from "@/services/facebook/facebook.service";
import { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    const { recipientId, message, accessToken } = await request.json();

    if (!recipientId || !message || !accessToken) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Send the message
    const result = await facebookService.sendMessage(
      recipientId,
      message,
      accessToken,
      "RESPONSE"
    );

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      status: isAxiosError(error) ? error.response?.status : 500,
    });
  }
}
