/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { khaltiAPI } from "@/lib/khalti-api";
import { esewaAPI } from "@/lib/esewa-api";
import {
  PaymentMethod,
  EsewaVerificationRequest,
  KhaltiLookupRequest,
} from "@/types/payment";

import { getServerUser } from "@/hooks/use-jwt-server";

/**
 * Fetch central Nepdora credentials from API if environment variables are missing
 */
async function fetchNepdoraCentralCredentials(
  paymentType: "esewa" | "khalti"
): Promise<{ secret_key: string; merchant_code: string | null }> {
  try {
    const centralApiUrl =
      "https://nepdora.baliyoventures.com/api/nepdora-payments/";
    console.log(
      `Fetching central credentials for ${paymentType} from: ${centralApiUrl}?payment_type=${paymentType}`
    );

    const response = await fetch(
      `${centralApiUrl}?payment_type=${paymentType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch central credentials: ${response.statusText}`
      );
    }

    const data = await response.json();
    const centralGateway = data.find(
      (g: any) => g.payment_type === paymentType
    );

    if (!centralGateway) {
      throw new Error(`Central credentials for ${paymentType} not found`);
    }

    return {
      secret_key: centralGateway.secret_key,
      merchant_code: centralGateway.merchant_code,
    };
  } catch (error) {
    console.error("Error fetching central credentials:", error);
    throw error;
  }
}

/**
 * Report a successful subscription payment to central history
 */
async function reportToCentralPaymentHistory(data: {
  subdomain: string;
  payment_type: string;
  pay_amount: string;
  transaction_id: string;
  products_purchased?: any;
  additional_info?: any;
}) {
  try {
    const centralApiUrl =
      "https://nepdora.baliyoventures.com/api/tenant-central-payments/";
    console.log(
      `Reporting subscription transaction for ${data.subdomain} to central history...`
    );

    const response = await fetch(centralApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant": data.subdomain,
      },
      body: JSON.stringify({
        tenant: data.subdomain, // Required field
        payment_type: data.payment_type,
        pay_amount: data.pay_amount,
        transaction_id: data.transaction_id,
        products_purchased: data.products_purchased || {},
        status: "received",
        additional_info: {
          ...data.additional_info,
          is_subscription: true,
          tenant_subdomain: data.subdomain,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Central history reporting failed (${response.status}):`,
        errorText
      );
    } else {
      console.log("Central history reporting successful");
    }
  } catch (error) {
    console.error("Error reporting to central payment history:", error);
  }
}

async function getCredentials(paymentType: "esewa" | "khalti") {
  const envMap = {
    esewa: {
      merchant_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
      secret_key: process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY,
    },
    khalti: {
      merchant_code: null,
      secret_key: process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY,
    },
  };

  const creds = envMap[paymentType];

  if (creds.secret_key && (paymentType !== "esewa" || creds.merchant_code)) {
    return { ...creds, is_fallback: false };
  }

  console.log(
    `Missing ${paymentType} env variables, fetching from central API...`
  );
  const centralCreds = await fetchNepdoraCentralCredentials(paymentType);
  return { ...centralCreds, is_fallback: true };
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/subscription/verify-payment");

  try {
    const user = await getServerUser();
    const subdomain = user?.sub_domain;

    const requestData = await req.json();
    console.log(
      "Subscription verify request body:",
      JSON.stringify(requestData, null, 2)
    );
    const { method, products_purchased } = requestData;

    if (!method || !["esewa", "khalti"].includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid payment method is required (esewa or khalti)",
        },
        { status: 400 }
      );
    }

    console.log(`Verifying ${method} payment for subscription`);

    // Get credentials (with fallback)
    const creds = await getCredentials(method as "esewa" | "khalti");

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

        // Initialize API with fetched/env credentials
        const esewaAPI_instance = esewaAPI.initialize({
          merchantCode: creds.merchant_code as string,
          secretKey: creds.secret_key as string,
        });

        const response = await esewaAPI_instance.verifyPayment(esewaRequest);

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

        // Report to central history
        if (subdomain) {
          reportToCentralPaymentHistory({
            subdomain: subdomain as string,
            payment_type: "esewa",
            pay_amount: response.data.total_amount.toString(),
            transaction_id:
              response.data.transaction_code || response.data.transaction_uuid,
            products_purchased: products_purchased,
            additional_info: {
              transaction_uuid: response.data.transaction_uuid,
              status: response.data.status,
              is_fallback: (creds as any).is_fallback,
            },
          });
        }

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

        // Initialize API with fetched/env credentials
        const khaltiAPI_instance = khaltiAPI.initialize({
          secretKey: creds.secret_key as string,
        });

        const response = await khaltiAPI_instance.verifyPayment(
          khaltiRequest.pidx
        );

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
        const paymentStatus = khaltiAPI_instance.validatePaymentStatus(
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

        // Report to central history
        if (subdomain) {
          reportToCentralPaymentHistory({
            subdomain: subdomain as string,
            payment_type: "khalti",
            pay_amount: khaltiAPI_instance.formatAmountFromPaisa(
              response.data.total_amount
            ),
            transaction_id: response.data.transaction_id || pidx,
            products_purchased: products_purchased,
            additional_info: {
              pidx: response.data.pidx,
              status: response.data.status,
              is_fallback: (creds as any).is_fallback,
            },
          });
        }

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
