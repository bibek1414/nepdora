/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { khaltiAPI } from "@/lib/khalti-api";
import { esewaAPI } from "@/lib/esewa-api";
import {
  PaymentMethod,
  EsewaVerificationRequest,
  KhaltiLookupRequest,
} from "@/types/payment";

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
    "NEXT_PUBLIC_ESEWA_SECRET_KEY",
    "NEXT_PUBLIC_KHALTI_SECRET_KEY",
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/subscription/verify-payment");

  try {
    validateEnvironmentVariables();

    const requestData = await req.json();
    const { method } = requestData;

    if (!method || !["esewa", "khalti"].includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid payment method is required (esewa or khalti)",
        },
        { status: 400 }
      );
    }

    console.log(`Verifying ${method} payment`);

    switch (method as PaymentMethod) {
      case "esewa": {
        const { data } = requestData;

        if (!data || typeof data !== "string") {
          return NextResponse.json(
            {
              success: false,
              error: "eSewa response data is required",
            },
            { status: 400 }
          );
        }

        const esewaRequest: EsewaVerificationRequest = {
          data: data,
        };

        const response = await esewaAPI.verifyPayment(esewaRequest);

        if (!response.success) {
          console.error("eSewa payment verification failed:", response.error);
          return NextResponse.json(
            {
              success: false,
              error: response.error,
              details: response.details,
            },
            { status: response.status_code || 500 }
          );
        }

        console.log("eSewa payment verified successfully");

        return NextResponse.json({
          success: true,
          data: response.data,
          message: response.message || "Payment verified successfully",
        });
      }

      case "khalti": {
        const { pidx } = requestData;

        if (!pidx || typeof pidx !== "string") {
          return NextResponse.json(
            {
              success: false,
              error: "Khalti payment identifier (pidx) is required",
            },
            { status: 400 }
          );
        }

        const khaltiRequest: KhaltiLookupRequest = {
          pidx: pidx,
        };

        const response = await khaltiAPI.verifyPayment(khaltiRequest.pidx);

        if (!response.success) {
          console.error("Khalti payment verification failed:", response.error);
          return NextResponse.json(
            {
              success: false,
              error: response.error,
              details: response.details,
            },
            { status: response.status_code || 500 }
          );
        }

        // Check if payment is completed
        const paymentStatus = khaltiAPI.validatePaymentStatus(
          response.data.status
        );

        if (!paymentStatus.isSuccess) {
          console.error("Khalti payment not completed:", response.data.status);
          return NextResponse.json(
            {
              success: false,
              error: paymentStatus.message,
              details: {
                status: response.data.status,
                pidx: response.data.pidx,
              },
            },
            { status: 400 }
          );
        }

        console.log("Khalti payment verified successfully");

        return NextResponse.json({
          success: true,
          data: response.data,
          message: response.message || "Payment verified successfully",
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid payment method",
          },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Payment Verification Error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify payment",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
