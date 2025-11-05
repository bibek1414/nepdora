import { NextResponse } from "next/server";
import { esewaAPI } from "@/lib/esewa-api";

export async function GET(req: Request) {
  console.log("Received GET request to /api/subscription/esewa-status");

  try {
    const { searchParams } = new URL(req.url);
    const productCode = searchParams.get("product_code");
    const totalAmount = searchParams.get("total_amount");
    const transactionUuid = searchParams.get("transaction_uuid");

    // Validate required parameters
    if (!productCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Product code is required",
        },
        { status: 400 }
      );
    }

    if (!totalAmount || isNaN(parseFloat(totalAmount))) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid total amount is required",
        },
        { status: 400 }
      );
    }

    if (!transactionUuid) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction UUID is required",
        },
        { status: 400 }
      );
    }

    console.log(
      `Checking eSewa payment status for transaction: ${transactionUuid}`
    );

    const statusResponse = await esewaAPI.checkPaymentStatus({
      product_code: productCode,
      total_amount: parseFloat(totalAmount),
      transaction_uuid: transactionUuid,
    });

    if (!statusResponse.success) {
      console.error("eSewa status check failed:", statusResponse.error);
      return NextResponse.json(
        {
          success: false,
          error: statusResponse.error,
          details: statusResponse.details,
        },
        { status: statusResponse.status_code || 500 }
      );
    }

    const statusData = statusResponse.data;

    console.log(
      `eSewa payment status check completed. Status: ${statusData.status}`
    );

    return NextResponse.json({
      success: true,
      data: {
        product_code: statusData.product_code,
        transaction_uuid: statusData.transaction_uuid,
        total_amount: statusData.total_amount.toString(),
        status: statusData.status,
        ref_id: statusData.ref_id,
        is_success: statusData.is_success,
        should_provide_service: statusData.should_provide_service,
      },
      message: statusResponse.message,
    });
  } catch (err) {
    console.error("eSewa status check error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: "eSewa status check failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
