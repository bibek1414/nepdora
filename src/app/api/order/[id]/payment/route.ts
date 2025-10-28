import { NextRequest, NextResponse } from "next/server";
import { orderApi } from "@/services/api/owner-sites/admin/orders";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { transaction_id, payment_method, payment_status } = body;

    if (!transaction_id || !payment_method || !payment_status) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: transaction_id, payment_method, payment_status",
        },
        { status: 400 }
      );
    }

    const updatedOrder = await orderApi.updateOrderPayment(orderId, {
      transaction_id,
      payment_method,
      payment_status,
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order payment information updated successfully",
    });
  } catch (error) {
    console.error("Error updating order payment:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update order payment information",
      },
      { status: 500 }
    );
  }
}
