import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload
    const { orderId, latitude, longitude, accuracy, timestamp } = body;

    if (
      !orderId ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payload. orderId, latitude, and longitude are required.",
        },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const API_BASE_URL = getApiBaseUrl();

    // Update order with location data
    const response = await fetch(`${API_BASE_URL}/api/order/${orderId}/`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        latitude,
        longitude,
        location_accuracy: accuracy,
        location_timestamp: timestamp,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to update order location:", errorData);
      return NextResponse.json(
        { error: "Failed to update order location", details: errorData },
        { status: response.status }
      );
    }

    const updatedOrder = await response.json();

    return NextResponse.json({
      ok: true,
      message: "Location confirmed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error confirming location:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
